import express from "express";
import productsRoute from "./routes/products.routes.js";
import cartsRoute from "./routes/carts.routes.js";
import __dirname from "./utilities.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js"
import ProductManager from "./dao/ProductManager.js";
import { Server } from "socket.io";


const app = express();
const productManager = new ProductManager();


app.engine("handlebars", handlebars.engine ());
app.set ("view engine", "handlebars");
app.set ("views", __dirname +"/views");

app.use("/", viewsRouter);

app.use(express.json());
app.use(express.static(__dirname + "/public"))

// ---------------------------------Productos--------------------------------------------
app.use("/api/products", productsRoute);
// ---------------------------------Carrito--------------------------------------------
app.use("/api/carts", cartsRoute);

/* DETERMINACION DE SERVIDOR HTTP PARA QUE PUEDA INICIAR EL PROTOCOLO DE WEBSOCKETS*/
const httpServer = app.listen(8080, () => {
  console.log("Server funcionando");
});

/*  INICIA PROTOCOLO DE WEBSOCKETS DESDE EL LADO DEL SERVIDOR */
export const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  /* CLIENTE CONECTADO*/
  console.log("Cliente conectado");

  try {
    /* OBTENER LISTA DE PRODUCTOS */
    const products = await productManager.getAllProducts() ;  

    /* ENVIAR AL CLIENTE */
    socket.emit("productosDisponibles", products);
  } catch (error) {
    console.error("ERROR AL LEER PRODUCTOS:", error);
    socket.emit("productosDisponibles", []); 
  }

  /* ESCUCHAR NUEVO PRODUCTO */
  socket.on("crearProducto", async (productData) => {
    try {
      await productManager.addNewProduct(productData);
      const updatedProducts = await productManager.getAllProducts();
      socketServer.emit("productosDisponibles", updatedProducts);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      socket.emit("errorCrearProducto", "No se pudo agregar el producto");
    }
  }); /* FIN ESCUCHA NUEVO PRODUCTO */

  socket.on("eliminarProducto", async (pid) => {
    try {
      /* ELIMINAR PRODUCTO EN products.json */
      await productManager.removeProduct(Number(pid));
      /* OBTENER LISTA ACTUALIZADA DE PRODUCTOS */
      const updatedProducts = await productManager.ggetAllProducts();
      /* ENVIAR LISTA ACTUALIZADA A CLIENTES */
      socketServer.emit("productosActuales", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      socket.emit("errorEliminarProducto", "No se pudo eliminar el producto");
    }
  }); /* ELIMINAR PRODUCTO  */


}); 