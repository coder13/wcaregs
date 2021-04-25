function Article({ article }) {
  return (
    <div className="article" key={article.id}>
      <span className="anchor" id={article.id} />
      <span className="anchor" id={article.name2} />
      <span className="anchor" id={`article-${article.id}-${article.name}`}/>
      <h2 className="title article-title">
        <a href={`article-${article.id}-${article.name}`}>Article {article.id}</a>: {article.description.split(': ')[1]}
      </h2>

      <ul>
        {article.regulations.map((regulation) => (
          <div key={regulation.id} className={'indent-' + regulation.level}>
            {regulation.description && (
              <li className='regulation' id={regulation.id}>
                <span className="anchor" id={regulation.id}/>
                <div>
                  <a className="anchor" href={regulation.id}>{regulation.id}</a>{') '}
                  {regulation.description.map((desc) => (
                    <>
                      {desc.href && <a href={`#${desc.href.split(':')[2]}`}>{desc.content}</a>}
                      <span v-else>{desc.content}</span>
                    </>
                  ))}
                </div>
              </li>
            )}

            {regulation.guidelines.map((guideline) => (
              <li key={guideline.id} className='guideline' id={regulation.id + guideline.pluses}>
                <span className="anchor" id={regulation.id + guideline.pluses}/>
                <div>
                  <a href={(guideline.id + guideline.pluses)}>{guideline.id + guideline.pluses}</a>{') '}
                  <span className="tag">{guideline.label}</span>{' '}
                  {guideline.description.map((desc) => (
                    <>
                      {desc.href && <a href={`#${desc.href.split(':')[2]}`}>{desc.content}</a>}
                      <span v-else>{desc.content}</span>
                    </>
                  ))}  
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
