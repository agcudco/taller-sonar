<?php
// Configurar encabezados para respuestas JSON y permitir CORS.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir el enrutador y los controladores.
require_once __DIR__ . '/../app/core/Router.php'; // Cambiar _DIR_ por __DIR__
require_once __DIR__ . '/../app/controllers/CategoriaController.php'; // Cambiar _DIR_ por __DIR__
require_once __DIR__ . '/../app/controllers/ProductoController.php'; // Cambiar _DIR_ por __DIR__

$router = new Router();

// Rutas para Categorías.
$categoriaController = new CategoriaController();
$router->add('GET', '/categorias', function () use ($categoriaController) {
    return $categoriaController->index();
});
$router->add('GET', '/categorias/:id', function ($id) use ($categoriaController) {
    return $categoriaController->show($id);
});
$router->add('POST', '/categorias', function () use ($categoriaController) {
    return $categoriaController->store();
});
$router->add('PUT', '/categorias', function () use ($categoriaController) {
    return $categoriaController->update();
});
$router->add('DELETE', '/categorias', function () use ($categoriaController) {
    return $categoriaController->destroy();
});

// Rutas para Productos.
$productoController = new ProductoController();
$router->add('GET', '/productos', function () use ($productoController) {
    return $productoController->index();
});
$router->add('GET', '/productos/:id', function ($id) use ($productoController) {
    return $productoController->show($id);
});
$router->add('POST', '/productos', function () use ($productoController) {
    return $productoController->store();
});
$router->add('PUT', '/productos', function () use ($productoController) {
    return $productoController->update();
});
$router->add('DELETE', '/productos', function () use ($productoController) {
    return $productoController->destroy();
});

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
