import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { RegulationsContext } from "../providers/RegulationsProvider/RegulationsProvider";

const sortAlphaNum = (a: string, b: string) =>
  a.localeCompare(b, "en", { numeric: true });

const options = {
  threshold: 0.2,
  includeMatches: true,
  distance: 1000,
  includeScore: true,
  minMatchCharLength: 1,
  findAllMatches: true,
  keys: [
    {
      name: "id",
      weight: 0.25,
    },
    {
      name: "description",
      weight: 1,
    },
  ],
};

// https://github.com/brunocechet/Fuse.js-with-highlight/blob/master/index.js
const highlight = function (resultItem) {
  return resultItem.matches.map((matchItem) => {
    let text = resultItem.item[matchItem.key];
    if (matchItem.key === "id") {
      return resultItem;
    }

    let result: string[] = [];
    let matches = [].concat(matchItem.indices).filter((i) => i[1] - i[0] > 3);
    let pair = matches.shift();

    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i);
      if (pair && i === pair[0]) {
        result.push('<span class="highlight">');
      }

      result.push(char);

      if (pair && i === pair[1]) {
        result.push("</span>");
        pair = matches.shift();
      }
    }

    resultItem.highlight = result.join("");

    if (resultItem.children && resultItem.children.length > 0) {
      resultItem.children = resultItem.children.map((child) =>
        highlight(child)
      );
    }

    return resultItem;
  });
};

const useQuery = () => new URLSearchParams(useLocation().search);

function Search() {
  const { regulationsAndGuidelines } = useContext(RegulationsContext);

  const flatRegulations = regulationsAndGuidelines.articles.flatMap((a) => {
    let article = {
      type: "regulation",
      id: a.id,
      name: a.name,
      name2: a.name2,
      description: a.description,
    };

    return a.regulations.flatMap((r) =>
      [
        {
          article,
          id: r.id,
          level: r.level,
          description: r.description
            ? r.description.map((i) => i.content).join("")
            : "",
        },
      ].concat(
        r.guidelines.map((g) => ({
          article,
          type: "guideline",
          label: g.label,
          id: g.id + g.pluses,
          level: g.level,
          description: g.description
            ? g.description.map((i) => i.content).join("")
            : "",
        }))
      )
    );
  });

  const fuse = new Fuse(flatRegulations, options);

  const navigate = useNavigate();
  const query = useQuery();

  console.log(query.get("q"));

  const q = query.get("q");

  const regulationsToShow = q ? fuse.search(q).map((i) => highlight(i)[0]) : [];
  const regulationsToShowSorted = regulationsToShow.sort((a, b) => {
    return sortAlphaNum(a.item.id, b.item.id);
  });

  useEffect(() => {
    if (query.get("q") === "") {
      navigate("/");
    }
  });

  return (
    <section>
      <div className="container">
        <ul>
          {regulationsToShowSorted.map((regulation) => (
            <li key={regulation.item.id}>
              <span className="anchor" id={regulation.item.id} />
              <a href={"/#" + regulation.item.id}>{regulation.item.id}</a>
              {") "}
              {regulation.item.label && (
                <span className="tag">{regulation.item.label}</span>
              )}
              <span
                dangerouslySetInnerHTML={{
                  __html: regulation.highlight || regulation.item.description,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Search;
