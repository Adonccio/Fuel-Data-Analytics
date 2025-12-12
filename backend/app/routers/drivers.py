from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud
from ..schemas import VendaResponse

router = APIRouter(prefix="/drivers", tags=["drivers"])


@router.get("/history", response_model=list[VendaResponse])
def driver_history(
    cpf: str = Query(None),
    nome: str = Query(None),
    db: Session = Depends(get_db),
):
    rows = crud.historico_motorista(db, cpf=cpf, nome=nome)
    result = []
    for venda, posto, motorista, veiculo in rows:
        result.append(
            VendaResponse(
                id=venda.id,
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
