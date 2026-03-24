import { Router } from "express";
import { productModel } from "../model/productModel.js";


const router = Router();

// Devuelve todos los productos
router.get("/", async (req, res) => {  
  const { limit = 2, page = 1, sort, query } = req.query; 
  const limitNum = Number(limit);
  const pageNum = Number(page);  
  let sortOption = {};
  if (sort === "asc") {
    sortOption = { price: 1 };
  } else if (sort === "desc") {
    sortOption = { price: -1 };
  }  
  let filter = {};
  if (query) {
    filter = { category: query };
  } 
  const result = await productModel.paginate(filter, {
    limit: limitNum,
    page: pageNum,
    sort: sortOption,
    lean: true,
  }); 
  res.status(200).json({
    status: "success",
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage
      ? `http://localhost:8080/api/products?page=${result.prevPage}&limit=${limitNum}`
      : null,
    nextLink: result.hasNextPage
      ? `http://localhost:8080/api/products?page=${result.nextPage}&limit=${limitNum}`
      : null,
  });
});

// Devuelve un producto definido según el id recibido
router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;
  //const product = await productManager.findProductById(Number(pid));
  const product = await productModel.findById(pid);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
});

// Crea producto
router.post("/", async (req, res) => {
  const product = req.body;
  //const createdProduct = await productManager.addNewProduct(newProduct);
  const newProducts = await productModel.create(product);
  res.status(201).json(newProducts);
});

// Actualiza producto por su id
router.put("/:pid", async (req, res) => {
  //const pid = Number(req.params.pid);
  const pid = req.params.pid;
  const updatedFields = req.body;
  // const updatedProduct = await productManager.modifyProduct(pid, updatedFields);
  const updateProduct = await productModel.findByIdAndUpdate(
    pid,
    updatedFields,
  );
  if (!updateProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(updateProduct);
});

// Elimina  producto por su id
router.delete("/:pid", async (req, res) => {
  //const pid = Number(req.params.pid);
  //const deletedProduct = await productManager.removeProduct(pid);
  const pid = req.params.pid;
  const deleteProduct = await productModel.findByIdAndDelete(pid);
  if (!deleteProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(deleteProduct);
});

export default router;
