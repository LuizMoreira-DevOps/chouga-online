import PageBackground from "./PageBackground";

function PageShell({ children, className = "" }) {
  const classes = `${className} page-bg`.trim();

  return (
    <main className={classes}>
      <PageBackground />
      {children}
    </main>
  );
}

export default PageShell;
