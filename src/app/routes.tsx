import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}