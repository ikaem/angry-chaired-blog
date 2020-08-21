---
title: 'GraphQL & React & JWT: Silent Token Refresh'
date: 2020-08-16 21:13:51
tags:
- frontend
- jwt
- authentication
- graphql
- apollo
categories: graphql & react & jwt
cover: jeffrey-f-lin-Oqs5aTNE-tA-unsplash.jpg

creditArtist: Jeffrey F Lin
creditSource: https://unsplash.com/@jeffreyflin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 11 of 12 in GraphQL & React & JWT

<!--more-->

#### See [Project Information](#Project-Information)

## Step 11. Enable silent refresh of access token when it reaches its expiry period

When we created the function to generate access tokens, we specified that each new access token should be valid for 30 minutes.

```js
    // tokens.ts
    ...
    export const generateAccessToken = (userId: number) => {
        return sign({ userId }, ACCESS_SECRET, { expiresIn: "30min" });
    };
```

Then, when we use the frontend to login, we receive an access token with which we access our protected routes and request protected data from the server. 
The problem is that this access token will be valid only for 30 minutes. If we use the app longer than 30 minutes, we will not be able to request protected resources on the server. For instance, our app would currently allow us to access the **"/addprofile"** route even if the access token expires (This would be easy to fix by verifying timestamps on the access token's payload)- However, if we actually submit a new user, the **express-jwt** middleware would see that our token has expired, and we would not be allowed to add the user to the database.

To fix this and make sure that we always have a valid access token while we are using the app, we can create a mechanism to automatically refresh access token every 30 minutes. 
We do not have to do much, either. We can use the existing mutation method already implemented in **app.tsx**, and have it refresh access token every 30 minutes.

The method is the one that we use to automatically login a user when they return to the app. 

```js
    // app.tsx
    ...
    const [refreshLogin, { client }] = useMutation<...>(REFRESH_ACCESS_TOKEN, {...});

    useEffect(() => {
        refreshLogin();
    }, []);
```

We can take the same method, and call it from a second **useEffect** hook every 30 minutes.

Here is the idea:

1. We only refresh the access token if an access token already exists in the cache
2. If access token exists, we start a timeout that will call **refreshLogin** mutation function after 30 minutes

### Refresh the access token if an access token already exists in the cache

First, let's extract the access token from the cache.
We need a client query, and an implementation of the **useQuery** hook. The hook is ok here because the **App** component never umnounts.

```js
    // app.tsx
    const GET_IS_LOGGED_IN_AT_CLIENT = gql`
        query GetIsLoggedInAtClient {
            login @client {
                access_token
            }
        }
    `;
    ...
    const App = () => {

        const {
            data: { login: { access_token }}} = useQuery(GET_IS_LOGGED_IN_AT_CLIENT) as { data: { login: { access_token: string }};
    ...
```

Now we make sure we only enter the **useEffect** if the current **access_token** holds a truthy value. We will have the **access_token** as a dependency of the hook, to make sure **useEffect** is called every time when the access token changes value. 

```js
    // app.tsx
    useEffect(() => {
        if (!access_token) return;

    }, [access_token]);
```

#### If access token exists, we start a timeout that will call **refreshLogin** mutation function after 30 minutes

Once we pass the access token test in the **useEffect** hook, we can simply start a timeout and call the **refreshLogin** function every 30 minutes. 
Notice that the **setTimeout** takes the time period argument in miliseconds, so we put 1800000 as an argument to the function, or 1800 * 1000 for legibility reasons:

```js
    // app.tsx
    useEffect(() => {
        if (!access_token) return;

        const timeoutId = setTimeout(() => {
            refreshLogin();
        }, 1800 * 1000);
    }, [access_token]);
```

This does the trick. When we log in, the hook is called because the access token changed. It sets a timeout to call the **refreshLogin** method in 30 minutes. In 30 minutes, we get a new access token, the hook is called again, and sets a new timeout. This repeats until we logout. Once we do, the hook is called, sees that access token is falsy, and does not start a new timeout.
Note that the previous timeout will still execute, but the server is set in such a way that it will return a message saying that we have already logged out.

We can improve this code a bit. If at some point we decide that our access token should be generated with shorter validity period on backend, we would have to adjust the frontend code too, to have the timeout call the **refreshLogin** function after that period. We can avoid this and have the timeout get this argument dynamically, from the access token itself. 

The token's payload includes the time of creation of the token and the time of expiration. These are expressed in seconds, and we can use them to get the validity period in seconds, and then multiply it by 1000 to get a value of our **setTimeout** function. Let's also deduce one minute from it, to have the request sent every 29 minutes in the current setup, just to compensate for possible delays and problems in frontend - backend communcation.

Extranction of the time properties from the token is done by:

1. Getting the middle string from the token (Tokens are separated by periods into 3 strings)
2. Passing the string to the **atob** method to get a JSON representation of the payload
3. Parsing the JSON payload to get JS object


```js
    // app.tsx
  useEffect(() => {
    if (!access_token) return;

    const dataString = access_token.split(".")[1];
    const jsonedData = atob(dataString);
    const { iat, exp } = JSON.parse(jsonedData) as { iat: number; exp: number };

    const timeoutId = setTimeout(() => {
      refreshLogin();
      }, (exp - iat - 60) * 1000);

  }, [access_token]);
```

That's it. We now have a system that automatically refreshes our access token just in time for it to always be valid. Lovely.

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
7. Set up Apollo Client so we can work with cookies and headers
8. Create login functionality
9. Create logout functionality
10. Create functionality to automatically log in user if they return to our app
11. **Enable silent refresh of access token when it reaches its expiry period**
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