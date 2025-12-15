# ⛽ Data Fuel Analytics
Projeto Full Cycle para registro, ingestão e visualização de dados de vendas de combustíveis, integrando:

- Backend (FastAPI + SQLAlchemy)
- Banco de Dados PostgreSQL
- Frontend (React + Vite)
- Script de seed para popular o banco
- Ambiente completo via Docker Compose

# Deploy

A aplicação está rodando em produçao no endereço

https://fueldataanalytics.vercel.app/

# 📦 Requisitos

- Docker + Docker Compose
- Python 3.10+ (apenas se quiser rodar o seed manualmente)

# 🛠 Como subir o ambiente (DB + Backend + Frontend)

Na raiz do projeto, execute:

```bash
docker compose up --build
```
Após o backend estar rodando, se quiser popular o banco:

```bash
python backend/scripts/seed.py

```

#  🔐Credenciais do Banco de Dados

As credenciais padrão são:
- Host	localhost
- Porta	5432
- Banco	combustivel360
- Usuário	admin
- Senha	admin

# 🌐 URLs dos Serviços

- Frontend	http://localhost:5173

- Backend – Swagger	http://localhost:8000

- PostgreSQL	localhost:5432

