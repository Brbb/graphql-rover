![GraphQL Rover](./img/logo.png)

# graphql-rover
A [GraphQL](http://graphql.org/) schema viewer.

**Rover** generates a navigable representation of the underlying schema through the [introspection](http://graphql.org/learn/introspection/) query, displaying nodes as [Vue.js](https://vuejs.org/) components using [D3.js](https://d3js.org/) to build the graph.

## Quick start
Description + video

1. Setup the endpoint
2. Re-arrange nodes

![drag](https://user-images.githubusercontent.com/2746209/29013947-5ca3eb48-7b6c-11e7-9c5c-499b3d7a071d.gif)

3. Select to zoom and inspect a type or use the search bar

![search](https://user-images.githubusercontent.com/2746209/29013948-5d0d0a10-7b6c-11e7-92e2-6ae26965b424.gif)


## Run
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
- [x] Interface / Enumerable / Types easy identification
- [x] Relationships edges with UML-like semantic
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



