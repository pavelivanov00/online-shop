import React from 'react';
import Home from './Home';
import { useLocation } from 'react-router-dom';

function HomeProps() {
  const { role, email, username } = useLocation().state;
  return (
    <Home
      role={role}
      email={email}
      username={username}
    />
  )
}

export default HomeProps