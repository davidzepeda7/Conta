import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CrearProducto from "../components/CrearProducto";
import AgregarStock from "../components/AgregarStock";
import RetirarStock from "../components/RetirarStock";
import ProductList from "../components/ProductList";
import Error404 from "../components/NotFound"; // tu componente 404
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const isLogged = localStorage.getItem("loggedIn");
    if (!isLogged) setAuthorized(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  if (!authorized) return <Error404 />;

  return (
    <div className="dashboard">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
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
