import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, Image, Button, Modal } from 'react-bootstrap';
import { deleteOrder, restoreOrder } from '../Redux/Actions/OrderAction';
import React from 'react';

const OrderInfoComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);

  const order = orders.find((o) => o.id.toString() === id);

  // Stati per il modale
  const [showModal, setShowModal] = React.useState(false);
  const [actionType, setActionType] = React.useState(null);

  const handleShowModal = (action) => {
    setActionType(action);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);
  const email = useSelector((state) => state.auth.user.email);
  const handleConfirmAction = () => {
    if (actionType === 'delete') {
      dispatch(deleteOrder(order.id, email));
    } else if (actionType === 'restore') {
      dispatch(restoreOrder(order.id, email));
    }
    setShowModal(false);
    navigate('/orders');
  };

  if (!order) {
    return (
      <div className='container mt-5'>
        <h2>Ordine non trovato</h2>
        <Link to='/account'>
          <Button variant='primary' className='mt-3'>
            Torna al tuo profilo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <Card>
        <Card.Header>
          <h2>Dettaglio Ordine n° {order.orderNumber}</h2>
          <p>Data ordine: {new Date(order.createdAt).toLocaleDateString()}</p>
          {order.isDeleted ? (
            <p className='text-danger'>Ordine Annullato</p>
          ) : (
            <p className='text-success'>Ordine Confermato</p>
          )}
        </Card.Header>

        <ListGroup variant='flush'>
          {order.items.map((item, index) => (
            <ListGroup.Item key={index} className='d-flex align-items-center'>
              <Image
                src={item.product.productImages[0]?.imageUrl}
                alt={item.product.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  marginRight: '15px',
                }}
                rounded
              />
              <div>
                <h5>{item.product.name}</h5>
                <p>Prezzo: {item.product.price.toFixed(2)} €</p>
                <p>Quantità: {item.quantity}</p>
                <p>
                  Subtotale: {(item.product.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Card.Footer className='text-end'>
          <h4>
            Totale Ordine:{' '}
            {order.items
              .reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              )
              .toFixed(2)}
            €
          </h4>

          {order.isDeleted ? (
            <Button
              variant='success'
              onClick={() => handleShowModal('restore')}
              className='mt-3 me-2'
            >
              Ripristina Ordine
            </Button>
          ) : (
            <Button
              variant='danger'
              onClick={() => handleShowModal('delete')}
              className='mt-3 me-2'
            >
              Annulla Ordine
            </Button>
          )}

          <Link to='/account'>
            <Button variant='secondary' className='mt-3'>
              Torna al tuo profilo
            </Button>
          </Link>
        </Card.Footer>
      </Card>

      {/* Modale di conferma */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'delete' ? 'Annulla Ordine' : 'Ripristina Ordine'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {actionType === 'delete'
              ? 'Sei sicuro di voler annullare questo ordine?'
              : 'Sei sicuro di voler ripristinare questo ordine?'}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Annulla
          </Button>
          <Button variant='primary' onClick={handleConfirmAction}>
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderInfoComponent;
