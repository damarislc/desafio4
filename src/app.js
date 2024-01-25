import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import socketRouter from "./routes/realtime.router.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

//servidor de sockets
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuracion de handlebars
//se le dice al engine que la extension para handlebars sera hbs
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
//se le dice al engine para que busce los archivos con la extension hbs
app.set("view engine", ".hbs");
//se le dice donde se encuentra el folder de las vistas
app.set("views", path.resolve(__dirname + "/views"));
//se le dice que use acrhivos estaticos y donde encontrarlos
app.use(express.static(__dirname + "/public"));
//se le dice que use el views router
app.use("/", viewsRouter);
//se le dice que use el socket Router y se le manda el servidor io
app.use("/", socketRouter(io));
