import Layout from "../components/Layout";
import "../css/sobre.css";

import sobre1 from "../assets/images/sobre-1.png";
import sobre2 from "../assets/images/sobre-2.png";
import sobre3 from "../assets/images/sobre-3.png";

function Sobre() {
  return (
    <Layout>
      <main className="sobre-page">
        <section className="sobre-container">

          <div className="sobre-content">
            {/* <span className="sobre-tag">SOBRE</span> */}

            <h1 className="sobre-title">
              SOBRE
              <br />
              <strong>NÓS</strong>
            </h1>

            <h2 className="sobre-subtitle">
              Nascida do concreto,
              <br />
              feita pra quem vive fora da curva.
            </h2>

            <p>
              A CHOUGA nasceu em 2022 da vontade de criar algo
              real, autêntico e que representasse o corre das ruas.
            </p>

            <p>
              Não é só sobre andar de skate.
              <br />
              É sobre atitude, liberdade e nunca parar de evoluir.
            </p>
          </div>

          <div className="sobre-gallery">
            <img
              src={sobre1}
              alt="Skatista Chouga"
              className="photo photo-1"
            />

            <img
              src={sobre2}
              alt="Skatista pista"
              className="photo photo-2"
            />

            <img
              src={sobre3}
              alt="Equipe Chouga"
              className="photo photo-3"
            />
          </div>

        </section>
      </main>
    </Layout>
  );
}

export default Sobre;