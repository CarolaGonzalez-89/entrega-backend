/* CONEXIÓN AL SERVIDOR WEBSOCKET  */
const socket = io();

/* CONTENEDOR PARA PRODUCTOS */
const productsCatalogue = document.getElementById("productsContainer");

/*RECIBIR LISTA DE PRODUCTOS Y RENDERIZAR  */
socket.on("productosDisponibles", (products) => {
  productsCatalogue.innerHTML = ""; 

  products.forEach((product) => {
    const li = document.createElement("li");

    /*  RENDERIZAR PRODUCTO COMO TARJETA */
    li.innerHTML = `
  <div class="product-card">

    <div class="product-header">
      <h3 class="product-title">${product.title}</h3>
      <span class="product-price">$${product.price}</span>
    </div>

    <p class="product-description">
      ${product.description}
    </p>

    <div class="product-details">

      <span class="product-id">
        ID: ${product.id}
      </span>

      <span class="product-code">
        Código: ${product.code}
      </span>

      <span class="product-stock">
        Stock: ${product.stock}
      </span>

      <span class="product-category">
        ${product.category}
      </span>

      <span class="product-status ${product.status ? "status-active" : "status-inactive"}">
        ${product.status ? "Disponible" : "No disponible"}
      </span>

    </div>

  </div>
`;
    productsCatalogue.appendChild(li);
  });
});

/*  FORMULARIO PARA INGRESAR PRODUCTO  */
const addProductForm = document.getElementById("addProductForm");

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault(); /* EVITA RECARGA DE PÁGINA */

  /*  LEER FORMULARIO */
  const formData = new FormData(addProductForm);
  const productData = Object.fromEntries(formData.entries());

  /* CONVERTIR CAMPOS NUMÉRICOS Y BOOLEANOS  */
  productData.price = Number(productData.price);
  productData.stock = Number(productData.stock);
  productData.status = productData.status === "true";
  productData.thumbnails = productData.thumbnails
    ? [productData.thumbnails]
    : [];

  /*  ENVIAR DATOS AL SERVIDOR POR WEBSOCKET   */
  socket.emit("crearProducto", productData);

  /*  MOSTRAR ALERTA DE EXITO  */
  Swal.fire({
    icon: "success",
    title: "Producto agregado",
    text: `${productData.title} se agregó correctamente!`,
    timer: 1500,
    showConfirmButton: false,
  });

  /* LIMPIAR FORMULARIO  */
  addProductForm.reset();
});

/* FORMULARIO PARA ELIMINAR PRODUCTO */
const deleteProductForm = document.getElementById("deleteProductForm");

deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault(); /* EVITAR RECARGA DE PÁGINA  */

  /*  LEER ID DEL PRODUCTO A ELIMINAR  */
  const pid = deleteProductForm.pid.value;

  /* ENVIAR ID AL SERVIDOR POR WEBSOCKET  */
  socket.emit("eliminarProducto", pid);

  /* ==== MOSTRAR ALERTA DE EXITO  ====== */
  Swal.fire({
    icon: "success",
    title: "Producto eliminado",
    text: `El producto con ID ${pid} se eliminó correctamente!`,
    timer: 1500,
    showConfirmButton: false,
  });

  /*  LIMPIAR FORMULARIO */
  deleteProductForm.reset();
});
