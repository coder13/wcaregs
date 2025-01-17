/* takes both regulations and guidelins and combins them into one single json */

import markdownItAST from "markdown-it-ast";
import markdownIt from "markdown-it";

type Description = {
  content: string;
  href?: string;
};

type Guideline = {
  id: string;
  level: number;
  pluses: string;
  label: string;
  description: Description[];
};

type Regulation = {
  id: string;
  level: number;
  description: Description[];
  guidelines: Guideline[];
};

type Article = {
  id: string;
  name: string;
  name2: string;
  description: string;
  regulations: Regulation[];
};

type Label = {
  type: string;
  description: string;
};

export interface RegsAndGuidelines {
  version: string;
  labels: Label[];
  articles: Article[];
}

const md = markdownIt({ html: true });

const sortAlphaNum = (a, b) => a.localeCompare(b, "en", { numeric: true });

const regexes = {
  article: /article-(\w+)/,
  label: /\[(\w+)\]\s(.+)/,
  guideline: /(\w+)(\++)\)\s\[(\w+)\]\s(.+)/,
  regulation: /(\w+)\)\s(.+)/,
};

const getArticle = (regulationId) =>
  regulationId.match(/(1[012]|[1-9]|[A-Z])\w+/)
    ? regulationId.match(/(1[012]|[1-9]|[A-Z])\w+/)[1]
    : null;

const parseDescription = (description, inlineToken) => {
  const desc: Description[] = [
    {
      content: description,
    },
  ];

  for (let i = 1; i < inlineToken.children.length; ) {
    const child = inlineToken.children[i];
    if (child.type === "text") {
      desc.push({
        content: child.content,
      });
      i++;
    } else if (child.type === "link_open") {
      desc.push({
        href: child.attrs[0][1],
        content: inlineToken.children[i + 1].content,
      });
      // TODO: figure out how we want to link regulations;
      i += 3;
    }
  }

  return desc;
};

const findArticle = (articles, article) =>
  articles.find((a) => a.id.slice(0, article.length) === article);

const rules = {
  heading(state, token) {
    const inline = token.children[0];
    if (inline.content[0] !== "<")
      // Probably not worth looking at
      return;

    const trimmed = inline.children.map((i) =>
      i.content.replace("<", "").replace(">", "")
    );

    const article = regexes.article.exec(trimmed[0]);

    // looking at an article and hasn't been added yet
    if (article && !findArticle(state.articles, article[1])) {
      state.articles.push({
        id: article[1],
        name: trimmed[1],
        name2: trimmed[2],
        description: trimmed[3],
        regulations: [],
      });
    }
  },

  // form of text -> inline -> paragraph -> listitem
  html_inline(state, token) {
    if (token.content === "<version>") {
      state.version = token.parent.children[1].content.replace("Version: ", "");
    } else if (token.content === "<label>") {
      const label = regexes.label.exec(token.parent.content);
      if (label) {
        state.labels.push({
          type: label[1],
          description: label[2],
        });
      }
    }
  },

  // look for text nodes inside a list item node that isn't a label
  list_item(state, token) {
    const inline = token.children[0].children[0];
    if (inline.children[0].content !== "<label>") {
      // regulation / guideline
      const textToken = inline.children[0];
      const guideline = regexes.guideline.exec(textToken.content);
      if (guideline !== null) {
        const article = findArticle(state.articles, getArticle(guideline[1]));
        const regulation = article.regulations.find(
          (r) => r.id === guideline[1]
        );
        if (regulation) {
          // Not all guidelines attach to regulations
          regulation.guidelines.push({
            id: guideline[1],
            level: guideline[1].length - 1,
            pluses: guideline[2],
            label: guideline[3],
            description: parseDescription(guideline[4], inline),
          });
        } else {
          // create a dummy regulation with no description and just the guideline
          article.regulations.push({
            id: guideline[1],
            level: guideline[1].length - 1,
            guidelines: [
              {
                id: guideline[1],
                level: guideline[1].length - 1,
                pluses: guideline[2],
                label: guideline[3],
                description: parseDescription(guideline[4], inline),
              },
            ],
          });
        }
      } else {
        // looks like it's a regulation
        const regulation = regexes.regulation.exec(textToken.content);
        if (regulation) {
          const article = findArticle(
            state.articles,
            getArticle(regulation[1])
          );
          if (article) {
            article.regulations.push({
              id: regulation[1],
              level: regulation[1].length - 1,
              description: parseDescription(regulation[2], inline),
              guidelines: [],
            });
          }
        }
      }
    }
  },
};

const traverse = (state, token) => {
  if (!token.type) {
    token.type = token.nodeType;
  }

  if (rules[token.type]) {
    rules[token.type](state, token);
  }

  if (token.children) {
    token.children.forEach((child) => {
      child.parent = token;
      traverse(state, child);
    });
  }
};

export const buildRegsAndGuidelines = (
  regulations: string,
  guidelines: string
): RegsAndGuidelines => {
  const state: RegsAndGuidelines = {
    version: "",
    labels: [],
    articles: [],
  };

  markdownItAST
    .makeAST(md.parse(regulations, {}))
    .forEach((child) => traverse(state, child));

  markdownItAST
    .makeAST(md.parse(guidelines, {}))
    .forEach((child) => traverse(state, child));

  state.articles.sort((a, b) => sortAlphaNum(a.id, b.id));

  return state;
};
