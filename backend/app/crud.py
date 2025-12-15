from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas


def get_or_create_motorista(db: Session, nome: str, cpf: str):
    motorista = db.query(models.Motorista).filter_by(cpf=cpf).first()
    if not motorista:
        motorista = models.Motorista(
            nome=nome,
            cpf=cpf
        )
        db.add(motorista)
        db.commit()
        db.refresh(motorista)
    return motorista


def get_or_create_posto(db: Session, nome: str, cnpj: str, estado:str, cidade:str):
    posto = db.query(models.Posto).filter_by(cnpj=cnpj).first()
    if not posto:
        posto = models.Posto(
            nome=nome,
            cnpj=cnpj,
            cidade=cidade,
            estado=estado,
        )
        db.add(posto)
        db.commit()
        db.refresh(posto)
    return posto

def get_or_create_veiculo(db: Session, placa: str, tipo: str):
    veiculo = db.query(models.Veiculo).filter_by(placa=placa).first()
    if not veiculo:
        veiculo = models.Veiculo(
            placa=placa,
            tipo=tipo
        )
        db.add(veiculo)
        db.commit()
        db.refresh(veiculo)
    return veiculo


def create_venda(db: Session, payload: schemas.IngestionPayload):
    posto = get_or_create_posto(
        db,
        cnpj=payload.cnpj,
        nome=payload.posto_nome,
        cidade=payload.cidade,
        estado=payload.estado,
    )
    motorista = get_or_create_motorista(db, nome=payload.motorista_nome, cpf=payload.motorista_cpf)
    veiculo = get_or_create_veiculo(db, placa=payload.placa_veiculo, tipo=payload.tipo_veiculo)

    venda = models.Venda(
        posto_id=posto.posto_id,
        motorista_id=motorista.motorista_id,
        veiculo_id=veiculo.veiculo_id,
        data_coleta=payload.data_coleta,
        tipo_combustivel=payload.tipo_combustivel,
        preco=payload.preco,
        volume_vendido=payload.volume_vendido
    )

    db.add(venda)
    db.commit()
    db.refresh(venda)
    return venda

def historico_venda(db: Session, cpf: str = None, nome: str = None):
    query = (
        db.query(models.Venda, models.Posto, models.Motorista, models.Veiculo)
        .join(models.Posto, models.Venda.posto_id == models.Posto.posto_id)
        .join(models.Motorista, models.Venda.motorista_id == models.Motorista.motorista_id)
        .join(models.Veiculo, models.Venda.veiculo_id == models.Veiculo.veiculo_id)
    )

    if cpf:
        query = query.filter(models.Motorista.cpf == cpf)
    if nome:
        query = query.filter(models.Motorista.nome.ilike(f"%{nome}%"))

    return query.order_by(models.Venda.data_coleta.desc()).all()

def registrar_historico(db: Session, tp_registro: str, status: str):
    historico = models.RegistroHistorico(
        tp_registro=tp_registro,
        status_registro=status
    )
    db.add(historico)
    db.commit()
    db.refresh(historico)
    return historico
