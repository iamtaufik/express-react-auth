import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PrivateRoute = () => {
  const authToken = useSelector((state: any) => state.authToken.token);
  return authToken ? (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
