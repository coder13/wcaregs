import { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Icon } from "react-bulma-components";
import { RegulationsContext } from "../providers/RegulationsProvider/RegulationsProvider";

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { version, releases } = useContext(RegulationsContext);

  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(history);
    navigate(`/search?q=${query}`);
  };

  return (
    <nav className="navbar is-flex" role="navigation">
      <div className="navbar-brand is-inline-flex">
        <Dropdown
          closeOnSelect={true}
          color=""
          icon={
            <Icon>
              <i aria-hidden="true" className="fas fa-angle-down" />
            </Icon>
          }
          value={version}
          hoverable
          className="navbar-item"
        >
          {releases.map((release) => {
            const name = release.name?.split(/[—-]/)[1];
            return (
              <Dropdown.Item key={release.id} value={release.tag_name}>
                <Link to={`/?version=${release.tag_name}`}>
                  <p className="is-small">{name}</p>
                </Link>
              </Dropdown.Item>
            );
          })}
        </Dropdown>
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
