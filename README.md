# WCA-Regs

WCA-Regs Compiles regulations and guidelines together to render them on the same searchable page.

[![Netlify Status](https://api.netlify.com/api/v1/badges/339d0924-c0bd-4374-99ce-009546873b8d/deploy-status)](https://app.netlify.com/sites/wcaregs/deploys)


## Design

The main focus of this website is converting the regulations and guidelines from markdown to json. This is a script that we run manually and it spits the json into ./src/assets/regulationsAndGuidelines.json. This is so that we can easily programatically render the markdown contents of the git submodule. Regulations only really change 1-2 times a year so this just has to be maintained occasionally.

## Setup

Because this repo includes the wca-regulations as a submodule, we have to clone it differently than normal:

```bash
git clone --recursive git@github.com:coder13/wcaregs.git
```

If you cloned it and forgot to grab the submodule:

```bash
git submodule update --init
```

You then install the node modules:

```bash
yarn install
```

The regulations json will not be included so you must build it to keep with the most up-to-date regs.

```bash
yarn regsAndGuides
```

And then start up the dev server:

```bash
yarn start
```

This project was bootstraped with create-react-app so further help can be found in their [docs](https://facebook.github.io/create-react-app/docs/getting-started).

## Update

Whenever new regulations are released, clone repo, and do `git submodule update --remote`, then commit and push.
