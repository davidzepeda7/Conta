// src/components/RetirarStock.jsx
import React, { useEffect, useState } from "react";
import "../styles/RetirarStock.css";

const RetirarStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Seleccione un producto");

    try {
      const res = await fetch("http://localhost:4000/api/batches/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedProduct, quantity: Number(quantity) }),
      });

      const data = await res.json();
      if (!res.ok) return alert("Error: " + (data.error || "No se pudo retirar stock"));

      alert("Stock retirado correctamente");
      setQuantity(0);
      setSelectedProduct("");
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <form className="retirar-stock" onSubmit={handleSubmit}>
      <h3>Retirar Stock</h3>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        required
      >
        <option value="">Seleccione producto</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Cantidad"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <button type="submit">Retirar</button>
    </form>
  );
};

export default RetirarStock;
