import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Camisetas from "./pages/Camisetas";
import Shapes from "./pages/Shapes";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import EmBreve from "./pages/EmBreve";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/camisetas" element={<Camisetas />} />
      <Route path="/shapes" element={<Shapes />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/em-breve" element={<EmBreve />} />
    </Routes>
  );
}

export default App;