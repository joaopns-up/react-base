import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CategoriasPage } from './pages/CategoriasPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProdutosPage } from './pages/ProdutosPage';
import { RegisterPage } from './pages/RegisterPage';
import { RequireAuth } from './routes/RequireAuth';
import { Layout } from './ui/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/categorias"
          element={
            <RequireAuth>
              <CategoriasPage />
            </RequireAuth>
          }
        />
        <Route
          path="/produtos"
          element={
            <RequireAuth>
              <ProdutosPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
