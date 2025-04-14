import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeComponent from './Components/HomeComponent';
import LoginComponent from './Components/Auth/LoginComponent';
import RegisterComponent from './Components/Auth/RegisterComponent';
import RoleRoute from './Components/Auth/roleRoute';
import NotAuthorized from './Components/NotAuthorized';
import NotFound from './Components/NotFound';
import NavBarComponent from './Components/NavBarComponent.jsx';
import { AccountInfoComponent } from './Components/AccountInfoComponent.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
};

const MainApp = () => {
  return (
    <>
      <NavBarComponent />

      <Routes>
        <Route path='/' element={<HomeComponent />} />
        <Route path='/account' element={<LoginComponent />} />
        <Route path='/accountInfo' element={<AccountInfoComponent />} />
        <Route
          path='/register'
          element={
            <RoleRoute component={<RegisterComponent />} requiredRole='Admin' />
          }
        />
        <Route path='/not-authorized' element={<NotAuthorized />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      {/* <FooterComponent /> */}
    </>
  );
};

export default App;
