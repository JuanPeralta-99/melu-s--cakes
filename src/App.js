import React, { useEffect, useState } from 'react';
import { database } from './firebase';
import './App.css';

const App = () => {
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [clientName, setClientName] = useState('');
  const [cakeType, setCakeType] = useState('');
  const [cakeCount, setCakeCount] = useState(1);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [showClients, setShowClients] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cakePrice, setCakePrice] = useState(65);
  const [cakeFlavors, setCakeFlavors] = useState(['Banano', 'Zanahoria']);

  useEffect(() => {
    const dbRef = database.ref('orders');
    dbRef.on('value', (snapshot) => {
      setData(snapshot.val());
    });

    // Limpia el listener cuando el componente se desmonta
    return () => {
      dbRef.off();
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    const dbRef = database.ref('orders');
    dbRef.set(inputValue);
  };

  const authenticateUser = () => {
    const inputPassword = prompt('Ingrese la contraseña para autenticarse:');
    if (inputPassword === 'Melu2024') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
  };

  const updateCakePrice = () => {
    const newPrice = prompt('Ingrese el nuevo precio del pastel:');
    if (!isNaN(newPrice) && newPrice > 0) {
      setCakePrice(Number(newPrice));
    } else {
      alert('Precio inválido');
    }
  };

  const addCakeFlavor = () => {
    const newFlavor = prompt('Ingrese el nuevo sabor del pastel:');
    if (newFlavor) {
      setCakeFlavors([...cakeFlavors, newFlavor]);
    }
  };

  const removeCakeFlavor = (flavor) => {
    setCakeFlavors(cakeFlavors.filter(f => f !== flavor));
  };

  const addOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now(),
      clientName,
      cakes: [{ type: cakeType, count: cakeCount }],
      total: cakeCount * cakePrice,
      confirmed: false,
    };
    setOrders([newOrder, ...orders]);

    if (!clients.find(client => client.name === clientName)) {
      setClients([...clients, { name: clientName }]);
    }

    const dbRef = database.ref('orders');
    dbRef.set([newOrder, ...orders]);

    resetOrderForm();
  };

  const addCakeToOrder = (e) => {
    e.preventDefault();
    setOrders(orders.map(order => {
      if (order.id === currentOrderId) {
        const newCakes = [...order.cakes, { type: cakeType, count: cakeCount }];
        const newTotal = newCakes.reduce((acc, cake) => acc + cake.count * cakePrice, 0);
        return {
          ...order,
          cakes: newCakes,
          total: newTotal
        };
      }
      return order;
    }));
    resetOrderForm();
  };

  const confirmOrder = (id) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, confirmed: true } : order
    ));
  };

  const deleteOrder = (id) => {
    const inputPassword = prompt('Ingrese la contraseña para eliminar el pedido:');
    if (inputPassword === 'Melu2024') {
      setOrders(orders.filter(order => order.id !== id));
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const deleteClient = (name) => {
    setClients(clients.filter(client => client.name !== name));
  };

  const resetOrderForm = () => {
    setClientName('');
    setCakeType('');
    setCakeCount(1);
    setCurrentOrderId(null);
  };

  const formatOrders = () => {
    const inputPassword = prompt('Ingrese la contraseña para formatear el listado de pedidos:');
    if (inputPassword === 'Melu2024') {
      setOrders([]);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleViewClients = () => {
    const inputPassword = prompt('Ingrese la contraseña para ver el listado de clientes:');
    if (inputPassword === 'Melu2024') {
      setShowClients(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleHideClients = () => {
    setShowClients(false);
  };

  return (
    <div className="App">
      <h1>•🍰 𝑀𝑒𝓁𝓊´𝓈 𝒞𝒶𝓀𝑒𝓈 🍰•</h1>
      <form onSubmit={currentOrderId ? addCakeToOrder : addOrder}>
        <div className="form-group">
          <label>Nombre y Apellido del Cliente:</label>
          <input 
            type="text" 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)} 
            required 
            disabled={currentOrderId !== null}
          />
        </div>
        <div className="form-group">
          <label>Tipo de Pastel:</label>
          <select 
            value={cakeType} 
            onChange={(e) => setCakeType(e.target.value)} 
            required
          >
            <option value="">Seleccione el sabor del pastel</option>
            {cakeFlavors.map((flavor, index) => (
              <option key={index} value={flavor}>{flavor}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Cantidad de Pasteles:</label>
          <input 
            type="number" 
            value={cakeCount} 
            onChange={(e) => setCakeCount(Number(e.target.value))} 
            min="1" 
            required 
          />
        </div>
        <button type="submit" className="add-order-btn">
          {currentOrderId ? 'Agregar Pastel al Pedido' : 'Agregar Pedido'}
        </button>
        {currentOrderId && (
          <button type="button" onClick={() => setCurrentOrderId(null)} className="cancel-btn">
            Cancelar
          </button>
        )}
      </form>

      <h2>Listado de Pedidos</h2>
      <button type="button" onClick={formatOrders} className="format-orders-btn">
        Formatear Listado de Pedidos
      </button>
      <button type="button" onClick={handleViewClients} className="view-clients-btn">
        Ver Listado de Clientes
      </button>
      <button type="button" onClick={authenticateUser} className="auth-btn">
        Administradora
      </button>
      <ul>
        {orders.map(order => (
          <li key={order.id} className={order.confirmed ? 'confirmed' : 'not-confirmed'}>
            <span>{order.clientName}</span>
            <ul>
              {order.cakes.map((cake, index) => (
                <li key={index}>
                  {cake.type} (x{cake.count})
                </li>
              ))}
            </ul>
            <div>
              <span>Total: Q{order.total}</span>
              <button 
                className="confirm-btn" 
                onClick={() => confirmOrder(order.id)}
                disabled={order.confirmed}
              >
                {order.confirmed ? 'Pedido Confirmado' : 'Confirmar Pedido'}
              </button>
              <button 
                className="delete-btn" 
                onClick={() => deleteOrder(order.id)}
              >
                Eliminar
              </button>
              <button 
                className="add-cake-to-order-btn"
                onClick={() => setCurrentOrderId(order.id)}
              >
                Agregar Pastel
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showClients && (
        <div className="clients-list">
          <h2>Base de datos clientes</h2>
          <button type="button" onClick={handleHideClients} className="hide-clients-btn">
            Ocultar Base de datos clientes
          </button>
          <ul>
            {clients.map((client, index) => (
              <li key={index}>
                <span>{client.name}</span>
                <button 
                  className="delete-client-btn" 
                  onClick={() => deleteClient(client.name)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isAuthenticated && (
        <div className="admin-controls">
          <h2>Controles de Administrador</h2>
          <button onClick={updateCakePrice} className="update-price-btn">
            Actualizar Precio de Pastel
          </button>
          <button onClick={addCakeFlavor} className="add-flavor-btn">
            Agregar Sabor de Pastel
          </button>
          <h3>Sabores de Pastel:</h3>
          <ul>
            {cakeFlavors.map((flavor, index) => (
              <li key={index} className="flavor-item">
                <span>{flavor}</span>
                <button onClick={() => removeCakeFlavor(flavor)} className="remove-flavor-btn">
                  Eliminar Sabor
                </button>
              </li>
            ))}
          </ul>
          <button onClick={logoutUser} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      )}

      <h1>Datos en Tiempo Real</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>
        <h1>Escribir en la Base de Datos en Tiempo Real</h1>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Enviar</button>
      </div>
    </div>
  );
};

export default App;

