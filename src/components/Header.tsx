import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export interface HeaderProps {
  version: string;
}

export const Header: React.FC<HeaderProps> = ({ version }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(history);
    navigate(`/search?q=${query}`);
  };

  return (
    <nav className="navbar is-flex" role="navigation">
      <div className="navbar-brand is-inline-flex">
        <Link
          className="navbar-item"
          style={{ display: "block", lineHeight: "1em" }}
          to="/"
        >
          <h1 style={{ margin: "0px" }}>WCA-Regs</h1>
          <span style={{ fontSize: ".65em" }}>Version: {version}</span>
        </Link>
      </div>
      <div className="navbar-item field is-inline-flex stretch">
        <form className="control stretch" onSubmit={search}>
          <input
            className="input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
    </nav>
  );
};
