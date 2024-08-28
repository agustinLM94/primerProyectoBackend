import fs, { unlink, unlinkSync } from 'fs';

fs.writeFileSync('./firstFile.txt', 'hola texto');
fs.unlinkSync('./firstFile.txt', )

class ProductManager {
    constructor(){
        this.products = []
    } 
    
static id = 0


addProduct(title, description, code, price, status , stock, category ) {
    for (let i = 0; i < this.products.length; id++) {
        if (this.products[i].code === code) {
            console.log(`el codigo ${code} esta repetido`);
            break
        }
    }

    const newProduct ={
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
    };

    if (!Object.values(newProduct).includes(undefined)){
        ProductManager.id++;
        this.products.push({
        ...newProduct,
        id: ProductManager.id,
        });
    }else{
        console.log("todos los campos son requeridos")
    }

 }   

    

 getProduct(){
    return this.products;
 }
existe (id){
    return this.products.find((product) => product.id === id )
}
 getProductById(id){
    !this.existe(id) ?  console.log("not found") : console.log(this.existe(id));
    }
  
} 

const productos = new ProductManager();

console.log(productos.getProduct())

productos.addProduct("titulo1","descripcion",1000,1000,"imagen",1000,"category")
productos.addProduct("titulo2","descripcion",1000,1000,"imagen",1000,"category")

console.log(productos.getProduct())

productos.addProduct("titulo1","descripcion",1000,1000,"imagen",1000,"category")

productos.getProductById(2)