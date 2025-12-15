from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class IngestionPayload(BaseModel):
    cnpj: str
    posto_nome: str
    cidade: str
    estado: str

    data_coleta: datetime
    tipo_combustivel: str
    preco: float
    volume_vendido: float

    motorista_nome: str
    motorista_cpf: str

    placa_veiculo: str
    tipo_veiculo: str


class MotoristaResponse(BaseModel):
    id: int
    nome: str
    cpf: str
    data_atualizacao: datetime

    model_config = {
        "from_attributes": True
    }

class PostoResponse(BaseModel):
    id: int
    nome: str
    cnpj: str
    cidade: str
    estado: str
    data_atualizacao: datetime

    model_config = {
        "from_attributes": True
    }


class VendaResponse(BaseModel):
    id: int
    data_coleta: datetime
    tipo_combustivel: str
    preco: float
    volume_vendido: float
    posto_nome: str
    cidade: str
    estado: str
    placa_veiculo: str
    tipo_veiculo: str
    motorista_nome: str

    class Config:
        orm_mode = True


class VeiculoResponse(BaseModel):
    id: int
    placa: str
    tipo: str
    data_atualizacao: datetime

    class Config:
        orm_mode = True


class PrecoMedioCombustivel(BaseModel):
    tipo_combustivel: str
    preco_medio: float


class ConsumoPorTipoVeiculo(BaseModel):
    tipo_veiculo: str
    total_volume: float



class RegistroHistoricoBase(BaseModel):
    tp_registro: str
    status_registro: str


class RegistroHistoricoCreate(RegistroHistoricoBase):
    pass


class RegistroHistorico(RegistroHistoricoBase):
    historico_id: int
    data_atualizacao: datetime

    class Config:
        orm_mode = True


class FiltroMotorista(BaseModel):
    cpf: Optional[str] = None
    nome: Optional[str] = None


class MotoristaCreate(BaseModel):
    nome: str
    cpf: str

class PostoCreate(BaseModel):
    nome: str
    cnpj: str
    cidade: str
    estado: str

class VendaCreate(BaseModel):
    posto_id: int
    motorista_id: int
    veiculo_id: int
    data_coleta: datetime
    tipo_combustivel: str
    preco: float
    volume_vendido: float


class VeiculoCreate(BaseModel):
    placa: str
    tipo: str

    

class ConsumoPorMes(BaseModel):
    mes: int
    total_volume: float


class ConsumoPorCidadeTop3(BaseModel):
    cidade: str
    total_volume: float

class PostosPorEstado(BaseModel):
    estado: str
    quantidade_postos: int

class PrecoPorMes(BaseModel):
    mes: int
    preco_medio: float