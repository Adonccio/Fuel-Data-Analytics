from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import crud

from ..database import get_db
from .. import models
from ..schemas import (
    PrecoMedioCombustivel,
    ConsumoPorTipoVeiculo,
    RegistroHistorico,
    ConsumoPorMes,
    ConsumoPorCidadeTop3,
    PostosPorEstado,
    PrecoPorMes
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


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


@router.get("/consumo-veiculo", response_model=list[ConsumoPorTipoVeiculo])
def get_consumo_veiculo(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.Veiculo.tipo,
            func.avg(models.Venda.volume_vendido).label("total_volume")
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



@router.get("/consumo-mes", response_model=list[ConsumoPorMes])
def get_consumo_mes(db: Session = Depends(get_db)):
    mes = func.extract("month", models.Venda.data_coleta).label("mes")
    total_volume = func.sum(models.Venda.volume_vendido).label("total_volume")

    rows = (
        db.query(mes, total_volume)
        .group_by(mes)
        .order_by(total_volume.desc())
        .all()
    )

    

    return [
        ConsumoPorMes(
            mes=r[0],
            total_volume=float(r[1])
        )
        for r in rows
    ]




@router.get("/consumo-cidade", response_model=list[ConsumoPorCidadeTop3])
def get_consumo_cidade(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.Posto.cidade,
            func.sum(models.Venda.volume_vendido).label("total_volume")
        )
        .join(models.Posto, models.Posto.posto_id == models.Venda.posto_id)
        .group_by(models.Posto.cidade)
        .order_by(func.sum(models.Venda.volume_vendido).desc())
        .limit(3)   
    )

    return [
        ConsumoPorCidadeTop3(
            cidade=r[0],
            total_volume=float(r[1])
        )
        for r in rows
    ]


@router.get("/media-preco-mes")
def get_media_preco_medio_mes(db: Session = Depends(get_db)):
    mes = func.extract("month", models.Venda.data_coleta).label("mes")
    preco_medio = func.avg(models.Venda.preco).label("preco_medio")

    rows = (
        db.query(mes, preco_medio)
        .group_by(mes)
        .order_by(preco_medio.desc())
        .all()
    )

    return [
        PrecoPorMes(
            mes= r[0],
            preco_medio= r[1]
        )
        for r in rows
    ]

@router.get("/quantidade-estado")
def get_quantidade_por_estado(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.Posto.estado,
            func.count(func.distinct(models.Posto.cnpj)).label("quantidade_postos")
        )
        .group_by(models.Posto.estado)
        .order_by(func.count(func.distinct(models.Posto.cnpj)).desc())
        .all()
    )

    return [
        PostosPorEstado(
            estado = r[0],
            quantidade_postos=r[1]
        )
        for r in rows
    ]
