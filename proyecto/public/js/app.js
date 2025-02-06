// Ruta base de la API (ajústala según tu entorno).
const apiUrl = 'http://localhost/proyecto/public';

// Al cargar la página, se ejecuta la función para obtener todas las categorías.
document.addEventListener('DOMContentLoaded', () => getCategorias());

/**
 * Obtiene todas las categorías desde la API y actualiza la tabla.
 */
const getCategorias = () => {
  axios.get(`${apiUrl}/categorias`)
    .then(response => {
      const categorias = response.data;
      const tbody = document.querySelector('#categoriasTable tbody');
      tbody.innerHTML = '';
      categorias.forEach(categoria => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${categoria.id}</td>
          <td>${categoria.nombre}</td>
          <td>${categoria.descripcion}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="editCategoria(${categoria.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCategoria(${categoria.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(error => console.error(error));
};

/**
 * Abre el modal para agregar una nueva categoría.
 */
const openModal = () => {
  document.getElementById('categoriaForm').reset();
  document.getElementById('categoriaId').value = '';
  document.getElementById('categoriaModalLabel').innerText = 'Agregar Categoría';
};

/**
 * Envía el formulario para crear o actualizar una categoría.
 */
document.getElementById('categoriaForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('categoriaId').value;
  const nombre = document.getElementById('categoriaNombre').value;
  const descripcion = document.getElementById('categoriaDescripcion').value;

  if (id) {
    axios.put(`${apiUrl}/categorias`, { id, nombre, descripcion })
      .then(response => {
        $('#categoriaModal').modal('hide');
        getCategorias();
      })
      .catch(error => console.error(error));
  } else {
    axios.post(`${apiUrl}/categorias`, { nombre, descripcion })
      .then(response => {
        $('#categoriaModal').modal('hide');
        getCategorias();
      })
      .catch(error => console.error(error));
  }
});

/**
 * Carga los datos de una categoría en el formulario para editar.
 */
const editCategoria = id => {
  axios.get(`${apiUrl}/categorias/${id}`)
    .then(response => {
      const categoria = response.data;
      document.getElementById('categoriaId').value = categoria.id;
      document.getElementById('categoriaNombre').value = categoria.nombre;
      document.getElementById('categoriaDescripcion').value = categoria.descripcion;
      document.getElementById('categoriaModalLabel').innerText = 'Editar Categoría';
      $('#categoriaModal').modal('show');
    })
    .catch(error => console.error(error));
};

/**
 * Elimina una categoría.
 */
const deleteCategoria = id => {
  if (confirm('¿Estás seguro de eliminar esta categoría?')) {
    axios.delete(`${apiUrl}/categorias`, { data: { id } })
      .then(response => getCategorias())
      .catch(error => console.error(error));
  }
};
