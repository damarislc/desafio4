import express from "express";
import path from "path";
import __dirname from "../utils.js";
import ProductManager from "../model/productManager.js";

/**
 * Función del router el cual recibe el socket de parámetro.
 * @param {*} io el socket
 * @returns el router
 */
export default function socketRouter(io) {
  //se crea el router
  const router = express.Router();
  //se crea el directorio del producst.json
  const productsdb = path.join(__dirname, "/db", "products.json");
  //se crea la instancia del ProductManager
  const productManager = new ProductManager(productsdb);

  //endpoint del GET para obtener todos los productos a listar
  router.get("/realtimeproducts", async (req, res) => {
    //se obtienen todos los productos
    const products = await productManager.getProducts();
    //se renderea el handlebar de realTimeProducts con los productos y el titulo de la página
    res.render("realTimeProducts", {
      products,
      title: "Productos tiempo real",
    });
  });

  //endpoint del POST para añadir un producto
  router.post("/realtimeproducts", async (req, res) => {
    //se obtiene el producto del body
    const productReq = req.body;
    try {
      //se añade el producto al json
      const product = await productManager.addProduct(productReq);
      //se emite el "mensaje" al cliente con el producto añadido
      io.emit("add_product", product);
      //se manda la respuesta al request del POST
      res.json(product);
    } catch (error) {
      return res.status(400).send(`Error al añadir el producto. ${error}`);
    }
  });

  //endpoint del DELETE para borrar un producto
  router.delete("/realtimeproducts/:pid", async (req, res) => {
    //Se obtiene el id del producto a eliminar
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
      return res.status(400).send("El id tiene que ser un numero");
    }
    try {
      //se borra el producto del JSON
      const product = await productManager.deleteProduct(pid);
      //se emite el "mensaje" del producto eliminado al cliente
      io.emit("delete_product", product);
      //se manda la respuesta al request del DELETE
      res.json(product);
    } catch (error) {
      return res.status(400).send(`Error al borrar el producto. ${error}`);
    }
  });

  return router;
}
