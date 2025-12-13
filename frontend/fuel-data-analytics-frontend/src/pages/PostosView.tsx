import { useEffect, useState } from "react";
import {MotoristaAPI, PostoAPI} from "../api";
import {formatCNPJ} from "../utils/format.ts";
import PaginatedTable, {type Header} from "../components/PaginatedTable/PaginatedTable.tsx";
import PostosForm from "../components/PostosForm/PostosForm";
import AddButton from "../components/AddButton/AddButton.tsx";
import Modal from "../components/Modal/Modal.tsx";

interface Posto {
    id: number;
    nome: string;
    cnpj: string;
    estado: string;
    cidade: string;
    data_atualizacao: string;
}

export default function PostosView() {
    const [postos, setPostos] = useState<Posto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados do form
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Paginação
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    async function loadPosto() {
        try {
            setLoading(true);
            const data = await PostoAPI.listAll();
            setPostos(data);
        } catch (err) {
            setError("Erro ao carregar postos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPosto();
    }, []);

    async function handleCreate({ nome,  cnpj, cidade, estado }: { nome: string; cnpj: string; cidade: string; estado: string }) {
        try {
            await PostoAPI.create({ nome, cnpj, cidade, estado });
            await loadPosto();
        } catch (err) {
            console.error(err);
        }
    }
    if (loading) return <p>Carregando postos...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    const startIndex = (page - 1) * pageSize;
    const currentPageData:Posto = postos.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(postos.length / pageSize);
    const headers:Header[] = [
        { key: "id", label: "ID" },
        { key: "nome", label: "Nome" },
        { key: "cnpj", label: "CNPJ", render: (v) => formatCNPJ(v) },
        { key: "estado", label: "Estado" },
        { key: "cidade", label: "Cidade" },
        {
            key: "data_atualizacao",
            label: "Atualizado em",
            render: (v) => new Date(v).toLocaleString(),
        },
    ]

    return (
        <div className="table-container d-flex flex-column align-items-center">
            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}

            <AddButton
                label="Cadastrar Posto"
                onOpen={() => setModalOpen(true)}
            />
            <Modal
                title="Cadastrar Posto"
                isOpen={modalOpen}
                width={"600px"}
                onClose={() => setModalOpen(false)}
            >
                <div className="modal-content m-3">
                    <PostosForm
                        onSubmit={handleCreate}
                        onSuccessClose={() => setModalOpen(false)}
                    />
                </div>
            </Modal>
            <PaginatedTable inputLimit={14} searchPlaceholder={"Buscar por CNPJ"}  onSearch={async (term) => PostoAPI.findByCnpj(term)} headers={headers} data={postos}/>
        </div>
    );
}
