<?php
namespace App\Services;

use App\Repositories\CategoriaRepository;
use App\Models\Categoria;

/**
 * Clase CategoriaService: Contiene la lógica de negocio para la entidad Categoría.
 */
class CategoriaService {
    private $categoriaRepository;

    public function __construct($db) {
        $this->categoriaRepository = new CategoriaRepository($db);
    }

    public function getAll() {
        $stmt = $this->categoriaRepository->readAll();
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        return $result;
    }

    public function getById($id) {
        $data = $this->categoriaRepository->readOne($id);
        return $data ? $data : null;
    }

    public function create($data) {
        $categoria = new Categoria();
        $categoria->setNombre($data->nombre);
        $categoria->setDescripcion($data->descripcion);
        return $this->categoriaRepository->create($categoria);
    }

    public function update($data) {
        $categoria = new Categoria();
        $categoria->setId($data->id);
        $categoria->setNombre($data->nombre);
        $categoria->setDescripcion($data->descripcion);
        return $this->categoriaRepository->update($categoria);
    }

    public function delete($id) {
        return $this->categoriaRepository->delete($id);
    }
}
?>
