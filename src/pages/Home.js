import regulations from '../assets/regulationsAndGuidelines.json';
import Article from '../components/Article';

function Home()  {
  return (
    <div id="home">
      <div className="container">
        <table className="table" style={{width: '100%'}}>
          <tbody>
            {regulations.labels.map((label) => (
              <tr key={label.type}>
                <td>{label.type}</td><td>{label.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className='title'><a className="anchor" id="contents" href="./#contents">Contents</a></h2>

        <ul>
          {regulations.articles.map((article) => (
            <li key={article.id}>
              Article {article.id}: <a href={`#article-${article.id}-${article.name}`}>{article.description.split(': ')[1]}</a>
            </li>
          ))}
        </ul>

        <hr />

        {regulations.articles.map((article) =>
          <Article key={article.id} article={article} />
        )}
      </div>
    </div>
  );
}

export default Home;