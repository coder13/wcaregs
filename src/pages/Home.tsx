import { useContext } from "react";
import Article from "../components/Article";
import { RegulationsContext } from "../providers/RegulationsProvider/RegulationsProvider";

function Home() {
  const { regulationsAndGuidelines } = useContext(RegulationsContext);

  console.log(8, regulationsAndGuidelines);

  return (
    <section id="home">
      <div className="container">
        <table className="table" style={{ width: "100%" }}>
          <tbody>
            {regulationsAndGuidelines.labels.map((label) => (
              <tr key={label.type}>
                <td>{label.type}</td>
                <td>{label.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="title">
          <a className="anchor" id="contents" href="./#contents">
            Contents
          </a>
        </h2>

        <ul>
          {regulationsAndGuidelines.articles.map((article) => (
            <li key={article.id}>
              Article {article.id}:{" "}
              <a href={`#article-${article.id}-${article.name}`}>
                {article.description.split(": ")[1]}
              </a>
            </li>
          ))}
        </ul>

        <hr />

        {regulationsAndGuidelines.articles.map((article) => (
          <Article key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

export default Home;
