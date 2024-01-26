import "../styles/Header.css";

export default function TemplateDemo() {
  return (
    <div className="header flex flex-col" id="header">
      <div className="container flex">
        <div className="header-content">
          <h2 className="text-uppercase text-white op-07 fw-6 ls-2">
            Web Shop
          </h2>
          <h1 className="text-white fw-6 header-title">
            Welcome to this
            <span className="text-brown"> shop experience </span>
            in the web
          </h1>
          <div className="btn-groups flex">
            <a href="/auth/login" className="aLog">
              <div>Login</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
