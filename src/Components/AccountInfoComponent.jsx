import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/Actions/authActions';
import {
  Card,
  Button,
  Row,
  Col,
  Spinner,
  ListGroup,
  Image,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchOrders } from '../Redux/Actions/OrderAction';

const AccountInfoComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { error, orders, loading } = useSelector((state) => state.orders);
  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders(user.email));
    }
  }, [user, dispatch]);
  useEffect(() => {
    if (error) console.error('Errore nel caricamento ordini:', error);
  }, [error]);

  if (!user) {
    return (
      <div className='container mt-5'>
        <h2>
          <Link to='/account'>Accedi</Link> per visualizzare il tuo profilo!
        </h2>
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <div className='d-flex justify-content-between'>
        <h2>Dettagli Profilo</h2>
        <h2>I miei ordini</h2>
      </div>
      <Row>
        <Col xs='12' lg='6'>
          <Card className='mb-4 h-100'>
            <Card.Body>
              <Card.Title>Username: {user.email}</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>
                User email: {user.email}
              </Card.Subtitle>
              <Card.Text>
                <strong>Ruolo:</strong> {user.role}
                <br />
                <strong>Data di nascita:</strong> {user.birthDate}
              </Card.Text>
              <Button variant='danger' onClick={handleLogout}>
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs='12' lg='6'>
          <Card className='mb-4 h-100'>
            <Card.Body>
              {loading ? (
                <div className='d-flex justify-content-center'>
                  <Spinner animation='border' variant='primary' />
                </div>
              ) : !orders || orders.length === 0 ? (
                <p>Non hai ancora effettuato ordini.</p>
              ) : (
                <div>
                  <p>Totale ordini: {orders.length}</p>
                  <Link to='/orders'>Visualizza tutti i tuoi ordini</Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountInfoComponent;
