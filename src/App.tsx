import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
