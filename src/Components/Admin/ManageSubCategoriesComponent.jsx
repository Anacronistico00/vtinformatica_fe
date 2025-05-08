import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  createSubCategory,
  deleteSubCategory,
  fetchSubCategories,
  updateSubCategory,
} from '../../Redux/Actions/SubCategoriesActions';

const ManageSubCategoriesComponent = () => {
  const dispatch = useDispatch();
  const { subcategories, loading, error } = useSelector(
    (state) => state.subcategories
  );

  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    categoryId: 1,
  });

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (formData.id) {
      await dispatch(
        updateSubCategory(formData.id, {
          id: formData.id,
          name: formData.name,
          categoryId: formData.categoryId,
        })
      );
    } else {
      await dispatch(
        createSubCategory({
          name: formData.name,
          categoryId: formData.categoryId,
        })
      );
    }

    setFormData({ id: null, name: '', categoryId: 1 });
    await dispatch(fetchSubCategories());
  };

  const handleEdit = (subcategory) => {
    setFormData({
      id: subcategory.id,
      name: subcategory.name,
      categoryId: subcategory.categoryId,
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm('Sei sicuro di voler eliminare questa sottocategoria?')
    ) {
      await dispatch(deleteSubCategory(id));
      await dispatch(fetchSubCategories());
    }
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      categoryId: e.target.value,
    });
  };

  return (
    <div className='container mt-4'>
      <h2>Gestione sottocategorie</h2>

      <form onSubmit={handleSubmit} className='mb-4'>
        <div className='form-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Nome categoria'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label htmlFor='category'>Categoria</label>
          <select
            id='category'
            className='form-control'
            value={formData.categoryId}
            onChange={handleCategoryChange}
          >
            <option value='' disabled>
              Seleziona una categoria
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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

      {subcategories.length === 0 ? (
        <p>Nessuna sottocategoria trovata.</p>
      ) : (
        <ul className='list-group'>
          {subcategories.map((subCategory) => (
            <li
              key={subCategory.id}
              className='list-group-item d-flex justify-content-between align-items-center'
            >
              <div>
                <strong>{subCategory.name}</strong>
                <br />
                <small>ID: {subCategory.id}</small>
              </div>
              <div>
                <button
                  className='btn btn-outline-primary btn-sm me-2'
                  onClick={() => handleEdit(subCategory)}
                >
                  Modifica
                </button>
                <button
                  className='btn btn-outline-danger btn-sm'
                  onClick={() => handleDelete(subCategory.id)}
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

export default ManageSubCategoriesComponent;
