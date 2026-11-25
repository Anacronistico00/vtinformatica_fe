import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaUserCog } from 'react-icons/fa';
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap';
// import { useSelector } from 'react-redux';
import HamburgerDropdown from '../NavBar/HamburgerDropdown';
import NavBarDropdown from './NavbarDropdown';
import SearchBar from './SearchBarComponent';
import ThemeToggle from './ThemeToggle';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../Redux/Actions/CartActions';
import { fetchCategories } from '../../Redux/Actions/CategoriesActions';

const NavBarComponent = () => {
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Le categorie servono al menu di ogni pagina: le carica il layout, non la home.
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);

  return (
    <div className='site-header pb-3'>
      <Navbar expand='lg' className='d-flex flex-column sticky-top pb-0'>
        <Container className='d-flex flex-row justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <HamburgerDropdown />
            {/* Logo */}
            <Navbar.Brand
              as={Link}
              to='/'
              className='fw-bold text-primary fs-4 order-1'
            >
              {/* Sotto il breakpoint della barra (lg) resta la sola VT con l'ombra: la parola non si legge a quella larghezza. */}
              <picture>
                <source media='(max-width: 991.98px)' srcSet='/Images/logo-mark.svg' />
                <img
                  id='navLogo'
                  src='/Images/logo-lockup.svg'
                  width='631'
                  height='118'
                  alt='VT Informatica'
                />
              </picture>
            </Navbar.Brand>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Icone Account e Carrello */}
          <Nav className='d-flex flex-row align-items-center gap-4 ms-2 order-2 order-lg-3'>
            <Nav.Link
              as={Link}
              to='/account'
              className='nav-icon-link fs-5 d-flex d-md-block align-items-center link'
            >
              <div className='d-flex flex-column align-items-center justify-content-center'>
                <FaUser />
                <p className='m-0 ms-2'>Account</p>
              </div>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to='/cart'
              className='nav-icon-link fs-5 d-flex align-items-center position-relative'
            >
              <div className='d-flex flex-column align-items-center justify-content-center'>
                <FaShoppingCart />
                <p className='m-0 ms-2'>Carrello</p>
              </div>

              {/* Badge per numero articoli */}
              {items.length > 0 && (
                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                  {items.length}
                </span>
              )}
            </Nav.Link>
            {user?.role === 'Admin' && (
              <Nav.Link
                as={Link}
                to='/admin'
                className='nav-icon-link fs-5 d-flex d-md-block align-items-center link'
              >
                <div className='d-flex flex-column align-items-center justify-content-center'>
                  <FaUserCog />
                  <p className='m-0 ms-2'>Admin</p>
                </div>
              </Nav.Link>
            )}
            <ThemeToggle />
          </Nav>
        </Container>
      </Navbar>
      <Container className='site-nav d-none d-lg-flex justify-content-evenly align-items-center m-auto'>
        <Link to={'/'} className='link'>
          Home
        </Link>
        <NavBarDropdown />
        <Link to={'/contatti'} className='link'>
          Contatti
        </Link>
        <Link to={'/chi-siamo'} className='link'>
          Chi siamo
        </Link>
      </Container>
    </div>
  );
};

export default NavBarComponent;
