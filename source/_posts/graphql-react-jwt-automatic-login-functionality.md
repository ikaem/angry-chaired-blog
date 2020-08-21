---
title: 'GraphQL & React & JWT: Automatic Login Functionality'
date: 2020-08-16 20:50:48
tags:
- frontend
- jwt
- authentication
- graphql
- apollo
categories: graphql & react & jwt
cover: ivars-utinans-Mx1ADpUts8s-unsplash.jpg

creditArtist: Ivars Utināns
creditSource: https://unsplash.com/@ivoprod?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 10 of 12 in GraphQL & React & JWT

We have set up the login mechanism in such a way that when a user logs in, a cookie gets set on the backend and stored on the client. This cookie holds a refresh token, valid for 10 days, or until the user explicitly logs out of their account.

Provided that the user doesn't log out of their account when they leave the app, we can use that cookie to automatically log into the user's account when they return to the app. 
We already have a mutation prepared for that on the backend - the **refreshAccessToken** one. It returns the same data as the login mutation, so we can use it to login user and get exact same data back to the client. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 10. Create functionality to automatically log in user if they return to our app

How would this work? Well, we can have this mutation sent to the backend immediately when to app starts. If we have a **refreshToken** cookie set on the client, the mutation's resolver will login the user. If there is no such cookie, the resolver will return an error, informing the client that the user has to manually login.
Since the **App** component will always mount, it being a container for all other components, we will do the mutation here. The **useEffect** hook will make sure that we perform the mutation only once, when the component mounts, by providing it with an empty dependence array.

Here is what we will do on the frontend:

1. Create query and implement **useMutation** hook in the **App** component
2. Use the **useEffect** hook to perform the mutation only when the component mounts
3. Update the cache when the mutation succeeds
4. Create protected component to protect certain routes, redirect unauthorized users to **"/login"** route

### Create query and implement **useMutation** hook in the **App** component

The mutation that we are sending to the server requests the full user info. We do not need any arguments to be included with the mutation because the matching resolver will get neccessary data from the **refreshToken** cookie.

Here is the mutation:

```js
    // app.tsx
    const REFRESH_ACCESS_TOKEN = gql`
        mutation RefreshAccessToken {
            refreshAccessToken {
                first_name
                avatar_link
                access_token
            }
        }
    `;
```

The **useMutation** hook is a usual one, accepting the mutation, and returning the mutation method. 
We also need the destructured **client** instance in order to update our cache later. 

```js
    // app.tsx
    ...
    const [refreshLogin, { client }] = useMutation<{
        refreshAccessToken: {
            first_name: string;
            avatar_link: string;
            access_token: string;
            __typename: string;
        };
    }>(REFRESH_ACCESS_TOKEN, {
        onError: (error) => {
            console.log(error);
            console.log(error.graphQLErrors);
        }
    });
```

### Use the **useEffect** hook to perform the mutation only when the component mounts

Simple really. Call the mutation function only when the component mounts:

```js
    // app.tsx
    ...
    useEffect(() => {
        refreshLogin();
    }, []);
    ...
```

With the current setup, the mutation will be done every time the component mounts - which is only once for the **App** component. This is exactly what we want. Depending on the existence and validity of the **refreshToken** cookie, a user will be automatically logged in or not. 

The login, however, is done only on the backend at the moment. 
We need to use the data returned from the mutation to login the user on the frontend as well.

### Update the cache when the mutation succeeds

And we do so by updating the cache with the logged user's info.
As before, we use the **update** method to do so:

```js
    // app.tsx
    ...
    const [refreshLogin, { client }] = useMutation<{
        refreshAccessToken: {
            first_name: string;
            avatar_link: string;
            access_token: string;
            __typename: string;
        };
    }>(REFRESH_ACCESS_TOKEN, {
        onError: (error) => {
            console.log(error);
            console.log(error.graphQLErrors);
        },
        update: (cache, { data }) => {
            client?.writeQuery({
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
                        __typename: data?.refreshAccessToken.__typename,
                        first_name: data?.refreshAccessToken.first_name,
                        avatar_link: data?.refreshAccessToken.avatar_link,
                        access_token: data?.refreshAccessToken.access_token,
                        isLoggedIn: true,
                    },
                },
            });
        },
    });
```

