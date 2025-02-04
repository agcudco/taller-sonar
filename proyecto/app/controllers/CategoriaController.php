<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../services/CategoriaService.php';

/**
 * Clase CategoriaController: Gestiona las peticiones HTTP relacionadas con las Categorías.
 */
class CategoriaController {
    private $categoriaService;

    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->categoriaService = new CategoriaService($db);
    }

    public function index() {
        $result = $this->categoriaService->getAll();
        echo json_encode($result);
    }

    public function show($id) {
        $result = $this->categoriaService->getById($id);
        if ($result) {
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Categoría no encontrada.']);
        }
    }

    public function store() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->nombre) && !empty($data->descripcion)) {
            if ($this->categoriaService->create($data)) {
                http_response_code(201);
                echo json_encode(['message' => 'Categoría creada exitosamente.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Error al crear la categoría.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos.']);
        }
    }

    public function update() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id) && !empty($data->nombre) && !empty($data->descripcion)) {
            if ($this->categoriaService->update($data)) {
                echo json_encode(['message' => 'Categoría actualizada.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'No se pudo actualizar la categoría.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos.']);
        }
    }

    public function destroy() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id)) {
            if ($this->categoriaService->delete($data->id)) {
                echo json_encode(['message' => 'Categoría eliminada.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'No se pudo eliminar la categoría.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'ID no proporcionado.']);
        }
    }
}
?>
