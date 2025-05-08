import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductsByManufacturer } from '../../Redux/Actions/ProductsAction';
import ProductComponent from './ProductComponent';
import { fetchManufacturerById } from '../../Redux/Actions/ManufacturersActions';
const ManufacturerComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.products || {}
  );

  const manufacturer = useSelector((state) => state.manufacturers.manufacturer);

  useEffect(() => {
    dispatch(fetchProductsByManufacturer(id));
    dispatch(fetchManufacturerById(id));
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className='container my-4'>
      <h2 className='mb-4'>
        Prodotti del produttore: {manufacturer?.manufacturerName}
      </h2>
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

export default ManufacturerComponent;
