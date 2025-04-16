import { useEffect } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManufacturers } from '../../Redux/Actions/ManufacturersActions';
import { Link } from 'react-router-dom';

const ManufacturersComponent = () => {
  const dispatch = useDispatch();
  const {
    manufacturers: manufacturers,
    loading,
    error,
  } = useSelector((state) => state.manufacturers);

  useEffect(() => {
    dispatch(fetchManufacturers());
  }, [dispatch]);

  if (loading) return <p>Caricamento categorie...</p>;
  if (error) return <p>Errore: {error}</p>;
  return (
    <Container className='mt-3'>
      <div className='d-flex justify-content-between'>
        <h2 className='fs-5'>I NOSTRI BRAND</h2>
        <Link to='/Manufacturers' className='link'>
          Visualizza tutti
        </Link>
      </div>
      <Container fluid className='categories py-3 overflow-hidden'>
        <Row>
          {manufacturers.manufacturers
            ?.slice(0, 6)
            .map((Manufacturer, index) => (
              <Col key={index} xs={6} md={4} className='categoryCard p-0'>
                <Link
                  to={`/products/manufacturer/${Manufacturer.manufacturerId}`}
                  className='text-decoration-none'
                >
                  <Card className='border-0 bg-transparent d-flex flex-column align-items-center justify-content-evenly mt-2'>
                    <Card.Img
                      variant='top'
                      style={{ height: '5em', width: '5em' }}
                      src={`${Manufacturer.manufacturerLogo}`}
                    />
                    <Card.Title>{Manufacturer.manufacturerName}</Card.Title>
                  </Card>
                </Link>
              </Col>
            ))}
        </Row>
      </Container>
    </Container>
  );
};

export default ManufacturersComponent;
