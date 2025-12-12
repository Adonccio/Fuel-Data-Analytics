import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// -----------------------------
// Dashboard endpoints
// -----------------------------

export const DashboardAPI = {
    getAveragePrices: async (page = 1, size = 20) => {
        const res = await api.get(`/dashboard/average-prices?page=${page}&size=${size}`);
        return res.data;
    },

    getVehicleConsumption: async (page = 1, size = 20) => {
        const res = await api.get(`/dashboard/vehicle-consumption?page=${page}&size=${size}`);
        return res.data;
    },

    getSales: async (page = 1, size = 20) => {
        const res = await api.get(`/dashboard/sales?page=${page}&size=${size}`);
        return res.data;
    }
};


// -----------------------------
// Driver / Motorista endpoints
// -----------------------------

export const DriverAPI = {
    search: async (cpf?: string, nome?: string) => {
        const params: any = {};

        if (cpf) params.cpf = cpf;
        if (nome) params.nome = nome;

        const res = await api.get("/drivers/search", { params });
        return res.data;
    }
};

// -----------------------------
// Health Check
// -----------------------------

export const HealthAPI = {
    health: async () => {
        const res = await api.get("/");
        return res.data;
    }
};
