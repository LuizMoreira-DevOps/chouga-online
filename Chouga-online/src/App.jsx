import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/css/App.css";
import Home from "./pages/Home";
import Camisetas from "./pages/Camisetas";
import Shapes from "./pages/Shapes";
import Sobre from "./pages/Sobre";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camisetas" element={<Camisetas />} />
        <Route path="/shapes" element={<Shapes />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;