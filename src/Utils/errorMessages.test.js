import { describe, expect, it } from 'vitest';
import { ApiError } from './apiClient';
import { messageFor } from './errorMessages';

const apiError = (code, extra = {}) => new ApiError({ status: 409, code, ...extra });

describe('messageFor', () => {
  it.each([
    ['insufficient_stock', /disponibil/i],
    ['cart_empty', /carrello è vuoto/i],
    ['stock_conflict', /modificato/i],
    ['resource_in_use', /collegat/i],
    ['product_not_found', /non è più disponibile/i],
    ['network_error', /non raggiungibile/i],
  ])('has a dedicated text for %s', (code, text) => {
    expect(messageFor(apiError(code))).toMatch(text);
  });

  it('uses the first field error for validation_failed', () => {
    const error = apiError('validation_failed', { errors: { Quantity: ['La quantità deve essere maggiore di zero.'] } });

    expect(messageFor(error)).toBe('La quantità deve essere maggiore di zero.');
  });

  it('falls back to the given text for unknown codes or non-API errors', () => {
    expect(messageFor(apiError('something_new'), 'Errore generico')).toBe('Errore generico');
    expect(messageFor(new Error('boom'), 'Errore generico')).toBe('Errore generico');
  });
});
