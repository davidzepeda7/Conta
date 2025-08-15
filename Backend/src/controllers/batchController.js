import Product from "../models/Product.js";
import Batch from "../models/Batch.js";
import Movement from "../models/Movement.js";

// Agregar stock
export const addStock = async (req, res) => {
  try {
    const { productId, quantity, price, code } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const batch = await Batch.create({ product: productId, quantity, remaining: quantity, price, code });
    product.totalStock += quantity;
    await product.save();

    await Movement.create({ product: productId, type: "entrada", quantity, price, code });

    res.json({ product, batch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retirar stock FIFO
export const removeStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    if (product.totalStock < quantity) return res.status(400).json({ error: "Stock insuficiente" });

    let qtyToRemove = quantity;
    const batches = await Batch.find({ product: productId, remaining: { $gt: 0 } }).sort({ date: 1 });
    const removed = [];

    for (let batch of batches) {
      if (qtyToRemove <= 0) break;

      const deduct = Math.min(batch.remaining, qtyToRemove);
      batch.remaining -= deduct;
      await batch.save();

      await Movement.create({ product: productId, type: "salida", quantity: deduct, price: batch.price, code: batch.code });
      removed.push({ batchId: batch._id, quantity: deduct, price: batch.price, code: batch.code });
      qtyToRemove -= deduct;
    }

    product.totalStock -= quantity;
    await product.save();

    res.json({ product, removed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar lotes
export const getAllBatches = async (req, res) => {
  const batches = await Batch.find().populate("product");
  res.json(batches);
};

export const getProductBatches = async (req, res) => {
  const { productId } = req.params;
  const batches = await Batch.find({ product: productId });
  res.json(batches);
};
