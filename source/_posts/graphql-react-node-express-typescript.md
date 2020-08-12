---
title: 'GraphQL & React: Node, Express & Typescript'
date: 2020-08-11 15:36:27
tags: ["react", "graphql", "node", "express", "typescript"]
updated: 
categories: 
- [grapqhl & react]
- [graphql]
- [react]
- [node]
- [express]
- [typescript]

comments: true
photos: 
# - code-styled-comp.jpg
# - atletico.jpg
- morata.jpg

#permalink: my-new-post/index.html
---
#### Part 1 of 10 in [GraphQL & React](/angry-chaired-blog/categories/grapqhl-react/)

<!-- Step Content Start -->

<!-- tag plugin for relative path -->
<!-- {% asset_img featured-image code-styled-comp.jpg '"alt text - this will be shown in index excerpt" "title text the image path here is relative to the post folder"' %} -->

I thought TS setup will be more complicated on the backend side, but it was actually quite simple.
I used the brief and convenient guide by [Traversy Media, titled TypeScript Setup With Node & Express, and got the thing up in minutes.](https://www.youtube.com/watch?v=zRo2tvQpus8)
It seems to me that the key part here is the ts-node package. I am not sure what exactly does, but it did get the TS working.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 1: Make simple Node and Express server with TypeScript

We need to:

1. Initialize package.json
2. Install dev dependencies
3. Install other dependencies
4. Initialize and set up the tsconfig.json file for backend
5. Need to modify scripts in package.json
6. Write normal Express server
   
### Initialize package.json

Install node-pg with:

```bash
    npm init
```

### Install dev dependencies

These will only be used while developing the app, and will not be included in the production build – the one that my users see when they use the app. 
We also need to install TypeScript types for some of the packages used by the server.

```bash
npm -D typescript ts-node nodemon @types/node @types/express @types/cors
```

### Install other dependencies

```bash
npm install express cors
```

### Initialize and set up the tsconfig.json file for backend

```bash
tsc --init
```

This creates tsconfig.json file that controls behavior of Typescript. I hope this sounds correct. It is a large file, with code that is mostly commented out. To be able to easily work with TS, we do need to modify it, however, and uncomment few things. 
Here is the relevant snippet for my setup, copied from the tutorial I mentioned above.

- “outDir” is used to specify directory where TS compiler will store .js code, created from our .ts code
- “rootDir” is used to specify directory where we will be writing .ts code
- “moduleResolution” is explained in the comment below, and I cannot explain it better. 

```js
// ts.config
{
  "compilerOptions": {
    ...
    "outDir": "./dist", /* Redirect output structure to the directory. */
    "rootDir": "./src",  
    ... 
    "moduleResolution": "node", /* Specify module resolution strategy: 'node' (Node.js) or 'classic' */
  }
}
```

### Need to modify scripts in package.json

Just a quick explanation. 
I want to be able to 

- Run a development server
- When development is done, I want to create a production build
- I also want to be able to start a server for production build

We do these things with scripts in package.json file.

Here is the relevant snippet of the file

```js
// package.json
{
  "name": "graphql-jwt-api",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc -p ."
  },
  "keywords": [],
  "author": "",
```

  
1. “dev” is used to specify that nodemon will run server.ts file in src folder.This runs our development server, and the script is activated with command:

```bash
npm run dev
```

2. “build” is used to have TS compiler compile our .ts code from src folder into .js code in dist folder. TS compiler knows which folders to use because we specified them in the previous step with tsconfig.json file. The script is activated with command:

```bash
npm run build
```

3. “start” is used to start a server with the production build on it. It is the build from the dist folder, which means that we have to make that build with “npm run build” prior to running this command.The production server is started with:

```bash
npm start
```

### Write normal Express server

Note that I use import syntaxt instead of require syntax that is normally used with Node.js. This is possible becuase of TS.

```js
// src/server.js
import cors from "cors";
import express from "express";
  
const app = express();
  
app.use(cors());
app.use(express.json());
  
  
app.get("/", async(req, res) => {
    res.json("Hello");
});
  
  
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})
```


<!-- End Step Content -->
<!-- Project Information -->

## Project Information

### Goals

1. Create an app that uses GrapqhQL on frontend and backend
2. Use PSQL for database
3. Use Typescript on both ends
4. The app should be hold a list of users that can be created, viewed, edited, and deleted.

### Steps

1. **Make simple Node and Express server with TypeScript**
2. Create a PostgreSQL database and tables that hold user info
3. Use node-postgres to connect backend to database
4. Set Apollo Express Server
5. Create GQL types, queries and resolvers on backend
6. Pause
7. Make simple frontend with React and TS
8. Set Apollo Client on frontend
9. Establish frontend and backend communication via Apollo Client
10. Create pagination

### Tech and Tools

1. React
2. React Router
3. Styled Components
4. Node
5. PSQL
6. GraphQL
7. Apollo Server Express
8. Apollo Client
9. Bcrypt
10. TypeScript
11. Express

### Experience with Tech & Tools
I am new to Typescript, have super little experience with PSQL and GQL and just a tiny bit more skills with Node and Express.
I am relatively ok with JS, React and other frontend stuff from the list but I am no way even close to be a seasoned frontend person.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.

