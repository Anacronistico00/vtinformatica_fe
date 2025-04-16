import { useEffect } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { fetchCategories } from '../../Redux/Actions/CategoriesActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CategoryComponent = () => {
  const dispatch = useDispatch();
  const {
    categories: categories,
    loading,
    error,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  if (loading) return <p>Caricamento categorie...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <Container className=' mt-5'>
      <h2 className='fs-5'>CATEGORIE</h2>
      <Container fluid className='categories py-5'>
        <Row>
          {categories.map((cat, index) => (
            <Col key={index} xs={6} md={4} className='categoryCard p-0'>
              <Link
                to={`/products/category/${cat.id}`}
                className='text-decoration-none'
              >
                <Card className='border-0 bg-transparent d-flex flex-column align-items-center justify-content-evenly mt-2'>
                  <Card.Img
                    variant='top'
                    className='p-4'
                    style={{ height: '8em', width: '10em' }}
                    src={`public/Images/categoria${index + 1}.jpg`}
                  />
                  <Card.Title>{cat.name}</Card.Title>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default CategoryComponent;
