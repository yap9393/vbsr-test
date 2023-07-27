let valorDolar = 1
//se establecio valor de dolar 1 solo para tener numeros mas chicos en el simulador.

class Producto {
    constructor( marca, modelo, rangoEdad, deporte, tamanio, precio, stock,imagen, alt) {
        this.marca = marca;
        this.modelo = modelo;
        this.rangoEdad = rangoEdad;
        this.deporte = deporte;
        this.tamanio = tamanio;
        this.precio = parseFloat(precio);
        this.stock = parseFloat(stock);
        this.imagen=imagen;
        this.alt='esquies';
    }
    precioEnPesos() {
        return this.precio * valorDolar;
    }
    sumarIva() {
        return this.precio * valorDolar * 1.21;
    }
    precioDeVenta() {
        return Math.ceil(this.precio * valorDolar * 1.21 * 1.3);
    }
}

const productos = [];


//mostrar productos en dom 
let contenedorDeProductos = document.getElementById('contenedorDeProductos')

function mostrarProductos(arrayProductos) {
  contenedorDeProductos.innerHTML = '';
  let fila = document.createElement('div');
  fila.classList.add('row', 'row-cols-1', 'row-cols-md-4', 'gx-5', 'gy-5');

  for (let producto of arrayProductos) {
    let contenedor = document.createElement('div');
    contenedor.classList.add('col', 'col-sm-12', 'col-md-6', 'col-lg-4', 'col-xl-3');
    contenedor.innerHTML = `
      <div class="card h-100">
        <img src="${producto.imagen}" class="card-img-top image-tienda" alt="${producto.alt}">
        <div class="card-body">
          <h3 class="card-title">${producto.marca}</h3>
          <p class="card-text">${producto.modelo}</p>
          <p class="card-text">${producto.tamanio}</p>
        </div>
        <div class="card-footer">
          <p class="pkg-price">$ ${producto.precioDeVenta()}</p>
          <a href="#"><button class="btn btn-danger boton btn-rental btn-add-cart" type="button">Agregar al carrito</button></a>
        </div>
      </div>`;
    fila.appendChild(contenedor);
  }
  contenedorDeProductos.appendChild(fila);
}

function mostrarTodo() {
  mostrarProductos(productos);
}

// ordenar por precio
let botonOrdenarPrecio = document.querySelector('.ordenar-precio');
botonOrdenarPrecio.addEventListener('click', ordenarPorPrecioClick);

function ordenarPorPrecioClick() {
  productos.sort((a, b) => a.precio - b.precio);
  mostrarProductos(productos);
}

// mostrar todo
let botonMostrarTodo= document.querySelector('.mostrar-todo');
botonMostrarTodo.addEventListener('click', mostrarTodo);

// funcion para mostrar las opciones de marcas en la barra lateral
let marcaSidebar = document.getElementById('marcaSidebar');

function mostrarOpcionesMarcas() {
  let marcasUnicas = [...new Set(productos.map(producto => producto.marca))];
  marcaSidebar.innerHTML = '';
  marcasUnicas.forEach(marca => {
    let li = document.createElement('li'); 
    li.innerText = marca; 
    li.classList.add('marca-option');
    marcaSidebar.appendChild(li);
  });
};

// funcion para mostrar las opciones de rango de edad en la barra lateral
let edadSidebar = document.getElementById('edadSidebar');

function mostrarOpcionesEdad() {
  let edadesUnicas = [...new Set(productos.map(producto => producto.rangoEdad))];
  edadSidebar.innerHTML = '';
  edadesUnicas.forEach(edad => {
    let li = document.createElement('li');
    li.innerText = edad;
    li.classList.add('edad-option');
    edadSidebar.appendChild(li);
  });
};

// funcion para manejar los clics en las opciones de filtrado
marcaSidebar.addEventListener('click', respuestaClick);
edadSidebar.addEventListener('click', respuestaClick);

function respuestaClick(event) {
  let opcion = event.target.textContent; //consigo el texto del elemento que clickeo
  let filtro = event.target.parentNode.id; //consigo el id del elemento padre (para saber si filtro x marca o edad)

  if (filtro === 'marcaSidebar') {
    let arrayFiltrado = productos.filter(producto => producto.marca.toLowerCase() === opcion.toLowerCase());
    mostrarProductos(arrayFiltrado);
  } else if (filtro === 'edadSidebar') {
    let arrayFiltrado = productos.filter(producto => producto.rangoEdad.toLowerCase() === opcion.toLowerCase());
    mostrarProductos(arrayFiltrado);
  }
};

