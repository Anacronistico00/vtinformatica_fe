import { Container, Form, Button } from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/Actions/authActions';
import { useSelector } from 'react-redux';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isLoggedIn = await dispatch(login(email, password));

    if (isLoggedIn) {
      navigate('/');
    } else {
      alert('Login fallito');
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
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <h4 className='mb-3'>Accedi qui!</h4>
      <p id='verde'>Inserisci email e password per poter acquistare!</p>

      <Form className='w-50 mt-4' onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formEmail'>
          <Form.Label id='verde'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Inserisci la tua email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formPassword'>
          <Form.Label id='verde'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Inserisci la tua password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button
          id='addbtn'
          type='submit'
          className='bg-transparent btn-outline-success  '
        >
          Accedi
        </Button>
      </Form>
    </Container>
  );
};

export default LoginComponent;
