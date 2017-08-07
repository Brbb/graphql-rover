![GraphQL Rover](./img/logo.png)

# graphql-rover
A [GraphQL](http://graphql.org/) + [Vue.js](https://vuejs.org/) schema viewer. **Rover** generates a navigable representation of the underlying schema through the [introspection](http://graphql.org/learn/introspection/) query.

## Quick start

### Option 1:
`git clone` the [repo](https://github.com/Brbb/graphql-rover.git) anywhere, run locally `path-to-graphql-rover/graphql-rover/index.html` and follow the quickstart steps. There's no need to keep Rover in the same path of your database, or on a server.

### Option 2:
Download the Electron App and follow the quickstart steps.

## Features
- [x] Drag nodes
- [x] Pan & Zoom
- [x] Zoom on selection
- [x] Type Documentation
- [x] Type & field search
- [x] Configure GraphQL endpoint
- [ ] Offline schema (paste introspection result + libraries included)
- [ ] Electron app
- [ ] Docker container

## Tech Stack

GraphQL
Vue + Vuex + Vue Elements (Nodes, storage, event management)
JQuery
Bootstrap
D3 + Dagre (graph theory and visualization)

Note: no Graphviz or non-pure libraries

## Electron



