<?php include 'templates/header.php'; ?>

<h1 class="mt-4">Gestión de Productos</h1>

<div class="mb-3">
  <button class="btn btn-primary" data-toggle="modal" data-target="#productoModal" onclick="openModalProducto();">Agregar Producto</button>
</div>

<table class="table table-bordered" id="productosTable">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Descripción</th>
      <th>Precio</th>
      <th>Categoría</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <!-- Las filas se generarán dinámicamente mediante JavaScript -->
  </tbody>
</table>

<!-- Modal para agregar/editar producto -->
<div class="modal fade" id="productoModal" tabindex="-1" role="dialog" aria-labelledby="productoModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="productoModalLabel" class="modal-title">Agregar Producto</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="productoForm">
          <input type="hidden" id="productoId">
          <div class="form-group">
            <label for="productoNombre">Nombre</label>
            <input type="text" class="form-control" id="productoNombre" required>
          </div>
          <div class="form-group">
            <label for="productoDescripcion">Descripción</label>
            <textarea class="form-control" id="productoDescripcion" required></textarea>
          </div>
          <div class="form-group">
            <label for="productoPrecio">Precio</label>
            <input type="number" step="0.01" class="form-control" id="productoPrecio" required>
          </div>
          <div class="form-group">
            <label for="productoCategoria">ID de Categoría</label>
            <input type="number" class="form-control" id="productoCategoria" required>
            <!-- Opcional: podrías reemplazar este input por un select que muestre el nombre de las categorías -->
          </div>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</div>

<?php include 'templates/footer.php'; ?>
