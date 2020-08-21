---
title: 'GraphQL & React & PSQL: Apollo Client & Frontend'
date: 2020-08-16 14:57:09
tags: 
- frontend
- apollo
- react
categories: graphql & react & psql
---

<!-- Step Content Start -->

#### Part 7 of 9 in GraphQL & React & PSQL

Previously, we have set up Apollo Server on the backend. Now we have to find a way to get backend GraphQL data to the frontend side. 
We will use Apollo Client for this. To be more specific, we will use Apollo Client 3 beta. The client provides tools to send queries and mutations to the backend, as well as to cache received data to keep it in memory, and use it throughout the application - sort of a state management.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 7. Set Apollo Client on frontend

Here is the plan:

1. Install Apollo Client and GrapqhQL
2. Create environmental variables for the frontedn, to be used to access GQL Server
3. Create instance of Apollo Client
4. Create and use Apollo provider component, which will make the Apollo Client instance available to all React components

### Install Apollo Client and GrapqhQL

Easy, this: 

```bash
    npm i @apollo/client grapqhl
```

### Create environmental variables for the frontedn, to be used to access GQL Server

Create-react-app gives us an option to create env variables for frontend. I am not too familiar with what is exactly going on, but here are the basics: 

- Env variables in React apps created with create-react-app need to have shape of "REACT_APP_VARIABLE_NAME", meaning that they start with "REACT_APP".
- We can create .env file in the root directory, where we put our env variables. Ceate-react-app will include those in the production build, once the build is made
- We can also specify which env variables are used in development, and which in production, by creating **.env.development** and **env.production** files in the root folder, and placing corresponding env variables in these files. Create-react-app is will automatically pickup appropriate env variables, depending on the build being executed. 

Ok, so now we create both **env.development** and **env.production**, and put same variables in it, as shown below. 
We will adjust the production variable later, at some point, in the future, maybe. 

```
    REACT_APP_GQL_API = “http://localhost:4000/grapqhl”
```

### Create instance of Apollo Client

Lets create a new filder inside **src** folder, and name it **apollo**. I am not sure if this is a good practice, but it seems a tidy way to go about the thing. 

Inside the folder, create a new file and call it **apollo-client.ts**. Define a varible to use our env variable that we previously defined.

Now, we need to import few things from **"@apollo/client**:

- **ApolloClient**, a class, same as ApolloServer that we used on the backedn. We need to import it into the file where we want the instance, and give it few properties.
- **createHttpLink**, method used to connect to grqphql api on backend. It will be used to provide a value for **link** property inside the ApolloClient class
- **inMemoryCache**, a class used to create gql cache in our front end app

Next, we will created an instance of ApolloClient. ApolloClient accepts an argument, that is an object holding, for now, 2 properties: 

- **cache**, which is an object created from the **inMemoryCache** class
- **link**, holding value of the **createHttpLink** with argument **uri**, which is the endpoint of our GQL server.


```js
    // apollo-client.ts
    import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

    const gqlEndpoint = process.env.REACT_APP_GQL_ENDPOINT;

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: createHttpLink({
            uri: gqlEndpoint
        }),
    });

    export default client;
```

### 4. Create and use ApolloProvider component, which will make the Apollo Client instance available to all React components

ApolloProvider is similar to React's Context Provider, at least according to Apollo's documentation. In short, ApolloProvider puts the created ApolloClient instance into Context, so that other components have access to it. 
Apollo Client provides a ready component called **ApolloProvider** for this purpose. 

Here, we will:

1. Create the provider
2. Wrap the provider around our app

#### Create the provider

I personally like to put ApolloProvider component inside my own component, and then export that one to be used throughout the app. 

Here is what I mean:

I create a new file inside the **apollo** folder, and I call it **apollo-provider.tsx**, and inside I import **ApolloProvider** from "@apollo/client". 
Note that we use .tsx extension, because this is a React component.

```js
    import { ApolloProvider } from "@apollo/client";
    ...
```

Then, I import the client module that we just created with **apollo-client.ts**

```js
    import client from "./apollo-client";
```

Next I create my own React component called **Apollo** ApolloClientProvider, and pass it **children props**. 
Note that I need to type the props, and this can be done in several ways:

- I directly type the **children** prop. This is the one I choose to go with.

```js
    const ApolloClientProvider = ({ children }: { children: React.ReactNode }) => {
```

- I type the component, and TS infers type of props. I think, at least, this is what happens.

```js
    const ApolloClientProvider: React.FC = ({ children }) => {
```

- Or, and I am honestly not sure what is going on here, I think I specify the shape of the argument that the typed component accepts?:

```js
const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
```

Then, I return the actual **ApolloProvider** component, provided by Apollo. I give its **client** prop the value of my own client which I imported into this module.
The Apollo's provider component will render the **children** prop.

```js
    // apollo-provider.tsx
    import React from "react";
    import { ApolloProvider } from "@apollo/client";

    import client from "./apollo-client";

    const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        return (
        <ApolloProvider client={client}>
            { children }
        </ApolloProvider>
        );
    }

    export default ApolloClientProvider;
```

#### Wrap the provider around our app

I choose to place the ApolloClientProvider in the **index.tsx** component, to have it wrap the application. I considered doing it in **App.tsx** as well, but I wanted to keep that component as clean as possible, and render only my own, and React Router components. 

It is quite simple, really. 
The **ApolloClientProvider** is imported into index.tsx, and then used to wrap the **App** component. 

```js
    // index.tsx
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { BrowserRouter as Router } from "react-router-dom";

    import "./index.css";

    import App from './App';
    import ApolloClientProvider from './apollo/apollo-provider';


    ReactDOM.render(
    <React.StrictMode>
        <Router>
        <ApolloClientProvider>
            <App />
        </ApolloClientProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
    );
```

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
6. Make simple frontend with React and TS
7. **Set Apollo Client on frontend**
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
