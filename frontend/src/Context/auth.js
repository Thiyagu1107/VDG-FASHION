import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: '',
  });

  useEffect(() => {
    const data = Cookies.get('auth');
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        user: parseData.user,
        token: parseData.token,
      });

      // Set default Axios headers after updating auth state
      axios.defaults.headers.common["Authorization"] = parseData.token;
    }
  }, []);

  const updateAuth = (authData) => {
    setAuth(authData);
    Cookies.set('auth', JSON.stringify(authData), { expires: 1 }); // Expires in 1 day
    axios.defaults.headers.common["Authorization"] = authData.token;
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
