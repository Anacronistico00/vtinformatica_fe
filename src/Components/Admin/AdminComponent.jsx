import { Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const AdminComponent = () => {
  const user = useSelector((state) => state.auth);
  return (
    <Container>
      <h1 className='text-center'>Bentornato {user.user.email}</h1>
      <h4>
        Gestisci tutti i dati della piattaforma in modo semplice e veloce!
      </h4>

      <Nav className='flex-column mt-4'>
        <Nav.Link as={Link} to='/admin/products'>
          Gestione Prodotti
        </Nav.Link>
        <Nav.Link as={Link} to='/admin/categories'>
          Gestione Categorie
        </Nav.Link>
        <Nav.Link as={Link} to='/admin/subcategories'>
          Gestione Sottocategorie
        </Nav.Link>
        <Nav.Link as={Link} to='/admin/manufacturers'>
          Gestione Marchi
        </Nav.Link>
      </Nav>
    </Container>
  );
};

export default AdminComponent;
