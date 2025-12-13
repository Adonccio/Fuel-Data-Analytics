from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, func
from sqlalchemy.orm import relationship

from .database import Base


class Posto(Base):
    __tablename__ = "posto"

    posto_id = Column(Integer, primary_key=True, index=True)
    cnpj = Column(String(20), index=True)  
    nome = Column(String(120), nullable=False)
    cidade = Column(String(80), nullable=False)
    estado = Column(String(2), nullable=False)
    data_atualizacao = Column(DateTime, server_default=func.now(), nullable=False)

    vendas = relationship("Venda", back_populates="posto")


class Motorista(Base):
    __tablename__ = "motorista"

    motorista_id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    cpf = Column(String(14), unique=True, index=True)
    data_atualizacao = Column(DateTime, server_default=func.now(), nullable=False)

    vendas = relationship("Venda", back_populates="motorista")


class Veiculo(Base):
    __tablename__ = "veiculo"

    veiculo_id = Column(Integer, primary_key=True, index=True)
    placa = Column(String(10), unique=True, nullable=False, index=True)
    tipo = Column(String(40), nullable=False)
    data_atualizacao = Column(DateTime, server_default=func.now(), nullable=False)

    vendas = relationship("Venda", back_populates="veiculo")


class Venda(Base):
    __tablename__ = "venda"

    venda_id = Column(Integer, primary_key=True, index=True)

    posto_id = Column(Integer, ForeignKey("posto.posto_id"))
    motorista_id = Column(Integer, ForeignKey("motorista.motorista_id"))
    veiculo_id = Column(Integer, ForeignKey("veiculo.veiculo_id"))

    data_coleta = Column(DateTime, nullable=False)
    tipo_combustivel = Column(String(20), nullable=False)
    preco = Column(Numeric(10, 2), nullable=False)
    volume_vendido = Column(Numeric(10, 2), nullable=False)

    posto = relationship("Posto", back_populates="vendas")
    motorista = relationship("Motorista", back_populates="vendas")
    veiculo = relationship("Veiculo", back_populates="vendas")
    data_atualizacao = Column(DateTime, server_default=func.now(), nullable=False)


class RegistroHistorico(Base):
    __tablename__ = "registro_historico"

    historico_id = Column(Integer, primary_key=True, index=True)
    tp_registro = Column(String(30))
    status_registro = Column(String (15))
    data_atualizacao = Column(DateTime, server_default=func.now(), nullable=False)

