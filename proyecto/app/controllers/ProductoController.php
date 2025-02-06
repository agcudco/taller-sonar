<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../services/ProductoService.php';

/**
 * Clase ProductoController: Gestiona las peticiones HTTP relacionadas con los Productos.
 */
class ProductoController {
    private $productoService;

    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->productoService = new ProductoService($db);
    }

    public function index() {
        $result = $this->productoService->getAll();
        echo json_encode($result);
    }

    public function show($id) {
        $result = $this->productoService->getById($id);
        if ($result) {
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Producto no encontrado.']);
        }
    }

    public function store() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->nombre) && !empty($data->descripcion) && !empty($data->precio) && !empty($data->categoria_id)) {
            if ($this->productoService->create($data)) {
                http_response_code(201);
                echo json_encode(['message' => 'Producto creado exitosamente.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Error al crear el producto.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos.']);
        }
    }

    public function update() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id) && !empty($data->nombre) && !empty($data->descripcion) && !empty($data->precio) && !empty($data->categoria_id)) {
            if ($this->productoService->update($data)) {
                echo json_encode(['message' => 'Producto actualizado.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'No se pudo actualizar el producto.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos.']);
        }
    }

    public function destroy() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id)) {
            if ($this->productoService->delete($data->id)) {
                echo json_encode(['message' => 'Producto eliminado.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'No se pudo eliminar el producto.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'ID no proporcionado.']);
        }
    }
}
?>
