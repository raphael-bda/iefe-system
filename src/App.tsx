import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Comercial = lazy(() => import('./pages/Comercial').then(m => ({ default: m.Comercial })));
const Secretaria = lazy(() => import('./pages/Secretaria').then(m => ({ default: m.Secretaria })));
const Financeiro = lazy(() => import('./pages/Financeiro').then(m => ({ default: m.Financeiro })));
const Pedagogico = lazy(() => import('./pages/Pedagogico').then(m => ({ default: m.Pedagogico })));
const Ferramentas = lazy(() => import('./pages/Ferramentas').then(m => ({ default: m.Ferramentas })));
const Certificados = lazy(() => import('./pages/Certificados').then(m => ({ default: m.Certificados })));
const Suporte = lazy(() => import('./pages/Suporte').then(m => ({ default: m.Suporte })));
const Configuracoes = lazy(() => import('./pages/Configuracoes').then(m => ({ default: m.Configuracoes })));

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center p-8 min-h-screen">
    <div className="w-8 h-8 border-4 border-iefe border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;