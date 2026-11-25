import { useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import {
  createReview,
  deleteReview,
  fetchMyReviews,
  fetchProductReviews,
  updateReview,
} from '../../Redux/Actions/reviewsActions';
import { messageFor } from '../../Utils/errorMessages';

const Stars = ({ rating }) => (
  <span className='rating-star' aria-label={`${rating} su 5`} role='img'>
    {[1, 2, 3, 4, 5].map((star) => (star <= rating ? <BsStarFill key={star} /> : <BsStar key={star} />))}
  </span>
);

const StarPicker = ({ value, onChange }) => (
  <div className='mb-2'>
    {[1, 2, 3, 4, 5].map((star) => (
      <Button
        key={star}
        variant='link'
        className='rating-star p-0 me-1 fs-4 text-decoration-none'
        aria-label={`Voto ${star}`}
        aria-pressed={value === star}
        onClick={() => onChange(star)}
      >
        {star <= value ? <BsStarFill aria-hidden='true' /> : <BsStar aria-hidden='true' />}
      </Button>
    ))}
  </div>
);

const emptyDraft = { id: null, rating: 0, comment: '' };

const ProductReviews = ({ productId }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [reviews, setReviews] = useState([]);
  const [mine, setMine] = useState(new Set());
  // id null = nuova recensione; id valorizzato = modifica di una propria.
  const [draft, setDraft] = useState(emptyDraft);

  const load = useCallback(async () => {
    try {
      setReviews(await fetchProductReviews(productId));
      if (isAuthenticated) {
        const own = await fetchMyReviews();
        setMine(new Set(own.map((review) => review.reviewId)));
      } else {
        setMine(new Set());
      }
    } catch (error) {
      toast.error(messageFor(error, 'Impossibile caricare le recensioni.'));
    }
  }, [productId, isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    const values = { rating: draft.rating, comment: draft.comment.trim() };
    try {
      if (draft.id) {
        await updateReview(draft.id, values);
        toast.success('Recensione aggiornata.');
      } else {
        await createReview(productId, values);
        toast.success('Recensione pubblicata.');
      }
      setDraft(emptyDraft);
      await load();
    } catch (error) {
      toast.error(messageFor(error, 'Recensione non salvata.'));
    }
  };

  const remove = async (review) => {
    if (!window.confirm('Vuoi eliminare la tua recensione?')) return;
    try {
      await deleteReview(review.reviewId);
      toast.success('Recensione eliminata.');
      if (draft.id === review.reviewId) setDraft(emptyDraft);
      await load();
    } catch (error) {
      toast.error(messageFor(error, 'Recensione non eliminata.'));
    }
  };

  return (
    <section className='mt-5'>
      <h4 className='mb-3'>Recensioni</h4>

      {reviews.length === 0 ? (
        <p>Ancora nessuna recensione.</p>
      ) : (
        <ul className='list-group mb-4'>
          {reviews.map((review) => (
            <li key={review.reviewId} className='list-group-item'>
              <div className='d-flex justify-content-between align-items-center'>
                <Stars rating={review.reviewRating} />
                <small className='text-muted'>{new Date(review.createdAt).toLocaleDateString('it-IT')}</small>
              </div>
              <p className='mb-1'>{review.reviewComment}</p>
              {mine.has(review.reviewId) && (
                <div className='d-flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline-primary'
                    onClick={() =>
                      setDraft({ id: review.reviewId, rating: review.reviewRating, comment: review.reviewComment })
                    }
                  >
                    Modifica
                  </Button>
                  <Button size='sm' variant='outline-danger' onClick={() => remove(review)}>
                    Elimina
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated ? (
        <Form onSubmit={submit}>
          <h5>{draft.id ? 'Modifica la tua recensione' : 'Scrivi una recensione'}</h5>
          <StarPicker value={draft.rating} onChange={(rating) => setDraft({ ...draft, rating })} />
          <Form.Group className='mb-2' controlId='reviewComment'>
            <Form.Label>La tua recensione</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              required
              value={draft.comment}
              onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
            />
          </Form.Group>
          <div className='d-flex gap-2'>
            <Button type='submit' variant='primary' disabled={draft.rating === 0}>
              {draft.id ? 'Salva modifiche' : 'Pubblica'}
            </Button>
            {draft.id && (
              <Button variant='secondary' onClick={() => setDraft(emptyDraft)}>
                Annulla
              </Button>
            )}
          </div>
        </Form>
      ) : (
        <p>
          <Link to='/account'>Accedi</Link> per scrivere una recensione.
        </p>
      )}
    </section>
  );
};

export default ProductReviews;
