import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SidebarMenu.css";
import { Link } from "react-router-dom";
import {CarIcon} from "../../assets/icons/CarIcon.tsx";
import {AnalyticsIcon} from "../../assets/icons/AnalyticsIcon.tsx";
import {FuelPumpIcon} from "../../assets/icons/FuelPumpIcon.tsx";
import {PersonIcon} from "../../assets/icons/PersonIcon.tsx";
import {DatabaseIcon} from "../../assets/icons/DatabaseIcon.tsx";

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <div className={`sidebar text-light ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header p-3">
                <button
                    className="btn btn-outline-light w-100"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    ☰
                </button>
            </div>

            <ul className="nav flex-column">

                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" to={"/"}>
                        <AnalyticsIcon/>
                        <span className="sidebar-text">Análise</span>
                    </Link>
                </li>


                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" to={"/motoristas"}>
                        <PersonIcon/>
                        <span className="sidebar-text">Motoristas</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" to={"/postos"}>
                        <FuelPumpIcon/>
                        <span className="sidebar-text">Postos</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" to={"/veiculos"}>
                        <CarIcon/>
                        <span className="sidebar-text">Veículos</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center"  to={"/controle-registros"}>
                        <DatabaseIcon/>
                        <span className="sidebar-text">Controle de Registros</span>
                    </Link>
                </li>

            </ul>
        </div>
    );
};
