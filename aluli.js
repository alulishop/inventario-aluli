// Seleccionar elementos del DOM
const form = document.getElementById('inventory-form');
const tableBody = document.querySelector('#inventory-table tbody');

// --- 1. FUNCIÓN PARA MOSTRAR LOS DATOS ---
function mostrarInventario() {
    // Obtenemos lo que haya en LocalStorage. Si está vacío, creamos un array vacío []
    const inventario = JSON.parse(localStorage.getItem('datosInventario')) || [];
    
    // Limpiar la tabla antes de volver a llenarla
    tableBody.innerHTML = '';

    // Dibujar cada fila
    inventario.forEach((item, index) => {
        const total = (item.cantidad * item.precio).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio}</td>
            <td>$${total}</td>
            <td><button onclick="eliminarProducto(${index})" style="background:#e74c3c; color:white; border:none; padding:5px; cursor:pointer;">Borrar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// --- 2. EVENTO PARA GUARDAR ---
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Crear el objeto del nuevo producto
    const nuevoProducto = {
        nombre: document.getElementById('name').value,
        cantidad: parseFloat(document.getElementById('quantity').value),
        precio: parseFloat(document.getElementById('price').value)
    };

    // 1. Traer lo que ya existe
    const inventarioActual = JSON.parse(localStorage.getItem('datosInventario')) || [];
    
    // 2. Empujar el nuevo producto al array
    inventarioActual.push(nuevoProducto);
    
    // 3. Guardar de nuevo en LocalStorage (convertido a texto)
    localStorage.setItem('datosInventario', JSON.stringify(inventarioActual));

    // Limpiar formulario y refrescar tabla
    form.reset();
    mostrarInventario();
});

// --- 3. FUNCIÓN PARA ELIMINAR ---
window.eliminarProducto = function(index) {
    const inventario = JSON.parse(localStorage.getItem('datosInventario')) || [];
    
    // Quitar el elemento del array usando su posición (index)
    inventario.splice(index, 1);
    
    // Guardar la lista actualizada
    localStorage.setItem('datosInventario', JSON.stringify(inventario));
    
    // Refrescar tabla
    mostrarInventario();
};

// --- 4. EJECUTAR AL CARGAR LA PÁGINA ---
// Esto asegura que al abrir la web, los datos aparezcan
mostrarInventario();