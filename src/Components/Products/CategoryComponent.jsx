import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductsByCategory } from '../../Redux/Actions/ProductsAction';
import ProductComponent from './ProductComponent';
import { fetchCategoryById } from '../../Redux/Actions/CategoriesActions';

const CategoryComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const category = useSelector((state) => state.categories.category);

  useEffect(() => {
    dispatch(fetchProductsByCategory(id));
    dispatch(fetchCategoryById(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  return (
    <div className='container my-4'>
      {products && (
        <h2 className='mb-4'>Prodotti per la categoria: {category?.name}</h2>
      )}
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

export default CategoryComponent;
