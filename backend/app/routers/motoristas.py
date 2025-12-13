from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import MotoristaResponse, MotoristaCreate

router = APIRouter(prefix="/motoristas", tags=["Motoristas"])


@router.get("/", response_model=list[MotoristaResponse])
def listar_motoristas(
    cpf: str | None = Query(None),
    nome: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Motorista)

    if cpf:
        query = query.filter(models.Motorista.cpf == cpf)

    if nome:
        query = query.filter(models.Motorista.nome.ilike(f"%{nome}%"))

    rows = query.order_by(models.Motorista.data_atualizacao.desc()).all()

    return [
        MotoristaResponse(
            id=row.motorista_id,
            nome=row.nome,
            cpf=row.cpf,
            data_atualizacao=row.data_atualizacao,
        )
        for row in rows
    ]

@router.post("/", response_model=MotoristaResponse)
def criar_motorista(
    payload: MotoristaCreate,
    db: Session = Depends(get_db),
):
    existente = db.query(models.Motorista).filter(models.Motorista.cpf == payload.cpf).first()
    if existente:
        raise HTTPException(
            status_code=400,
            detail="Já existe um motorista cadastrado com este CPF."
        )
    if not (payload.cpf.isdigit() and len(payload.cpf) == 11):
        raise HTTPException(
            status_code=400,
            detail="CPF inválido. Deve conter exatamente 11 dígitos numéricos."
        )


    novo = models.Motorista(
        nome=payload.nome,
        cpf=payload.cpf,
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    return MotoristaResponse(
        id=novo.motorista_id,
        nome=novo.nome,
        cpf=novo.cpf,
        data_atualizacao=novo.data_atualizacao,
    )