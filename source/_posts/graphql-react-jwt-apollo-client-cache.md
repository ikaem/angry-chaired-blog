---
title: 'GraphQL & React & JWT: Apollo Client Cache'
date: 2020-08-16 20:05:19
tags:
- frontend
- apollo
- apollo cache
categories: graphql & react & jwt
cover: mosa-moseneke-WOP-W1Yg6cg-unsplash.jpg

creditArtist: Mosa Moseneke
creditSource: https://unsplash.com/@moooooose?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 6 of 12 in GraphQL & React & JWT

We are now moving to the frontend side, to implement authentication functionalities into our React app.
We want to be able to login, register and logout from the app. We also want to be able to automatically login when we return to the app, and once we are logged in, we want to stay logged in as long as we are using the app.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 6. Set up Apollo Client cache

How do we do that? We used Apollo Client in the last series, working on this same app, so we will continue using it. I found it very practical and relatively easy to learn, at least on a basic level.
In short, we will use its mutation hook to access our backend resolvers, and we will use its cache to actually store resolved data, so we have access to it throughout the app.
We will also need to make some adjustments to the way our client communicates with the server, to make sure that the server has access to our request headers and cookies.

In this post we will focus on setting up the cache:

1. Initialize Apollo Client cache
2. Test querying cache in the app

### Initialize Apollo Client cache

Even though Apollo makes their documentation very good, and the logic of their code actually pretty simple, at least on the basic level, and once you spend some time juggling it all, the cache itself was the biggest issue for me.
This is primarily because there are so many options available when it comes to work with cache, and there are tons of ways to something.
After playing with it and busting my head for a while, I just opted for the easier way to get what I needed, and here it is. There are tons of options I didn't even look at, as well as tons that I look, got confused, and decided there must be a simpler way to do my thing.

Apollo Client cache is an in-memory storage space for data that an app uses. This means that the data lives there until the app is refreshed.
The cache has a neat feature where it will automatically store all data that we retrieve via Apollo client. The only condition is that each retrieved item has to have an **id** or **\_id** property, which the client uses to store and differentiate different items. If I understood correctly, this mechanism is then also used to prevent unneccessary requests to GQL server, but I didn't go into it too much.

I recommend you install **Apollo Client Developer Tools** extension for Chrome to see the cache state in real time, as we work with the app. I tried to get it for Firefox too, but couldn't really get it to start.

We can also manually store and modify data in the Apollo Client cache, and we can do it in several ways (see what I mean?):

1. We can do it immediately when instantiating our Apollo Client
2. We can do it after we perform a query or a mutation on backend
3. We can do it after we reset the entire cache, as a reaction to this reset.
4. We can do it anywhere in our app, at any point
5. I am sure there is other ways

Very basic way, however, how to do it, is the one we already used in the last series, when we instantiated our Apollo Client. With this setup, we get a fully functional in-memory cache that will automatically store GQL responses and make the data available in the app.

```js
    // apollo-client.ts
    import {
        ApolloClient,
        createHttpLink,
        InMemoryCache,
    } from "@apollo/client";

    const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
        uri: gqlEndpoint,
        credentials: "include",
    });
    ...
```

Apollo Client gives as an option to read and write directly from cache with **readQuery** and **writeQuery** methods.
We can access those methods both on the **ApolloClient** instance, and on the actual **cache**.

For instance, we could use initialize our **cache** outside the ApolloClient contructor, write something to the cache, and then use that cache in the ApolloClient constructor.
Similarly, we could use our current **client** instance to write something in the cache.

Here is the code with both examples:

```js
    // apollo-client.ts
    import {
        ApolloClient,
        createHttpLink,
        InMemoryCache,
    } from "@apollo/client";

    const myCache = new InMemoryCache();
    cache.writeQuery( /* some code here */ )
    cache.readQuery( /* some code here */ )

    const client = new ApolloClient({
    cache: myCache,
    link: createHttpLink({
        uri: gqlEndpoint,
        credentials: "include",
    });

    client.writeQuery( /* some code here */ )
    client.readQuery( /* some code here */ )
    ...
```

