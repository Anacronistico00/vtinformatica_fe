import { useDispatch, useSelector } from 'react-redux';
import { deactivateSelf, logout } from '../Redux/Actions/authActions';
import {
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Modal,
  Form,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchOrders } from '../Redux/Actions/OrderAction';

const AccountInfoComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { error, orders, loading } = useSelector((state) => state.orders);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivationNote, setDeactivationNote] = useState('');

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleDeactivate = async () => {
    const result = await dispatch(deactivateSelf(deactivationNote));
    if (result.ok) {
      setShowDeactivate(false);
      toast.success('Account disattivato. Potrai riattivarlo accedendo di nuovo.');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders());
    }
  }, [user, dispatch]);
  useEffect(() => {
    if (error) console.error('Errore nel caricamento ordini:', error);
  }, [error]);

  if (!user) {
    return (
      <div className='container mt-5'>
        <h2 className='text-center'>
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
              {/* Il BE non consente a un Admin di disattivare se stesso. */}
              {user.role !== 'Admin' && (
                <Button variant='outline-danger' className='ms-2' onClick={() => setShowDeactivate(true)}>
                  Disattiva il mio account
                </Button>
              )}
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

      <Modal show={showDeactivate} onHide={() => setShowDeactivate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Disattiva il tuo account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Non potrai più accedere finché non lo riattivi: per farlo basterà accedere di nuovo con
            email e password.
          </p>
          <Form.Group controlId='deactivationNote'>
            <Form.Label>Motivo (facoltativo)</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              maxLength={500}
              value={deactivationNote}
              onChange={(e) => setDeactivationNote(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeactivate(false)}>
            Annulla
          </Button>
          <Button variant='danger' onClick={handleDeactivate}>
            Conferma disattivazione
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccountInfoComponent;
