import { Carousel } from 'react-bootstrap';

const CarouselComponent = () => {
  return (
    <Carousel data-bs-theme='dark' controls={false}>
      <Carousel.Item>
        <img
          className='d-block w-100'
          src='public\Images\Banner1.png'
          alt='First slide'
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className='d-block w-100'
          src='https://media.ldlc.com/encart/p/26682_b.jpg'
          alt='Second slide'
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className='d-block w-100'
          src='https://media.ldlc.com/encart/p/23008_b.jpg'
          alt='Third slide'
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default CarouselComponent;
