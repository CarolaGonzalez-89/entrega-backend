import fs from "fs/promises";

class CartManager {
  // Controla si existe carts.json y lo crea vacío si no está presente
  async checkFileExists()  {
    try {
      await fs.readFile("carts.json", "utf-8");
    } catch (error) {
      await fs.writeFile("carts.json", JSON.stringify([]), "utf-8");
    }
  }

  // Lee todos los carritos almacenados en carts.json
  async getAllCarts() {
    await this.checkFileExists() ; 
    const carts = await fs.readFile("carts.json", "utf-8");
    return JSON.parse(carts); 
  }

  // Crea un carrito con id automático y productos vacíos
  async createCart() {
    const carts = await this.getAllCarts();
    const newCart = {
      id: carts.length === 0 ? 1 : carts[carts.length - 1].id + 1,
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile("carts.json", JSON.stringify(carts), "utf-8");
    return newCart;
  }

  // Obtiene un carrito por su id
  async findCartById(id) {
    const carts = await this.getAllCarts();
    return carts.find((cart) => cart.id === id) || null;
  }

  // Suma un producto al carrito o incrementa la cantidad si ya existe
  async addProductToCart(cid, pid) {
    const carts = await this.getAllCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cid);
    if (cartIndex === -1) {
      return null;
    }
    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(
      (item) => item.product === pid,
    );
    if (productIndex === -1) {
      cart.products.push({
        product: pid,
        quantity: 1,
      });
    } else {
      cart.products[productIndex].quantity++;
    }
    await fs.writeFile("carts.json", JSON.stringify(carts), "utf-8");
    return cart;
  }
}

export default CartManager;
