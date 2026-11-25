import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const emptyForm = {
  name: '',
  manufacturerId: 0,
  description: '',
  price: 0,
  quantity: 0,
  fullDescription: '',
  subCategoryId: 0,
  productImages: [{ imageUrl: '' }],
};

const formFrom = (product) =>
  product
    ? {
        name: product.name,
        manufacturerId: product.manufacturerId,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        fullDescription: product.fullDescription ?? '',
        subCategoryId: product.subCategory?.id ?? 0,
        productImages: product.productImages?.length ? product.productImages : [{ imageUrl: '' }],
      }
    : emptyForm;

/** Corpo per POST/PUT /Product: numeri come numeri, immagini vuote scartate. */
const toProductBody = (form) => ({
  ...form,
  manufacturerId: Number(form.manufacturerId),
  price: Number(form.price),
  quantity: Number(form.quantity),
  subCategoryId: Number(form.subCategoryId),
  productImages: form.productImages.filter((img) => img.imageUrl),
});

/** Form di creazione/modifica prodotto. Rimontato a ogni apertura (key nel padre), parte dai dati del prodotto. */
const ProductFormModal = ({ show, product, subcategories, manufacturers, onSubmit, onClose }) => {
  const [form, setForm] = useState(() => formFrom(product));

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const setImage = (index, imageUrl) =>
    setForm({
      ...form,
      productImages: form.productImages.map((img, i) => (i === index ? { imageUrl } : img)),
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(toProductBody(form));
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{product ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-2' controlId='productName'>
            <Form.Label>Nome Prodotto</Form.Label>
            <Form.Control type='text' value={form.name} onChange={set('name')} />
          </Form.Group>

          <Form.Group className='mb-2' controlId='productManufacturer'>
            <Form.Label>Produttore</Form.Label>
            <Form.Select value={form.manufacturerId} onChange={set('manufacturerId')}>
              <option value={0}>Seleziona un produttore</option>
              {manufacturers.map((man) => (
                <option key={man.manufacturerId} value={man.manufacturerId}>
                  {man.manufacturerName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-2' controlId='productDescription'>
            <Form.Label>Descrizione Breve</Form.Label>
            <Form.Control as='textarea' value={form.description} onChange={set('description')} />
          </Form.Group>

          <Form.Group className='mb-2' controlId='productPrice'>
            <Form.Label>Prezzo (€)</Form.Label>
            <Form.Control type='number' value={form.price} onChange={set('price')} />
          </Form.Group>

          <Form.Group className='mb-2' controlId='productQuantity'>
            <Form.Label>Quantità Disponibile</Form.Label>
            <Form.Control type='number' value={form.quantity} onChange={set('quantity')} />
          </Form.Group>

          <Form.Group className='mb-2' controlId='productFullDescription'>
            <Form.Label>Descrizione Completa</Form.Label>
            <Form.Control as='textarea' value={form.fullDescription} onChange={set('fullDescription')} />
          </Form.Group>

          <Form.Group className='mb-2' controlId='productSubCategory'>
            <Form.Label>Sottocategoria</Form.Label>
            <Form.Select value={form.subCategoryId} onChange={set('subCategoryId')}>
              <option value={0}>Seleziona una sottocategoria</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <h6>Immagini del prodotto</h6>
          {form.productImages.map((image, index) => (
            <Form.Group key={index} className='mb-2 d-flex align-items-center gap-2'>
              <Form.Control
                type='text'
                placeholder={`Immagine ${index + 1} URL`}
                aria-label={`Immagine ${index + 1} URL`}
                value={image.imageUrl}
                onChange={(e) => setImage(index, e.target.value)}
              />
              <Button
                variant='outline-danger'
                size='sm'
                onClick={() =>
                  setForm({ ...form, productImages: form.productImages.filter((_, i) => i !== index) })
                }
                disabled={form.productImages.length === 1}
              >
                Rimuovi
              </Button>
            </Form.Group>
          ))}
          <div className='d-flex align-items-center justify-content-end'>
            <Button
              variant='outline-primary'
              size='sm'
              className='mb-3'
              onClick={() => setForm({ ...form, productImages: [...form.productImages, { imageUrl: '' }] })}
            >
              Aggiungi immagine
            </Button>
          </div>

          <Button variant='primary' type='submit'>
            {product ? 'Aggiorna' : 'Aggiungi'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductFormModal;
