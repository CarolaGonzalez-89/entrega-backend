import { Router } from "express";
import { cartModel } from "../model/cartModel.js";

const router = Router();

// Crea un nuevo carrito
router.post("/", async (req, res) => {
  const newCart = await cartModel.create({});
  res.status(201).json(newCart);
});

// Agrega un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartModel.findById(cid);
  let products = cart.products;
  if (!products.find((product) => product.product == pid)) {
    products.push({ product: pid, quantity: 1 });
  } else {
    const product = products.find((product) => product.product == pid);
    product.quantity += 1;
  }
  const updatedCart = await cartModel.findByIdAndUpdate(cid, cart);
  res.status(200).json({ message: "carrito actualizado", updatedCart });
});

// Devuelve los productos de un carrito por su id
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartModel.findById({ _id: cid });
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  res.json(cart.products);
});

// Actualiza la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Cantidad incorrecta" });
  }
  const cart = await cartModel.findById(cid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito inexistente" });
  }
  const productInCart = cart.products.find((item) => {
    const productId = item.product._id
      ? item.product._id.toString()
      : item.product.toString();
    return productId === pid;
  });
  if (!productInCart) {
    return res
      .status(404)
      .json({ error: "Producto inexistente en el carrito" });
  }
  productInCart.quantity = quantity;
  await cart.save();
  res.json({ message: "Cantidad actualizada", cart });
});

// Sobrescribe todos los productos del carrito
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  if (!Array.isArray(products)) {
    return res
      .status(400)
      .json({ error: "Se espera un array de productos en el body" });
  }
  const cart = await cartModel.findById(cid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito inexistente" });
  }
  cart.products = products;
  await cart.save();
  res.json({ message: "Carrito actualizado", cart });
});

// Elimina un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  // Busco el carrito
  const cart = await cartModel.findById({ _id: cid });
  if (!cart) {
    return res.status(404).json({ error: "Carrito inexistente" });
  }
  //Filtro los porductos
  cart.products = cart.products.filter(
    (product) => product.product._id.toString() !== pid,
  );
  // Guardo los cambios
  await cart.save();
  res.json({ message: "Producto quitado del carrito", cart });
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartModel.findById(cid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito inexistente" });
  }
  cart.products = [];
  await cart.save();
  res.json({
    message: "Todos los productos fueron eliminados del carrito",
    cart,
  });
});

export default router;
