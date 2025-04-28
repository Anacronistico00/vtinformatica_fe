import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeComponent from './Components/HomeComponent';
import LoginComponent from './Components/Auth/LoginComponent';
import RegisterComponent from './Components/Auth/RegisterComponent';
import RoleRoute from './Components/Auth/roleRoute';
import NotAuthorized from './Components/NotAuthorized';
import NotFound from './Components/NotFound';
import NavBarComponent from './Components/NavBar/NavBarComponent.jsx';
import AccountInfoComponent from './Components/AccountInfoComponent.jsx';
import FooterComponent from './Components/FooterComponent.jsx';
import SearchResultComponent from './Components/SearchResultComponent.jsx';
import CategoryComponent from './Components/Products/CategoryComponent.jsx';
import SubCategoryComponent from './Components/Products/SubCategoryComponent.jsx';
import ManufacturerComponent from './Components/Products/ManufacturerComponent.jsx';
import ProductInfo from './Components/Products/ProductInfo.jsx';
import CartComponent from './Components/CartComponent.jsx';
import OrdersComponent from './Components/OrdersComponent.jsx';
import OrderInfoComponent from './Components/OrderInfoComponent.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
};
const MainApp = () => {
  return (
    <div className='app-container'>
      <NavBarComponent />
      <ToastContainer position='top-right' autoClose={3500} />

      <div className='main-content'>
        <Routes>
          <Route path='/' element={<HomeComponent />} />
          <Route path='/accountInfo' element={<AccountInfoComponent />} />
          <Route path='/register' element={<RegisterComponent />} />
          <Route path='/search/:query' element={<SearchResultComponent />} />
          <Route path='/account' element={<LoginComponent />} />
          <Route path='/orders' element={<OrdersComponent />} />
          <Route path='/orderInfo/:id' element={<OrderInfoComponent />} />

          <Route
            path='/products/category/:id'
            element={<CategoryComponent />}
          />
          <Route
            path='/products/subcategory/:id'
            element={<SubCategoryComponent />}
          />
          <Route
            path='/products/manufacturer/:id'
            element={<ManufacturerComponent />}
          />
          <Route path='/product/:id' element={<ProductInfo />} />
          <Route path='/cart' element={<CartComponent />} />
          <Route path='/not-authorized' element={<NotAuthorized />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>

      <FooterComponent />
    </div>
  );
};

export default App;
