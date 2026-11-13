
import { useEffect, useState } from 'react';
import { helpFetch } from './helpers/helpFetch';

const api = '/api/productos';

const formularioVacio = {
  nombre: '',
  precio: '',
  stock: '',
  categoria: ''
};

function Negocio() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState(formularioVacio);

  // READ: Consultar productos desde la API
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const datos = await helpFetch().get(api);
        setProductos(datos);
        setError('');
      } catch (error) {
        setError('No se pudieron cargar los productos.');
        console.error(error);
      }
    };

    cargarProductos();
  }, []);

  // Abrir formulario para agregar productos
  const agregarProducto = () => {
    setProductoEditando(null);
    setNuevoProducto(formularioVacio);
    setMostrarFormulario(true);
    setError('');
  };

  // Abrir formulario para editar productos
  const editarProducto = (producto) => {
    setProductoEditando(producto.id);

    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria
    });

    setMostrarFormulario(true);
    setError('');
  };

  // CREATE y UPDATE: Guardar o actualizar productos
  const guardarProducto = async (e) => {
    e.preventDefault();

    try {
      const producto = {
        nombre: nuevoProducto.nombre.trim(),
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock),
        categoria: nuevoProducto.categoria
      };

      if (
        !producto.nombre ||
        !Number.isFinite(producto.precio) ||
        producto.precio < 0 ||
        !Number.isInteger(producto.stock) ||
        producto.stock < 0 ||
        !producto.categoria
      ) {
        setError('Verifica los datos del producto.');
        return;
      }

      if (productoEditando !== null) {
        // UPDATE: Actualizar producto existente
        const actualizado = await helpFetch().put(
          `${api}/${productoEditando}`,
          producto
        );

        setProductos((anteriores) =>
          anteriores.map((p) =>
            p.id === productoEditando ? actualizado : p
          )
        );

      } else {
        // CREATE: Agregar producto nuevo
        const guardado = await helpFetch().post(api, producto);

        setProductos((anteriores) => [
          ...anteriores,
          guardado
        ]);
      }

      setNuevoProducto(formularioVacio);
      setProductoEditando(null);
      setMostrarFormulario(false);
      setError('');

    } catch (error) {
      setError('No se pudo guardar el producto.');
      console.error(error);
    }
  };

  // DELETE: Eliminar productos
  const eliminarProducto = async (producto) => {
    const confirmar = window.confirm(
      `¿Estás segura de eliminar "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await helpFetch().del(`${api}/${producto.id}`);

      setProductos((anteriores) =>
        anteriores.filter((p) => p.id !== producto.id)
      );

      setError('');

    } catch (error) {
      setError('No se pudo eliminar el producto.');
      console.error(error);
    }
  };

  // Cancelar el formulario
  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
    setNuevoProducto(formularioVacio);
    setError('');
  };

  return (
    <div className="container mt-5 mb-5">

      <h1 className="text-center mb-3">
        Fortune Candles
      </h1>

      <p className="text-center text-muted">
        Laboratorio 4 - Programación Web
      </p>

      <div className="card shadow-sm">
        <div className="card-body">

          <h3>Administración de productos</h3>

          <p>
            Sistema de gestión de productos
            de Fortune Candles.
          </p>

          {/* Botón para agregar productos */}
          <button
            className="btn btn-primary mb-3"
            onClick={agregarProducto}
          >
            Agregar producto
          </button>

          {/* Formulario para agregar y editar */}
          {mostrarFormulario && (
            <form
              onSubmit={guardarProducto}
              className="mb-4 p-3 border rounded"
            >

              <h4 className="mb-3">
                {productoEditando !== null
                  ? 'Editar producto'
                  : 'Registrar nuevo producto'}
              </h4>

              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label">
                  Nombre
                </label>

                <input
                  type="text"
                  className="form-control"
                  required
                  value={nuevoProducto.nombre}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      nombre: e.target.value
                    })
                  }
                />
              </div>

              {/* Precio */}
              <div className="mb-3">
                <label className="form-label">
                  Precio
                </label>

                <input
                  type="number"
                  className="form-control"
                  min="0"
                  required
                  value={nuevoProducto.precio}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      precio: e.target.value
                    })
                  }
                />
              </div>

              {/* Stock */}
              <div className="mb-3">
                <label className="form-label">
                  Stock
                </label>

                <input
                  type="number"
                  className="form-control"
                  min="0"
                  step="1"
                  required
                  value={nuevoProducto.stock}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      stock: e.target.value
                    })
                  }
                />
              </div>

              {/* Categoría */}
              <div className="mb-3">
                <label className="form-label">
                  Categoría
                </label>

                <select
                  className="form-select"
                  required
                  value={nuevoProducto.categoria}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      categoria: e.target.value
                    })
                  }
                >
                  <option value="">
                    Selecciona una categoría
                  </option>

                  <option value="Decorativa">
                    Decorativa
                  </option>

                  <option value="Personalizada">
                    Personalizada
                  </option>

                  <option value="Aromática">
                    Aromática
                  </option>
                </select>
              </div>

              {/* Botones del formulario */}
              <button
                type="submit"
                className="btn btn-success me-2"
              >
                {productoEditando !== null
                  ? 'Actualizar producto'
                  : 'Guardar producto'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelarFormulario}
              >
                Cancelar
              </button>

            </form>
          )}

          {/* Mensajes de error */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* Tabla de productos */}
          <div className="table-responsive">

            <table className="table table-striped table-hover align-middle">

              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {productos.map((producto) => (
                  <tr key={producto.id}>

                    <td>{producto.id}</td>

                    <td>{producto.nombre}</td>

                    <td>
                      ${producto.precio.toLocaleString('es-CO')}
                    </td>

                    <td>{producto.stock}</td>

                    <td>{producto.categoria}</td>

                    <td>
                      <div className="d-flex gap-2">

                        {/* Botón editar */}
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => editarProducto(producto)}
                        >
                          Editar
                        </button>

                        {/* Botón eliminar */}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarProducto(producto)}
                        >
                          Eliminar
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

                {productos.length === 0 && !error && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-muted"
                    >
                      No hay productos registrados.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Negocio;
