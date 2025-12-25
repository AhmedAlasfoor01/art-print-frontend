import { Routes, Route, Navigate } from 'react-router';
import { useContext } from 'react';
import { UserContext } from './compnents/contexts/Contexts';

import NavBar from './compnents/NavBar/NavBar.jsx';
import SignUpForm from './compnents/SignUpForm/SignUpForm.jsx';
import SignInForm from './compnents/Signinform/SigninForm.jsx';
import Landing from './compnents/Landing/Landing.jsx';
import Product from './compnents/Products/product.jsx';
import Orders from './compnents/Orders/order.jsx';
import DashBoard from './compnents/DashBoard/DashBoard.jsx';

import './index.css';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/products' element={<Product />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/Dashboard' element={<DashBoard />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  );
};

export default App;
