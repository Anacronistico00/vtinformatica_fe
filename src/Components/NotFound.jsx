import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <div className='container my-5'>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='text-center'
      >
        <h1 className='display-1 fw-semibold mb-3'>404</h1>
        <p className='fs-5 mb-4'>Pagina non trovata.</p>
        <Link to='/'>
          <Button variant='primary' size='lg'>
            Torna alla home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