// carrito
// funciones para obtener y guardar el carrito en el Local Storage.
let carrito = [];
function getCarritoFromLocalStorage() {
  const carritoString = localStorage.getItem('carrito');
  return carritoString ? JSON.parse(carritoString) : [];
};

function guardarCarritoEnLS() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

function buscarProductoEnCarrito(nombreProducto) {
  return carrito.find((producto) => producto.nombre === nombreProducto);
};

contenedorDeProductos.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-add-cart')) {
    const card = event.target.closest('.card');
    const nombre = card.querySelector('.card-title').textContent;
    const modelo = card.querySelector('.card-text:nth-child(2)').textContent;
    const precio = parseFloat(card.querySelector('.pkg-price').textContent.replace('$', ''));
    
    let productoEnCarrito = buscarProductoEnCarrito(nombre);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
    } else {
      productoEnCarrito = {
        nombre,
        modelo,
        precioVenta: precio,
        cantidad: 1,
      };
      carrito.push(productoEnCarrito);
    }
    guardarCarritoEnLS();
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado al carrito',
      })
    mostrarCarrito(carrito);
    mostrarCantidadCarrito();
  }
});

// funcion para eliminar un producto del carrito
function eliminarProductoDelCarrito(nombreProducto) {
  carrito = carrito.filter((producto) => producto.nombre !== nombreProducto);
  guardarCarritoEnLS();
  mostrarCarrito(carrito);
  mostrarCantidadCarrito();
};

// funcion para mostrar la cantidad de productos en el carrito
function mostrarCantidadCarrito() {
  const cantidadCarrito = document.getElementById('cantidadCarrito');
  cantidadCarrito.textContent = carrito.reduce((total, producto) => total + producto.cantidad, 0);
};

// funcion para mostrar el carrito en su dropdown
function mostrarCarrito(arrayCarrito) {
  const productosCarritoContainer = document.getElementById('productosCarrito');
  productosCarritoContainer.innerHTML = '';
  let totalCarrito = 0;

  for (let producto of arrayCarrito) {
    const productoElement = document.createElement('div');
    productoElement.classList.add('carrito-item');
    productoElement.innerHTML = `
      <span class="nombre">${producto.nombre}</span>
      <span class="modelo">${producto.modelo} </span>
      <span>|</span>
      <span class="cantidad"> x ${producto.cantidad} </span>
      <span>|</span>
      <span class="precio"> $${(producto.precioVenta * producto.cantidad).toFixed(2)}</span>
      <button class="btn btn-danger btn-eliminar" data-nombre="${producto.nombre}">Eliminar</button>
    `;

    //evento del boton eliminar 
    productoElement.querySelector('.btn-eliminar').addEventListener('click', (event) => {
      const nombreProducto = event.target.dataset.nombre;
      eliminarProductoDelCarrito(nombreProducto);
    });
    productosCarritoContainer.appendChild(productoElement);
    totalCarrito += producto.precioVenta * producto.cantidad;
  };

  //mostrar total del carrito
  document.querySelector('.total-precio').textContent = `$${totalCarrito.toFixed(2)}`;
};

//al cargar la pag obtengo el carrito que esta en LS y lo muestro en su dropdown
document.addEventListener('DOMContentLoaded', () => {
  carrito = getCarritoFromLocalStorage();
  mostrarCarrito(carrito);
  mostrarCantidadCarrito();
  
});

//fetch desde el JSON
const pedirProductosaBD = async () => {
  try {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Mostrar el loader antes de la carga de productos
    await new Promise(resolve => setTimeout(resolve, 1500)); //promesa para simular la carga de productos por 1.5 segs
    const response = await fetch('../data.json'); //pido la data a mi JSON
    const data = await response.json(); 
    productos.push(...data.map(item => new Producto(
      item.marca,
      item.modelo,
      item.rangoEdad,
      item.deporte,
      item.tamanio,
      item.precio,
      item.stock,
      item.imagen,
      item.alt
    )));

    mostrarProductos(productos);
    mostrarOpcionesMarcas();
    mostrarOpcionesEdad();
    marcaSidebar.addEventListener('click', respuestaClick);
    edadSidebar.addEventListener('click', respuestaClick);
  } catch (error) {
    console.log(error);
  } finally {
    const loader = document.getElementById('loader');
    loader.style.display = 'none'; 
  }
};

pedirProductosaBD();
