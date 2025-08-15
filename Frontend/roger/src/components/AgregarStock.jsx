// src/components/AgregarStock.jsx
import React, { useEffect, useState } from "react";
import "../styles/AgregarStock.css";

const AgregarStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0); // nuevo precio por lote

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:4000/api/products");
    if (!res.ok) return alert("Error al cargar productos");
    const data = await res.json();
    setProducts(data);
  };

  const handleProductChange = async (e) => {
    setSelectedProduct(e.target.value);
    setSelectedBatch("");
    if (!e.target.value) return setBatches([]);
    
    const resBatches = await fetch(`http://localhost:4000/api/batches/${e.target.value}`);
    if (!resBatches.ok) return alert("Error al cargar lotes");
    const batchData = await resBatches.json();
    setBatches(batchData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Seleccione un producto");

    // Si el usuario selecciona un lote existente
    let batchToUse = batches.find(b => b._id === selectedBatch);

    const body = {
      productId: selectedProduct,
      quantity: Number(quantity),
      price: batchToUse ? batchToUse.price : Number(price),
      code: batchToUse ? batchToUse.code : `L-${Date.now()}`
    };

    const res = await fetch("http://localhost:4000/api/batches/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) return alert("Error al agregar stock");
    await res.json();
    alert("Stock agregado correctamente");

    setQuantity(0);
    setSelectedBatch("");
    setPrice(0);
  };

  return (
    <form className="agregar-stock" onSubmit={handleSubmit}>
      <h3>Agregar Stock</h3>

      <label>Producto</label>
      <select value={selectedProduct} onChange={handleProductChange} required>
        <option value="">Seleccione producto</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {batches.length > 0 && (
        <>
          <label>Lote existente</label>
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
            <option value="">Nuevo lote / Precio distinto</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>
                Código: {b.code} | Precio: {b.price}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Precio solo si se crea un nuevo lote */}
      {!selectedBatch && (
        <>
          <label>Precio del nuevo lote</label>
          <input
            type="number"
            placeholder="Precio del nuevo lote"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </>
      )}

      <label>Cantidad</label>
      <input
        type="number"
        placeholder="Cantidad"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        required
      />
      <button type="submit">Agregar</button>
    </form>
  );
};

export default AgregarStock;
