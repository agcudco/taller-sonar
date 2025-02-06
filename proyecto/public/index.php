<?php
// Configurar encabezados para respuestas JSON y permitir CORS.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir el enrutador y los controladores.
require_once __DIR__ . '/../vendor/autoload.php';

$router = new Router();

// Ruta predeterminada para la raíz.
$router->add('GET', '/', function () {
    echo json_encode([
        "message" => "Bienvenido a la API del proyecto",
        "endpoints" => [
            "categorias" => "/categorias",
            "productos" => "/productos"
        ]
    ], JSON_UNESCAPED_UNICODE);
});

// Rutas para Categorías.
$categoriaController = new CategoriaController();
$router->add('GET', '/categorias', fn() => $categoriaController->index());
$router->add('GET', '/categorias/:id', fn($id) => $categoriaController->show($id));
$router->add('POST', '/categorias', fn() => $categoriaController->store());
$router->add('PUT', '/categorias', fn() => $categoriaController->update());
$router->add('DELETE', '/categorias', fn() => $categoriaController->destroy());

// Rutas para Productos.
$productoController = new ProductoController();
$router->add('GET', '/productos', fn() => $productoController->index());
$router->add('GET', '/productos/:id', fn($id) => $productoController->show($id));
$router->add('POST', '/productos', fn() => $productoController->store());
$router->add('PUT', '/productos', fn() => $productoController->update());
$router->add('DELETE', '/productos', fn() => $productoController->destroy());

// Obtener la URI solicitada.
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = '/proyecto/public'; // Ajusta si está en un subdirectorio.
if (strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}
if ($uri == '') {
    $uri = '/';
}

// Despachar la petición.
$router->dispatch($_SERVER['REQUEST_METHOD'], $uri);
?>
