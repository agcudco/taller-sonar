import React, { useEffect, useState } from 'react';

interface InventoryItem {
  id: number;
  producto: string;
  cantidad: number;
  fecha_ingreso: string;
  fecha_descargo: string | null;
  usuario_responsable: string;
}

const PythonApiPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/inventory')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Python API - Inventory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Producto</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Cantidad</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>
              Fecha Ingreso
            </th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>
              Fecha Descargo
            </th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>
              Usuario Responsable
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item.id}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item.producto}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item.cantidad}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item.fecha_ingreso}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item.fecha_descargo || 'N/A'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item.usuario_responsable}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <em>Nota:</em> La API de Python para el inventario es vulnerable a la
        falta de validación y sanitización.
      </p>
    </div>
  );
};

export default PythonApiPage;
