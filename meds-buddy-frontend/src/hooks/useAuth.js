import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/check');
        const userData = res.data.user;
        setUser(userData);

        const currentPath = location.pathname;

        // Role-based redirect
        if (userData.role === 'patient' && currentPath.startsWith('/caretaker')) {
          navigate('/patient', { replace: true });
        } else if (userData.role === 'caretaker' && currentPath.startsWith('/patient')) {
          navigate('/caretaker', { replace: true });
        }

        // Block going back to login after login
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', blockBack);

      } catch (err) {
        console.error('Not authenticated, redirecting...', err.message);
        navigate('/login', { replace: true });
      }
    };

    checkAuth();

    const blockBack = () => {
      window.history.pushState(null, '', window.location.href);
    };

    return () => {
      window.removeEventListener('popstate', blockBack);
    };
  }, [navigate, location]);

  return { user };
};



// import { useEffect, useState } from 'react';
// import axios from '../api/axiosInstance';
// import { useNavigate, useLocation } from 'react-router-dom';

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get('/check'); // Assumes backend sends { user: { id, role, name, ... } }
//         const userData = res.data.user;
//         setUser(userData);

//         const currentPath = location.pathname;

//         if (userData.role === 'patient' && currentPath.startsWith('/caretaker')) {
//           navigate('/patient', { replace: true });
//         } else if (userData.role === 'caretaker' && currentPath.startsWith('/patient')) {
//           navigate('/caretaker', { replace: true });
//         }
//       } catch (err) {
//         console.error('Not authenticated, redirecting...', err.message);
//         navigate('/login', { replace: true });
//       }
//     };

//     checkAuth();
//   }, [navigate, location]);

//   return { user };
// };