With this setup, try login and then refresh the page. You should stay logged in because the refreshToken cookie on your browser is sent to the server and used by a resolver to log you on the backend. The data that the resolver sends back is used by the **update** method to update the client cache, and you get logged back in on the client side too. 

Try logging out now, and then refresh the page. You are not logged backin because there is no cookie to provide info needed to refresh your login. 

### Create protected component to protect certain routes, redirect unauthorized users to **"/login"** route

Why do we need to be logged in at all? One reason would be to access some special parts of a website. For instance, we don't want everyone to be able to add new users to our app. Only logged users should be able to do that. 

How do we do that? 
One approach, and the one that we will take, is to wrap those parts into a component that will check if there is a logged user in the cache. If a user is logged in, the so-called **protected route** component will render the requested content, and if there is no logged user, the browser will be redirected to the login page. 

Here is the plan: 

1. Create such component
2. Query cache for logged user
3. Conditionally render content or redirect to **"/login"** route

#### Create the ProtectedRoute component

The component accepts children as props. In the current setup, it will always render children props, with the children being other components that we only want to render if the user is logged in.

```js
    // protected-route.container.tsx
    import React from 'react'

    interface ProtectedRouteProps {
        children: React.ReactNode
    }

    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

        return (
            <div>
                { children }
            </div>
        )
    }

    export default ProtectedRoute;
```

In the **App** component we wrap our **AddProfile** component inside the **ProtectedRoute**:

```js
    // app.tsx
    ...
        <Route path="/addprofile">
            <ProtectedRoute>
            <AddEditProfilePage />
            </ProtectedRoute>
        </Route>
    </Switch>
    ...
```

#### Query cache for logged user

To query our cache, we will once again use the **useLazyQuery** hook to avoid the **useQUery** hook attempt to set the component's state when we logout.
We will use the **useEffect** hook again, too, to query the cache only when the component actually mounts. 

```js
    // protected-route.container.tsx
    ...
    const IS_USER_LOGGED_IN = gql`
        query IsUserLoggedIn {
            login @client {
                isLoggedIn
                refreshRequestHasFinished
            }
        }
    `;

    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

        const [ getIsLoggedIn, { data } ] = useLazyQuery<{ login: { isLoggedIn: boolean, refreshRequestHasFinished: boolean  } }>(IS_USER_LOGGED_IN);

        useEffect(() => {
            getIsLoggedIn();
        }, []);
    ...
```

#### Conditionally render content or redirect to **"/login"** route

Let's say we want to start using the app at the **"/addprofile"** route.
Ideally, we would use the **isLoggedIn** field in the cache to render the children props at this route. If the field is false, we redirect the client to the **"/login"** route, and if it is true, we render the children.

**isLogged** is always **false** when the app starts. Our **ProtectedRoute** component would then always redirect the client. Even if our **refreshAccessToken** mutation eventually logs the user, the browser is already at the **"/login"** route and we cannot go to the **"/addprofile"** route.

Here is the code for such case:

```js
    // protected-route.container.tsx
    ...
    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
        const [getIsLoggedIn, { data, called, loading }] = useLazyQuery<{
            login: { isLoggedIn: boolean; refreshRequestHasFinished: boolean };
        }>(IS_USER_LOGGED_IN);
        ...

        if (!data?.login.isLoggedIn) return <Redirect to="/login" />;
        return <div>{children}</div>;
```

The problem here is that, when the app starts, it takes a short period of time for the **refreshAccessToken** to make a request to the server and get a response back. The **ProtectedRoute** component is faster, however. Its logic is focused only on the local variables, so when it sees that the **isLoggedIn** is false, it immediately redirects the browser and unmounts itself. Even if the **refreshAccessToken** does actually log in the user, the **ProtectedRoute** component is unmounted and cannot react to a change in its state. 

