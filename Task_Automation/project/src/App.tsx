import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScriptsProvider } from './contexts/ScriptsContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ScriptBuilder from './pages/ScriptBuilder';
import ScriptDetail from './pages/ScriptDetail';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ScriptsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<ScriptBuilder />} />
            <Route path="/edit/:id" element={<ScriptBuilder />} />
            <Route path="/script/:id" element={<ScriptDetail />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ScriptsProvider>
    </Router>
  );
}

export default App;