import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
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
import HamburgerDropdown from '../HamburgerDropdown';
import NavBarDropdown from './NavbarDropdown';
import SearchBar from './SearchBarComponent';

const NavBarComponent = () => {
  return (
    <div className='shadow-lg pb-3'>
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
              <img id='navLogo' src='public/Images/VT.svg' alt='AppLogo' />
            </Navbar.Brand>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Icone Account e Carrello */}
          <Nav className='d-flex flex-row align-items-center gap-4 ms-2 order-2 order-lg-3'>
            <Nav.Link
              as={Link}
              to='/account'
              className='text-white fs-5 d-flex d-md-block align-items-center link'
            >
              <div className='d-flex flex-column align-items-center justify-content-center'>
                <FaUser />
                <p className='m-0 ms-2'>Account</p>
              </div>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to='/cart'
              className='text-white fs-5 d-flex align-items-center position-relative'
            >
              <div className='d-flex flex-column align-items-center justify-content-center'>
                <FaShoppingCart />
                <p className='m-0 ms-2'>Carrello</p>
              </div>

              {/* Badge per numero articoli */}
              {/* {cartItems.length > 0 && (
              <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                {cartItems.length}
              </span>
            )} */}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className=' d-none d-lg-flex justify-content-evenly align-items-center m-auto'>
        <NavBarDropdown />

        <Link to={'/offerte'} className='link'>
          OFFERTE
        </Link>
        <Link to={'/contatti'} className='link'>
          CONTATTI
        </Link>
        <Link to={'/chi-siamo'} className='link'>
          CHI SIAMO
        </Link>
      </Container>
    </div>
  );
};

export default NavBarComponent;
