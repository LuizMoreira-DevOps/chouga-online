import bgHome from "../assets/images/optimized/bg-home-1920.webp";
import "../css/PageBackground.css";

function PageBackground() {
  return (
    <div className="page-background" aria-hidden="true">
      <img
        className="page-background-image"
        src={bgHome}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      <div className="page-background-overlay" />
    </div>
  );
}

export default PageBackground;
