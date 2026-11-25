import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchProducts } from '../Redux/Actions/ProductsAction';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { BsArrowDownShort, BsArrowUpShort, BsDiagram3, BsTag } from 'react-icons/bs';

const SearchResultComponent = () => {
  const { query } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await searchProducts(query);
        setProducts(data);
        setFilteredProducts(data);
        setCurrentPage(1); // Reset pagina alla nuova query
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  useEffect(() => {
    let temp = [...products];

    if (minPrice !== '')
      temp = temp.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice !== '')
      temp = temp.filter((p) => p.price <= parseFloat(maxPrice));

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
  }, [sortOption, minPrice, maxPrice, products]);

  // Calcolo dei prodotti correnti
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

  if (loading) return <div className='text-center mt-4'>Caricamento...</div>;
  if (error)
    return (
      <div className='mt-5'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='text-center'
        >
          <h1 className='text-6xl font-bold mb-4'>
            Nessun prodotto trovato...
          </h1>
          <Link to='/'>
            <Button variant='warning' size='lg' className='shadow-lg'>
              Torna indietro
            </Button>
          </Link>
        </motion.div>
      </div>
    );

  return (
    <div className='container my-4'>
      <h2 className='mb-4'>
        Risultati per: <span className='text-primary'>"{query}"</span>
      </h2>

      {/* Filtri */}
      <div className='mb-3 text-end'>
        <button className='btn' onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? (
            <BsArrowUpShort aria-hidden='true' />
          ) : (
            <BsArrowDownShort aria-hidden='true' />
          )}

          {showFilters ? 'Nascondi filtri' : 'Filtra per...'}
        </button>
      </div>

      {showFilters && (
        <div className='row mb-4'>
          <div className='col-md-3'>
            <label className='form-label'>Ordina per</label>
            <select
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
            <label className='form-label'>Prezzo minimo (€)</label>
            <input
              type='number'
              className='form-control'
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder='Es. 100'
            />
          </div>

          <div className='col-md-3'>
            <label className='form-label'>Prezzo massimo (€)</label>
            <input
              type='number'
              className='form-control'
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder='Es. 1000'
            />
          </div>
        </div>
      )}

      {/* Lista prodotti */}
      <div className='row row-cols-1 row-cols-md-3 g-4'>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className='col'>
              <Link
                to={`/product/${product.id}`}
                state={{ product }}
                className='text-decoration-none text-dark'
              >
                <div className='card h-100 shadow-sm'>
                  <img
                    src={product.productImages[0]?.imageUrl}
                    alt={product.name}
                    className='card-img-top img-fluid'
                    style={{
                      objectFit: 'contain',
                      height: '200px',
                      backgroundColor: '#f8f9fa',
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
                  <div className='card-footer d-flex justify-content-between align-items-center bg-white'>
                    <strong className='text-primary fs-5'>
                      {product.price.toFixed(2)} €
                    </strong>
                    <div className='text-end' style={{ fontSize: '0.8rem' }}>
                      <div>
                        <BsTag aria-hidden='true' /> {product.subCategory.name}
                      </div>
                      <div>
                        <BsDiagram3 aria-hidden='true' />{' '}
                        {product.category.name}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className='col'>
            <p>Nessun prodotto trovato con questi filtri.</p>
          </div>
        )}
      </div>

      {/* Paginazione */}
      {totalPages > 1 && (
        <nav className='mt-4 d-flex justify-content-center'>
          <ul className='pagination'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? 'active' : ''}`}
              >
                <button
                  onClick={() => setCurrentPage(page)}
                  className='page-link'
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SearchResultComponent;
