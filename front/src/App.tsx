import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PhpApiPage from './pages/PhpApiPage';
import NodeApiPage from './pages/NodeApiPage';
import PythonApiPage from './pages/PythonApiPage';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<PhpApiPage />} />
          <Route path="/php" element={<PhpApiPage />} />
          <Route path="/node" element={<NodeApiPage />} />
          <Route path="/python" element={<PythonApiPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
