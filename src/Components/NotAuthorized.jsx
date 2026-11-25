import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div className='container text-center my-5'>
      <h1 className='h3'>Accesso negato</h1>
      <p>Non hai i permessi per accedere a questa pagina.</p>
      <Link to='/'>
        <Button variant='primary' size='lg'>
          Torna alla home
        </Button>
      </Link>
    </div>
  );
};

export default NotAuthorized;
