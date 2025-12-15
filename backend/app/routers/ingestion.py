from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/ingestion", tags=["ingestion"])


@router.post("/")
def ingest_data(payload: schemas.IngestionPayload, db: Session = Depends(get_db)):
    venda = crud.create_venda(db, payload)
    return {"status": "ok", "venda_id": venda.venda_id}
