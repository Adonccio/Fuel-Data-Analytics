from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import crud

from ..database import get_db
from .. import models
from ..schemas import (
    PrecoMedioCombustivel,
    ConsumoPorTipoVeiculo,
    RegistroHistorico
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =============================
# MÉDIAS DE PREÇO POR COMBUSTÍVEL
# =============================
@router.get("/precos-medios", response_model=list[PrecoMedioCombustivel])
def get_precos_medios(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.Venda.tipo_combustivel,
            func.avg(models.Venda.preco).label("preco_medio")
        )
        .group_by(models.Venda.tipo_combustivel)
        .order_by(func.avg(models.Venda.preco).desc())
        .all()
    )

    return [
        PrecoMedioCombustivel(
            tipo_combustivel=r[0],
            preco_medio=float(r[1])
        )
        for r in rows
    ]


# =============================
# CONSUMO POR TIPO DE VEÍCULO
# =============================
@router.get("/consumo-veiculo", response_model=list[ConsumoPorTipoVeiculo])
def get_consumo_veiculo(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.Veiculo.tipo,
            func.sum(models.Venda.volume_vendido).label("total_volume")
        )
        .join(models.Venda, models.Veiculo.veiculo_id == models.Venda.veiculo_id)
        .group_by(models.Veiculo.tipo)
        .order_by(func.sum(models.Venda.volume_vendido).desc())
        .all()
    )

    return [
        ConsumoPorTipoVeiculo(
            tipo_veiculo=r[0],
            total_volume=float(r[1])
        )
        for r in rows
    ]


# =============================
# HISTÓRICO DE REGISTROS (AINDA NÃO IMPLEMENTADO)
# =============================
@router.get("/historico-registros", response_model=list[RegistroHistorico])
def historico_registros(db: Session = Depends(get_db)):
    rows = (
        db.query(models.RegistroHistorico)
        .order_by(models.RegistroHistorico.data_atualizacao.desc())
        .all()
    )

    return [
        RegistroHistorico(
            historico_id=row.historico_id,
            tp_registro=row.tp_registro,
            status_registro=row.status_registro,
            data_atualizacao=row.data_atualizacao,
        )
        for row in rows
    ]

