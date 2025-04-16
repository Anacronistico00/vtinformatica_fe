import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, Button } from 'react-bootstrap';

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
      className='d-flex w-100 order-3 order-lg-2 bg-white'
      onSubmit={handleSearch}
    >
      <FormControl
        type='search'
        placeholder={'Cerca un prodotto...'}
        aria-label='Search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='border-0'
      />
      <Button
        className='searchButton bg-white text-black border-0'
        type='submit'
      >
        <i className='bi bi-search'></i>
      </Button>
    </Form>
  );
};

export default SearchBar;
