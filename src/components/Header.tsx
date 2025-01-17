import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Icon } from "react-bulma-components";
import { useRegulations } from "../providers/RegulationsProvider/RegulationsContext";
import { useScrollToLocation } from "../hooks/useScrollToLocation";

export const Header: React.FC = () => {
  useScrollToLocation();

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { version, releases } = useRegulations();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hash = location.hash;

  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newQueryParams = new URLSearchParams(queryParams);
    newQueryParams.set("q", query);
    navigate(`/search?${newQueryParams.toString()}${hash}`);
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

            const newQueryParams = new URLSearchParams(queryParams);
            newQueryParams.set("version", release.tag_name);

            return (
              <Dropdown.Item
                key={release.id}
                value={release.tag_name}
                renderAs={Link}
                to={`${location.pathname}?${newQueryParams.toString()}${hash}`}
              >
                <p className="is-small">{name}</p>
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
