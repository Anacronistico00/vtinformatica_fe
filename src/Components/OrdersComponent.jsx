import { Card, ListGroup, Image, Container, Spinner } from 'react-bootstrap';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../Redux/Actions/OrderAction';

const OrdersComponent = () => {
  const dispatch = useDispatch();
  const { error, orders, loading } = useSelector((state) => state.orders);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchOrders());
  }, [dispatch, isAuthenticated]);

  return (
    <Container className='mt-5'>
      <Card className='h-100'>
        <Card.Body className='text-center'>
          <Card.Title as='h2' className='fs-4'>I miei ordini</Card.Title>

          {loading ? (
            <div className='d-flex justify-content-center'>
              <Spinner animation='border' variant='primary' />
            </div>
          ) : error ? (
            <p className='text-danger'>{error}</p>
          ) : !orders || orders.length === 0 ? (
            <p>Non hai ancora effettuato ordini.</p>
          ) : (
            <ListGroup variant='flush'>
              {orders.map((order, index) => (
                <Link
                  key={index}
                  to={`/orderInfo/${order.id}`}
                  className='text-decoration-none product-link'
                >
                  <ListGroup.Item key={order.id} className='text-start'>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <strong>Ordine n°: </strong> {order.orderNumber} <br />
                        <strong>Data: </strong>
                        {new Date(order.createdAt).toLocaleDateString()} <br />
                        <strong>Totale: </strong>
                        {order.items
                          .reduce(
                            (acc, item) =>
                              acc + item.product.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                        €
                      </div>
                      <div>
                        {order.isDeleted ? (
                          <p className='text-danger'>Ordine annullato</p>
                        ) : (
                          <p>Ordine effettuato</p>
                        )}
                      </div>
                    </div>

                    <div className='d-flex align-items-center mb-2'>
                      {order.items.map((item, index) => (
                        <Image
                          key={index}
                          src={item.product.productImages[0]?.imageUrl}
                          alt={item.product.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            marginRight: '10px',
                          }}
                          rounded
                          className='product-thumb'
                        />
                      ))}
                    </div>
                  </ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrdersComponent;
