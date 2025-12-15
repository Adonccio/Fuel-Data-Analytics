from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, models
from ..schemas import VendaResponse, VendaCreate

router = APIRouter(prefix="/vendas", tags=["Vendas"])


@router.get("/", response_model=list[VendaResponse])
def vendas_historico(
    cpf: str = Query(None),
    nome: str = Query(None),
    db: Session = Depends(get_db),
):
    rows = crud.historico_venda(db, cpf=cpf, nome=nome)
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


@router.post("/", response_model=VendaResponse)
def criar_venda(payload: VendaCreate, db: Session = Depends(get_db)):
    # Validar posto
    posto = db.query(models.Posto).filter_by(posto_id=payload.posto_id).first()
    if not posto:
        crud.registrar_historico(db, "Venda", "Erro")
        raise HTTPException(status_code=400, detail="Posto não encontrado.")

    # Validar motorista
    motorista = db.query(models.Motorista).filter_by(motorista_id=payload.motorista_id).first()
    if not motorista:
        crud.registrar_historico(db, "Venda", "Erro")
        raise HTTPException(status_code=400, detail="Motorista não encontrado.")

    # Validar veículo
    veiculo = db.query(models.Veiculo).filter_by(veiculo_id=payload.veiculo_id).first()
    if not veiculo:
        crud.registrar_historico(db, "Venda", "Erro")
        raise HTTPException(status_code=400, detail="Veículo não encontrado.")

    # Criar venda
    venda = models.Venda(
        posto_id=payload.posto_id,
        motorista_id=payload.motorista_id,
        veiculo_id=payload.veiculo_id,
        data_coleta=payload.data_coleta,
        tipo_combustivel=payload.tipo_combustivel,
        preco=payload.preco,
        volume_vendido=payload.volume_vendido,
    )

    db.add(venda)
    db.commit()
    db.refresh(venda)

    # Registrar histórico
    crud.registrar_historico(db, "Venda", "Sucesso")

    return VendaResponse(
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