from fastapi import FastAPI
from .database import Base, engine
from .routers import ingestion, dashboard, vendas, motoristas, postos, veiculos, registro_historico
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fuel Monitor API",
    version="1.0.0"
)


app = FastAPI(
    title="Fuel Monitor API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Liberar tudo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingestion.router)
app.include_router(dashboard.router)
app.include_router(vendas.router)
app.include_router(motoristas.router)
app.include_router(postos.router)
app.include_router(veiculos.router)
app.include_router(registro_historico.router)


@app.get("/")
def health():
    return {"status": "ok"}
