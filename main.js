const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const productManager = new ProductManager('productos.json');

app.use(express.json());


app.get('/products', async (req, res) => {
    try {
        const allProducts = await productManager.getProducts();
        const limit = req.query.limit;
        
        if (limit) {
            res.json(allProducts.slice(0, parseInt(limit)));
        } else {
            res.json(allProducts);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto por ID' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
