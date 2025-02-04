<?php
/**
 * Clase Categoria: Representa la entidad "Categoría".
 * Contiene propiedades privadas y sus respectivos getters y setters.
 */
class Categoria {
    // Propiedades privadas
    private $id;
    private $nombre;
    private $descripcion;

    // Constructor opcional para inicializar propiedades
    public function __construct($nombre = null, $descripcion = null) {
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
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
}
?>
