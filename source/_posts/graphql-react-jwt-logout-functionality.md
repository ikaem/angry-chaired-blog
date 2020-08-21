---
title: 'GraphQL & React & JWT: Logout Functionality'
date: 2020-08-16 20:45:30
tags:
- frontend
- jwt
- authentication
- graphql
- apollo
categories: graphql & react & jwt
cover: baylee-gramling-R5eoT-c-jkY-unsplash.jpg

creditArtist: Jeffrey F Lin
creditSource: https://unsplash.com/@bayleejadegramling?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 9 of 12 in GraphQL & React & JWT

When a user logs out on the frontend, the client should call the **logout** mutation that we have prepared on the backend. That mutation will clear the refresh token column in the database and clear the **refreshToken** cookie, setting it to an empty string and backdating its expiration date. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 9. Create logout functionality

The frontend itself also has to do some clean up, to make sure there is no user info left on the client. 

We will: 

1. Create mutation and implement **useMutation** hook
2. Clear cache to reset its values to their intial state on successfull mutation
3. Redirect the user to the login page
4. And fix an interesting bug that took me ages to figure out. 

#### Create mutation and implement **useMutation** hook

The mutation itself is very simple, as we already know. It requires no arguments, as its resolver with gather needed data from the access token passed to it via request headers.

```js
    // header.container.tsx
    const LOGOUT_USER = gql`
        mutation LogoutUser {
            logout
        }
    `;
```

When implementing the **useMutation** hook, we want to destructure the mutation method for its return, as well as the client instance from its response object. We need the instance to be able to delete user data from the cache once the **logout** mutation completes.

```js
    // header.container.tsx
const [ logoutMutationAtServer, { client } ] = useMutation<{ logout: boolean }>(
    LOGOUT_USER,
    {
        onCompleted: ({ logout }) => {
            if (!logout) throw new Error("There was an error logging out the user");
        },
        onError: (error) => {
            console.log(error);
            console.log(error.graphQLErrors);
        },
    }
);
```

Note that we are throwing an error in the **onCompleted** method if the **logout** mutation returns false. Remember that the mutation returns true in case a logout was successfull, or a falsy value if there was an error or unsuccessful logout. 
We want to clear user data from the client only when they are successfuly logged out from the backend too.

Let's also have the mutation method be called by a click event on the **logout** span element in the header:

```js
    // header.container.tsx
    return (
        <HeaderStyled>
            <div className="main-header__logo-container">
                <Link className="logo-container__logo-link" to="/home">
                    <h1 className="logo-container__logo-actual">GraphQL-JWT</h1>
                </Link>
            </div>
            <nav className="main-header__navigation">
                <ul className="navigation__options">
                ...
                    <li className="navigation__option">
                        <span
                            onClick={() => logoutMutationAtServer()}
                            className="option__link-actual"
                            style={{ cursor: "pointer" }}
                        >
                ...
```

#### Clear cache to reset its values to their intial state

Apollo Client provides two neat methods to return cache to initial state. 
One is **resetStore**, and the other one is **clearStore**. Both of these will clear the cache, but the first one will refetch the active queries, while the second one will not. 
By active queries, I mean that if a GQL query exists in a currently mounted component at the time when the cache is reset, that query will automatically refetch if we use the **resetStore** method. 
We do need this functionality, to make sure our header actually updates name and avatar values to empty strings once we log out.

To use the method, we just call it on the client instance:

```js
    client.resetStore();
```

Here it is, called in the **onCompleted** method of our **useMutation** hook implementation:

```js
    // header.container.tsx
    const [ logoutMutationAtServer, { client } ] = useMutation<{ logout: boolean }>(
        LOGOUT_USER,
        {
            onCompleted: ({ logout }) => {
                if (!logout) throw new Error("There was an error logging out the user");
                client?.resetStore();
            },
            ...
        }
    );
```

When **resetStore** is called, it will clear the entire store, leaving nothing in it. Once those active queries refetch their data, the cache will repopulate. However, we will not get our **login** data back to the cache because there is no active query to automatically attempt a login and set it.

To fix this, we can use another method available on the client instance - **onResetStore**. This method will execute once the **resetStore** method is called anywhere in the app, and we can use it to reset the cache to the original login data. 
Apparenty, **onResetStore** returns **void**, and takes as an argument a function that returns a generic **Promise**. This is why we will make this argument function an async one. 

We use the **onResetStore** method in the **apollo-client.ts**:

```js
    // apollo-client.ts
    ...
    client.onResetStore( async() => {
        client.writeQuery({
            query: gql`
                query Login {
                    login {
                    __typename
                    first_name
                    avatar_link
                    access_token
                    isLoggedIn
                    }
                }
            `,
            data: {
                login: {
                    __typename: "",
                    first_name: "",
                    avatar_link: "",
                    access_token: "",
                    isLoggedIn: false,
                },
            },
        });
    });

    export default client;
```

