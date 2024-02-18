const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(product) {
    try {
      const products = await this.getProductsFromFile();
      product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
      products.push(product);
      await this.saveProductsToFile(products);
      console.log("Producto agregado correctamente:", product);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async getProducts() {
    try {
      const products = await this.getProductsFromFile();
      return products;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProductsFromFile();
      const product = products.find(product => product.id === id);
      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      return null;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      let products = await this.getProductsFromFile();
      const index = products.findIndex(product => product.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields };
        await this.saveProductsToFile(products);
        console.log("Producto actualizado correctamente:", products[index]);
      } else {
        console.error("Producto no encontrado.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  }

  async deleteProduct(id) {
    try {
      let products = await this.getProductsFromFile();
      const index = products.findIndex(product => product.id === id);
      if (index !== -1) {
        const deletedProduct = products.splice(index, 1);
        await this.saveProductsToFile(products);
        console.log("Producto eliminado correctamente:", deletedProduct);
      } else {
        console.error("Producto no encontrado.");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  async getProductsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      } else {
        throw error;
      }
    }
  }

  async saveProductsToFile(products) {
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }
}

module.exports = ProductManager;
