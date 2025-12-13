import { useState } from "react";

interface MotoristaFormProps {
    onSubmit: (data: { nome: string; cpf: string }) => Promise<void>;
    loading?: boolean;
    error?: string | null;
    success?: string | null;
}

export default function MotoristaForm({
                                          onSubmit,
                                          loading = false,
                                          error = null,
                                          success = null,
                                      }: MotoristaFormProps) {

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");

    function formatCpfInput(value: string) {
        return value.replace(/\D/g, "").slice(0, 11);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit({ nome, cpf });
    }

    return (
        <form className="modern-form" onSubmit={handleSubmit}>

            <h4 className="mb-3 ">Cadastrar Motorista</h4>

            {error && <p className="alert alert-danger">{error}</p>}
            {success && <p className="alert alert-success">{success}</p>}

            <div className="mb-3 w-50">
                <label className="form-label fw-bold">Nome</label>
                <input
                    type="text"
                    className="form-control w-50"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3 w-50">
                <label className="form-label fw-bold">CPF</label>
                <input
                    type="text"
                    className="form-control w-50"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpfInput(e.target.value))}
                    required
                />
                {cpf && cpf.length < 11 && (
                    <small className="text-danger">
                        CPF deve conter 11 dígitos numéricos.
                    </small>
                )}
            </div>

            <div className="d-flex justify-content-left my-3 w-50">
                <button
                    type="submit"
                    className="btn btn-primary "
                    disabled={loading || cpf.length !== 11}
                >
                    {loading ? "Salvando..." : "Cadastrar"}
                </button>
            </div>
        </form>
    );
}
