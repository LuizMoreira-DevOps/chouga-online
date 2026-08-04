import { Route, Routes } from "react-router-dom";

import Contato from "./pages/Contato";
import EmBreve from "./pages/EmBreve";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Sobre from "./pages/Sobre";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";
import NotFound from "./pages/NotFound";

const productsPage = {
  path: "/produtos",
  categoryGroups: ["camisetas", "cropped", "blusas"],
  title: "Produtos",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path={productsPage.path}
        element={<Produtos {...productsPage} />}
      />

      <Route path="/produtos/:slug" element={<ProdutoDetalhes />} />

      <Route path="/sobre" element={<Sobre />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/em-breve" element={<EmBreve />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
