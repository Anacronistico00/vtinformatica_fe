import { describe, expect, it } from 'vitest';
import * as actions from './ProductsAction';

describe('action types of the product lists', () => {
  it('are distinct between subcategory and manufacturer', () => {
    for (const phase of ['LOADING', 'SUCCESS', 'ERROR']) {
      expect(actions[`FETCH_PRODUCTS_BY_MANUFACTURER_${phase}`]).not.toBe(actions[`FETCH_PRODUCTS_BY_SUBCATEGORY_${phase}`]);
    }
  });

  it('are unique across every FETCH_PRODUCTS_* constant', () => {
    const types = Object.entries(actions)
      .filter(([name]) => name.startsWith('FETCH_PRODUCTS_'))
      .map(([, value]) => value);
    expect(new Set(types).size).toBe(types.length);
  });
});
