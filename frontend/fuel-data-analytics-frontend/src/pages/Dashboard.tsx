import { useEffect, useState } from "react";
import { DashboardAPI } from "../api";
import type {PrecoMedioCombustivel, ConsumoPorTipoVeiculo} from "../types/dashboard";

export default function DashboardPage() {
    const [prices, setPrices] = useState<PrecoMedioCombustivel[]>([]);
    const [vehicles, setVehicles] = useState<ConsumoPorTipoVeiculo[]>([]);

    useEffect(() => {
        DashboardAPI.getAveragePrices().then(setPrices);
        DashboardAPI.getVehicleConsumption().then(setVehicles);
    }, []);

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center fw-bold">Ministério dos Transportes</h1>

            <div className="row g-4">

                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0 text-center">Preço Médio por Combustível</h5>
                        </div>
                        <div className="card-body">
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

                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0 text-center">Consumo Total por Tipo de Veículo</h5>
                        </div>
                        <div className="card-body">
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
        </div>
    );
}
