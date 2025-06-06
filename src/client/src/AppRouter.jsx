import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InboxPage from './pages/InboxPage';
// … autres importations …

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        { /* tu peux rediriger "/" vers "/inbox" en attendant, ou définir une route protégée */ }
        <Route path="/inbox" element={<InboxPage />} />
        { /* … autres routes */ }
      </Routes>
    </BrowserRouter>
  );
}
