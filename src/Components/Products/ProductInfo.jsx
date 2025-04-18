import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ProductInfo = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [mainImage, setMainImage] = useState(
    product.productImages[0]?.imageUrl
  );
  const [modalImage, setModalImage] = useState(
    product.productImages[0]?.imageUrl
  );
  const [showModal, setShowModal] = useState(false);

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

          <p>
            <strong>Disponibilità:</strong>{' '}
            {product.quantity > 0 ? (
              <span className='text-success'>{product.quantity} pezzi</span>
            ) : (
              <span className='text-danger'>Non disponibile</span>
            )}
          </p>

          <p className='mt-4'>
            <i className='bi bi-diagram-3 me-2'></i>
            Categoria: <strong>{product.category.name}</strong>
          </p>
          <p>
            <i className='bi bi-tag me-2'></i>
            Sottocategoria: <strong>{product.subCategory.name}</strong>
          </p>
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

      {/* MODAL */}
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
            {/* Immagine principale */}
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

            {/* Miniature */}
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
