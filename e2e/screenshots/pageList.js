// Le 24 pagine fotografate e controllate: stessi nomi nelle foto (prima, direzioni, dopo) e nel rapporto axe.
export const publicPages = ({ products }) => [
  ['public-home', '/'],
  ['public-category', '/products/category/1'],
  ['public-subcategory', '/products/subcategory/1'],
  ['public-manufacturers', '/manufacturers'],
  ['public-manufacturer', '/products/manufacturer/1'],
  ['public-search', '/search/E2E'],
  ['public-product', `/product/${products.reviews}`],
  ['public-cart-empty', '/cart'],
  ['public-login', '/account'],
  ['public-register', '/register'],
  ['public-reactivate', '/reactivate'],
  ['public-not-authorized', '/not-authorized'],
  ['public-not-found', '/pagina-inesistente'],
];

export const accountPages = ({ products, orderId }) => [
  ['account-info', '/accountInfo'],
  ['account-cart', '/cart'],
  ['account-orders', '/orders'],
  ['account-order-detail', `/orderInfo/${orderId}`],
  ['account-product-reviews', `/product/${products.reviews}`],
];

export const adminPages = () => [
  ['admin-dashboard', '/admin'],
  ['admin-products', '/admin/products'],
  ['admin-categories', '/admin/categories'],
  ['admin-subcategories', '/admin/subcategories'],
  ['admin-manufacturers', '/admin/manufacturers'],
  ['admin-users', '/admin/users'],
];
