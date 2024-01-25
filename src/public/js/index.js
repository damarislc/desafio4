//Se hace la conexion del socket en el front-end
const socket = io();
//selecciona el ul de la lista
const ul = document.querySelector("#products-list");

//socket para añadir un producto
socket.on("add_product", (product) => {
  //se añade el codigo html del list item del nuevo producto al elemento ul
  ul.innerHTML += `<li id="${product.id}"><b>ID: </b>${product.id}, <b>Producto: </b>${product.title}</li>`;
});

//socket para borrar un producto
socket.on("delete_product", (product) => {
  //se busca el list item que corresponda al id del producto
  const li = document.getElementById(product.id);
  //se quita de la lista
  ul.removeChild(li);
});
