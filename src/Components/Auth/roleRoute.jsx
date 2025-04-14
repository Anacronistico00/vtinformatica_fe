import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleRoute = ({ component, requiredRole }) => {
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, role } = auth;

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (role !== requiredRole) {
    return <Navigate to='/not-authorized' />;
  }

  return component;
};

export default RoleRoute;
