import fs from "fs/promises";

class ProductManager {
  // Comprueba si products.json existe y lo crea en caso contrario
  async checkFileExists() {
    try {
      await fs.readFile("products.json", "utf-8");
    } catch (error) {
      await fs.writeFile("products.json", JSON.stringify([]), "utf-8");
    }
  }

  // Lee todos los productos almacenados en products.json
  async getAllProducts() {
    await this.checkFileExists();
    const products = await fs.readFile("products.json", "utf-8");
    return JSON.parse(products);
  }

  // Busca un producto por su id
  async findProductById(id) {
    const products = await this.getAllProducts();
    return products.find((product) => product.id === id) || null;
  }

  // Agrega un producto con id automático (no recibido por body)
  async addNewProduct(product) {
    const products = await this.getAllProducts();
    const newProduct = {
      id: products.length === 0 ? 1 : products[products.length - 1].id + 1,
      ...product,
    };
    products.push(newProduct);
    await fs.writeFile("products.json", JSON.stringify(products), "utf-8");
    return newProduct;
  }

  // Actualiza un producto existente según su id, sin permitir modificarlo
  async modifyProduct(id, updatedFields) {
    const products = await this.getAllProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return null;
    }
    products[index] = {
      ...products[index],
      ...updatedFields,
      id: products[index].id,
    };
    await fs.writeFile("products.json", JSON.stringify(products), "utf-8");
    return products[index];
  }

  // Borra un producto por id
  async removeProduct(id) {
    const products = await this.getAllProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return null;
    }
    const deletedProduct = products.splice(index, 1)[0];
    await fs.writeFile("products.json", JSON.stringify(products), "utf-8");
    return deletedProduct;
  }
}

export default ProductManager;
