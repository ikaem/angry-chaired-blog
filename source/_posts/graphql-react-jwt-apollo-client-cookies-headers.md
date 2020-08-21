---
title: 'GraphQL & React & JWT: Apollo Client & Cookies & Headers'
date: 2020-08-16 20:12:07
tags:
- frontend
- apollo
- cookies
- jwt
categories: graphql & react & jwt
cover: ahmad-AT22-uV7rQs-unsplash.jpg

creditArtist: Ahmad
creditSource: https://unsplash.com/@ahmadr1?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 7 of 12 in GraphQL & React & JWT

We have setup our backend in such way that a middleware, **express-jwt**, intercepts all our requests and checks if they come with valid access token attached to their headers. 
Similarly, we used another middleware, **cookie-parser**, that also checks all requests for cookies, and populates the **cookies** property on the request object with existing cookies.
Because of such setup, our resolvers are able to perform user authentication.
At the moment, we dont' have access token attached to our headers, nor do we include any cookies with our requests. So let's change that.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 7. Set up Apollo Client so we can work with cookies and headers

We need to:
 
1. Work with headers
2. Work with cookies

### Work with headers

Firt, let's make sure each of our requests actually comes equipped with access token in its headers. 
What we want is to have our client checks for access token in our cache, and then adds that access token to every request going to the backend. We already have a place reserved for our token - it is a part of the cache we initialized in our **appollo-client.ts**.

To make sure our requests have a header holding access token, we will use the **setContext** method that is part of the **@apollo/client** package we already have installed in our app.

```js
    // apollo-client.ts
    import { setContext } from "@apollo/client/link/context";
```

With this method we can set context of a request, meaning that we can set headers on them. 
The method itself takes an argument which is a function. This function is passed two arguments - the current GQL request itself, and an object holding the previous context up to this point. 
At the moment we are not interested in the **request** argument. Instead, we only care about the **headers** property of the second argument, the previous context.

Inside the body of the argument function we will query the Apollo Client cache for the access token, and then attach that value to an **authorization** variable, as a part of a string. 
Then we will return that variable from the argument function as a part of **headers** object, together with other properties spread from the previous context's headers.
Finally, we assign the return of the **setContext** method to the **authLink** constant (or any other constant name we want).

```js
    // apollo-client.ts
    ...
    const authLink = setContext((_, { headers }) => {
        const {
            login: { access_token },
        } = client.readQuery({
                query: gql`
                    query Login {
                        login {
                        access_token
                        }
                    }
                `,
        }) as {
            login: {
                access_token: string;
            };
        };

        return {
            headers: {
                ...headers,
                authorization: access_token ? `Bearer ${access_token}` : "",
            },
        };
    });
```

With this, we have created a variable that holds our request headers. One of those, the **authorization** one, holds a value of access token - it is a part of a string value assigned to the header, together with the **Bearer** substring. 
It is a common practice to do that, and our **express-jwt** middleware will be looking for this pattern when validating the token on backend.

Still, the variable itself doesn't make our new neaders reach backend. We have to include them into our Apollo Client instance. 

In the last series we have created our link to the server with the Apollo's **createHttpLink** method, by passing it an object with an **uri** property:

```js
    // apollo-client.ts
    const httpLink = createHttpLink({
        uri: gqlEndpoint
    });

    const cache = new InMemoryCache();

    const client = new ApolloClient({
        cache,
        link: httpLink,
    });
```

To have our new haders included in each request, we concatenate the **authLink** variable with the existing link to our **Apollo Server Express** backend.

```js
    // apollo-client.ts
    ...
    const client = new ApolloClient({
        cache,
        link: authLink.concat(httpLink),
    });
    ...
```

That's it. Easy.

### Work with cookies

To have our cookies be sent to backend with each request, we just add **credentials** property to the options object passed to the **createHttpLink** method, and give it a value of **"include**.

```js
    // apollo-client.ts
    const httpLink = createHttpLink({
        uri: gqlEndpoint,
        credentials: "include",
    });

    const cache = new InMemoryCache();

    const client = new ApolloClient({
        cache,
        link: authLink.concat(httpLink)
    });
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

1. Create types and queries
2. Create functions to generate JSON Web Tokens
3. Create middleware to check if tokens are valid
4. Set up Apollo Express be able to deal with tokens and cookies
5. Create resolvers
6. Set up Apollo Client cache
7. **Set up Apollo Client so we can work with cookies and headers**
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
