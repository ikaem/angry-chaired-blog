---
title: 'GraphQL & React & PSQL: React & TypeScript Frontend'
date: 2020-08-16 14:50:06
tags: 
- react
- typescript
- frontend
categories: graphql & react & psql
---
<!-- Step Content Start -->

#### Part 6 of 9 in GraphQL & React & PSQL

Frontend is made with React, which I am relatively comfortable with. I don't want to spend too much time on createing components and routine stuff, so I will just breeze through it to get to working with Apollo on frontend.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 6. Make simple frontend with React and TS

Few things I do want to mention here:

### Create a TS React app with create-react-app:

```bash
    npx create-react-app appname --typescript
    npm install typescript
```

Also, make sure to have TS installed globally on my system too.

```bash
    npm install -g typescript
```

This will have the React app development environment be completely setup for Typescript. 

- index.js and App.js are now index.tsx and App.tsx, as well as all other .js files.
- .tsx becomes required extension for a React component, unlike regular .js component used in case of JS setup
- tsconfig.json file is created automatically. I am not going into it, since I am not confident that I know what is going on in there, except for that fact that everything worked outside of the box.

### Installed important dependencies at this point

```bash
    npm install react-router-dom styled-components
```

As I am using TS, types for these also need to be installed

```bash
    npm install @types/react-router-dom @types/styled-components
```

###  App organization

React components are separated into

Pages:

- Home page, 
- profile page, 
- add profile, 
- and edit profile

Containers:

- There is only one component here, the one that maps over a list of users and then renders a each user to be shown on the list on the home page. There is some logic in this component, so I included it in the containers.

Components:

- Components include form for adding and editing user, header, footer, layout, controls for pages change and so on.

Elements:

- These are titles of sections, and profile avatar

I like to have simple components that render small pieces of view categorized as elements. I use elements mostly for styling repeating parts of pages

<!-- End Step Content -->
<!-- Project Information -->

## Project Information

### Available at 

[Github](https://github.com/ikaem/graphql-jwt-react.git) 

### Goals

1. Create an app that uses GrapqhQL on frontend and backend
2. Use PSQL for database
3. Use Typescript on both ends
4. The app should be hold a list of users that can be created, viewed, edited, and deleted.

### Steps

1. Make simple Node and Express server with TypeScript
2. Create a PostgreSQL database and tables that hold user info
3. Use node-postgres to connect backend to database
4. Set up Apollo Express Server
5. Create GQL types, queries and resolvers on backend
6. **Make simple frontend with React and TS**
7. Set Apollo Client on frontend
8. Establish frontend and backend communication via Apollo Client
9.  Create pagination

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