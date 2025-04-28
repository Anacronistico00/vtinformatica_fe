import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProductsBySubCategory } from '../../Redux/Actions/ProductsAction';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Redux/Actions/CartActions';

const ProductInfo = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { product } = location.state || {};
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

  const handleAddToCart = () => {
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
          <div className='border rounded shadow-sm bg-white p-3 text-center'>
            <img
              src={mainImage}
              alt={product.name}
              className='img-fluid'
              style={{
                maxHeight: '350px',
                objectFit: 'contain',
                cursor: 'pointer',
              }}
              onClick={() => setShowModal(true)}
            />
          </div>

          {/* Miniature sotto */}
          <div className='d-flex flex-wrap justify-content-center mt-3'>
            {product.productImages.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl}
                alt={`Miniatura ${index + 1}`}
                className='img-thumbnail m-1'
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border:
                    mainImage === img.imageUrl ? '2px solid #0d6efd' : 'none',
                }}
                onClick={() => setMainImage(img.imageUrl)}
              />
            ))}
          </div>
        </div>

        {/* Info prodotto */}
        <div className='col-lg-7'>
          <h2 className='fw-bold mb-3'>{product.name}</h2>
          <div className='mb-3'>
            <img
              src={product.manufacturer.manufacturerLogo}
              alt={product.manufacturer.manufacturerName}
              style={{ height: '40px' }}
            />
          </div>

          <p className='text-muted mb-3'>{product.description}</p>

          <h4 className='text-primary fw-bold mb-3'>
            {product.price.toFixed(2)} €
          </h4>
          <div className='d-flex justify-content-between align-items-center'>
            <p>
              <strong>Disponibilità:</strong>{' '}
              {product.quantity > 0 ? (
                <span className='text-success'>{product.quantity} pezzi</span>
              ) : (
                <span className='text-danger'>Non disponibile</span>
              )}
            </p>
            <div>
              {/* Controllo della quantità */}
              <div className='d-flex align-items-center mt-3'>
                <button
                  className='btn btn-outline-primary'
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type='number'
                  className='form-control mx-2'
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min='1'
                  max={product.quantity}
                  style={{ width: '60px' }}
                />
                <button
                  className='btn btn-outline-primary'
                  onClick={handleIncrement}
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>

              {/* Bottone per aggiungere al carrello */}
              <div className='mt-4'>
                <button className='btn btn-primary' onClick={handleAddToCart}>
                  Aggiungi al carrello
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Descrizione estesa */}
      <div className='row mt-5'>
        <div className='col-12'>
          <div className='bg-light p-4 rounded shadow-sm'>
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
                    <Link to={`/product/${item.id}`} state={{ product: item }}>
                      <div className='card mx-auto' style={{ width: '18rem' }}>
                        <img
                          src={
                            item.productImages[0]?.imageUrl ||
                            '/images/placeholder.jpg'
                          }
                          className='card-img-top'
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

      {/* Modal */}
      {showModal && (
        <div
          className='modal d-flex justify-content-center align-items-center'
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1050,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className='bg-white p-3 rounded shadow-lg'
            style={{
              position: 'relative',
              maxWidth: '60vw',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage}
              alt='Modal'
              className='img-fluid mb-3'
              style={{
                width: '100%',
                maxHeight: '50vh',
                objectFit: 'contain',
              }}
            />
            <div className='d-flex flex-wrap justify-content-center'>
              {product.productImages.map((img, index) => (
                <img
                  key={index}
                  src={img.imageUrl}
                  alt={`Miniatura ${index + 1}`}
                  className='img-thumbnail m-1'
                  style={{
                    width: '90px',
                    height: '90px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border:
                      modalImage === img.imageUrl
                        ? '2px solid #0d6efd'
                        : 'none',
                  }}
                  onClick={() => setModalImage(img.imageUrl)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
