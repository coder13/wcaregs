import { useLocation } from "react-router-dom";
import classNames from "classnames";

function Article({ article }) {
  const location = useLocation();
  const url =
    location.pathname +
    (location.search ? "?" : "") +
    new URLSearchParams(location.search).toString();
  const hash = location.hash.replace("#", "");

  return (
    <div className="article">
      <span className="anchor" id={article.id} />
      <span className="anchor" id={article.name2} />
      <span className="anchor" id={`article-${article.id}-${article.name}`} />
      <h2 className="title article-title">
        <a href={`${url}#article-${article.id}-${article.name}`}>
          Article {article.id}
        </a>
        : {article.description.split(": ")[1]}
      </h2>

      <ul>
        {article.regulations.map((regulation) => (
          <div
            key={regulation.id + regulation.pluses}
            className={"indent-" + regulation.level}
          >
            {regulation.description && (
              <li
                className={classNames("regulation", {
                  highlight: hash === regulation.id,
                })}
                id={regulation.id}
              >
                <span className="anchor" id={regulation.id} />
                <div>
                  <a className="anchor" href={`#` + regulation.id}>
                    {regulation.id}
                  </a>
                  {") "}
                  {regulation.description.map((desc, index) =>
                    desc.href ? (
                      <a
                        key={desc.content + index}
                        href={
                          desc.href.startsWith("http")
                            ? desc.href
                            : `${url}#${desc.href.split(":")[2]}`
                        }
                      >
                        {desc.content}
                      </a>
                    ) : (
                      <span key={desc.content + index}>{desc.content}</span>
                    )
                  )}
                </div>
              </li>
            )}

            {regulation.guidelines.map((guideline) => (
              <li
                key={regulation.id + guideline.pluses}
                className={classNames("guideline", {
                  highlight: hash === regulation.id + guideline.pluses,
                })}
                id={regulation.id + guideline.pluses}
              >
                <span
                  className="anchor"
                  id={regulation.id + guideline.pluses}
                />
                <div>
                  <a href={`${url}#${guideline.id}${guideline.pluses}`}>
                    {guideline.id + guideline.pluses}
                  </a>
                  {") "}
                  <span className="tag">{guideline.label}</span>{" "}
                  {guideline.description.map((desc, index) =>
                    desc.href ? (
                      <a
                        key={desc.content + index}
                        href={
                          desc.href.startsWith("http")
                            ? desc.href
                            : `${url}#${desc.href.split(":")[2]}`
                        }
                      >
                        {desc.content}
                      </a>
                    ) : (
                      <span key={desc.content + index}>{desc.content}</span>
                    )
                  )}
                </div>
              </li>
            ))}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Article;
