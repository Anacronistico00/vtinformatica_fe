import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getCart,
  removeItemFromCart,
  updateItemQuantity,
} from '../Redux/Actions/CartActions';
import { getEmailFromToken } from '../Utils/jwtUtils';
import { CreateOrder } from '../Redux/Actions/OrderAction';
import { Link } from 'react-router-dom';

const CartComponent = () => {
  const dispatch = useDispatch();
  const { items, totalPrice, loading, error } = useSelector(
    (state) => state.cart
  );

  const [quantityToRemove, setQuantityToRemove] = useState({});

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      const defaultQuantities = {};
      items.forEach((item) => {
        defaultQuantities[item.id] = 1;
      });
      setQuantityToRemove(defaultQuantities);
    }
  }, [items]);

  const handleRemoveItem = (itemId) => {
    const confirmRemove = window.confirm(
      'Sei sicuro di voler rimuovere questo prodotto dal carrello?'
    );
    if (confirmRemove) {
      dispatch(removeItemFromCart(itemId));
    }
  };

  const handleQuantityChange = (itemId, quantityToRemove) => {
    if (quantityToRemove > 0) {
      dispatch(updateItemQuantity(itemId, quantityToRemove));
    }
  };

  const handleQuantityInputChange = (itemId, value) => {
    setQuantityToRemove({
      ...quantityToRemove,
      [itemId]: value,
    });
  };

  const token = localStorage.getItem('token');
  const userEmail = token ? getEmailFromToken(token) : null;

  const handleCreateOrder = () => {
    const confirmOrder = window.confirm(
      "Sei sicuro di voler completare l'ordine?"
    );
    if (confirmOrder) {
      if (userEmail) {
        dispatch(CreateOrder(userEmail));
      } else {
        alert("Devi essere autenticato per completare l'ordine");
      }
    }
  };

  if (loading) return <div className='text-center mt-5'>Caricamento...</div>;
  if (error)
    return (
      <div className='text-center mt-5'>
        <h1 className='fs-3'>Per poter visualizzare il carrello</h1>
        <h4>
          <Link to='/account'>Accedi ora</Link>
        </h4>
      </div>
    );

  return (
    <div>
      <h2 className='text-center mt-5'>Il tuo carrello</h2>
      {items.length === 0 ? (
        <p className='text-center'>Il tuo carrello è vuoto.</p>
      ) : (
        <div>
          <ul className='list-group'>
            {items.map((item) => (
              <li
                key={item.id}
                className='list-group-item d-flex justify-content-between align-items-center'
              >
                <div className='d-flex align-items-center'>
                  <img
                    src={
                      item.product &&
                      item.product.productImages &&
                      item.product.productImages[0]
                        ? item.product.productImages[0].imageUrl
                        : 'default-image.jpg'
                    }
                    alt={item.product ? item.product.name : 'Prodotto'}
                    className='img-fluid rounded-3'
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }}
                  />
                  <div className='ml-2'>
                    <p className='mb-0'>
                      {item.product
                        ? item.product.name
                        : 'Prodotto non disponibile'}
                    </p>
                    <small>
                      {item.product ? `${item.product.price}€` : 'N/A'}
                      <br />
                      quantità: {item.quantity} pz
                    </small>
                  </div>
                </div>

                <div className='d-flex align-items-center'>
                  <input
                    type='number'
                    value={quantityToRemove[item.id] || 1}
                    min='1'
                    max={item.quantity}
                    onChange={(e) =>
                      handleQuantityInputChange(item.id, e.target.value)
                    }
                    className='form-control form-control-sm'
                    style={{ width: '60px' }}
                  />
                  <button
                    className='btn btn-outline-warning btn-sm ml-2'
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        parseInt(quantityToRemove[item.id])
                      )
                    }
                    disabled={quantityToRemove[item.id] <= 0}
                  >
                    Rimuovi quantità
                  </button>
                </div>

                <button
                  className='btn btn-outline-danger btn-sm'
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <i className='bi bi-trash'></i>
                  Rimuovi
                </button>
              </li>
            ))}
          </ul>
          <p className='mt-3'>
            <strong>Totale: {totalPrice}€</strong>
          </p>
        </div>
      )}
      {items.length > 0 ? (
        <button
          className='btn btn-success'
          onClick={handleCreateOrder}
          disabled={items.length === 0}
        >
          Completa l'ordine
        </button>
      ) : (
        ''
      )}
    </div>
  );
};
export default CartComponent;
