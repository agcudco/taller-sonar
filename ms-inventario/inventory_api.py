#!/usr/bin/env python 
# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
import re
import bleach
from marshmallow import Schema, fields, validate, ValidationError

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Constants
NOT_FOUND_MESSAGE = "Registro no encontrado"
INVALID_ID_MESSAGE = "ID de inventario inválido"  # Nueva constante
MAX_PRODUCT_LENGTH = 100
MIN_QUANTITY = 0
MAX_QUANTITY = 999999

# Database configuration
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'bd-taller')

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Validation schemas
class InventorySchema(Schema):
    producto = fields.Str(required=True, 
                         validate=[
                             validate.Length(min=1, max=MAX_PRODUCT_LENGTH),
                             validate.Regexp(r'^[a-zA-Z0-9\s\-_.,]+$')
                         ])
    cantidad = fields.Integer(required=True,
                            validate=validate.Range(min=MIN_QUANTITY, max=MAX_QUANTITY))
    fecha_descargo = fields.DateTime(format="%Y-%m-%d %H:%M:%S", allow_none=True)
    usuario_responsable = fields.Str(required=True,
                                   validate=[
                                       validate.Length(min=1, max=100),
                                       validate.Regexp(r'^[a-zA-Z0-9\s\-_@.]+$')
                                   ])

inventory_schema = InventorySchema()

class Inventory(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    producto = db.Column(db.String(100), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    fecha_ingreso = db.Column(db.DateTime, nullable=False)
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

def get_current_datetime():
    """Return current UTC datetime with timezone information"""
    return datetime.now(timezone.utc)

def sanitize_input(text):
    """Sanitize input text to prevent XSS"""
    if text is None:
        return None
    # Remove HTML tags and sanitize special characters
    cleaned_text = bleach.clean(str(text), tags=[], strip=True)
    # Additional sanitization for SQL injection prevention
    return re.sub(r'[\'";()]', '', cleaned_text)

def validate_date_format(date_str):
    """Validate date string format"""
    if not date_str:
        return True
    try:
        datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        return True
    except ValueError:
        return False

@app.route('/inventory', methods=['GET'])
def get_inventory():
    try:
        items = Inventory.query.all()
        return jsonify([item.to_dict() for item in items])
    except Exception as e:
        return jsonify({'error': 'Error al obtener el inventario'}), 500

@app.route('/inventory/<int:item_id>', methods=['GET'])
def get_inventory_item(item_id):
    try:
        if not isinstance(item_id, int) or item_id < 1:
            return jsonify({'error': INVALID_ID_MESSAGE}), 400  # Usando la constante aquí
        
        item = Inventory.query.get(item_id)
        if item:
            return jsonify(item.to_dict())
        return jsonify({'message': NOT_FOUND_MESSAGE}), 404
    except Exception as e:
        return jsonify({'error': 'Error al obtener el item'}), 500

@app.route('/inventory', methods=['POST'])
def create_inventory_item():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Datos no proporcionados'}), 400

        # Validate input data
        errors = inventory_schema.validate(data)
        if errors:
            return jsonify({'error': 'Datos inválidos', 'details': errors}), 400

        # Sanitize input
        sanitized_data = {
            'producto': sanitize_input(data['producto']),
            'cantidad': int(data['cantidad']),
            'usuario_responsable': sanitize_input(data['usuario_responsable']),
        }

        nuevo_item = Inventory(
            producto=sanitized_data['producto'],
            cantidad=sanitized_data['cantidad'],
            fecha_ingreso=get_current_datetime(),
            fecha_descargo=None,
            usuario_responsable=sanitized_data['usuario_responsable']
        )

        db.session.add(nuevo_item)
        db.session.commit()
        return jsonify(nuevo_item.to_dict()), 201

    except ValidationError as e:
        return jsonify({'error': 'Error de validación', 'details': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al crear el item'}), 500

@app.route('/inventory/<int:item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    try:
        if not isinstance(item_id, int) or item_id < 1:
            return jsonify({'error': INVALID_ID_MESSAGE}), 400  # Usando la constante aquí

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Datos no proporcionados'}), 400

        # Validate input data
        errors = inventory_schema.validate(data, partial=True)
        if errors:
            return jsonify({'error': 'Datos inválidos', 'details': errors}), 400

        item = Inventory.query.get(item_id)
        if not item:
            return jsonify({'message': NOT_FOUND_MESSAGE}), 404

        # Sanitize and update fields
        if 'producto' in data:
            item.producto = sanitize_input(data['producto'])
        if 'cantidad' in data:
            item.cantidad = int(data['cantidad'])
        if 'fecha_descargo' in data and validate_date_format(data['fecha_descargo']):
            item.fecha_descargo = datetime.strptime(data['fecha_descargo'], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc) if data['fecha_descargo'] else None
        if 'usuario_responsable' in data:
            item.usuario_responsable = sanitize_input(data['usuario_responsable'])

        db.session.commit()
        return jsonify(item.to_dict())

    except ValidationError as e:
        return jsonify({'error': 'Error de validación', 'details': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar el item'}), 500

@app.route('/inventory/<int:item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):
    try:
        if not isinstance(item_id, int) or item_id < 1:
            return jsonify({'error': INVALID_ID_MESSAGE}), 400  # Usando la constante aquí

        item = Inventory.query.get(item_id)
        if not item:
            return jsonify({'message': NOT_FOUND_MESSAGE}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Registro eliminado correctamente'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar el item'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
