import { useState, useMemo, useEffect } from "react";
import "./PaginatedTable.css";

export interface Header {
    key: string;
    label: string;
    render?: (value: any, row: any) => JSX.Element | string;
}

interface PaginatedTableProps {
    headers: Header[];
    data: any[];
    defaultPageSize?: number;

    onSearch?: (term: string) => Promise<any[]>;
    searchPlaceholder?: string;
    inputLimit: number;
}

export default function PaginatedTable({
                                           headers,
                                           data,
                                           defaultPageSize = 10,
                                           onSearch,
                                           searchPlaceholder = "Buscar...",
                                           inputLimit
                                       }: PaginatedTableProps) {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState("");

    const [filteredData, setFilteredData] = useState<any[]>(data);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const currentPageData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, page, pageSize]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    // dispara busca apenas quando searchTerm muda
    useEffect(() => {
        if (!onSearch) return;
        if (searchTerm === "") return;

        const fetch = async () => {
            const result = await onSearch(searchTerm);
            setFilteredData(result);
            setPage(1);
        };

        fetch();
    }, [searchTerm]);

    return (
        <div className="w-100">

            {onSearch && (
                <div className="search-container d-flex justify-content-center mb-4 gap-2">

                    <input
                        type="text"
                        className="form-control"
                        placeholder={searchPlaceholder}
                        value={inputValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= inputLimit) {
                                setInputValue(value);
                            }

                            if (value.length === 0) {
                                setSearchTerm("");
                                setFilteredData(data);
                                setPage(1);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && inputValue.length === inputLimit) {
                                setSearchTerm(inputValue);
                            }
                        }}
                    />

                    <button
                        className="btn btn-primary"
                        disabled={inputValue.length !== inputLimit}
                        onClick={() => setSearchTerm(inputValue)}
                    >
                        Buscar
                    </button>
                </div>
            )}

            {/* TABELA */}
            <table className="table-modern w-100">
                <thead>
                <tr>
                    {headers.map((h) => (
                        <th key={h.key}>{h.label}</th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {currentPageData.map((row, idx) => (
                    <tr key={idx}>
                        {headers.map((h) => {
                            const value = row[h.key];
                            return (
                                <td key={h.key} data-label={h.label}>
                                    {h.render ? h.render(value, row) : value}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>

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
                    className="btn btn-primary"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Próxima
                </button>

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
                        {[5, 10, 20, 50, 100].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
