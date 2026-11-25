import { Carousel } from 'react-bootstrap';
import { useReducedMotion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CpuArt, KeyboardArt, TowerArt } from './BannerArt';

// Il carosello presenta tre categorie del catalogo: nome e sottocategorie vengono dallo store (le carica il layout),
// l'illustrazione e il testo del pulsante sono propri. L'ordine è fisso, qualunque sia l'ordine del catalogo.
const SLIDES = [
  { match: /componenti/i, Art: CpuArt, cta: 'Vedi i componenti' },
  { match: /assembl/i, Art: TowerArt, cta: 'Vedi i PC' },
  { match: /perifer/i, Art: KeyboardArt, cta: 'Vedi le periferiche' },
];

const CarouselComponent = () => {
  const categories = useSelector((state) => state.categories.categories);
  const reducedMotion = useReducedMotion();

  const slides = SLIDES.map((slide) => ({ ...slide, category: categories?.find((c) => slide.match.test(c.name)) })).filter(
    (slide) => slide.category
  );
  if (slides.length === 0) return null;

  return (
    <section aria-label='In evidenza'>
      {/* Con prefers-reduced-motion il carosello non scorre da solo. */}
      <Carousel controls={false} interval={reducedMotion ? null : 7000}>
        {slides.map(({ category, Art, cta }) => (
          <Carousel.Item key={category.id}>
            <div className='banner'>
              <div className='banner-copy'>
                <h2 className='banner-title'>{category.name}</h2>
                {category.subCategories?.length > 0 && (
                  <ul className='banner-links'>
                    {category.subCategories.map((sub) => (
                      <li key={sub.id}>
                        <Link to={`/products/subcategory/${sub.id}`}>{sub.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
                <Link className='btn btn-primary' to={`/products/category/${category.id}`}>
                  {cta}
                </Link>
              </div>
              <Art className='banner-art' />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default CarouselComponent;
