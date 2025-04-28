import ApiURL from '../../Utils/ApiURL';

export const FETCH_PRODUCTS_BY_CATEGORY_LOADING =
  'FETCH_PRODUCTS_BY_CATEGORY_REQUEST';
export const FETCH_PRODUCTS_BY_CATEGORY_SUCCESS =
  'FETCH_PRODUCTS_BY_CATEGORY_SUCCESS';
export const FETCH_PRODUCTS_BY_CATEGORY_ERROR =
  'FETCH_PRODUCTS_BY_CATEGORY_FAILURE';

export const FETCH_PRODUCTS_BY_SUBCATEGORY_LOADING =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_REQUEST';
export const FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS';
export const FETCH_PRODUCTS_BY_SUBCATEGORY_ERROR =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_FAILURE';

export const FETCH_PRODUCTS_BY_MANUFACTURER_LOADING =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_REQUEST';
export const FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS';
export const FETCH_PRODUCTS_BY_MANUFACTURER_ERROR =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_FAILURE';

export const fetchProductsByCategory = (categoryId) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_BY_CATEGORY_LOADING });

  try {
    const response = await fetch(
      `${ApiURL.apiUrl}/Product/category/${categoryId}`
    );
    const data = await response.json();
    dispatch({ type: FETCH_PRODUCTS_BY_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_BY_CATEGORY_ERROR,
      payload: error.message,
    });
  }
};

export const fetchProductsBySubCategory =
  (subCategoryId) => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BY_SUBCATEGORY_LOADING });

    try {
      const response = await fetch(
        `${ApiURL.apiUrl}/Product/subcategory/${subCategoryId}`
      );
      const data = await response.json();
      dispatch({ type: FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: FETCH_PRODUCTS_BY_SUBCATEGORY_ERROR,
        payload: error.message,
      });
    }
  };

export const fetchProductsByManufacturer =
  (manufacturerId) => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BY_MANUFACTURER_LOADING });

    try {
      const response = await fetch(
        `${ApiURL.apiUrl}/Product/manufacturer/${manufacturerId}`
      );
      const data = await response.json();
      dispatch({ type: FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: FETCH_PRODUCTS_BY_MANUFACTURER_ERROR,
        payload: error.message,
      });
    }
  };
