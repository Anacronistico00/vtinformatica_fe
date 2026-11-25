import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const WelcomeBackComponent = () => (
  <Container
    className='d-flex flex-column align-items-center mt-5 pb-5'
  >
    <h1 className='h3 mb-3'>Bentornato!</h1>
    <p className='text-center text-muted'>
      Il tuo account è di nuovo attivo: ordini e carrello sono dove li avevi lasciati.
    </p>
    <div className='d-flex gap-4 mt-3'>
      <Link to='/'>Vai al negozio</Link>
      <Link to='/accountInfo'>Il mio account</Link>
    </div>
  </Container>
);

export default WelcomeBackComponent;
