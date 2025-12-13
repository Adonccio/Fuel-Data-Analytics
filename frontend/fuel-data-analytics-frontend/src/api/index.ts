import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const DashboardAPI = {
    getAveragePrices: async (page = 1, size = 20) => {
        const res = await api.get(`/dashboard/precos-medios?page=${page}&size=${size}`);
        return res.data;
    },

    getVehicleConsumption: async (page = 1, size = 20) => {
        const res = await api.get(`/dashboard/consumo-veiculo?page=${page}&size=${size}`);
        return res.data;
    },

    getSales: async (page = 1, size = 20) => {
        const res = await api.get(`/dashboard/vendas?page=${page}&size=${size}`);
        return res.data;
    }
};


export const DriverAPI = {
    listAll: async () => {
        const res = await api.get("/motoristas");
        return res.data;
    },

    create: async (motorista: { nome: string; cpf: string }) => {
        const res = await api.post("/motoristas", motorista);
        return res.data;
    }
};


export const HealthAPI = {
    health: async () => {
        const res = await api.get("/");
        return res.data;
    }
};
