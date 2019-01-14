/* takes both regulations and guidelins and combins them into one single json */

const fs = require('fs');
const path = require('path');
const almphanumbericCompare = require('alphanumeric-sort').compare;
const markdownItAST = require('markdown-it-ast')
const markdownIt = require('markdown-it')({
  html: true
});

const regexes = {
  article: /article\-(\w+)/,
  label: /\[(\w+)\]\s(.+)/,
  guideline: /(\w+)(\++)\)\s\[(\w+)\]\s(.+)/,
  regulation: /(\w+)\)\s(.+)/,
}

const getArticle = (regulationId) => regulationId.match(/(1[012]|[1-9]|[A-Z])\w+/) ? regulationId.match(/(1[012]|[1-9]|[A-Z])\w+/)[1] : null

function parseDescription(description, inlineToken) {
  let desc = [{
    content: description
  }];

  for (let i = 1; i < inlineToken.children.length;) {
    let child = inlineToken.children[i];
    if (child.type === 'text') {
      desc.push({
        content: child.content
      });
      i++;
    } else if (child.type === 'link_open') {
      console.log(child)
      desc.push({
        href: child.attrs[0][1],
        content: inlineToken.children[i+1].content
      });
      // TODO: figure out how we want to link regulations;
      i += 3;
    }
  }

  return desc;
}

function findArticle(articles, article) {
  return articles.find(a => a.id.slice(0, article.length) === article);
}

let rules = {
  heading (state, token, level) {
    let inline = token.children[0];
    if (inline.content[0] !== '<') // Probably not worth looking at
      return;

    let trimmed = inline.children.map(i => i.content.replace('<', '').replace('>', ''))

    let article = regexes.article.exec(trimmed[0]);

    // looking at an article and hasn't been added yet
    if (article && !findArticle(state.articles, article[1])) {
      state.articles.push({
        id: article[1],
        name: trimmed[1],
        name2: trimmed[2],
        description: trimmed[3],
        regulations: []
      });
    }
  },

  // form of text -> inline -> paragraph -> listitem
  html_inline (state, token, level) {
    if (token.content === '<version>') {
      state.version = token.parent.children[1].content.replace('Version: ', '');
    } else if (token.content === '<label>') {
      let label = regexes.label.exec(token.parent.content);
      state.labels.push({
        type: label[1],
        description: label[2]
      });
    }
  },

  // look for text nodes inside a list item node that isn't a label
  list_item (state, token, level) {
    let inline = token.children[0].children[0];
    if (inline.children[0].content !== '<label>') { // regulation / guideline
      let textToken = inline.children[0];
      let guideline = regexes.guideline.exec(textToken.content);
      if (guideline !== null) {
        let article = findArticle(state.articles, getArticle(guideline[1]));
        let regulation = article.regulations.find(r => r.id === guideline[1]);
        if (regulation) { // Not all guidelines attach to regulations
          regulation.guidelines.push({
            id: guideline[1],
            level: guideline[1].length - 1,
            pluses: guideline[2],
            label: guideline[3],
            description: parseDescription(guideline[4], inline)
          })
        } else { // create a dummy regulation with no description and just the guideline
          article.regulations.push({
            id: guideline[1],
            level: guideline[1].length - 1,
            guidelines: [{
              id: guideline[1],
              level: guideline[1].length - 1,
              pluses: guideline[2],
              label: guideline[3],
              description: parseDescription(guideline[4], inline)
            }]
          });
        }
      } else { // looks like it's a regulation
        let regulation = regexes.regulation.exec(textToken.content);
        let article = findArticle(state.articles, getArticle(regulation[1]));
        if (article) {
          article.regulations.push({
            id: regulation[1],
            level: regulation[1].length - 1,
            description: parseDescription(regulation[2], inline),
            guidelines: []
          })
        }
      }
    }
  }
};

function traverse(state, token, level) {
  if (!token.type) {
    token.type = token.nodeType; // freaking inconsistency
  }

  if (rules[token.type]) {
    rules[token.type](state, token, level);
  }

  if (token.children) {
    token.children.forEach(child => {
      child.parent = token;
      traverse(state, child, level + 1)
    });
  }
}

let regulations = String(fs.readFileSync(path.resolve(__dirname, '../wca-regulations/wca-regulations.md')));
let guidelines = String(fs.readFileSync(path.resolve(__dirname, '../wca-regulations/wca-guidelines.md')));

const state = {
  version: null,
  labels: [],
  articles: [],
};



markdownItAST.makeAST(markdownIt.parse(regulations, {}))
  .forEach(child => traverse(state, child, 0));

markdownItAST.makeAST(markdownIt.parse(guidelines, {}))
  .forEach(child => traverse(state, child, 0));

state.articles.sort((a,b) => almphanumbericCompare(a.id, b.id))

fs.writeFile(path.resolve(__dirname, '../src/assets/regulationsAndGuidelines.json'), JSON.stringify(state), function () {
  console.log('Wrote file to /src/assets/regulationsAndGuidelines.json');
});
