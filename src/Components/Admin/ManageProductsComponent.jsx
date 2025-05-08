import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../../Redux/Actions/ProductsAction';
import { Modal, Button, Form, Row, Col, Card, Spinner } from 'react-bootstrap';

const ManageProductsComponent = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    manufacturerId: 0,
    description: '',
    price: 0,
    quantity: 0,
    fullDescription: '',
    subCategoryId: 0,
    productImages: [
      {
        imageUrl: '',
      },
    ],
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const groupedProducts = categories.reduce((acc, category) => {
    acc[category.id] = products.filter((product) => {
      return product.category.id === category.id;
    });
    return acc;
  }, {});

  const openModal = (product = null) => {
    setEditingProduct(product);
    setFormData(
      product
        ? {
            name: product.name,
            manufacturerId: product.manufacturerId,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            fullDescription: product.fullDescription,
            subCategoryId: product.subCategory.id,
            productImages: product.productImages || [{ imageUrl: '' }],
          }
        : {
            name: '',
            manufacturerId: 0,
            description: '',
            price: 0,
            quantity: 0,
            fullDescription: '',
            subCategoryId: 0,
            productImages: [{ imageUrl: '' }],
          }
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      manufacturerId: 0,
      description: '',
      price: 0,
      quantity: 0,
      fullDescription: '',
      subCategoryId: 0,
      productImages: [{ imageUrl: '' }],
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      productImages: formData.productImages.filter((img) => img.imageUrl),
    };
    console.log('Dati inviati alla PUT:', productData);
    if (editingProduct) {
      dispatch(updateProduct(editingProduct.id, productData));
    } else {
      dispatch(addProduct(productData));
    }
    closeModal();
    dispatch(fetchProducts());
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.productImages];

    updatedImages[index] = { imageUrl: value };

    setFormData({ ...formData, productImages: updatedImages });
  };

  const handleAddImageField = () => {
    setFormData({
      ...formData,
      productImages: [...formData.productImages, { imageUrl: '' }],
    });
  };

  const handleRemoveImageField = (indexToRemove) => {
    const updatedImages = formData.productImages.filter(
      (_, i) => i !== indexToRemove
    );
    setFormData({
      ...formData,
      productImages: updatedImages,
    });
  };

  return (
    <div className='container mt-4'>
      <h2 className='text-center mb-4'>Gestione Prodotti per Categoria</h2>

      {categories.map((category) => (
        <div key={category.id} className='mb-5'>
          <h3>{category.name}</h3>

          {loading && <Spinner animation='border' />}
          {error && <p className='text-danger'>{error}</p>}

          <Row>
            {groupedProducts[category.id] &&
            groupedProducts[category.id].length === 0 ? (
              <p>Non ci sono prodotti in questa categoria.</p>
            ) : (
              groupedProducts[category.id]?.map((product) => (
                <Col
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className='mb-4'
                  key={product.id}
                >
                  <Card className='product-card h-100'>
                    <Card.Img
                      variant='top'
                      src={product.productImages[0]?.imageUrl}
                      className='product-image'
                    />
                    <Card.Body className='card-body-custom'>
                      <div>
                        <Card.Title className='fs-6'>{product.name}</Card.Title>
                        <Card.Text className='product-description'>
                          {product.description}
                        </Card.Text>
                        <p className='mb-1'>
                          <strong>Prezzo:</strong> €{product.price}
                        </p>
                      </div>
                      <div className='d-flex justify-content-between mt-3'>
                        <Button
                          variant='outline-primary'
                          size='sm'
                          onClick={() => openModal(product)}
                        >
                          Modifica
                        </Button>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => dispatch(deleteProduct(product.id))}
                        >
                          Elimina
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      ))}

      {/* Modal Bootstrap */}
      <Modal show={modalVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className='mb-2'>
              <Form.Control
                type='text'
                placeholder='Nome'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className='mb-2'>
              <Form.Control
                as='textarea'
                placeholder='Descrizione'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className='mb-2'>
              <Form.Control
                type='number'
                placeholder='Prezzo'
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className='mb-2'>
              <Form.Control
                type='number'
                placeholder='Quantità'
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className='mb-2'>
              <Form.Control
                as='textarea'
                placeholder='Descrizione Completa'
                value={formData.fullDescription}
                onChange={(e) =>
                  setFormData({ ...formData, fullDescription: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className='mb-2'>
              <Form.Control
                as='select'
                value={formData.subCategoryId}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryId: e.target.value })
                }
              >
                <option value={0}>Seleziona una sottocategoria</option>
                {categories
                  .find((cat) => cat.id === formData.subCategoryId)
                  ?.subCategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            {/* Sezione per l'inserimento delle immagini */}
            {formData.productImages.map((image, index) => (
              <Form.Group
                key={index}
                className='mb-2 d-flex align-items-center gap-2'
              >
                <Form.Control
                  type='text'
                  placeholder={`Immagine ${index + 1} URL`}
                  value={image.imageUrl}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                />
                <Button
                  variant='danger'
                  size='sm'
                  onClick={() => handleRemoveImageField(index)}
                  disabled={formData.productImages.length === 1}
                >
                  Rimuovi
                </Button>
              </Form.Group>
            ))}
            <div className='d-flex align-items-center justify-content-end'>
              <Button
                variant='info'
                size='sm'
                className='mb-3'
                onClick={handleAddImageField}
              >
                Aggiungi immagine
              </Button>
            </div>

            <Button variant='success' type='submit'>
              {editingProduct ? 'Aggiorna' : 'Aggiungi'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageProductsComponent;
