import { Alert, Container, Form, Button } from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/Actions/authActions';
import { useSelector } from 'react-redux';
import { getCart } from '../../Redux/Actions/CartActions';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await dispatch(login(email, password));

    if (result.ok) {
      dispatch(getCart());
      navigate('/accountInfo');
    } else if (result.code === 'account_deactivated') {
      // Solo l'email passa alla pagina di riattivazione: la password viene richiesta di nuovo.
      navigate('/reactivate', { state: { email } });
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/accountInfo');
    }
  }, [token, navigate]);

  return (
    <Container
      fluid
      className='d-flex flex-column justify-content-start align-items-center pb-5 mt-5'
    >
      <h1 className='h4 mb-3'>Accedi al tuo account</h1>
      <p className='text-muted'>Inserisci email e password per acquistare.</p>

      {error && (
        <Alert variant='danger' className='auth-form'>
          {error}
        </Alert>
      )}

      <Form className='auth-form mt-4' onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Inserisci la tua email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Inserisci la tua password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <div className='d-flex justify-content-between align-items-end'>
          <Button type='submit' variant='primary'>
            Accedi
          </Button>

          <Link to={'/register'}>Non sei registrato?</Link>
        </div>
      </Form>
    </Container>
  );
};

export default LoginComponent;
