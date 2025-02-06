<?php
require_once __DIR__ . '/../repositories/ProductoRepository.php';
require_once __DIR__ . '/../models/Producto.php';

/**
 * Clase ProductoService: Gestiona la lógica de negocio para la entidad Producto.
 */
class ProductoService {
    private $productoRepository;

    public function __construct($db) {
        $this->productoRepository = new ProductoRepository($db);
    }

    public function getAll() {
        $stmt = $this->productoRepository->readAll();
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        return $result;
    }

    public function getById($id) {
        $data = $this->productoRepository->readOne($id);
        return $data ? $data : null;
    }

    public function create($data) {
        $producto = new Producto();
        $producto->setNombre($data->nombre);
        $producto->setDescripcion($data->descripcion);
        $producto->setPrecio($data->precio);
        $producto->setCategoriaId($data->categoria_id); // Asignar la categoría
        return $this->productoRepository->create($producto);
    }

    public function update($data) {
        $producto = new Producto();
        $producto->setId($data->id);
        $producto->setNombre($data->nombre);
        $producto->setDescripcion($data->descripcion);
        $producto->setPrecio($data->precio);
        $producto->setCategoriaId($data->categoria_id); // Asignar la categoría
        return $this->productoRepository->update($producto);
    }

    public function delete($id) {
        return $this->productoRepository->delete($id);
    }
}
?>
