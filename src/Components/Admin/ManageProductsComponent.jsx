import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import {
  addProduct,
  deleteProduct,
  fetchProductsPage,
  updateProduct,
} from '../../Redux/Actions/ProductsAction';
import { fetchCategories } from '../../Redux/Actions/CategoriesActions';
import { fetchManufacturers } from '../../Redux/Actions/ManufacturersActions';
import { fetchSubCategories } from '../../Redux/Actions/SubCategoriesActions';
import AdminPagination from './AdminPagination';
import ProductFormModal from './ProductFormModal';

const ManageProductsComponent = () => {
  const dispatch = useDispatch();
  const { adminPage, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const subcategories = useSelector((state) => state.subcategories.subcategories);
  const manufacturers = useSelector((state) => state.manufacturers.manufacturers);

  // null = modale chiuso; { product } = modifica, { product: null } = nuovo prodotto.
  const [editing, setEditing] = useState(null);
  const [formKey, setFormKey] = useState(0);
  // Categoria scelta nel filtro (null = tutte, paginate dal server).
  const [categoryId, setCategoryId] = useState(null);

  const loadPage = useCallback((page) => dispatch(fetchProductsPage(page, categoryId)), [dispatch, categoryId]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchManufacturers());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  // Cambiando filtro si riparte dalla prima pagina.
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const openModal = (product = null) => {
    setFormKey((key) => key + 1);
    setEditing({ product });
  };

  const closeModal = () => setEditing(null);

  const handleSubmit = async (body) => {
    const product = editing.product;
    // Lo stock visto all'apertura: se nel frattempo è cambiato, il BE risponde 409 stock_conflict.
    // Gli errori (es. stock_conflict) li mostra l'action; in ogni caso si ricarica la pagina.
    await dispatch(
      product ? updateProduct(product.id, { ...body, expectedQuantity: product.quantity }) : addProduct(body)
    );

    closeModal();
    loadPage(adminPage.page);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Sei sicuro di voler eliminare il prodotto "${product.name}"?`)) return;
    await dispatch(deleteProduct(product.id));
    const lastOnPage = adminPage.items.length === 1 && adminPage.page > 1;
    loadPage(lastOnPage ? adminPage.page - 1 : adminPage.page);
  };

  // I filtri vengono da GET /Category; le sezioni mostrano solo le categorie con prodotti nella lista caricata.
  const sections = categories
    .map((category) => ({
      category,
      products: adminPage.items.filter((product) => product.category?.id === category.id),
    }))
    .filter((section) => section.products.length > 0);

  return (
    <div className='container mt-4'>
      <h2 className='text-center mb-4'>Gestione Prodotti per Categoria</h2>

      <div className='d-flex justify-content-end mb-3'>
        <Button variant='primary' onClick={() => openModal()}>
          Aggiungi Nuovo Prodotto
        </Button>
      </div>

      <div className='d-flex flex-wrap gap-2 mb-4'>
        <Button variant={categoryId === null ? 'dark' : 'outline-dark'} size='sm' onClick={() => setCategoryId(null)}>
          Tutte
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={categoryId === category.id ? 'dark' : 'outline-dark'}
            size='sm'
            onClick={() => setCategoryId(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {loading && <Spinner animation='border' />}
      {error && <p className='text-danger'>{error}</p>}
      {!loading && sections.length === 0 && <p>Nessun prodotto.</p>}

      {sections.map(({ category, products }) => (
        <div key={category.id} className='mb-5'>
          <h3>{category.name}</h3>
          <Row>
            {products.map((product) => (
              <Col xs={12} sm={6} md={4} lg={3} className='mb-4' key={product.id}>
                <Card className='product-card h-100'>
                  <Card.Img variant='top' src={product.productImages[0]?.imageUrl} className='product-image' />
                  <Card.Body className='card-body-custom'>
                    <div>
                      <Card.Title className='fs-6'>{product.name}</Card.Title>
                      <Card.Text className='product-description'>{product.description}</Card.Text>
                      <p className='mb-1'>
                        <strong>Prezzo:</strong> €{product.price}
                      </p>
                    </div>
                    <div className='d-flex justify-content-between mt-3'>
                      <Button variant='outline-primary' size='sm' onClick={() => openModal(product)}>
                        Modifica
                      </Button>
                      <Button variant='outline-danger' size='sm' onClick={() => handleDelete(product)}>
                        Elimina
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <AdminPagination
        page={adminPage.page}
        pageSize={adminPage.pageSize}
        total={adminPage.total}
        onChange={loadPage}
      />

      {editing && (
        <ProductFormModal
          key={formKey}
          show
          product={editing.product}
          subcategories={subcategories}
          manufacturers={manufacturers}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ManageProductsComponent;
