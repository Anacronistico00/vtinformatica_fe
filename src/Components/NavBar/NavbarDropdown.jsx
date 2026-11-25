import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

const NavbarDropdown = () => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const { categories } = useSelector((state) => state.categories);

  if (!categories || categories.length === 0) return null;

  return (
    <Dropdown className='position-relative'>
      <Dropdown.Toggle
        variant='light'
        id='categoriesDropdown'
        className='fw-semibold bg-transparent border-0 p-0'
      >
        Categorie
      </Dropdown.Toggle>

      <Dropdown.Menu className='p-0 shadow' style={{ width: '250px' }}>
        {categories.map((category) => (
          <div
            key={category.id}
            className='categoryDiv position-relative'
            onMouseEnter={() => setHoveredCategoryId(category.id)}
            onMouseLeave={() => setHoveredCategoryId(null)}
          >
            <Link
              to={`products/category/${category.id}`}
              className='text-decoration-none'
            >
              <Dropdown.Item
                as='div'
                className='d-flex justify-content-between align-items-center px-3 py-2'
                style={{ cursor: 'pointer' }}
              >
                <p className='categoryName m-0 p-1'>{category.name}</p>

                {category.subCategories?.length > 0 && (
                  <span className='ms-2'>&rsaquo;</span>
                )}
              </Dropdown.Item>
            </Link>
            {hoveredCategoryId === category.id &&
              category.subCategories?.length > 0 && (
                <div
                  className='category-submenu position-absolute top-0 start-100'
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
