import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiURL from '../../Utils/ApiURL';

const RegisterComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fiscalCode, setFiscalCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ApiURL.apiUrl}/Account/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          birthDate,
          fiscalCode,
        }),
      });

      if (!response.ok) {
        alert('Errore nella registrazione');
        throw new Error('Errore nella registrazione');
      }
      navigate('/');
    } catch (error) {
      console.error('Errore nella registrazione e login:', error.message);
    }
  };

  return (
    <Container
      fluid
      className='d-flex flex-column justify-content-start align-items-center pb-5'
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <h4 id='verde' className='mb-3 mt-5'>
        Registrati ora!
      </h4>
      <p className='text-muted'>Crea un account per acquistare!</p>

      <Form className='w-50 mt-4' onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formFirstName'>
          <Form.Label id='verde'>Nome</Form.Label>
          <Form.Control
            type='text'
            placeholder='Inserisci il nome'
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formLastName'>
          <Form.Label id='verde'>Cognome</Form.Label>
          <Form.Control
            type='text'
            placeholder='Inserisci il cognome'
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formEmail'>
          <Form.Label id='verde'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Inserisci la email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formPassword'>
          <Form.Label id='verde'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Inserisci la password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formConfirmPassword'>
          <Form.Label id='verde'>Conferma Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Conferma la password'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBirthDate'>
          <Form.Label id='verde'>Data di Nascita</Form.Label>
          <Form.Control
            type='date'
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formFiscalCode'>
          <Form.Label id='verde'>Codice Fiscale</Form.Label>
          <Form.Control
            type='text'
            placeholder='Inserisci il codice fiscale'
            required
            value={fiscalCode}
            onChange={(e) => setFiscalCode(e.target.value)}
          />
        </Form.Group>

        <Button
          id='addbtn'
          type='submit'
          className='bg-transparent btn-outline-success '
        >
          Registrati
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterComponent;
