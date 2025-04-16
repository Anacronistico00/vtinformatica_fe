import { Carousel, Col, Container, Row } from 'react-bootstrap';
import CarouselComponent from './Home/CarouselComponent';
import CategoryComponent from './Home/CategoryComponent';
import ManufacturersComponent from './Home/ManufacturersComponent';
import NewsletterComponent from './Home/NewsLetterComponent';
const HomeComponent = () => {
  return (
    <Container className='mt-3'>
      <CarouselComponent />
      <CategoryComponent />
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <ManufacturersComponent />
          </Col>
          <Col xs={12} md={6}>
            <NewsletterComponent />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};
export default HomeComponent;
