import { useNavigate } from 'react-router';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
   
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return { handleLogout };
};