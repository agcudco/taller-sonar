#!/usr/bin/env python 
# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Importar Flask-CORS
from datetime import datetime

app = Flask(__name__)

# Habilitar CORS para toda la aplicación
CORS(app)

# Configuración de la base de datos MySQL.
# Ajusta los parámetros (host, usuario, contraseña, base de datos) según tu entorno.
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:12345678@localhost/bd-taller'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo para el Inventario
class Inventory(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    producto = db.Column(db.String(100), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    fecha_ingreso = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    fecha_descargo = db.Column(db.DateTime, nullable=True)
    usuario_responsable = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'producto': self.producto,
            'cantidad': self.cantidad,
            'fecha_ingreso': self.fecha_ingreso.strftime("%Y-%m-%d %H:%M:%S") if self.fecha_ingreso else None,
            'fecha_descargo': self.fecha_descargo.strftime("%Y-%m-%d %H:%M:%S") if self.fecha_descargo else None,
            'usuario_responsable': self.usuario_responsable
        }

# Crear las tablas (si no existen)
with app.app_context():
    db.create_all()

# -----------------------------------------------------------
# Endpoints para la gestión del inventario
# -----------------------------------------------------------

# Obtener todos los registros del inventario
@app.route('/inventory', methods=['GET'])
def get_inventory():
    items = Inventory.query.all()
    return jsonify([item.to_dict() for item in items])

# Obtener un registro del inventario por ID
@app.route('/inventory/<int:item_id>', methods=['GET'])
def get_inventory_item(item_id):
    item = Inventory.query.get(item_id)
    if item:
        return jsonify(item.to_dict())
    else:
        return jsonify({'message': 'Registro no encontrado'}), 404

# Crear un nuevo registro en el inventario
@app.route('/inventory', methods=['POST'])
def create_inventory_item():
    data = request.get_json()
    # Se espera que el JSON contenga: producto, cantidad, (opcional: fecha_descargo), usuario_responsable.
    try:
        nuevo_item = Inventory(
            producto=data['producto'],
            cantidad=data['cantidad'],
            fecha_ingreso=datetime.utcnow(),  # Se asigna la fecha de ingreso actual
            fecha_descargo=datetime.strptime(data['fecha_descargo'], "%Y-%m-%d %H:%M:%S") if 'fecha_descargo' in data and data['fecha_descargo'] else None,
            usuario_responsable=data['usuario_responsable']
        )
        db.session.add(nuevo_item)
        db.session.commit()
        return jsonify(nuevo_item.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Actualizar un registro del inventario
@app.route('/inventory/<int:item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    data = request.get_json()
    item = Inventory.query.get(item_id)
    if not item:
        return jsonify({'message': 'Registro no encontrado'}), 404
    try:
        if 'producto' in data:
            item.producto = data['producto']
        if 'cantidad' in data:
            item.cantidad = data['cantidad']
        if 'fecha_descargo' in data:
            # Si se envía la fecha de descargo, se intenta convertir a datetime; de lo contrario, se deja en None.
            item.fecha_descargo = datetime.strptime(data['fecha_descargo'], "%Y-%m-%d %H:%M:%S") if data['fecha_descargo'] else None
        if 'usuario_responsable' in data:
            item.usuario_responsable = data['usuario_responsable']
        db.session.commit()
        return jsonify(item.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Eliminar un registro del inventario
@app.route('/inventory/<int:item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):
    item = Inventory.query.get(item_id)
    if not item:
        return jsonify({'message': 'Registro no encontrado'}), 404
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Registro eliminado correctamente'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# -----------------------------------------------------------
# Iniciar la aplicación
# -----------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
