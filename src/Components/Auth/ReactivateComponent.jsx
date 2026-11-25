import { useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { reactivate } from '../../Redux/Actions/authActions';

// Pagina raggiunta dal login quando il BE risponde account_deactivated: l'account è stato
// disattivato dal cliente stesso e si riattiva riconfermando la password.
const ReactivateComponent = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    const result = await dispatch(reactivate(email, password));
    setSending(false);

    if (result.ok) {
      navigate('/welcome', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <Container
      fluid
      className='d-flex flex-column justify-content-start align-items-center pb-5 mt-5'
    >
      <h1 className='h4 mb-3'>Riattiva il tuo account</h1>
      <p className='text-center text-muted'>
        Il tuo account è disattivato. Conferma la password per riattivarlo e ritrovare ordini e carrello.
      </p>

      {error && (
        <Alert variant='danger' className='auth-form'>
          {error}
        </Alert>
      )}

      <Form className='auth-form mt-4' onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='reactivateEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className='mb-3' controlId='reactivatePassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <div className='d-flex justify-content-between align-items-end'>
          <Button type='submit' variant='primary' disabled={sending}>
            Riattiva il mio account
          </Button>
          <Link to='/account'>Torna al login</Link>
        </div>
      </Form>
    </Container>
  );
};

export default ReactivateComponent;
