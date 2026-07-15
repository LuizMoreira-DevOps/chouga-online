import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Contato from "./pages/Contato";
import EmBreve from "./pages/EmBreve";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Sobre from "./pages/Sobre";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";

const productsPage = {
  path: "/produtos",
  groupSlug: "produtos",
  categoryGroups: [
    "camisetas",
    "cropped",
    "blusas",
  ],
  pageClass: "camisetas",
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

      <Route
        path="/produtos/:slug"
        element={<ProdutoDetalhes />}
      />

      <Route
        path="/camisetas"
        element={
          <Navigate
            to="/produtos?categoria=camisetas"
            replace
          />
        }
      />

      <Route
        path="/blusas"
        element={
          <Navigate
            to="/produtos?categoria=blusas"
            replace
          />
        }
      />

      <Route path="/sobre" element={<Sobre />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/em-breve" element={<EmBreve />} />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;