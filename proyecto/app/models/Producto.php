<?php
/**
 * Clase Producto: Representa la entidad "Producto".
 * Incluye una propiedad para la categoría a la que pertenece.
 */
class Producto {
    // Propiedades privadas
    private $id;
    private $nombre;
    private $descripcion;
    private $precio;  // Precio decimal
    private $categoriaId; // ID de la categoría a la que pertenece

    // Constructor opcional para inicializar propiedades
    public function __construct($nombre = null, $descripcion = null, $precio = null, $categoriaId = null) {
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->precio = $precio;
        $this->categoriaId = $categoriaId;
    }

    // Getters y Setters

    public function getId() {
        return $this->id;
    }
    public function setId($id) {
        $this->id = $id;
    }
    public function getNombre() {
        return $this->nombre;
    }
    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }
    public function getDescripcion() {
        return $this->descripcion;
    }
    public function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
    }
    public function getPrecio() {
        return $this->precio;
    }
    public function setPrecio($precio) {
        $this->precio = $precio;
    }
    public function getCategoriaId() {
        return $this->categoriaId;
    }
    public function setCategoriaId($categoriaId) {
        $this->categoriaId = $categoriaId;
    }
}
