## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Description

This is a testcase project for sBoard. It produces solution of finding shortest path between two rectangulars.

It builds path tree using class instances. Each instance have parent, childrens. It is build recursively inside class constructor. It uses "Availability Heuristic" and "Euclidean Heuristic" to avoid building all paths, it drops some tree branches as it gets that even partial way is longer than already found solution.

All canvas class instances built only once. Main canvas instance has 'reactive bridge' to canvas related .tsx component, so it can be commonly used in React Layout. This canvas solution goes with hook, which allows to call Feature methods from parent component.

The code of building path is covered with tests using Jest.

Application is built using Next.js.

## Deployment

Deployed with Docker and Nginx with domain on my own server which I can touch directly.

**Warning:** server got AC malfunction and its Power Unit got damaged due to anomaly heat in Taganrog. Now server is working on Perdoon Power Unit. It should be stable, I hope.

Feel free to visit domain with this project deployed:
[www.petrovich-stage-2.ru](https://petrovich-stage-2.ru/)
