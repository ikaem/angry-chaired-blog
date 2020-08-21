---
title: 'GraphQL & React & JWT: Authentication & GQL Types and Queries'
date: 2020-08-16 15:44:30
tags: 
- jwt
- graphql
- react
categories: graphql & react & jwt
cover: giorgio-trovato-iP4Ju2-4paQ-unsplash.jpg

creditArtist: Giorgio Trovato
creditSource: https://unsplash.com/@giorgiotrovato?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 1 of 12 in GraphQL & React & JWT

This project is a continuation of the [Graphql & React & Psql series](categories/graphql-react-psql/), where we used GraphQL to get and manipulate data in PSQL database.
The idea in this part is to create functionality to log users into their account with a piece of data called JSON Web Token (JWT). This token is created on backend, and sent to and stored on frontend. It is then used for user authentication anytime the user requests protected data. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 1. Create types and mutations

The JWT has an expiration period, usually of some 10 minutes, after which it becomes invaild. To prevent user having to sign in every 10 minutes, the server also creates a refresh token at the same time when the access token is created. This refresh token has a longer expiration period, usually a week or so. It is stored into the browser's http-only cookie, as well as in the user's database account. Once the access token expiration period is reached, a request for creation of new access token is automatically sent to the server. It includes the refresh token which, when successfully verified against the database copy, allows for creation of a new pair of tokens - new access token and new refresh token. Access token is again stored into the browser's memory, and the refresh one is stored into the cookie.

If the user logs out, access token is deleted from the memory of the browser, and the refresh token is deleted from the cookie and from the database account of the user.

If the user doesn't logout, but just navigates away from the page, refresh cookie is not deleted. The access token expires when it reaches its expiration date, and the refresh token stays both in the cookie and in the database, until the cookie itself reaches its own expiration date. If the user returns to the page within this expiration data, they are automatically logged back in based on the refresh token. If they return later than that, they are redirected to the login page.

In addition to this, we also want to disable access to edit and add profiles to users that are not logged in. We do this by creating a higher order component that renders these pages only if the user is actually logged in.

We will start with backend, by creating and testing types, queries and resolvers for login, register, refresh access token and logout. Then, we will move to the frontend and make use of the created resolvers. We will also set up the Apollo Client, to store and retrieve data we need.

First we define types and mutations in the **type-defs.ts** file on backend.

### The **Me** type

This type holds information about logged user, and it will be returned by all mutations that we work with in this project.

We call this type **Me**, and have it return following data:

1. name of the logged user - of String type
2. link to the logged user's avatar - of String type
3. access token - of String type

```js
// type-defs.ts
import { gql } from "apollo-server-express";

export default gql`
    ...
    type Me {
        first_name: String
        avatar_link: String
        access_token: String
    }
    `;
```

### Mutations

We will have 3 mutations that return the **Me** type - login, register, and refreshToken.
In addition to this, we will also have a mutation to log out user. This mutation will only return a boolean, indicating if a user was logged out on the backend, or not.

#### Login mutation

The login mutation accepts two arguments, email and password. Both of these are of **String** type, and both are mandatory.

```js
// type-defs.ts
import { gql } from "apollo-server-express";

export default gql`
    ...

    type Mutation {
    ...
        login(email: String!, password: String!): Me
    ...
    `;
```

#### Register mutation

This one accepts four arguments - first name, last name, email and password. Same as the login one, all of them are mandatory, and all of them are strings.

```js
// type-defs.ts
import { gql } from "apollo-server-express";

export default gql`
    ...

    type Mutation {
    ...
        register(
            first_name: String!, 
            last_name: String!, 
            email: String!
            password: String!
        ): Me
    ...
    `;
```

#### Refresh Access Token mutation

This mutation does not accept any arguments. Instead, we will later set up its resolver to try to get data from a cookie. Because of this approach, the mutation is very simple.

```js
// type-defs.ts
import { gql } from "apollo-server-express";

export default gql`
    ...

    type Mutation {
    ...
        refreshAccessToken: Me
    ...
    `;
```

#### Logout mutation

Finally, the logout mutation is similar to the previous one in that it doesn't accept any arguments. It's resolver, however, will get data it needs - access token, via the request header that is normally sent with every request. 

Here is the simple logout mutation:

```js
// type-defs.ts
import { gql } from "apollo-server-express";

export default gql`
    ...

    type Mutation {
    ...
        logout: Boolean
    ...
    `;
`

#### Refresh Access Token mutation

This mutation does not accept any arguments. Instead, we will later set up its resolver to try to get data from a cookie. Because of this approach, the mutation is very simple.

```js
// type-defs.ts
import { gql } from "apollo-server-express";

export default gql`
    ...

    type Mutation {
    ...
        refreshAccessToken: Me
    ...
    `;
```

#### Logout mutation

Finally, the logout mutation is similar to the previous one in that it doesn't accept any arguments. It's resolver, however, will get data it needs - access token, via the request header that is normally sent with every request. 

Here is the simple logout mutation:

```js
// type-defs.ts
import { gql } from "apollo-server-express";

export default gql`
    ...

    type Mutation {
    ...
        logout: Boolean
    ...
    `;
```

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

1. **Create types and mutations**
2. Create functions to generate JSON Web Tokens
3. Create resolvers
4. Create middleware to check if tokens are valid
5. Set up Apollo Express be able to deal with tokens and cookies
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