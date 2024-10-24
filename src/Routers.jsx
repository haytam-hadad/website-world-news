import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
