import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-orange-100 text-gray-800 mt-5'>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='text-center'
      >
        <h1 className='text-6xl font-bold mb-4'>404</h1>
        <p className='text-xl mb-6'>
          Oh no! Questa pagina non è stata trovata.
        </p>
        <Link to='/'>
          <Button variant='warning' size='lg' className='shadow-lg'>
            Torna indietro
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
