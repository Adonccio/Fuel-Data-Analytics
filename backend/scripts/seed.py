import random
import requests
from faker import Faker
from datetime import datetime

fake = Faker("pt_BR")

API_URL = "http://localhost:8000/ingestion" 

TIPOS_COMBUSTIVEL = ["Gasolina", "Etanol", "Diesel S10"]
TIPOS_VEICULO = ["Carro", "Moto", "Caminhão Leve", "Carreta", "Ônibus"]
ESTADOS = ["BA", "SP", "RJ", "MG", "PR", "SC", "RS"]
CIDADES = ["Salvador", "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Florianópolis", "Porto Alegre"]

def gerar_dado():
    return {
        "cnpj": fake.cnpj(),
        "posto_nome": fake.company(),
        "cidade": random.choice(CIDADES),
        "estado": random.choice(ESTADOS),

        "data_coleta": datetime.now().isoformat(),
        "tipo_combustivel": random.choice(TIPOS_COMBUSTIVEL),
        "preco": round(random.uniform(4.50, 8.50), 2),
        "volume_vendido": round(random.uniform(5, 80), 2),

        "motorista_nome": fake.name(),
        "motorista_cpf": fake.cpf(),

        "placa_veiculo": fake.license_plate(),
        "tipo_veiculo": random.choice(TIPOS_VEICULO),
    }

def enviar_dados(qtd=10):
    for _ in range(qtd):
        payload = gerar_dado()
        r = requests.post(API_URL, json=payload)

        if r.status_code == 200:
            print("✓ Enviado:", payload["motorista_nome"], "-", payload["tipo_combustivel"])
        else:
            print("Erro:", r.status_code, r.text)

if __name__ == "__main__":
    enviar_dados(2)# Enviar 200 registros
