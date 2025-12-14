import { useEffect, useState } from "react";
import { DashboardAPI } from "../api";
import type { PrecoMedioCombustivel, ConsumoPorTipoVeiculo } from "../types/dashboard";
import BarChartPreco from "../components/BarChartPreco/BarChartPreco.tsx";
import BarChartVeiculos from "../components/BarChartVeiculoConsumo/BarChartVeiculoConsumo.tsx";
import logomarca from "../assets/logomarca.png";

export default function DashboardPage() {
    const [prices, setPrices] = useState<PrecoMedioCombustivel[]>([]);
    const [vehicles, setVehicles] = useState<ConsumoPorTipoVeiculo[]>([]);

    useEffect(() => {
        DashboardAPI.getAveragePrices().then(setPrices);
        DashboardAPI.getVehicleConsumption().then(setVehicles);
    }, []);

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            {/* LOGO CENTRALIZADA */}
            <div className="mb-4 text-center align-items-start position-relative ">
                <img
                    src={logomarca}
                    height={250}
                    style={{ objectFit: "contain" }}
                    alt="Logomarca"
                />
            </div>

            {/* =========================== */}
            {/* 1ª LINHA - TABELAS          */}
            {/* =========================== */}
            <div className="row g-4 w-100 justify-content-center">

                {/* Preço Médio */}
                <div className="col-12 col-md-5">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-primary text-white text-center">
                            <h5 className="mb-0">Preço Médio por Combustível</h5>
                        </div>
                        <div className="card-body" style={{ minHeight: 250 }}>
                            {prices.length === 0 && <p>Carregando...</p>}

                            <ul className="list-group">
                                {prices.map((p, index) => (
                                    <li className="list-group-item d-flex justify-content-between" key={index}>
                                        <strong>{p.tipo_combustivel}</strong>
                                        <span>R$ {p.preco_medio.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Consumo */}
                <div className="col-12 col-md-5">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-primary text-white text-center">
                            <h5 className="mb-0">Consumo Médio por Tipo de Veículo</h5>
                        </div>
                        <div className="card-body" style={{ minHeight: 250 }}>
                            {vehicles.length === 0 && <p>Carregando...</p>}

                            <ul className="list-group">
                                {vehicles.map((v, index) => (
                                    <li className="list-group-item d-flex justify-content-between" key={index}>
                                        <strong>{v.tipo_veiculo}</strong>
                                        <span>{v.total_volume.toFixed(2)} L</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            {/* =========================== */}
            {/* 2ª LINHA - GRÁFICOS         */}
            {/* =========================== */}
            <div className="row g-4 mt-4 w-100 justify-content-center">

                {/* Gráfico Preços */}
                <div className="col-12 col-md-5">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-primary text-white text-center">
                            <h5 className="mb-0">Preço Médio</h5>
                        </div>
                        <div className="card-body">
                            <BarChartPreco data={prices} />
                        </div>
                    </div>
                </div>

                {/* Gráfico Consumo */}
                <div className="col-12 col-md-5">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-primary text-white text-center">
                            <h5 className="mb-0">Consumo por Veículo</h5>
                        </div>
                        <div className="card-body">
                            <BarChartVeiculos data={vehicles} />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}