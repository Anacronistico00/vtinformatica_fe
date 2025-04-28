import { Card, ListGroup, Image, Container, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const OrdersComponent = () => {
  const { error, orders, loading } = useSelector((state) => state.orders);

  return (
    <Container className='mt-5'>
      <Card className='h-100'>
        <Card.Body className='text-center'>
          <Card.Title>I MIEI ORDINI</Card.Title>

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
              {orders.map((order) => (
                <Link
                  to={`/orderInfo/${order.id}`}
                  className='text-decoration-none'
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
