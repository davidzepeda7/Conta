// Dependencias
import express from "express";
import cors from "cors";


// Rutas
import productsRoutes from "./src/routes/product.js";
import batchesRoutes from "./src/routes/batches.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // permite ambos puertos
    credentials: true,
  })
);
app.use(express.json());

// Endpoints
app.use("/api/products", productsRoutes);   // Productos
app.use("/api/batches", batchesRoutes);

export default app;
