import { useState, useMemo } from "react";

export interface Header {
    key: string;
    label: string;
    render?: (value: any, row: any) => JSX.Element | string;
}

interface PaginatedTableProps {
    headers: Header[];
    data: any[];
    defaultPageSize?: number;
}

export default function PaginatedTable({
                                           headers,
                                           data,
                                           defaultPageSize = 10,
                                       }: PaginatedTableProps) {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const totalPages = Math.ceil(data.length / pageSize);

    const currentPageData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, page, pageSize]);

    return (
        <div className="w-100">

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
                    className="btn btn-dark"
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
