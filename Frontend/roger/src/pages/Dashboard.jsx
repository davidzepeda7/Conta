// src/pages/Dashboard.jsx
import React from "react";
import CrearProducto from "../components/CrearProducto";
import AgregarStock from "../components/AgregarStock";
import RetirarStock from "../components/RetirarStock";
import ProductList from "../components/ProductList";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Sistema de Productos</h1>
      <div className="forms">
        <CrearProducto />
        <AgregarStock />
        <RetirarStock />
      </div>
      <ProductList />
    </div>
  );
};

export default Dashboard;
