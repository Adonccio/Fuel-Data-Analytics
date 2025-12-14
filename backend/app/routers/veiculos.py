from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from .. import models, crud
from ..schemas import VeiculoResponse, VeiculoCreate

router = APIRouter(prefix="/veiculos", tags=["Veiculos"])


def normalizar_placa(placa: str) -> str:
    return placa.upper().replace("-", "").strip()


@router.get("/", response_model=list[VeiculoResponse])
def listar_veiculos(
    placa: str | None = Query(None),
    tipo: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Veiculo)

    if placa:
        placa_norm = normalizar_placa(placa)
        query = query.filter(
            func.replace(models.Veiculo.placa, "-", "") == placa_norm
        )

    if tipo:
        query = query.filter(models.Veiculo.tipo.ilike(f"%{tipo}%"))

    rows = query.order_by(models.Veiculo.data_atualizacao.desc()).all()

    return [
        VeiculoResponse(
            id=row.veiculo_id,
            placa=row.placa,
            tipo=row.tipo,
            data_atualizacao=row.data_atualizacao,
        )
        for row in rows
    ]


@router.post("/", response_model=VeiculoResponse)
def criar_veiculo(
    payload: VeiculoCreate,
    db: Session = Depends(get_db),
):
    placa_norm = normalizar_placa(payload.placa)

    existente = db.query(models.Veiculo).filter(
        func.replace(models.Veiculo.placa, "-", "") == placa_norm
    ).first()

    if existente:
        crud.registrar_historico(db, "Veículo", "Erro")
        raise HTTPException(
            status_code=400,
            detail="Já existe um veículo cadastrado com esta placa."
        )

    novo = models.Veiculo(
        placa=placa_norm,
        tipo=payload.tipo,
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    crud.registrar_historico(db, "Veículo", "Sucesso")

    return VeiculoResponse(
        id=novo.veiculo_id,
        placa=novo.placa,
        tipo=novo.tipo,
        data_atualizacao=novo.data_atualizacao,
    )