So how to approach the problem? My idea was to stay with the **ProtectedRoute** component until the **refreshToken** returns its response. 
To do this, I added another field to the **login** cache, to indicate whether the response has arrived. 
The field, called **refreshRequestHasFinished** is false when the app starts, and switches to **true** when **refreshAccessToken** returns, regardless of whether it logs the user or not. 

Here is the modified initialized cache in the **apollo-client.ts**:

```js
    // apollo-client.ts
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
```

Obviously, introduction of this field requires additional code modifications throughout the app.

We need to make the new field hold **true** value when we are done with the **refreshToken** mutation. We need to do this both when the mutation succeeds and when we get an error. 
The error case might seems strange, because why would we change our cache if aa request failed. The idea here, however, is just to know whether the request has finished, so we can render the appropriate page. We can deal with the error in a separate way.

```js
    // app.tsx
    const [refreshLogin, { client }] = useMutation<...>(REFRESH_ACCESS_TOKEN, {
        onError: (error) => {
            ...
            client?.writeQuery({
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
                        refreshRequestHasFinished: true,
                    },
                },
            })
        },
        update: (cache, { data }) => {
            client?.writeQuery({
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
                        __typename: data?.refreshAccessToken.__typename,
                        first_name: data?.refreshAccessToken.first_name,
                        avatar_link: data?.refreshAccessToken.avatar_link,
                        access_token: data?.refreshAccessToken.access_token,
                        isLoggedIn: true,
                        refreshRequestHasFinished: true,
                    },
                },
            });
        },
    });
```

We need to adjust the **onResetStore** method in the **apollo-client.ts** as well, to actually keep the new field **true**. The assumption is that, when we reset the store, the app had been running for a while already, and had performed the initial refresh attempt.

```js
    // apollo-client.ts
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
                    refreshRequestHasFinished: true,
                },
            },
        });
    });
```

We will keep the field **true** when we perform the **login** mutation too:

```js
    // login.page.tsx
    ...
    
    update: (_cache, { data }) => {
        client?.writeQuery({
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
                    __typename: data?.login.__typename,
                    first_name: data?.login.first_name,
                    avatar_link: data?.login.avatar_link,
                    access_token: data?.login.access_token,
                    isLoggedIn: true,
                    refreshRequestHasFinished: true,
                },
            },
        });
    },
```

We don't need to adjust anything about the **logout** mutation, because the **onResetStore** method deals with the new field already. 

Now that we have an additional property in our cache with which we can stay with the **ProtectedRoute** component until a response from the **refreshAccessToken** mutation arrives, we can conditionally render waht we need.

How do we want to do it?

1. In case the response has not arrived, we want to stay with the component
2. In case the response has arrived, and the **isLogged** property is false, we want to redirect the client to **"/login"**
3. In case the response has arrived, and the **isLogged** property is true, we render the children. We can also remove conditions from this one, and render this when none of the above conditions are fulfilled.

Here is the code:

```js
    // protected-route.container.tsx

    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
        const [getIsLoggedIn, { data, called, loading }] = useLazyQuery<{
            login: { isLoggedIn: boolean; refreshRequestHasFinished: boolean };
        }>(IS_USER_LOGGED_IN);

        useEffect(() => {
            getIsLoggedIn();
        }, []);

        if(!data?.login.refreshRequestHasFinished) return <p>Loading...</p>
        if(data?.login.refreshRequestHasFinished && !data?.login.isLoggedIn) return <Redirect to="/login" />

        return (
            <div>
                { children }
            </div>
        )
    };
```

Try it now. Go an login, and then visit the **"/addprofile** route. Now refresh the page, and see if you can still see the the same component. You should.
Now try to logout, and do the same. You should not be able to visit the route because the **isLoggedIn** field is **false**.

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
10. **Create functionality to automatically log in user if they return to our app**
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

