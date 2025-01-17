import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { authTokenActions } from '../store/authSlice';

const backendUrl = import.meta.env.VITE_SERVER_URL;

const AxiosInstance = ({ headers }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state: any) => state.authToken.token);

  const instance = axios.create({
    baseURL: backendUrl,
    headers: {
      headers,
      authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401) {
        if (accessToken) {
          try {
            const response = await axios.get(`${backendUrl}/api/auth/refresh-token`, {
              withCredentials: true,
            });

            const newAccessToken = response.data.data.token;

            dispatch(authTokenActions.setToken(newAccessToken));

            error.config.headers.authorization = `Bearer ${newAccessToken}`;

            return axios.request(error.config);
          } catch (error) {
            navigate('/login');

            return Promise.reject(error);
          }
        } else {
          navigate('/login');
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  return instance;
};

export default AxiosInstance;
