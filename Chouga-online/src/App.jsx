import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Camisetas from "./pages/Camisetas";
import Shapes from "./pages/Shapes";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camisetas" element={<Camisetas />} />
        <Route path="/shapes" element={<Shapes />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;