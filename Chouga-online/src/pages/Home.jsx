import Layout from "../components/Layout";
import WheelMenu from "../components/WheelMenu";
import "../css/home.css";

function Home() {
  return (
    <Layout>
      <section className="home">
        <div className="home-content">
          <h1>CHOUGA ONLINE</h1>
          <p>Feito nas ruas para as ruas.</p>

          <WheelMenu />
        </div>
      </section>
    </Layout>
  );
}

export default Home;