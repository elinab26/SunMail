import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InboxPage from './pages/jsx/InboxPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        { /* you can redirect "/" to "/inbox" for now, or define a protected route */ }
        <Route path="/inbox" element={<InboxPage />} />
        { /* ... other routes */ }
      </Routes>
    </BrowserRouter>
  );
}
