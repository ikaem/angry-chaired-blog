---
title: 'GraphQL & React & JWT: Apollo Server, Cors, JWT & Cookies'
date: 2020-08-16 17:37:58
tags: 
- cookies
- jwt
- cors
- apollo 
- server
- express
categories: graphql & react & jwt
cover: kuan-fang-WaQ5xQq2E6g-unsplash.jpg

creditArtist: Kuan Fang
creditSource: https://unsplash.com/@fangkuan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 4 of 12 in GraphQL & React & JWT

Now when we have made sure that our requests are inspected for access token for validity on their arrival to the backend, we want to make sure that our resolvers can actually work with both requests and responses. Mainly, we want to be able to have them deal with cookies and set tokens on responses. 
In addition to this, we want to make sure our server is actually allowed to read and set cookies on clients that access backend resources.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 4. Set up Cors and Apollo Express be able to deal with tokens and cookies

Here is what we will do: 

1. We will install a package that will help us work with cookies
2. We will tweak our CORS package to specify how our frontend and backend should communicate
3. We will also tweak our Apollo Server Express instance to setup both its context and CORS further

### Install cookie-parser to work with cookies

Cookie Parser is an npm package that intercepts requests coming to the backend, and populates a **cookies** object on the **request** object with cookies that exist on the request. 

It is a middleware, similar to the one we used to inspect headers for access token. 

We install it with: 

```bash
    npm intall cookie-parser
```

Again, we also install TS types for this pacakge:

```bash
    npm i -D @types/cookie-parser
```

Once we have it installed, we just have to import the package into our **server.ts** file, and use it as a middleware:

```js
    // server.ts
    import cookieParser from "cookie-parser";
    ...
    app.use(cookieParser());
    ...
```

### Tweak CORS in our app

I am not really familiar with CORS. I know it stands for **Cross Origin Resource Sharing**, and that it has to do with allowing an application running on one origin to have access to resources on a different origin. 
Origin, too, is a vague concept to me, but from what I understand, is a combination of web protocol (http, for instance), domain (google.com) and port (:3000). 

In our case, with CORS we define which origins (there where our app runs) can access our server, running on some origin. 
Currently, our frontend runs on **http://localhost:3000**, while the backend runs on **http://localhost:4000**. 
Since ports of our two ends are different, they do not have the same origin.
So much for that.

We have already used the **cors** package in our last series.
Now, we want to enable our backend to read cookies, and cookies coming from our front end.
To do this, we will pass an object to the **cors** middleware, and have that object hold 2 properties:

- origin
- credentials

**Origin** will specify which origins we want want to access our backend. In our case, we will put the origin of our frontend

**Credentials** controls use of HTTP cookies, which we need for our refresh tokens. We will set this to **true**

Here is the implementation of the middleware:

```js
    // server.ts
    import cors from "cors";
    ...
    app.use(
        cors({
            origin: ["http://localhost:3000"],
            credentials: true,
        })
    );
    ...
```

### Tweak Apollo Server Express instance 

Our resolvers will eventually have to read HTTP requests to work with that **user** property that houses access token payload. They will also need to set a cookie to hold our refresh tokens, and for this they will need access to the **response** object. 

First, however, lets deal with an odd issue that I found out about by chance. It turns our that the Apollo Express Server has its own cors implementation. With both our own **cors**, and the Apollo one enabled, we need to disable one to prevent any conflicts. 
Of course, we will disable the Apollo one.

It is pretty simple - we do it by including a **cors** property in the object passed to the **applyMiddleware** method on our instance of the Apollo Express Server. Long sentence. We set the property value to **false**.

```js
    // server.ts
    server.applyMiddleware({ app, path: "/grapqhl", cors: false });
```

Now, regarding those HTTP request and response objects which our resolvers need. Obviously, we will provide them via the **context** object which we set up in our instance of Apollo Express Server. 
The object passed to the context method is automatically passed **request** and **response** arguments, and we can return them from the method to make them available for resolvers.

```js
    // server.ts
    ...
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }: { req: express.Request; res: express.Response }) => {
            return {
                pgPool,
                req,
                res,
            };
        },
    });
```

This should be it. Our resolvers now have access to cookies and headers, and we can finally define resolvers to be able to authenticate users.

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at 

[Github](https://github.com/ikaem/graphql-jwt-react.git) 

### Goals

1. Create an app that uses GraphQL and JWT to log in and log out users
2. Use PSQL for database
3. Use Typescript on both ends
4. Use Apollo Client Cache features to store JWT and user info on front end
5. Implement protected routes, so that only logged users can access certain pages

### Steps

1. Create types and queries
2. Create functions to generate JSON Web Tokens
3. Set up middleware to check if tokens are valid
4. **Set up Cors and Apollo Express be able to deal with tokens and cookies**
5. Create resolvers
6. Set up Apollo Client so we can work with cookies and headers
7. Set up Apollo Client cache
8. Create login functionality
9. Create logout functionality
10. Create functionality to automatically log in user if they return to our app
11. Enable silent refresh of access token when it reaches its expiry period
12. Create register functionality

### Tech and Tools

1. React
2. Node
3. PSQL
4. GraphQL
5. Apollo Server Express
6. Apollo Client
7. Bcrypt
8. TypeScript
9. Express
10. JWT

### Experience with Tech & Tools

This project is a continuation of the [Graphql & React & Psql series](categories/graphql-react-psql/). There, I worked with TS, PSQL and GQL, so I'm ok with that, I guess.
I have done some JWT things before, and here I wanted to try it with GQL.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
