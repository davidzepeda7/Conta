// src/components/CrearProducto.jsx
import React, { useState } from "react";
import "../styles/CrearProducto.css";

const CrearProducto = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [code, setCode] = useState("");
  const [stock, setStock] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price,
        code,
        totalStock: stock
      }),
    });
    const data = await res.json();
    alert("Producto creado: " + data.name);
    setName(""); setDescription(""); setPrice(0); setCode(""); setStock(0);
  };

  return (
    <form className="crear-producto" onSubmit={handleSubmit}>
      <h3>Crear Producto</h3>
      <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
      
      <label htmlFor="precio">Precio</label>
      <input
        id="precio"
        type="number"
        placeholder="Precio"
        value={price}
        onChange={e => setPrice(e.target.value)}
        required
      />

      <input type="text" placeholder="Código" value={code} onChange={e => setCode(e.target.value)} required />
      
      <label htmlFor="stock">Stock inicial</label>
      <input
        id="stock"
        type="number"
        placeholder="Stock inicial"
        value={stock}
        onChange={e => setStock(e.target.value)}
      />

      <button type="submit">Crear</button>
    </form>
  );
};

export default CrearProducto;