According to the Apollo Client documentation, the difference between the two is that using these methods on the **client** instance results in automatic updates of UI throughout the app where data from cache is used. It means that if we write something to the cache via **client** instance, those changes will be rendered immediately wherever those values are used. This is not the case with using methods on the **cache** instance.
So we use methods on the **client** instance.

Let's write something to the cache now. Let's write it immediately after we create our client instance.
We are planning to use the cache to store information about the currently logged user. We want to have a certain shape of data always present in the cache, so when the user actually logs in, we will just update the cache to fill already present variables with appropriate values. And if there is no logged user, this data will still hold the shape, but its variables' values will be empty.
With this approach, we will always be able to query cache for logged user, to see if anyone is logged in, and our app will not be broken because certain varaibles do not exist.

Note that we will be updating cache manually, because our **login** mutation does not return an **id** property.

To write something to the cache, we provide an object argument to the **writeQuery** method.
This object needs 2 properties:

1. **query** - a signature, to be used to access a particular element in the cache. The query is an actual GQL query, made with Apollo's **gql** method, but used to query the client's Apollo cache instead of the server's queries.
2. **data** - values to be used to modify the data that we accessed with the query

We want our cache for logged user to hold following information:

1. First name
2. Avatar link
3. Acess token
4. Information whether they are logged or not
5. Information about the typename - the GQL type we associate with this particular data collection.

Also, we want all of this data to be grouped inside an object which we will name **login**.
Here is how I wanted it to look:

```js
    login: {
        first_name: "",
        avatar_link: "",
        access_token: "",
        isLoggedIn: false,
        __typename: ""
    }
```

You probably noticed that this shape is same as the data that our **login** mutation returns from the server - the shape returned by the **me** type. In fact, we will have the typename in the cache also be **Me**. I dont know if this is a good practice, but for now it is what it is.
The only extra property is the information whether the user is logged in or not.

Ok, so here is how we write this data into the cache, to make sure that the our cache is initialized with the neccessary data:

```js
    // apollo-client.ts
    import {
        ApolloClient,
        createHttpLink,
        InMemoryCache,
        gql
    } from "@apollo/client";

    const myCache = new InMemoryCache();

    const client = new ApolloClient({
    cache: myCache,
    link: createHttpLink({
        uri: gqlEndpoint,
        credentials: "include",
    });

    client.writeQuery({
        query: gql`
            query Login {
                login {
                    __typename
                    first_name
                    avatar_link
                    access_token
                    isLoggedIn
                    refreshRequestHasFinished
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
                refreshRequestHasFinished: false,
            },
        },
    });
    ...
