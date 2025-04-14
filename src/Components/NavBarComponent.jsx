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
import { useState } from 'react';
import HamburgerDropdown from './HamburgerDropdown';

const NavBarComponent = () => {
  const [search, setSearch] = useState('');
  // const cartItems = useSelector((state) => state.cart.items);

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
          <Form
            className='d-flex w-100 order-3 order-lg-2'
            onSubmit={(e) => e.preventDefault()}
          >
            <FormControl
              type='search'
              placeholder='Cerca un prodotto...'
              className='me-2'
              aria-label='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant='outline-primary'>Cerca</Button>
          </Form>

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

              {/* Badge per numero articoli (decommenta e collega a stato) */}
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
        <div>
          <DropdownButton
            align='end'
            title='PRODOTTI'
            id='dropdown-menu-align-end'
            className='noCaret'
          >
            <Dropdown.Item eventKey='1'>Action</Dropdown.Item>
            <Dropdown.Item eventKey='2'>Another action</Dropdown.Item>
            <Dropdown.Item eventKey='3'>Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey='4'>Separated link</Dropdown.Item>
          </DropdownButton>
        </div>
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
