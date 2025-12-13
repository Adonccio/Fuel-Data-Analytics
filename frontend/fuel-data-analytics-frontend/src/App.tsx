import DashboardPage from "./pages/Dashboard.tsx";
import { Sidebar } from "./components/Sidebar/SidebarMenu.tsx";
import { Routes, Route } from "react-router-dom";
import MotoristasView from "./pages/MotoristasView.tsx";
import PostosView from "./pages/PostosView.tsx";
import VeiculosView from "./pages/VeiculosView.tsx";
import ControleRegistrosView from "./pages/ControleRegistrosView.tsx";

export default function App() {
    return (
        <div className="app-layout d-flex">
            <Sidebar />

            <div className="flex-grow-1 p-4">
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/motoristas" element={<MotoristasView />} />
                    <Route path="/postos" element={<PostosView />} />
                    <Route path="/veiculos" element={<VeiculosView />} />
                    <Route path="/controle-registros" element={<ControleRegistrosView />} />
                </Routes>
            </div>
        </div>
    );
}