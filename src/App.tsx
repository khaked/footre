
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Creativite from './pages/Creativite';
import MesCreations from './pages/MesCreations';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/creativite" element={<Creativite />} />
            <Route path="/mes-creations" element={<MesCreations />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;