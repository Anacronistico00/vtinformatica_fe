import { useState, useRef, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import NavbarDropdown from './NavbarDropdown';

const HamburgerDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='hamburger-container me-2 d-lg-none' ref={dropdownRef}>
      <div
        className={`hamburger-icon ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
      >
        <span></span>
        <span></span>
        <span></span>
        <span className='text-center'>Menù</span>
      </div>

      <div className={`hamburger-dropdown ${isOpen ? 'show' : ''}`}>
        <Nav className='flex-column'>
          <Nav.Link href='/'>HOME</Nav.Link>
          <NavbarDropdown />
          <Nav.Link className='mt-2' href='/contatti'>
            CONTATTI
          </Nav.Link>
          <Nav.Link href='/chi-siamo'>CHI SIAMO</Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default HamburgerDropdown;