```

With this setup, we now have our cache initialized with some data. We can now query this data within our app, as well as update it when a user actually logs in.

Here is our cache as shown by Apollo Client Developer Tools:

Let's also try to render the data from cache in our app.

### Test querying cache in the app

There are several ways (see, again!) to access cache data from our app's components:

1. Via a client instance
2. Via Apollo Client's hooks
3. We can also use client side resolvers that access cache and return specific data
4. Something called Local-only fields
5. Probably some other too

The resolvers way includes defining resolvers when creating an instance of the Apollo Client, and then calling those resolvers within queries in a component.
Resolvers are pretty much same as those on the server side, receiving same arguments. They access cache and return some data, that we then ask for in our queries.
However, they are deprecated in the newest version of Apollo Client (3.0), and I found them a bit unneccessary too. So we won't go into it.
We won't go into **Local-only fields** either, as I found them confusing, and will come back to that in a future series.

We will do check the first two options, and then use the second one in our app.

#### Working with cache via Apollo Client instance

Let's work in **app.tsx** component.

We need to get our client instance in this component, and we can do that with the **useApolloClient** hook provided to us by Apollo. This assumes that we have wrapped our entire app in the Apollo Provider, like we did in the last series.

We need to import this hook from Apollo Client, and then use it in our component to get access to the client instance.
We use our **App** component for this purpose.

```js
    // app.tsx
    import { useApolloClient } from "@apollo/client";

    const App = () => {
        const client = useApolloClient();
    ...
```

To read the data in the cache, we will use the **readQuery** method that exist on the client instance.
The method accepts an options object which needs a mandatory **query** property, and an optional **variables** object.

The **query** property holds a query that needs to match the query we provided when we wrote data to the cache. We do not have to require all properties that exist in the data, but the name of the top field on both queries has to the same - this field is **login** in our case.

We will not deal with the variables in this series, because in one of the future ones I plan to go more in depth with the whole Apollo Client thing.

Ok, here is the code, with the query, implementation of the **readQuery** method, and the destructured query result:

```js
    // app.tsx
    ...
    const TEST_LOGIN_CACHE = gql`
        query {
            logins {
                __typename
                first_name
                avatar_link
                access_token
                isLoggedIn
            }
        }
    `;
    ...
    const App = () => {
        const myClient = useApolloClient();

        const queryLoginData = myClient.readQuery<{
        login: {
            __typename: string;
            first_name: string;
            avatar_link: string;
            access_token: string;
            isLoggedIn: boolean;
        };
        }>({
        query: TEST_LOGIN_CACHE,
        });

        const { login } = queryLoginData!;
    ...
```

Let's now render the returned values:

```js
    // app.tsx
    ...
    const App = () => {
    ...
    return (
      <Switch>
        <Route exact path="/">
          <p>__typename: {login.__typename}</p>
          <p>first_name: {login.first_name}</p>
          <p>avatar_link: {login.avatar_link}</p>
          <p>access_token: {login.access_token}</p>
          <p>isLoggedIn: {login.isLoggedIn.toString()}</p>
    ...
```

If we visit the **"/"** root path now, we will see that all of our values are empty, except for the **isLoggedIn** value, which renders **false** because we converted the **false** boolean value to string

Let's make things a bit more interesting by manually changing our initialized values in the **appolo-client.ts** file:

```js
    // apollo-client.ts
    ...
    client.writeQuery({
        query: gql`
            query Login {
                login {
                    __typename
                    first_name
                    avatar_link
                    access_token
                    isLoggedIn
                    refreshRequestHasFinished
                }
            }
        `,
        data: {
            login: {
                __typename: "Me",
                first_name: "Joe",
                avatar_link: "Johnson",
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTU5NTIzMDMxOSwiZXhwIjoxNTk1MjMyMTE5fQ.VPxdlZz_WtHkIxWqyyE4VgVlU800M7G6-tpAfAjQJac",
                isLoggedIn: true,
                refreshRequestHasFinished: false,
            },
        },
    });
    ...
```

Try and see what the app renders now. The rendered values are not empty anymore.

#### Working with cache via Apollo Client's hooks.

Another way, and the one we will use in our app, is by using Apollo hooks. We will be using same hooks as we used to query our Apollo Server Express. This way we will have a consistent way of querying data.

The procedure is same as with the server queries:

1. We define a query
2. We implement a hook
3. We render the data

The only difference is that when we define a query with the **gql** method, we have to specify that we are querying the Apollo Client cache, and not the Apollo Server.
We do this by adding **@client** after our query name:

```js
    const TEST_LOGIN_CACHE = gql`
        query {
            login @client {
                __typename
                first_name
                avatar_link
                access_token
                isLoggedIn
            }
        }
    `;
```

Now, lets use this query with the **useQueryHook**: 

```js
    // app.tsx
    ...
    const App = () => {

        const { data: testLoginData } = useQuery<{
            login: {
                __typename: string;
                first_name: string;
                avatar_link: string;
                access_token: string;
                isLoggedIn: boolean;
            };
        }>(TEST_LOGIN_CACHE);

        const { login: testLogin } = testLoginData!

        console.log(testLogin);
    ...
```

Alright, this is it. We now have a functional cache that we can query with Apollo hooks.

Next, we need to finish the Apollo Client setup to have it send our access tokens with each request, as well as cookies that will hold refresh tokens.

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
4. Set up Cors and Apollo Express be able to deal with tokens and cookies
5. Create resolvers
6. Set up Apollo Client so we can work with cookies and headers
7. **Set up Apollo Client cache**
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
