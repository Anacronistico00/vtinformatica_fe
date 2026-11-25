import { Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const AdminComponent = () => {
  const user = useSelector((state) => state.auth);
  return (
    <Container className='my-4'>
      <h1 className='h3'>Bentornato {user.user.email}</h1>
      <p className='text-muted'>Gestisci prodotti, categorie, marchi e utenti.</p>

      <Nav className='admin-grid mt-4'>
        <Nav.Link className='admin-tile' as={Link} to='/admin/products'>
          Gestione Prodotti
        </Nav.Link>
        <Nav.Link className='admin-tile' as={Link} to='/admin/categories'>
          Gestione Categorie
        </Nav.Link>
        <Nav.Link className='admin-tile' as={Link} to='/admin/subcategories'>
          Gestione Sottocategorie
        </Nav.Link>
        <Nav.Link className='admin-tile' as={Link} to='/admin/manufacturers'>
          Gestione Marchi
        </Nav.Link>
        <Nav.Link className='admin-tile' as={Link} to='/admin/users'>
          Gestione Utenti
        </Nav.Link>
      </Nav>
    </Container>
  );
};

export default AdminComponent;
