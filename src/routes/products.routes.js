import { Router } from "express";
import ProductManager from "../dao/ProductManager.js"



const router = Router()
const productManager = new ProductManager();

// Devuelve todos los productos
router.get("/", async (req, res) => {
  const products = await productManager.getAllProducts();
  res.json(products);
});

// Devuelve un producto definido según el id recibido
router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.findProductById(Number(pid));
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
});

// Crea producto
router.post("/", async (req, res) => {
  const newProduct = req.body;
  const createdProduct = await productManager.addNewProduct(newProduct);
  res.status(201).json(createdProduct);
});

// Actualiza producto por su id
router.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const updatedFields = req.body;
  const updatedProduct = await productManager.modifyProduct(pid, updatedFields);
  if (!updatedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(updatedProduct);
});

// Elimina  producto por su id
router.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const deletedProduct = await productManager.removeProduct(pid);  
  if (!deletedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }  
  res.json(deletedProduct);
});

export default router