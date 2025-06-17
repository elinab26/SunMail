// src/client/src/App.js
import React from 'react';
import AppRouter from './AppRouter';
import { MailProvider } from './contexts/MailContext';


function App() {
  return (
    <MailProvider>
      <AppRouter />
      </MailProvider>
  );
}

export default App;
