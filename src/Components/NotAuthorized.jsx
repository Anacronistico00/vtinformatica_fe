import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div>
      <h2>Accesso Negato</h2>
      <p>Non hai i permessi per accedere a questa pagina.</p>
      <Link to='/'>
        <Button variant='warning' size='lg' className='shadow-lg'>
          Torna alla home
        </Button>
      </Link>
    </div>
  );
};

export default NotAuthorized;
