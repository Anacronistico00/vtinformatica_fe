import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../Redux/Actions/CategoriesActions';

const ManageCategoriesComponent = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({ id: null, name: '' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (formData.id) {
      dispatch(
        updateCategory(formData.id, { id: formData.id, name: formData.name })
      );
    } else {
      dispatch(createCategory({ name: formData.name }));
    }

    setFormData({ id: null, name: '' });
  };

  const handleEdit = (category) => {
    setFormData({ id: category.id, name: category.name });
  };

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa categoria?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className='container mt-4'>
      <h2>Gestione Categorie</h2>

      <form onSubmit={handleSubmit} className='mb-4'>
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Nome categoria'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <button type='submit' className='btn btn-success'>
            {formData.id ? 'Aggiorna' : 'Aggiungi'}
          </button>
          {formData.id && (
            <button
              type='button'
              className='btn btn-secondary ms-2'
              onClick={() => setFormData({ id: null, name: '' })}
            >
              Annulla
            </button>
          )}
        </div>
      </form>

      {loading && <p>Caricamento...</p>}
      {error && <p className='text-danger'>{error}</p>}

      {categories.length === 0 ? (
        <p>Nessuna categoria trovata.</p>
      ) : (
        <ul className='list-group'>
          {categories.map((category) => (
            <li
              key={category.id}
              className='list-group-item d-flex justify-content-between align-items-center'
            >
              <div>
                <strong>{category.name}</strong>
                <br />
                <small>ID: {category.id}</small>
              </div>
              <div>
                <button
                  className='btn btn-outline-primary btn-sm me-2'
                  onClick={() => handleEdit(category)}
                >
                  Modifica
                </button>
                <button
                  className='btn btn-outline-danger btn-sm'
                  onClick={() => handleDelete(category.id)}
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

export default ManageCategoriesComponent;
