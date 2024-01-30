import React from 'react';
import Home from './Home';
import { useLocation } from 'react-router-dom';

function HomeProps() {
  const { accountRole, email, username } = useLocation().state;
  return (
    <Home
      accountRole={accountRole}
      email={email}
      username={username}
    />
  )
}

export default HomeProps