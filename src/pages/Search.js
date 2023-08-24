import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import flatten from 'lodash.flatten'
import {compare as almphanumbericCompare} from 'alphanumeric-sort'
import Fuse from 'fuse.js'
import REGULATIONS from '../assets/regulationsAndGuidelines.json';

const options = {
  threshold: 0.20,
  includeMatches: true,
  distance: 1000,
  includeScore: true,
  minMatchCharLength: 1,
  findAllMatches: true,
  keys: [{
    name: 'id',
    weight: 0.25
  }, {
    name: 'description',
    weight: 1
  }]
};

// https://github.com/brunocechet/Fuse.js-with-highlight/blob/master/index.js
const highlight = function (resultItem) {
  return resultItem.matches.map((matchItem) => {
    let text = resultItem.item[matchItem.key]
    if (matchItem.key === 'id') {
      return resultItem
    }

    let result = []
    let matches = [].concat(matchItem.indices).filter(i => (i[1] - i[0]) > 3)
    let pair = matches.shift()

    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i)
      if (pair && i === pair[0]) {
        result.push('<span class="highlight">')
      }

      result.push(char)

      if (pair && i === pair[1]) {
        result.push('</span>')
        pair = matches.shift()
      }
    }

    resultItem.highlight = result.join('')

    if (resultItem.children && resultItem.children.length > 0) {
      resultItem.children = resultItem.children.map((child) => highlight(child))
    }

    return resultItem
  })
};

const flatRegulations = flatten(REGULATIONS.articles.map(a => {
  let article = { type: 'regulation', id: a.id, name: a.name, name2: a.name2, description: a.description }

  return flatten(a.regulations.map(r => [{
    article,
    id: r.id,
    level: r.level,
    description: r.description ? r.description.map(i => i.content).join('') : ''
  }].concat(r.guidelines.map(g => ({
    article,
    type: 'guideline',
    label: g.label,
    id: g.id + g.pluses,
    level: g.level,
    description: g.description ? g.description.map(i => i.content).join('') : ''
  })))
  ))
}));

let fuse = new Fuse(flatRegulations, options)

const useQuery = () => new URLSearchParams(useLocation().search);

function Search() {
  const history = useHistory();
  const query = useQuery();
  console.log(query.get('q'));

  let regulationsToShow = fuse.search(query.get('q')).map(i => highlight(i)[0])
  regulationsToShow = regulationsToShow.sort((a, b) => {
    return almphanumbericCompare(a.item.id, b.item.id)
  });

  useEffect(() => {
    if (query.get('q') === '') {
      history.push('/');
    }
  })

  return (
    <div>
      <div className="container">
        <ul>
          {regulationsToShow.map((regulation) => (
            <li key={regulation.item.id}>
              <span className="anchor" id={regulation.item.id}/>
              <a href={'/#' + regulation.item.id}>{regulation.item.id}</a>{') '}
              {regulation.item.label && <span className="tag">{regulation.item.label}</span>}
              <span dangerouslySetInnerHTML={{__html: regulation.highlight || regulation.item.description}} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Search;