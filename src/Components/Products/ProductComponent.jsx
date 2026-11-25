import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowDownShort, BsArrowUpShort, BsDiagram3, BsTag } from 'react-icons/bs';

const ProductGrid = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    if (!Array.isArray(products)) return;

    let temp = [...products];

    // Filtraggio
    if (minPrice !== '')
      temp = temp.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice !== '')
      temp = temp.filter((p) => p.price <= parseFloat(maxPrice));

    // Ordinamento
    switch (sortOption) {
      case 'nameAsc':
        temp.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        temp.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'priceAsc':
        temp.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        temp.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(temp);
    setCurrentPage(1);
  }, [products, sortOption, minPrice, maxPrice]);

  // Gestione paginazione
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (!Array.isArray(products) || products.length === 0) {
    return <p>Nessun prodotto disponibile.</p>;
  }

  return (
    <div className='container my-4'>
      {/* Filtri */}
      <div className='mb-3 text-end'>
        <button className='btn' onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? (
            <BsArrowUpShort aria-hidden='true' />
          ) : (
            <BsArrowDownShort aria-hidden='true' />
          )}
          {showFilters ? ' Nascondi filtri' : ' Filtra per...'}
        </button>
      </div>

      {showFilters && (
        <div className='row mb-4'>
          <div className='col-md-3'>
            <label className='form-label' htmlFor='filter-sort'>Ordina per</label>
            <select
              id='filter-sort'
              className='form-select'
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value=''>-- Seleziona --</option>
              <option value='nameAsc'>Nome (A-Z)</option>
              <option value='nameDesc'>Nome (Z-A)</option>
              <option value='priceAsc'>Prezzo crescente</option>
              <option value='priceDesc'>Prezzo decrescente</option>
            </select>
          </div>

          <div className='col-md-3'>
            <label className='form-label' htmlFor='filter-min'>Prezzo minimo (€)</label>
            <input
              id='filter-min'
              type='number'
              className='form-control'
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder='Es. 100'
            />
          </div>

          <div className='col-md-3'>
            <label className='form-label' htmlFor='filter-max'>Prezzo massimo (€)</label>
            <input
              id='filter-max'
              type='number'
              className='form-control'
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder='Es. 1000'
            />
          </div>
        </div>
      )}

      {/* Prodotti */}
      {filteredProducts.length === 0 ? (
        <p className='text-center mt-4'>
          Nessun prodotto trovato con questi filtri.
        </p>
      ) : (
        <>
          <div className='row row-cols-1 row-cols-md-3 g-4'>
            {currentProducts.map((product) => (
              <div key={product.id} className='col'>
                <div className='card h-100'>
                  <Link
                    to={`/product/${product.id}`}
                    state={{ product }}
                    className='text-decoration-none product-link'
                  >
                    <img
                      src={product.productImages[0]?.imageUrl}
                      alt={product.name}
                      className='card-img-top img-fluid product-thumb'
                      style={{
                        objectFit: 'contain',
                        height: '200px',
                      }}
                    />
                    <div className='card-body'>
                      <h5 className='card-title'>{product.name}</h5>
                      <p
                        className='card-text text-muted'
                        style={{ fontSize: '0.9rem' }}
                      >
                        {product.description.length > 100
                          ? `${product.description.slice(0, 100)}...`
                          : product.description}
                      </p>
                    </div>
                  </Link>
                  <div className='card-footer d-flex justify-content-between align-items-center'>
                    <strong className='text-primary fs-5'>
                      {product.price.toFixed(2)} €
                    </strong>
                    <div className='text-end' style={{ fontSize: '0.8rem' }}>
                      <div>
                        <Link
                          to={`/products/subcategory/${product.subCategory.id}`}
                          className='text-decoration-none product-link'
                        >
                          <BsTag aria-hidden='true' />{' '}
                          {product.subCategory.name}
                        </Link>
                      </div>
                      <div>
                        <Link
                          to={`/products/category/${product.category.id}`}
                          className='text-decoration-none product-link'
                        >
                          <BsDiagram3 aria-hidden='true' />{' '}
                          {product.category.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginazione */}
          {totalPages > 1 && (
            <nav className='mt-4 d-flex justify-content-center'>
              <ul className='pagination'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        page === currentPage ? 'active' : ''
                      }`}
                    >
                      <button
                        onClick={() => setCurrentPage(page)}
                        className='page-link'
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
