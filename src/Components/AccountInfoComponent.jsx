import { useDispatch } from 'react-redux';
import { logout } from '../Redux/Actions/authActions';
import { Link } from 'react-router-dom';

export const AccountInfoComponent = () => {
  const dispatch = useDispatch();
  return (
    <Link
      to='/'
      onClick={() => dispatch(logout())}
      className='nav-link text-danger'
    >
      Logout
    </Link>
  );
};
