import { FormEvent, useEffect, useState } from 'react';
import AxiosInstance from '../libs/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface Profile {
  id: string;
  name: string;
  email: string;
  isVerived: boolean;
}

const Profile = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  //   const [isEditing, setIsEditing] = useState(false);
  const axiosInstance = AxiosInstance({ 'Content-Type': 'application/json' });

  const handleVerify = () => {
    alert('Verification link sent to your email!');
  };

  const handleEditPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axiosInstance.put('/api/users', { password, confirmPassword });

      if (response.status !== 200) {
        console.error(response.data.errors);
        // toast.error('Failed to update password!');
        return;
      }

      toast.success('Password updated successfully!');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errors = error.response?.data.errors;
        if (errors) {
          errors.forEach((error: { path: string; message: string }) => {
            toast.error(`${error.path}: ${error.message}`);
          });
        }
      } else {
        console.error(error);
        toast.error('Failed to update password!');
      }
    } finally {
      // alert('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const myProfile = async () => {
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
    myProfile();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Profile</h1>

        {/* User Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="text-lg font-medium text-gray-800">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-medium text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Verification Status</p>
            <p className="text-lg font-medium text-gray-800">{user?.isVerived ? 'Verified' : 'Not Verified'}</p>
            {!user?.isVerived && (
              <button onClick={handleVerify} className="px-4 py-2 mt-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                Verify Account
              </button>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Change Password</h2>
          <form onSubmit={handleEditPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300">
              Edit Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
