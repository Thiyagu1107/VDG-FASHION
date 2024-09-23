import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { styled, ThemeProvider } from '@mui/material/styles';
import PrivateRoute from './Components/Route/UserRoute';
import AdminRoute from './Components/Route/AdminRoute';
import theme from './Styles/Theme/defaultTheme';
import Dashboard from './Pages/Dashboard';
import 'react-toastify/dist/ReactToastify.css';

const LoaderWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1301,
  width: '100%',
});

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>
);

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

const Login = Loadable(React.lazy(() => import("./Pages/Auth/Login")));
const AdminDashboard = Loadable(React.lazy(() => import("./Pages/Admin/AdminDashboard")));
const UserDashboard = Loadable(React.lazy(() => import("./Pages/User/UserDashboard")));
const ForgotPassword = Loadable(React.lazy(() => import("./Pages/Auth/ForgotPassword")));
const Register = Loadable(React.lazy(() => import("./Pages/Auth/Register")));
const AdminProfile = Loadable(React.lazy(() => import('./Pages/Admin/Profile')));
const UserProfile = Loadable(React.lazy(() => import('./Pages/User/Profile')));
const HomePage = Loadable(React.lazy(() => import("./Pages/HomePage")));
const PageNotFound = Loadable(React.lazy(() => import("./Pages/PageNotFound")));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
        
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/profile" element={<UserProfile />} />
        </Route>
        
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/profile" element={<AdminProfile />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
