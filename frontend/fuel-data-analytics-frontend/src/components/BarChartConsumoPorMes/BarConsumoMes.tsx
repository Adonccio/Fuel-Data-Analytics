
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const mesesLabels = {
    1: "Jan",
    2: "Fev",
    3: "Mar",
    4: "Abr",
    5: "Mai",
    6: "Jun",
    7: "Jul",
    8: "Ago",
    9: "Set",
    10: "Out",
    11: "Nov",
    12: "Dez"
};

export default function BarConsumoMes({ data }) {
    if (!data || data.length === 0) return <p>Nenhum dado disponível</p>;

    const chartData = data.map(item => ({
        mes: mesesLabels[item.mes] ?? item.mes,     // converte 1 → Jan
        volume: item.total_volume
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#1a3361" />
            </BarChart>
        </ResponsiveContainer>
    );
}
