import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductsBySubCategory } from '../../Redux/Actions/ProductsAction';
import ProductComponent from './ProductComponent';

const SubCategoryComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsBySubCategory(id));
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className='container my-4'>
      <h2 className='mb-4'>Prodotti della sottocategoria</h2>
      {loading ? (
        <p>Caricamento...</p>
      ) : error ? (
        <p>Errore: {error}</p>
      ) : (
        <ProductComponent products={products} />
      )}
    </div>
  );
};

export default SubCategoryComponent;
