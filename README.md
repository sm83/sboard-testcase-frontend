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

It builds path tree using class instances. Each instance have parent, children. It is built recursively inside class constructor. It uses an "Availability Heuristic" and a "Euclidean Distance Heuristic" to avoid building all paths, it prunes some branches of the tree when it detects that even a partial path is longer than an already found solution.

All canvas class instances built only once. The main canvas instance has a 'reactive bridge' to the related .tsx component, so it can be commonly used in React Layout. This canvas solution goes with hook, which allows to call Feature methods from parent component.

The code of building path is covered with tests using Jest.

Application is built using Next.js.

## Deployment  
- Docker + Nginx on a self-hosted server.  
- Live demo: [https://petrovich-stage-2.ru/](https://petrovich-stage-2.ru/)  

⚠ **Note:** The server is currently running on a backup PSU due to AC failure (Taganrog heatwave). Stability may vary, but it should be ok.  
