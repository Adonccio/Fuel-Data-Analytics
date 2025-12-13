from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import PostoResponse, PostoCreate

router = APIRouter(prefix="/postos", tags=["Postos"])


@router.get("/", response_model=list[PostoResponse])
def listar_postos(
    cnpj: str | None = Query(None),
    nome: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Posto)

    if cnpj:
        query = query.filter(models.Posto.cnpj == cnpj)

    if nome:
        query = query.filter(models.Posto.nome.ilike(f"%{nome}%"))

    rows = query.order_by(models.Posto.data_atualizacao.desc()).all()

    return [
        PostoResponse(
            id=row.posto_id,
            nome=row.nome,
            cnpj=row.cnpj,
            estado=row.estado,
            cidade=row.cidade,
            data_atualizacao=row.data_atualizacao,
        )
        for row in rows
    ]

@router.post("/", response_model=PostoResponse)
def criar_posto(
    payload: PostoCreate,
    db: Session = Depends(get_db),
):
    existente = db.query(models.Posto).filter(models.Posto.cnpj == payload.cnpj).first()
    if existente:
        raise HTTPException(
            status_code=400,
            detail="Já existe um posto cadastrado com este CNPJ."
        )
    if not (payload.cnpj.isdigit() and len(payload.cnpj) == 14):
        raise HTTPException(
            status_code=400,
            detail="CNPJ inválido. Deve conter exatamente 14 dígitos numéricos."
        )


    novo = models.Posto(
        nome=payload.nome,
        cnpj=payload.cnpj,
        estado=payload.estado,
        cidade=payload.cidade,
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    return PostoResponse(
        id=novo.posto_id,
        nome=novo.nome,
        cnpj=payload.cnpj,
        estado=payload.estado,
        cidade=payload.cidade,
        data_atualizacao=novo.data_atualizacao,
    )