import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
const productManager = new ProductManager();
const cartManager = new CartManager();
app.use(express.json());

// ---------------------------------Productos--------------------------------------------

// Devuelve todos los productos
app.get("/api/products", async (req, res) => {
  const products = await productManager.getAllProducts();
  res.json(products);
});

// Devuelve un producto definido según el id recibido
app.get("/api/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.findProductById(Number(pid));
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
});

// Crea producto
app.post("/api/products", async (req, res) => {
  const newProduct = req.body;
  const createdProduct = await productManager.addNewProduct(newProduct);
  res.status(201).json(createdProduct);
});

// Actualiza producto por su id
app.put("/api/products/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const updatedFields = req.body;
  const updatedProduct = await productManager.modifyProduct(pid, updatedFields);
  if (!updatedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(updatedProduct);
});

// Elimina  producto por su id
app.delete("/api/products/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const deletedProduct = await productManager.removeProduct(pid);  
  if (!deletedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }  
  res.json(deletedProduct);
});

// ---------------------------------Carrito--------------------------------------------

// Crea un nuevo carrito
app.post("/api/carts", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Agrega un producto a un carrito
app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cid = Number(req.params.cid); // id del carrito
  const pid = Number(req.params.pid); // id del producto

  const updatedCart = await cartManager.addProductToCart(cid, pid);
  if (!updatedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  res.json(updatedCart);
});

// Devuelve los productos de un carrito por su id
app.get("/api/carts/:cid", async (req, res) => {
  const cid = Number(req.params.cid); // id del carrito
  const cart = await cartManager.findCartById(cid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  res.json(cart.products);
});

app.listen(8080, () => {
  console.log("Server levantado en puerto 8080");
});
