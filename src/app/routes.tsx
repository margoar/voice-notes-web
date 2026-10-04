import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { BooksPage } from '../pages/Books/BooksPage';
import { NotesPage } from '../pages/Notes/NotesPage';
import { DraftsPage } from '../pages/Drafts/DraftsPage';
import { BookDetailPage } from '../pages/Books/BookDetailPage';
import { CreateNotePage } from '../pages/Notes/CreateNotePage';
export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/drafts" element={<DraftsPage />} />
                    <Route path="/books/:bookId" element={<BookDetailPage />} />
                    <Route path="/books/:bookId/notes/new" element={<CreateNotePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

