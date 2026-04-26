const form = document.getElementById('inventory-form');
const tableBody = document.querySelector('#inventory-table tbody');
const submitBtn = form.querySelector('button[type="submit"]');

// Variable para saber si estamos editando y qué ID estamos editando
let editMode = false;
let editId = null;

document.addEventListener('DOMContentLoaded', mostrarInventario);

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('name').value;
    const cantidad = parseFloat(document.getElementById('quantity').value);
    const precio = parseFloat(document.getElementById('price').value);

    let inventario = JSON.parse(localStorage.getItem('datosInventario')) || [];

    if (editMode) {
        // MODO ACTUALIZAR: Buscamos el producto por ID y lo modificamos
        inventario = inventario.map(item => {
            if (item.id === editId) {
                return { ...item, nombre, cantidad, precio };
            }
            return item;
        });
        
        // Resetear el botón y el estado
        editMode = false;
        editId = null;
        submitBtn.innerText = "Agregar al Inventario";
        submitBtn.style.backgroundColor = "var(--purpura-aluli)";
    } else {
        // MODO AGREGAR: Creamos uno nuevo
        const nuevoProducto = {
            id: Date.now(),
            nombre,
            cantidad,
            precio
        };
        inventario.push(nuevoProducto);
    }

    localStorage.setItem('datosInventario', JSON.stringify(inventario));
    form.reset();
    mostrarInventario();
});

function mostrarInventario() {
    const inventario = JSON.parse(localStorage.getItem('datosInventario')) || [];
    tableBody.innerHTML = '';

    inventario.forEach((item) => {
        const total = (item.cantidad * item.precio).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio}</td>
            <td>$${total}</td>
            <td>
                <button class="edit-btn" onclick="prepararEdicion(${item.id})">Editar</button>
                <button class="delete-btn" onclick="eliminarProducto(${item.id})">Borrar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función que sube los datos al formulario
window.prepararEdicion = function(id) {
    const inventario = JSON.parse(localStorage.getItem('datosInventario')) || [];
    const producto = inventario.find(item => item.id === id);

    if (producto) {
        document.getElementById('name').value = producto.nombre;
        document.getElementById('quantity').value = producto.cantidad;
        document.getElementById('price').value = producto.precio;

        // Cambiar apariencia del botón para indicar edición
        editMode = true;
        editId = id;
        submitBtn.innerText = "Actualizar Producto";
        submitBtn.style.backgroundColor = "var(--cian-aluli)";
        document.getElementById('name').focus();
    }
};

window.eliminarProducto = function(id) {
    let inventario = JSON.parse(localStorage.getItem('datosInventario')) || [];
    inventario = inventario.filter(item => item.id !== id);
    localStorage.setItem('datosInventario', JSON.stringify(inventario));
    mostrarInventario();
    
    // Si borramos mientras editamos, reseteamos el formulario
    if(editMode && editId === id) {
        form.reset();
        editMode = false;
        submitBtn.innerText = "Agregar al Inventario";
    }
};

