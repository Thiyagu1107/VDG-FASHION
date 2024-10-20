import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from "../Assets/VDG Fshion.png";
import { useAuth } from '../Context/auth';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { auth, setAuth } = useAuth();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [cartItems, setCartItems] = React.useState(0);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    Cookies.remove('auth');
    handleMenuClose();
    toast.success('Logout Successfully');
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handleMenuClose = (route) => {
    setAnchorEl(null);
    if (route) {
      const targetRoute = route === 'dashboard'
        ? (auth.user?.role === 1 ? '/dashboard/admin' : '/dashboard/user')
        : route;
      navigate(targetRoute);
    }
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerItems = auth.user?.role === 1
    ? [
      { text: 'Home', path: '/' },
      { text: 'Dashboard', path: '/dashboard/admin' },
      { text: 'Slider', path: '/dashboard/admin/slider' },
      { text: 'Category', path: '/dashboard/admin/category' },
      { text: 'Sub Category', path: '/dashboard/admin/subcategory' },
      { text: 'Products', path: '/dashboard/admin/products' },
    ]
    : auth.user?.role === 0
    ? [
      { text: 'Profile', path: '/profile' },
      { text: 'Order', path: '/order' },
    ]
    : [];

  const renderMenu = (
    <Menu
    anchorEl={anchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    keepMounted
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    open={isMenuOpen}
    onClose={() => handleMenuClose(null)} 
  >
    {auth && auth.user ? (
      [
        <MenuItem key="dashboard" onClick={() => handleMenuClose('dashboard')}>Dashboard</MenuItem>,
        <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
      ]
    ) : (
      <MenuItem key="login" onClick={() => handleMenuClose('/login')}>My account</MenuItem>
    )}
  </Menu> 
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={() => navigate('/cart')}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={cartItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
    </Menu>
  );

  const renderDrawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer}
      sx={{
        '& .MuiDrawer-paper': {
          width: '15%',
        },
      }}
    >
      <List>
        {drawerItems.map((item, index) => (
          <ListItem button key={index} onClick={() => {
            navigate(item.path);
            toggleDrawer(); 
          }}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'navy' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="VDG Fashion" style={{ width: '90px', height: 'auto', marginRight: '10px' }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" edge="end" aria-label="show cart" color="inherit">
              <Badge badgeContent={cartItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" edge="end" aria-label="account of current user" onClick={handleProfileMenuOpen} color="inherit">
              <AccountCircle />
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)' }}>
                Hello, {auth?.user?.name}
              </Typography>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="show more" aria-controls="mobile-menu" aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderDrawer}
    </Box>
  );
}
