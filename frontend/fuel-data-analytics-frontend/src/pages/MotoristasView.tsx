import { useEffect, useState } from "react";
import { DriverAPI } from "../api";
import {formatCPF} from "../utils/format.ts";

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

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        if (!nome || !cpf) {
            setError("Preencha todos os campos.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await DriverAPI.create({ nome, cpf });

            setSuccessMessage("Motorista cadastrado com sucesso!");
            setNome("");
            setCpf("");

            // recarrega tabela
            await loadMotoristas();

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setError("Erro ao cadastrar motorista");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p>Carregando motoristas...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    const startIndex = (page - 1) * pageSize;
    const currentPageData = motoristas.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(motoristas.length / pageSize);

    return (
        <div className="table-container">
            <h2 className="table-title">Gerenciar Motoristas</h2>

            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}

            {/* FORMULÁRIO */}
            <form onSubmit={handleCreate} className="mb-4 p-3 d-grid w-50 border rounded">
                <h5 className="mb-3">Cadastrar Novo Motorista</h5>

                <div className="col">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            maxLength={50}
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">CPF</label>
                        <input
                            type="text"
                            className="form-control"
                            value={cpf}
                            maxLength={11} // impede mais de 11 dígitos
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, ""); // remove tudo que não é dígito
                                setCpf(onlyNumbers);
                            }}
                            required
                        />
                    </div>

                    <div className="d-flex justify-content-center my-3">
                        <button
                            type="submit"
                            className="btn btn-primary w-50"
                            disabled={saving}
                        >
                            {saving ? "Salvando..." : "Cadastrar"}
                        </button>
                    </div>
                </div>
            </form>


            {/* TABELA */}
            <table className="table-modern w-100">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Atualizado em</th>
                </tr>
                </thead>
                <tbody>
                {currentPageData.map((m) => (
                    <tr key={m.id}>
                        <td data-label="ID">{m.id}</td>
                        <td data-label="Nome">{m.nome}</td>
                        <td data-label="CPF">{formatCPF(m.cpf)}</td>
                        <td data-label="Atualização">
                            {new Date(m.data_atualizacao).toLocaleString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* PAGINAÇÃO */}
            <div className="pagination-container">
                <button
                    className="btn btn-dark"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Anterior
                </button>

                <span>
                    Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                </span>

                <button
                    className="btn btn-dark"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Próxima
                </button>

                {/* CONTROLE DE PÁGINAS */}
                <div className="d-flex align-items-center mt-3 mb-3">
                    <label className="me-2 fw-bold">Quantidade: </label>
                    <select
                        className="form-select select-pagesize"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        {[5, 10, 20, 50, 100].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
