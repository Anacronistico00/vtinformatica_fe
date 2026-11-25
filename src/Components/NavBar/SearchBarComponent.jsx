import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${search}`);
      setSearch('');
    }
  };

  return (
    <Form
      className='search-bar d-flex w-100 order-3 order-lg-2'
      onSubmit={handleSearch}
    >
      <FormControl
        type='search'
        placeholder={'Cerca un prodotto...'}
        aria-label='Search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='search-input border-0'
      />
      <Button
        className='searchButton border-0'
        aria-label='Cerca'
        type='submit'
      >
        <BsSearch aria-hidden='true' />
      </Button>
    </Form>
  );
};

export default SearchBar;
