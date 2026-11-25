import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getCart,
  removeItemFromCart,
  updateItemQuantity,
} from '../Redux/Actions/CartActions';
import { CreateOrder } from '../Redux/Actions/OrderAction';
import { Link } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';

const CartComponent = () => {
  const dispatch = useDispatch();
  const { items, totalPrice, loading, error } = useSelector(
    (state) => state.cart
  );

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [quantityToRemove, setQuantityToRemove] = useState({});
  const [customerComment, setCustomerComment] = useState('');

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

  const handleCreateOrder = () => {
    const confirmOrder = window.confirm(
      "Sei sicuro di voler completare l'ordine?"
    );
    if (confirmOrder) {
      dispatch(CreateOrder({ customerComment }));
      setCustomerComment('');
    }
  };

  if (!isAuthenticated)
    return (
      <div className='text-center mt-5'>
        <h1 className='fs-3'>Per poter visualizzare il carrello</h1>
        <h4>
          <Link to='/account'>Accedi ora</Link>
        </h4>
      </div>
    );
  if (loading) return <div className='text-center mt-5'>Caricamento...</div>;
  if (error) return <div className='text-center mt-5'>{error}</div>;

  return (
    <div className='container my-4'>
      <h2 className='mb-4'>Il tuo carrello</h2>
      {items.length === 0 ? (
        <p className='text-center'>Il tuo carrello è vuoto.</p>
      ) : (
        <div>
          <ul className='list-group'>
            {items.map((item) => (
              <li
                key={item.id}
                className='list-group-item d-flex flex-wrap justify-content-between align-items-center gap-3'
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
                    className='img-fluid rounded-3 me-3 product-thumb'
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
                    aria-label='Quantità da rimuovere'
                    className='form-control form-control-sm'
                    style={{ width: '60px' }}
                  />
                  <button
                    className='btn btn-outline-primary btn-sm ms-2 me-1'
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
                  <button
                    className='btn btn-outline-danger btn-sm'
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <BsTrash aria-hidden='true' />
                    Rimuovi
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className='cart-total mt-3'>
            <strong>Totale: {totalPrice}€</strong>
          </p>
        </div>
      )}
      {items.length > 0 ? (
        <>
          <div className='mb-3'>
            <label htmlFor='customerComment' className='form-label'>
              Note per l&apos;ordine (facoltative)
            </label>
            <textarea
              id='customerComment'
              className='form-control'
              rows={2}
              maxLength={500}
              value={customerComment}
              onChange={(e) => setCustomerComment(e.target.value)}
            />
          </div>
          <button
            className='btn btn-primary'
            onClick={handleCreateOrder}
            disabled={items.length === 0}
          >
            Completa l&apos;ordine
          </button>
        </>
      ) : (
        ''
      )}
    </div>
  );
};
export default CartComponent;
