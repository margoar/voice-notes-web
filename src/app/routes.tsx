import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { BooksPage } from '../pages/Books/BooksPage';
import { NotesPage } from '../pages/Notes/NotesPage';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/notes" element={<NotesPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}