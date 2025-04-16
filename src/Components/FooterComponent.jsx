import { Container, Row, Col } from 'react-bootstrap';

const FooterComponent = () => {
  return (
    <footer className='footer mt-5 pt-5'>
      <Container>
        <Row className='text-white text-start'>
          <Col md={3} sm={6} className='mb-4'>
            <h5>Informazioni</h5>
            <ul className='list-unstyled'>
              <li>
                <a href='#'>Chi siamo</a>
              </li>
              <li>
                <a href='#'>Contattaci</a>
              </li>
              <li>
                <a href='#'>Lavora con noi</a>
              </li>
              <li>
                <a href='#'>Mappa del sito</a>
              </li>
            </ul>
          </Col>
          <Col md={3} sm={6} className='mb-4'>
            <h5>Assistenza</h5>
            <ul className='list-unstyled'>
              <li>
                <a href='#'>Servizio Clienti</a>
              </li>
              <li>
                <a href='#'>Resi e Rimborsi</a>
              </li>
              <li>
                <a href='#'>Garanzia</a>
              </li>
              <li>
                <a href='#'>Supporto tecnico</a>
              </li>
            </ul>
          </Col>
          <Col md={3} sm={6} className='mb-4'>
            <h5>Servizi</h5>
            <ul className='list-unstyled'>
              <li>
                <a href='#'>Finanziamenti</a>
              </li>
              <li>
                <a href='#'>Ritiro Usato</a>
              </li>
              <li>
                <a href='#'>Configuratore PC</a>
              </li>
              <li>
                <a href='#'>VTInformatica Pro</a>
              </li>
            </ul>
          </Col>
          <Col md={3} sm={6} className='mb-4'>
            <h5>Seguici</h5>
            <div className='d-flex gap-3'>
              <a href='#'>
                <i className='bi bi-facebook text-white fs-4'></i>
              </a>
              <a href='#'>
                <i className='bi bi-instagram text-white fs-4'></i>
              </a>
              <a href='#'>
                <i className='bi bi-twitter-x text-white fs-4'></i>
              </a>
              <a href='#'>
                <i className='bi bi-youtube text-white fs-4'></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
      <div className='footer-bottom text-center py-3 text-white mt-4'>
        <Container>
          <small>
            © {new Date().getFullYear()} VTInformatica - Tutti i diritti
            riservati.
          </small>
        </Container>
      </div>
    </footer>
  );
};

export default FooterComponent;
