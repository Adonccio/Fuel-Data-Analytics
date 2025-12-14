from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import RegistroHistoricoCreate, RegistroHistorico

router = APIRouter(prefix="/registro-historico", tags=["Registro Histórico"])

@router.get("/", response_model=list[RegistroHistorico])
def listar_historico(
    tipo: str | None = Query(None),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.RegistroHistorico)

    if tipo:
        query = query.filter(models.RegistroHistorico.tp_registro.ilike(f"%{tipo}%"))

    if status:
        query = query.filter(models.RegistroHistorico.status_registro.ilike(f"%{status}%"))

    registros = query.order_by(
        models.RegistroHistorico.data_atualizacao.desc()
    ).all()

    return [
        RegistroHistorico(
            historico_id=r.historico_id,
            tp_registro=r.tp_registro,
            status_registro=r.status_registro,
            data_atualizacao=r.data_atualizacao,
        )
        for r in registros
    ]