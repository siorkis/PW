import React from 'react';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import Landing from './pages/landing';
import Signup from './pages/signup';
import Quiz from './pages/quiz';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/landing/:id" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quiz/:id/:user" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}

function Header() {
  const navigate = useNavigate();
  function goTo(path) {
    navigate(path);
  }

  return (
    <header>
      <nav className='header'>
        <button onClick={() => goTo('/landing')}>Home</button>
        <button onClick={() => goTo('/signup')}>Login</button>
      </nav>
    </header>
  );
}
