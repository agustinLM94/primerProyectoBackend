import express from "express";
import exphbs from 'express-handlebars';
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';


import { productsRouter } from "./routes/productsRouter.js";
import { cartsRouter } from "./routes/cartsRouter.js";
import { viewsRouter } from "./routes/viewsRouter.js";


import { ProductManager } from "./managers/productManager.js";
import { CartManager } from "./managers/cartManager.js";


const productManagerInstance = new ProductManager();
const cartManagerInstance = new CartManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    try {
        const products = await productManagerInstance.getProducts();
        socket.emit("productos", products);
        
        socket.on("eliminarProducto", async (id) => {
            try {
                await productManagerInstance.deleteProduct(id);
                const updatedProducts = await productManagerInstance.getProducts();
                io.emit("productos", updatedProducts);
            } catch (error) {
                console.error("Error deleting product:", error);
                socket.emit("error", "Failed to delete product");
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        socket.emit("error", "Failed to load products");
    }
});

export { productManagerInstance as productManager, cartManagerInstance as cartManager };
