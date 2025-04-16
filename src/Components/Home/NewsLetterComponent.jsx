import { Card, Col, Container, Form, Row, Button } from 'react-bootstrap';

const NewsletterComponent = () => {
  return (
    <Container className='mt-3'>
      <h2 className='fs-5'>ISCRIVITI ALLA NEWSLETTER</h2>
      <Container fluid className='p-0 overflow-hidden newsletter text-center'>
        <Card className='p-4 border-0 shadow-sm newsletter'>
          <Row className='align-items-center'>
            <h5 className='mb-2'>Resta aggiornato!</h5>
            <p className='text-muted mb-0'>
              Ricevi le ultime novità, offerte e aggiornamenti direttamente
              nella tua casella email.
            </p>
            <Form className='d-flex flex-column mt-5'>
              <Form.Control
                type='email'
                placeholder='Inserisci la tua email'
                className='newsletter-input'
              />
              <Button type='submit' className='mt-3 mainColor'>
                Iscriviti
              </Button>
            </Form>
          </Row>
        </Card>
      </Container>
    </Container>
  );
};

export default NewsletterComponent;
