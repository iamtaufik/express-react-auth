import { useEffect, useState } from 'react';
import AxiosInstance from '../libs/axiosInstance';
import Timeline from './Timeline';
import { User } from '../types/user';

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const axiosInstance = AxiosInstance({ 'Content-Type': 'application/json' });

  const getUser = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/me');

      if (response.status !== 200) {
        console.error(response.data.message);
        return;
      }

      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return <>{user ? <Timeline user={user} /> : <div>Loading...</div>}</>;
};

export default Home;
