from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, models
from ..schemas import PrecoMedioCombustivel, ConsumoPorTipoVeiculo, VendaResponse, HistoricoRegistro

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/precos-medios", response_model=list[PrecoMedioCombustivel])
def get_precos_medios(db: Session = Depends(get_db)):
    rows = crud.media_preco_por_combustivel(db)
    return [
        PrecoMedioCombustivel(
            tipo_combustivel=r[0],
            preco_medio=float(r[1])
        )
        for r in rows
    ]


@router.get("/consumo-veiculo", response_model=list[ConsumoPorTipoVeiculo])
def get_consumo_veiculo(db: Session = Depends(get_db)):
    rows = crud.consumo_por_tipo_veiculo(db)
    return [
        ConsumoPorTipoVeiculo(
            tipo_veiculo=r[0],
            total_volume=float(r[1])
        )
        for r in rows
    ]



@router.get("/historico-registros", response_model=list[Historic])
def get_vehicle_consumption(db: Session = Depends(get_db)):
    rows = crud.consumo_por_tipo_veiculo(db)
    return [
        ConsumoPorTipoVeiculo(
            tipo_veiculo=r[0],
            total_volume=float(r[1])
        )
        for r in rows
    ]



@router.get("/vendas", response_model=list[VendaResponse])
def list_vendas(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * size

    query = (
        db.query(models.Venda, models.Posto, models.Motorista, models.Veiculo)
        .join(models.Posto, models.Venda.posto_id == models.Posto.posto_id)
        .join(models.Motorista, models.Venda.motorista_id == models.Motorista.motorista_id)
        .join(models.Veiculo, models.Venda.veiculo_id == models.Veiculo.veiculo_id)
        .order_by(models.Venda.data_coleta.desc())
        .offset(offset)
        .limit(size)
    )

    rows = query.all()

    result = []
    for venda, posto, motorista, veiculo in rows:
        result.append(
            VendaResponse(
                id=venda.venda_id,
                data_coleta=venda.data_coleta,
                tipo_combustivel=venda.tipo_combustivel,
                preco=float(venda.preco),
                volume_vendido=float(venda.volume_vendido),
                posto_nome=posto.nome,
                cidade=posto.cidade,
                estado=posto.estado,
                placa_veiculo=veiculo.placa,
                tipo_veiculo=veiculo.tipo,
                motorista_nome=motorista.nome,
            )
        )
    return result
