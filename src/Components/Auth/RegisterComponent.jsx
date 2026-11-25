import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../Redux/Actions/authActions';
import { messageFor } from '../../Utils/errorMessages';

const RegisterComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser({
        firstName,
        lastName,
        email,
        password,
        birthDate,
      });
      navigate('/');
    } catch (error) {
      alert(messageFor(error, 'Errore nella registrazione'));
    }
  };

  return (
    <Container
      fluid
      className='d-flex flex-column justify-content-start align-items-center pb-5'
    >
      <h1 className='h4 mb-3 mt-5'>Crea il tuo account</h1>
      <p className='text-muted'>Serve per acquistare e seguire i tuoi ordini.</p>

      <Form className='auth-form mt-4' onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formFirstName'>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type='text'
            placeholder='Inserisci il nome'
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formLastName'>
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type='text'
            placeholder='Inserisci il cognome'
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Inserisci la email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Inserisci la password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formConfirmPassword'>
          <Form.Label>Conferma password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Conferma la password'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBirthDate'>
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control
            type='date'
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary'>
          Registrati
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterComponent;
