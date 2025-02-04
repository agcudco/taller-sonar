<?php
// Incluir la definición de la entidad Producto.
require_once __DIR__ . '/../models/Producto.php';

/**
 * Clase ProductoRepository: Encapsula las operaciones CRUD para la entidad Producto.
 * Incluye la columna categoria_id para relacionar el producto con una categoría.
 */
class ProductoRepository {
    private $conn;
    private $table_name = "productos";

    // Constructor que recibe la conexión a la base de datos.
    public function __construct($db){
        $this->conn = $db;
    }

    /**
     * Obtiene todos los productos junto con el nombre de su categoría.
     *
     * @return PDOStatement Conjunto de resultados.
     */
    public function readAll(){
        // Realizamos un JOIN para obtener el nombre de la categoría.
        $query = "SELECT p.*, c.nombre as categoria_nombre 
                  FROM {$this->table_name} p 
                  INNER JOIN categorias c ON p.categoria_id = c.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Crea, actualiza, delete y readOne se mantienen igual (se pueden actualizar readOne también si se desea).
     */
    public function create(Producto $producto){
        $query = "INSERT INTO {$this->table_name} (nombre, descripcion, precio, categoria_id) 
                  VALUES (:nombre, :descripcion, :precio, :categoria_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre", $producto->getNombre());
        $stmt->bindParam(":descripcion", $producto->getDescripcion());
        $stmt->bindParam(":precio", $producto->getPrecio());
        $stmt->bindParam(":categoria_id", $producto->getCategoriaId());
        return $stmt->execute();
    }

    public function update(Producto $producto){
        $query = "UPDATE {$this->table_name} 
                  SET nombre = :nombre, descripcion = :descripcion, precio = :precio, categoria_id = :categoria_id
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre", $producto->getNombre());
        $stmt->bindParam(":descripcion", $producto->getDescripcion());
        $stmt->bindParam(":precio", $producto->getPrecio());
        $stmt->bindParam(":categoria_id", $producto->getCategoriaId());
        $stmt->bindParam(":id", $producto->getId());
        return $stmt->execute();
    }

    public function delete($id){
        $query = "DELETE FROM {$this->table_name} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    /**
     * (Opcional) Actualiza la consulta para leer un producto junto con el nombre de la categoría.
     */
    public function readOne($id){
        $query = "SELECT p.*, c.nombre as categoria_nombre 
                  FROM {$this->table_name} p 
                  INNER JOIN categorias c ON p.categoria_id = c.id
                  WHERE p.id = :id LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
