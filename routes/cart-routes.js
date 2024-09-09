const express = require('express');
const router = express.Router();
const { readCartsFile, writeCartsFile } = require('../manager/cart-manager');
const { readProductsFile } = require('../manager/product-manager');

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    const carts = await readCartsFile();
    res.json(carts);
});

router.post('/', async (req, res) => {
    const carts = await readCartsFile();
    const newCart = { id: Date.now().toString(), products: [] };
    carts.push(newCart);
    await writeCartsFile(carts);
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const carts = await readCartsFile();
    const cart = carts.find(c => c.id == req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const carts = await readCartsFile();
    const products = await readProductsFile();
    const cart = carts.find(c => c.id == req.params.cid);
    const product = products.find(p => p.id == req.params.pid);
    if (cart && product) {
        const cartProduct = cart.products.find(p => p.product == req.params.pid);
        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }
        await writeCartsFile(carts);
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart or Product not found' });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    const { quantity } = req.body;
    const carts = await readCartsFile();
    const cart = carts.find(c => c.id == req.params.cid);
    if (cart) {
        const cartProduct = cart.products.find(p => p.product == req.params.pid);
        if (cartProduct) {
            cartProduct.quantity = quantity;
            await writeCartsFile(carts);
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
});

router.delete('/:cid', async (req, res) => {
    let carts = await readCartsFile();
    carts = carts.filter(c => c.id != req.params.cid);
    await writeCartsFile(carts);
    res.status(200).json({ message: 'Cart deleted' });
});

module.exports = router;