With this, when a user logs out, a successful logout mutation should cause our Apollo Client cache to reset and reinitiaze with a login **object** holding empty properties.

#### Redirect the user to the login page

Redirect is easy, and we have already done this we the **login** mutation.
We need to conditionally rendering the **React Router**'s **Redirect** component, and set the route state when our **logout** mutation completes.

```js
    // header.container.tsx
    ...
    const Header = () => {
        const [logoutRedirect, setLogoutRedirect] = useState<string>("");
        ...
        const [ logoutMutationAtServer, { client } ] = useMutation<{ logout: boolean }>(
            LOGOUT_USER,
            {
                onCompleted: ({ logout }) => {
                    if (!logout) throw new Error("There was an error logging out the user");
                    setLogoutRedirect("login");
                    client?.resetStore();
                },
                ...
            }
        );
        ...
          return (
            <HeaderStyled>
            ...
                    </nav>
                    {logoutRedirect && <Redirect to={`/${logoutRedirect}`} />}
                </HeaderStyled>
          )
        ...
```

#### Fix an interesting bug that took me ages to figure out. 

Ok, so the situation now is that when we logout, we are redirected to the **/login** route, and the cache is reset to its initial state.

But, when we do that, we get an error from React saying that it cannot set state on an unmounted component. Depending on which page we were when we logged out from the app, React can throw this error several times, warning about different components being unmounted and not being able to set their state. 

So what is happening? It ook me a while to figure it out. 
Let's start with the header. When we login, the app will redirect us to the home page. The view in the browser consists of several components, all of them wrapped in a single **Layout** component. This is just the way I organized the app. Each route renders a new Layout component, which in turn renders a new header, new footer, and the main page such as the **homepage**.
When we logout, we are redirected to the **login** route. This route renders the Layout component all over again, as well as the new header. This new header is not the same as the header where we clicked on **logout**. That component has unmounted at the moment when we were redirected to the **login** route. 
This is our first clue - we have an unmounted header component.

Now, remember how we said that the **resetStore** method refetches active queries? One of those queries is the header's query to fetch logged user data, active via the **useQuery** hook. Because of the way **resetStore** works, a refetch is attempted for that old, unmounted component too, because of its **useQuery** hook. Since the hook also returns state in form of its data (I assume it uses React's **useState** hook in the background), Apollo tries to update that state, but since the component is no longer mounted, React throws an error warning us that it cannot update an unmounted component's state. 
That's our second clue - we are using a React state in the component from which we will navigate away. 
If we had a different setup (totally possible), where we always render the same header, and just change pages based on the route, React would not warn us about trying to set state in the unmounted header component. It wouldn't need to because we would never unmount the header component.

But, we would get this error for other components, such as the home page. The **Home** component also uses the same hook, creating a React state, and keeping its queries active on store reset. On logout we navigate away from this page as well, and React warns us about being unable to set state for when this unmounted component too. 

So what to do? I guess we could do lot of things, but one solution I found is to use a different hook to make queries - the **useLazyQuery** hook. This hook can also be used to send GQL requests to Apollo Server, but unlike the **useQuery** one, it returns an array holding a query method, and an object holding query response, error, loading property and so on. Its looks very much like the return of the **useMutation** hook. 

```js
    import { useLazyQuery } from "@apollo/client";

    const SomeComponent = () => {
        const [ queryMethod, { data, error, loading, fetchMore } ] = useLazyQuery(SOME_QUERY);
    }
```

Once we implement the hook, it doesn't send any query requests until we call its query method. It doesn't do an active query, and it will not refetch when **resetStore** is called. Instead, it will refetch only when we call it.

We can use React's **useEffect** hook to call it only when a component mounts. This way, there will not be any refetching and setting of state by unmounted components, so no error.

Here is the implementation for the **Header** component:

```js
    // header.container.tsx
    import React, { useState, useEffect } from "react";
    ...
    const GET_LOGGED_USER_AT_CLIENT = gql`
        query GetLoggedUserAtClient {
            login @client {
                first_name
                avatar_link
            }
        }
    `;
    ...
    const Header = () => {
        const [logoutRedirect, setLogoutRedirect] = useState<string>("");
        ...
        const [ getLoggeduserAtClient, { data }] = useLazyQuery<{ login: { first_name: string, avatar_link: string }}>(GET_LOGGED_USER_AT_CLIENT);

        const { first_name, avatar_link } = data?.login || { first_name: "", avatar_link: ""};

        useEffect(() => {
            getLoggeduserAtClient();
        }, []);
        ...
```

The two hooks should be implemented in all components that make queries with **useQuery**. 

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
9. **Create logout functionality**
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
