import { NavLink, useNavigate } from 'react-router-dom';
import AxiosInstance from '../libs/axiosInstance';
import { useDispatch } from 'react-redux';
import { authTokenActions } from '../store/authSlice';

const paths = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/profile',
    name: 'Profile',
  },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosInstance = AxiosInstance({ 'Content-Type': 'application/json' });

  const logout = async () => {
    try {
      const response = await axiosInstance.delete('/api/auth/logout');

      if (response.status !== 200) {
        console.error(response.data.message);
        return;
      }

      dispatch(authTokenActions.removeToken());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="py-4 text-white bg-blue-500 shadow-md">
      <div className="container flex items-center justify-between px-4 mx-auto">
        <div>
          {paths.map((path) => (
            <NavLink key={path.path} to={path.path} className={({ isActive }) => `mr-4 text-xl ${isActive ? 'text-white underline' : 'text-gray-200'}`}>
              {path.name}
            </NavLink>
          ))}
        </div>
        <div>
          <button type="button" onClick={logout} className="px-4 py-1 font-semibold text-white bg-red-500 rounded-md">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
