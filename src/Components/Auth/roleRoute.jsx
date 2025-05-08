import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to='/not-authorized' replace />;
  }

  return children;
};

export default RoleRoute;
