import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  fetchManufacturers,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
} from '../../Redux/Actions/ManufacturersActions';

const ManageManufacturersComponent = () => {
  const dispatch = useDispatch();
  const { manufacturers, loading, error } = useSelector(
    (state) => state.manufacturers
  );

  const [formData, setFormData] = useState({
    id: null,
    manufacturerName: '',
    manufacturerLogo: '',
  });

  useEffect(() => {
    dispatch(fetchManufacturers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.manufacturerName.trim() || !formData.manufacturerLogo.trim())
      return;

    if (formData.id) {
      dispatch(
        updateManufacturer(formData.id, {
          id: formData.id,
          manufacturerName: formData.manufacturerName,
          manufacturerLogo: formData.manufacturerLogo,
        })
      );
    } else {
      dispatch(
        createManufacturer({
          manufacturerName: formData.manufacturerName,
          manufacturerLogo: formData.manufacturerLogo,
        })
      );
    }

    setFormData({ id: null, manufacturerName: '', manufacturerLogo: '' });
  };

  const handleEdit = (manufacturer) => {
    setFormData({
      id: manufacturer.manufacturerId,
      manufacturerName: manufacturer.manufacturerName,
      manufacturerLogo: manufacturer.manufacturerLogo,
    });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo produttore?')) {
      dispatch(deleteManufacturer(id));
    }
  };

  return (
    <div className='container mt-4'>
      <h2>Gestione Produttori</h2>

      <form onSubmit={handleSubmit} className='mb-4'>
        <div className='mb-2'>
          <input
            type='text'
            className='form-control'
            placeholder='Nome produttore'
            value={formData.manufacturerName}
            onChange={(e) =>
              setFormData({ ...formData, manufacturerName: e.target.value })
            }
          />
        </div>
        <div className='mb-2'>
          <input
            type='text'
            className='form-control'
            placeholder='Logo produttore (URL)'
            value={formData.manufacturerLogo}
            onChange={(e) =>
              setFormData({ ...formData, manufacturerLogo: e.target.value })
            }
          />
        </div>
        <button type='submit' className='btn btn-success'>
          {formData.id ? 'Aggiorna' : 'Aggiungi'}
        </button>
        {formData.id && (
          <button
            type='button'
            className='btn btn-secondary ms-2'
            onClick={() =>
              setFormData({
                id: null,
                manufacturerName: '',
                manufacturerLogo: '',
              })
            }
          >
            Annulla
          </button>
        )}
      </form>

      {loading && <p>Caricamento...</p>}
      {error && <p className='text-danger'>{error}.</p>}
      {Array.isArray(manufacturers) && manufacturers.length === 0 ? (
        <p>Nessun produttore trovato.</p>
      ) : (
        <ul className='list-group'>
          {Array.isArray(manufacturers) &&
            manufacturers.map((man) => (
              <li
                key={man.manufacturerId}
                className='list-group-item d-flex justify-content-between align-items-center'
              >
                <div
                  style={{
                    width: '120px',
                  }}
                >
                  <h4>{man.manufacturerName}</h4>
                </div>
                <div className='manufacturerLogoAdmin'>
                  <img src={man.manufacturerLogo} alt={man.manufacturerName} />
                </div>
                <div>
                  <button
                    className='btn btn-outline-primary btn-sm me-2'
                    onClick={() => handleEdit(man)}
                  >
                    Modifica
                  </button>
                  <button
                    className='btn btn-outline-danger btn-sm'
                    onClick={() => handleDelete(man.manufacturerId)}
                  >
                    Elimina
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default ManageManufacturersComponent;
