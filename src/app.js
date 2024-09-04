import express from 'express';

const app = express();

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


app.use(express.json());

const products = []; 
let nextId = 1; 


app.get('/products', (req, res) => {
    res.send({ products });
});


app.post('/products', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    
    if (!title || !description || !code || typeof price !== 'number' || typeof status !== 'boolean' || typeof stock !== 'number' || !Array.isArray(thumbnails) || !category) {
        return res.status(400).send({ status: "error", error: "Incomplete or invalid values" });
    }

    
    const newProduct = { id: nextId++, title, description, code, price, status, stock, category, thumbnails };
    products.push(newProduct); 

    res.status(201).send(newProduct); 
});


app.put('/products/:id', (req, res) => {
    const { id } = req.params; 
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;  
    const productIndex = products.findIndex(p => p.id === parseInt(id)); 

    
    if (productIndex === -1) {
        return res.status(404).send({ status: "error", error: "Product doesn't exist" });
    }

    
    products[productIndex] = { ...products[productIndex], title, description, code, price, status, stock, category, thumbnails };

    res.send({ status: "success", message: "Product updated" }); 
});


app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === parseInt(id)); 


    if (productIndex === -1) {
        return res.status(404).send({ status: "error", error: "Product doesn't exist" });
    }


    products.splice(productIndex, 1);

    res.sendStatus(204); 
});
