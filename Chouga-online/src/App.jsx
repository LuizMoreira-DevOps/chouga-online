import { Route, Routes } from "react-router-dom";

import Contato from "./pages/Contato";
import EmBreve from "./pages/EmBreve";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Sobre from "./pages/Sobre";

const productPages = [
  {
    path: "/camisetas",
    groupSlug: "camisetas",
    pageClass: "camisetas",
    title: "Camisetas",
    assetFolder: "camisetas",
  },
  {
    path: "/blusas",
    groupSlug: "blusas",
    pageClass: "blusas",
    title: "Blusas",
    assetFolder: "blusas",
  },
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {productPages.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<Produtos {...page} />}
        />
      ))}

      <Route path="/sobre" element={<Sobre />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/em-breve" element={<EmBreve />} />
    </Routes>
  );
}

export default App;
