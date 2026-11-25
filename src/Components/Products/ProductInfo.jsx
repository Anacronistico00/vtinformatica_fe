import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { fetchProductById, fetchProductsBySubCategory } from '../../Redux/Actions/ProductsAction';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Redux/Actions/CartActions';
import { messageFor } from '../../Utils/errorMessages';
import ProductReviews from './ProductReviews';

// Il prodotto arriva dallo stato della navigazione (click da una lista) oppure, se la pagina
// è aperta direttamente o ricaricata, viene letto dall'API con l'id della route.
const ProductInfo = () => {
  const { id } = useParams();
  const location = useLocation();
  const fromNavigation = location.state?.product;
  const [product, setProduct] = useState(
    fromNavigation && String(fromNavigation.id) === id ? fromNavigation : null
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product && String(product.id) === id) return;
    fetchProductById(id)
      .then(setProduct)
      .catch((e) => setError(messageFor(e, 'Prodotto non disponibile.')));
  }, [id, product]);

  if (error) return <p className='container my-5'>{error}</p>;
  if (!product) return <p className='container my-5'>Caricamento...</p>;

  return <ProductDetail product={product} />;
};

const ProductDetail = ({ product }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);

  const [quantity, setQuantity] = useState(1);
  const handleIncrement = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Intero, almeno 1 e non oltre la scorta: con scorta zero nessuna quantità è valida.
  const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= product.quantity;

  const handleAddToCart = () => {
    if (!validQuantity) return;
    dispatch(addToCart(product.id, quantity));
  };

  const [mainImage, setMainImage] = useState(
    product.productImages[0]?.imageUrl
  );
  const [modalImage, setModalImage] = useState(
    product.productImages[0]?.imageUrl
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (product?.subCategory?.id) {
      dispatch(fetchProductsBySubCategory(product.subCategory.id));
    }
  }, [dispatch, product?.subCategory?.id]);

  useEffect(() => {
    setMainImage(product?.productImages[0]?.imageUrl);
    setModalImage(product?.productImages[0]?.imageUrl);
  }, [product]);

  const relatedProducts = products.filter((p) => p.id !== product.id);

  if (!product) return <p>Prodotto non disponibile.</p>;

  return (
    <div className='container my-5'>
      <div className='row'>
        {/* Immagine principale */}
        <div className='col-lg-5 mb-4'>
          <div className='media-well border rounded shadow-sm p-3 text-center'>
            <button
              type='button'
              className='image-button'
              aria-label='Ingrandisci immagine'
              onClick={() => setShowModal(true)}
            >
              <img
                src={mainImage}
                alt={product.name}
                className='img-fluid'
                style={{ maxHeight: '350px', objectFit: 'contain' }}
              />
            </button>
          </div>

          {/* Miniature sotto */}
          <div className='d-flex flex-wrap justify-content-center mt-3'>
            {product.productImages.map((img, index) => (
              <button
                key={index}
                type='button'
                className={`thumb-button m-1 ${mainImage === img.imageUrl ? 'is-selected' : ''}`}
                aria-label={`Immagine ${index + 1}`}
                aria-pressed={mainImage === img.imageUrl}
                onClick={() => setMainImage(img.imageUrl)}
              >
                <img src={img.imageUrl} alt='' width='60' height='60' />
              </button>
            ))}
          </div>
        </div>

        {/* Info prodotto */}
        <div className='col-lg-7'>
          <h2 className='product-title mb-3'>{product.name}</h2>
          <div className='brand-chip mb-3'>
            <img
              src={product.manufacturer.manufacturerLogo}
              alt={product.manufacturer.manufacturerName}
              style={{ height: '40px' }}
            />
          </div>

          <p className='text-muted mb-3'>{product.description}</p>

          {/* Box d'acquisto: prezzo, disponibilità, quantità e carrello restano insieme anche su mobile. */}
          <div className='buy-box'>
            <p className='price'>{product.price.toFixed(2)} €</p>
            <p className='mb-3'>
              <strong>Disponibilità:</strong>{' '}
              {product.quantity > 0 ? (
                <span className='text-success'>{product.quantity} pezzi</span>
              ) : (
                <span className='text-danger'>Non disponibile</span>
              )}
            </p>
            <div className='d-flex flex-wrap align-items-center gap-3'>
              <div className='d-flex align-items-center gap-2'>
                <button
                  className='btn btn-outline-primary'
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type='number'
                  aria-label='Quantità'
                  className='form-control quantity-field'
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min='1'
                  max={product.quantity}
                />
                <button
                  className='btn btn-outline-primary'
                  onClick={handleIncrement}
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>
              <button
                className='btn btn-primary flex-grow-1 flex-sm-grow-0'
                onClick={handleAddToCart}
                disabled={!validQuantity}
              >
                Aggiungi al carrello
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Descrizione estesa */}
      <div className='row mt-5'>
        <div className='col-12'>
          <div className='bg-body-tertiary p-4 rounded shadow-sm'>
            <h4 className='mb-3'>Descrizione dettagliata</h4>
            <p>{product.fullDescription}</p>
          </div>
        </div>
      </div>

      {/* Prodotti correlati */}
      <div className='row mt-5'>
        <div className='col-12'>
          <h4 className='mb-4'>Prodotti correlati</h4>

          {loading ? (
            <div
              className='d-flex justify-content-center align-items-center'
              style={{ height: '150px' }}
            >
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Caricamento...</span>
              </div>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div
              id='relatedProductsCarousel'
              className='carousel slide'
              data-bs-ride='carousel'
            >
              <div className='carousel-inner'>
                {relatedProducts.map((item, index) => (
                  <div
                    key={item.id}
                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                  >
                    <Link
                      to={`/product/${item.id}`}
                      state={{ product: item }}
                      className='text-decoration-none product-link'
                    >
                      <div className='card mx-auto' style={{ width: '18rem' }}>
                        <img
                          src={
                            item.productImages[0]?.imageUrl ||
                            '/images/placeholder.jpg'
                          }
                          className='card-img-top product-thumb'
                          alt={item.name}
                          style={{ height: '200px', objectFit: 'contain' }}
                        />
                        <div className='card-body'>
                          <h5 className='card-title'>{item.name}</h5>
                          <p className='card-text text-primary fw-bold'>
                            {item.price.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <button
                className='carousel-control-prev'
                type='button'
                data-bs-target='#relatedProductsCarousel'
                data-bs-slide='prev'
              >
                <span
                  className='carousel-control-prev-icon'
                  aria-hidden='true'
                ></span>
                <span className='visually-hidden'>Precedente</span>
              </button>
              <button
                className='carousel-control-next'
                type='button'
                data-bs-target='#relatedProductsCarousel'
                data-bs-slide='next'
              >
                <span
                  className='carousel-control-next-icon'
                  aria-hidden='true'
                ></span>
                <span className='visually-hidden'>Successivo</span>
              </button>
            </div>
          ) : (
            <p>Nessun prodotto correlato trovato.</p>
          )}
        </div>
      </div>

      {/* Immagini ingrandite: il Modal di React-Bootstrap gestisce focus, Esc e ruoli. */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title as='h2' className='fs-5'>
            {product.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='media-well rounded p-2 text-center mb-3'>
            <img
              src={modalImage}
              alt={product.name}
              className='img-fluid'
              style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }}
            />
          </div>
          <div className='d-flex flex-wrap justify-content-center'>
            {product.productImages.map((img, index) => (
              <button
                key={index}
                type='button'
                className={`thumb-button m-1 ${modalImage === img.imageUrl ? 'is-selected' : ''}`}
                aria-label={`Immagine ${index + 1} ingrandita`}
                aria-pressed={modalImage === img.imageUrl}
                onClick={() => setModalImage(img.imageUrl)}
              >
                <img src={img.imageUrl} alt='' width='90' height='90' />
              </button>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <ProductReviews productId={product.id} />
    </div>
  );
};

export default ProductInfo;
