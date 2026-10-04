import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { BooksPage } from '../pages/Books/BooksPage';
import { NotesPage } from '../pages/Notes/NotesPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>
    </BrowserRouter>
  );
}