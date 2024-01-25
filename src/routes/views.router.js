import express from "express";
import path from "path";
import __dirname from "../utils.js";
import ProductManager from "../model/productManager.js";

//se crea el router para la página principal
const router = express.Router();
const productsdb = path.join(__dirname, "/db", "products.json");
const productManager = new ProductManager(productsdb);

//endpoint del GET para obtener todos los productos
router.get("/", async (req, res) => {
  //se obtienen todos los productos
  const products = await productManager.getProducts();
  //se renderea el handbars del home con la lista de productos y el título de la página
  res.render("home", { products, title: "Lista de productos" });
});

export default router;
