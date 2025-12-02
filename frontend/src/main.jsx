import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Pages/login';
import Register from './Pages/register'; 
import Dashboard from './Pages/dashboard';
import Home from './Pages/Home.jsx';
import AboutUs from './Pages/aboutUs.jsx';
import ContactUs from './Pages/contactUs.jsx';
import Header from './Components/Header.jsx';
import UserDashboard from './Pages/dashboarUser.jsx';
import BreederCatList from './Pages/BreederCatList.jsx';
import BreederProfileForm from './Components/BreederProfileForm.jsx';
import Profile from './Pages/Profile.jsx';

function Layout({ user, setUser }) {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <>
      {showHeader && <Header role={user.role} />}
      <div style={{ paddingTop: showHeader ? '100px' : '0px' }}>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          {user.role === 'admin' && <Route path="/dashboard" element={<Dashboard />} />}
          {user.role === 'user' && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard-user" element={<UserDashboard />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/breeder/cats" element={<BreederCatList />} />
              <Route path="/breeder/profile" element={<BreederProfileForm />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
          <Route
            path="*"
            element={<Navigate to={user.role === 'admin' ? '/dashboard' : '/'} replace />}
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState({ role: 'user', loggedIn: true });

  if (!user.loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <BrowserRouter>
      <Layout user={user} setUser={setUser} />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
