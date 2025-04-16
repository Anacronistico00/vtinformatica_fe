import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

const NavbarDropdown = () => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const { categories, loading } = useSelector((state) => state.categories);

  if (loading || !categories || categories.length === 0) return null;

  return (
    <Dropdown className='position-relative'>
      <Dropdown.Toggle
        variant='light'
        id='categories-dropdown'
        className='fw-semibold bg-transparent border-0 text-dark'
      >
        Categorie
      </Dropdown.Toggle>

      <Dropdown.Menu className='p-0 shadow' style={{ width: '250px' }}>
        {categories.map((category) => (
          <div
            key={category.id}
            className='position-relative'
            onMouseEnter={() => setHoveredCategoryId(category.id)}
            onMouseLeave={() => setHoveredCategoryId(null)}
          >
            <Link
              to={`products/category/${category.id}`}
              className='text-decoration-none text-dark'
            >
              <Dropdown.Item
                as='div'
                className='d-flex justify-content-between align-items-center px-3 py-2'
                style={{ cursor: 'pointer' }}
              >
                {category.name}

                {category.subCategories?.length > 0 && (
                  <span className='ms-2'>&rsaquo;</span> // freccina >
                )}
              </Dropdown.Item>
            </Link>
            {hoveredCategoryId === category.id &&
              category.subCategories?.length > 0 && (
                <div
                  className='position-absolute top-0 start-100 bg-white border rounded shadow zindex-tooltip'
                  style={{ minWidth: '220px' }}
                >
                  <ul className='list-unstyled m-0 p-2'>
                    {category.subCategories.map((sub, index) => (
                      <li key={index}>
                        <Link
                          to={`/products/subcategory/${sub.id}`}
                          className='dropdown-item py-2'
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarDropdown;
