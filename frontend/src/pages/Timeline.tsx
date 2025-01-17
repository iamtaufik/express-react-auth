import { useEffect, useState } from 'react';
import { User } from '../types/user';
import AxiosInstance from '../libs/axiosInstance';
import { Post } from '../types/post';
import { toast } from 'react-toastify';

const Timeline = ({ user }: { user: User }) => {
  const [newTweet, setNewTweet] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const axiosInstance = AxiosInstance({ 'Content-Type': 'application/json' });

  const getPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/posts');

      if (response.status !== 200) {
        console.error(response.data.message);
        return;
      }

      setPosts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostTweet = async () => {
    if (newTweet.trim() === '') {
      alert('Tweet cannot be empty!');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/posts', { content: newTweet });

      if (response.status !== 201) {
        console.error(response.data.message);
        return;
      }

      getPosts();
      toast.success('Tweet posted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to post tweet!');
    } finally {
      setNewTweet('');
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <main className="container px-4 py-6 mx-auto">
      {/* Welcome Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Welcome, {user.name}!</h2>
      </section>

      <section className="mb-8">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            className="flex-grow px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button onClick={handlePostTweet} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
            Post
          </button>
        </div>
      </section>

      {/* Timeline Section */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-700">Timeline</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
                {post.author}
                {post.isVerivedUser ? (
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-sky-600">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                      />
                    </svg>
                  </span>
                ) : null}
              </p>
              <p className="mt-2 text-gray-800">{post.content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Timeline;
