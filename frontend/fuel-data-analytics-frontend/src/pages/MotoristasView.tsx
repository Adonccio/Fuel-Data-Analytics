import { useEffect, useState } from "react";
import { DriverAPI } from "../api";
import {formatCPF} from "../utils/format.ts";
import PaginatedTable, {type Header} from "../components/PaginatedTable/PaginatedTable.tsx";
import MotoristaForm from "../components/MotoristasForm/MotoristasForm";

interface Motorista {
    id: number;
    nome: string;
    cpf: string;
    data_atualizacao: string;
}

export default function MotoristasView() {
    const [motoristas, setMotoristas] = useState<Motorista[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados do form
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    // Paginação
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    async function loadMotoristas() {
        try {
            setLoading(true);
            const data = await DriverAPI.listAll();
            setMotoristas(data);
        } catch (err) {
            setError("Erro ao carregar motoristas");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMotoristas();
    }, []);

    async function handleCreate({ nome, cpf }: { nome: string; cpf: string }) {
        try {
            await DriverAPI.create({ nome, cpf });
            await loadMotoristas();
        } catch (err) {
            console.error(err);
        }
    }
    if (loading) return <p>Carregando motoristas...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    const startIndex = (page - 1) * pageSize;
    const currentPageData = motoristas.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(motoristas.length / pageSize);
    const headers:Header[] = [
        { key: "id", label: "ID" },
        { key: "nome", label: "Nome" },
        { key: "cpf", label: "CPF", render: (v) => formatCPF(v) },
        {
            key: "data_atualizacao",
            label: "Atualizado em",
            render: (v) => new Date(v).toLocaleString(),
        },
    ]

    return (
        <div className="table-container">
            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}



            <MotoristaForm
                onSubmit={handleCreate}
            />

            <PaginatedTable headers={headers} data={motoristas}/>
        </div>
    );
}
