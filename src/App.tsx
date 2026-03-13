import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Comercial } from './pages/Comercial';
import { Secretaria } from './pages/Secretaria';
import { Financeiro } from './pages/Financeiro';
import { Pedagogico } from './pages/Pedagogico';
import { Ferramentas } from './pages/Ferramentas';
import { Certificados } from './pages/Certificados';
import { Suporte } from './pages/Suporte';
import { Configuracoes } from './pages/Configuracoes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="comercial" element={<Comercial />} />
          <Route path="secretaria" element={<Secretaria />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="pedagogico" element={<Pedagogico />} />
          <Route path="ferramentas" element={<Ferramentas />} />
          <Route path="certificados" element={<Certificados />} />
          <Route path="suporte" element={<Suporte />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;