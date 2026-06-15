import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Home';
import ConceptA from './concepts/a/ConceptA';
import ConceptB from './concepts/b/ConceptB';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/a" element={<ConceptA />} />
        <Route path="/b" element={<ConceptB />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
