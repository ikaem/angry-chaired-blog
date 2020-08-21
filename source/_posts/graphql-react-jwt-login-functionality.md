---
title: 'GraphQL & React & JWT: Login Functionality'
date: 2020-08-16 20:24:13
tags:
- frontend
- jwt
- authentication
- graphql
- apollo
categories: graphql & react & jwt
cover: jeffrey-f-lin-D4DBJk5UmFo-unsplash.jpg

creditArtist: Jeffrey F Lin
creditSource: https://unsplash.com/@jeffreyflin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 8 of 12 in GraphQL & React & JWT

Now that we have setup our Apollo Client to use our headers and cookies, we can finally start to implement uathentication features.
First one is the **login** one.
To login a user, we make use of the **login** mutation we already have prepared on the backend. So that part is done.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 8. Create login functionality

On the frontend side, we have to have gather data from a form, and then submit it to the backend mutation somehow. We also need to implement some kind of validation to make sure both email and password are valid values, and we also have to react to successful and unsuccessful mutations. Once the mutation succeeds, we will have the returned data stored into cache, and use it in the Header component to show the logged user's name and avatar. 

Here is a more detailed plan:

1. Create login component
2. Gather user input for mutation submission and make sure it is valid
3. Create the mutation query, implement the **useMutation** hook with the **onError** options object property, and call mutation method inside the submit handler
4. Update Apollo Client cache on successful mutation
5. Use login data from the cache in the Header component
6. Redirect client on successful mutation

### Create login component

We will only briefly show the component. It is one of the app's **page** components, and it directly renders the login form, instead of housing a separate view component. We do this for the sake of practicality, even though a common practice would probably be to separate logic and presentation.

We have a simple form with imputs for email and password, and a button to submit the login details. Email and password inputs have **required** attribute to make sure they hold truthy values before they are submitted.
The component is styled with the **styled-components** package, but that is not part of this series.

```js
// login-page.ts
const LoginPage = () => {
  return (
    <Layout>
      <LoginStyled>
        <section className="main-content__login-section">
          <h1 className="login-section__title">Login</h1>
          <form className="login-section__login-form">
            <label htmlFor="email" className="login-form__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="login-form__input"
              required
            />
            <label htmlFor="password" className="login-form__label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="login-form__input"
              required
            />
            <button type="submit" className="login-form__login-button">
              Login
            </button>
          </form>
        </section>
      </LoginStyled>
    </Layout>
  );
};
```

### Gather user input for mutation submission and make sure it is valid

Normally, I do form data collection with state, making a 2-way connection between the state and form inputs with the **value** attribute and **onChange** event.

Recently I learned that we can use the **onRef** hook to collect data from inputs as well, so we will implement the hook here to see how it works.

As far as the validation go, we will not go too deep into it. Proper input validation would mean checking if provided email address has a true email format, and that a password holds certain number of characters, and includes whatever type of characters we decide. Yes, a topic for another post series.
Instead, we will only use TS to make sure inputs are provided.

#### Gather user input

To gather data provided by the user, we will use the the **useRef** hook, provided by React itself.

When used, the hook returns a regular JS object holding a **current** property. This property is initialized to whatever was passed to the hook in the first place.
This process effectively creates a reference object.

Two important things reagrding the hook are:

1. The object returned by the hook will live for the entirety of its components's life
2. Mutation of the **current** property does not cause the component to re-render

Here is an example:

```js
    import React, { useRef } from "react";

    const LoginPage = () => {

        const test = useRef("test");
        console.log("test useRef return:", test); // { current: "test" }
```

To gather data from an input element, we would attach the element to this reference by adding as a value to the element's **ref** attribute

```js
    import React, { useRef } from "react";

    const LoginPage = () => {

        const test = useRef(null);

        return (
            <input id="test-input" ref={test}>
        )
```

Note that we initialized the reference as **null** because when the component mounts, it doesn't render any HTML yet.

Now we have access to the **test-input** input, and we can get its value via the **test** reference object's **current** property. This property will mutate from **null** to eventually hold the entire **test-input** element.
Because we now have the **current** property referencing the input element, we can also access the lement's **value** property.

```js
    import React, { useRef } from "react";

    const LoginPage = () => {

        const test = useRef(null);

        console.log(test.current);
        // null
        // <input id="test-input" autocomplete="off" ...>

        return (
            <input id="test-input" ref={test}>
        )
```

Let's now use this to get access to our email and password's input values.

We create references for our email and password inputs, and initialize them to **null** to start with. Note that we are using a concrete type on the hook to make sure our **current** property is of **HTMLInputElement** type.

```js
    // login.page.ts
    const LoginPage = () => {
        const emailInputRef = useRef<HTMLInputElement>(null);
        const passwordInputRef = useRef<HTMLInputElement>(null);
        ...
```

Next, we attach our input elements to the references we just created, to make sure that the reference object's **current** property holds our input elements:

```js
    // login.page.ts
    const LoginPage = () => {
        ...
        return (
            ...
            <form className="login-section__login-form" onSubmit={handleSubmit}>
                <label htmlFor="email" className="login-form__label">
                    Email
                </label>
                <input
                    ...
                    ref={emailInputRef}
                    ...
                />
                <label htmlFor="password" className="login-form__label">
                Password
                </label>
                <input
                    ...
                ref={passwordInputRef}
                    ...
                />
            ...
        )
        ...
```

#### Make sure inputs are valid

We will only make sure our inputs have truthy values. HTML itself is already doing some of the validation work with the **required** attribute being applied to the input elements, but I don't think these two validation parts would be enough for real, production application. Still, it is enough here.

We will place this validation in a submit handler function. The submit handler will eventuall be used to actually submit mutation to the backend too, but for now we will only use it to make sure we have valid input data.

The handler will be called by a submit event on the form element, getting the event passed to it. 
Then, we will extract input values from the references' value properties, and make sure they are not falsy. 

```js
    // login.page.ts
    const LoginPage = () => {
        ...
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const enteredEmail = (emailInputRef.current as HTMLInputElement).value;
            // const enteredEmail = emailInputRef.current.value; // error, warning that the current property is possibly null
            // const enteredEmail = emailInputRef.current?.value; / no error here

            const enteredPassword = (passwordInputRef.current as HTMLInputElement)
                .value;

            if (!enteredEmail || !enteredPassword) return;

            console.log("enteredEmail:", enteredEmail);
            console.log("enteredPassword:", enteredPassword);
        };
        ...
```

Note that, when asssigning values to our **entered** variables, we are casting the **current** properties as **HTMLInputElement**. We are doing this to avoid the error where the **current** propert is possibly **null**. TS is warning us about this because we initialized our references with **null** values. However, at this point, when our **handleSubmit** function gets called, the references will already be pointing to input elements and have a truthy **current** values.
I commented out the syntax that will cause the error, as well as another possible solution with conditionally evaluating the **current** property.

With this setup, we also set the function to return if either of the two **entered** constants are falsy, or log their values if all is good. 

### Create the mutation query, implement the **useMutation** hook with the **onError** options object property, and call mutation method inside the submit handler

Title of the section makes it obvious that we will do three things here:

1. Create mutation query
2. Implement the **useMutation** hook
3. Have the mutation method called inside the **handleSubmit** function

#### Mutation query

The mutation query is simple, and we have done this before. You probably have it laying forgotten in the **GraphQL Playground** from when we tested **login** resolver on the backend.

We define two variables inside the mutation query, both mandatory and both strings. Then we use those variables in the mutation. We will give values to those variables later when we call the mutation method. 
Finally, we request logged user's name, avatar link and access token back from the mutation. 

```js
    // login.page.ts
    import { gql } from "@apollo/client";

    const LOGIN_MUTATION_QUERY = gql`
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                first_name
                avatar_link
                access_token
            }
        }
    `;
```

#### Implement the **useMutation** hook

We have done this part before, too. We will pass our mutation to the **useMutation** hook, and we will destructure the mutation method from the hook's return return. 
We do not need the actual data in this case, as we will not be rendering the returned data directly.

We will, however, define a concrete type to be used by the hook, instead of its default generic type. We will do it to get the TS support and autocompletion featrues for the returned data, to use later when updating cache. 

First, lets define the type as an interface. 
We know that the data returned from the **login** mutation is of **Me** type, as defined by our GQL types on backend. 
The **Me** type returns logged user's first name, avatar link, access token, as well as the **__typename** property holding name of the type - "Me". 

The interface, therefore, can look like this:

```js
    // login.page.ts
    interface LoggedUserInterface {
        login: {
            __typename: string;
            first_name: string;
            avatar_link: string;
            access_token: string;
        };
    }
```

Let's implement the **useMutation** hook now.

```js
    // login.page.ts
    ...
    const [ loginMutation ] = useMutation<LoggedUserInterface>(
        LOGIN_MUTATION_QUERY,
        {
            onCompleted: (data) => {
                console.log("onCompleted data:", data)
                setDoRedirect(true);
            },
            onError: (error) => {
                console.log("Error:", error);
                console.log("GraphQLErrors:", error.graphQLErrors);
            },
        }
    );
    ...
```

We have also included two methods in the options object passed to the **useMutation** hook:

1. **onError** method, as a basic and simple way to get information about any possible errors that might happen.
2. **onCompleted** method, just to temporarily log the data returned by the mutation. The **data** argument** is automatically passed to method once the mutation is complete, holding values returned from the mutatation, and in our case, being of our concrete type that we defined with the **LoggedUserInterface** interface. We will later use this method to redirect user to a different page once the mutation completes successfully. 

#### Have the mutation method called inside the **handleSubmit** function

We have already prepared our **handleSubmit** function, and we can simply call our method from there.
We will need to include varibles in the method's options object argument, as we defined our mutation query to accept two - email and password. We will get those from our **entered** constants extracted from email and password references.

```js
    // login.page.ts
    ...
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const enteredEmail = (emailInputRef.current as HTMLInputElement).value;
        const enteredPassword = (passwordInputRef.current as HTMLInputElement).value;

        if (!enteredEmail || !enteredPassword) return;

        loginMutation({
            variables: {
                email: enteredEmail,
                password: enteredPassword,
            },
        });
    };
    ...
```

Finally, we need to have the **handleSubmit** method be called when we actually click on the login button and submit the form data:

```js
    // login.page.js
    return (
        ...
        <form className="login-section__login-form" onSubmit={handleSubmit}>
            <label htmlFor="email" className="login-form__label">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                className="login-form__input"
                ref={emailInputRef}
                required
            />
            <label htmlFor="password" className="login-form__label">
                Password
            </label>
            <input
                type="password"
                id="password"
                name="password"
                className="login-form__input"
                ref={passwordInputRef}
                required
            />
            <button type="submit" className="login-form__login-button">
                Login
            </button>
        </form>
        ...
    )
```

This should be enough. Let's try and login to see what happens. We expect our **onCompleted** method log the full **Me** type returned by the **login** mutation.

Here it is:

```js
    onCompleted data: 
        {login: {…}}
            login:
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTU5NTM5NzQ3OCwiZXhwIjoxNTk1Mzk5Mjc4fQ.JPPS79eXLlhW7IWXkc4QCILOket8V9hu7QOUlLw_ego"
                avatar_link: "https://source.unsplash.com/225x225/?portrait"
                first_name: "karlo"
                __typename: "Me"
```

### Update Apollo Client cache on successful mutation

We already have pretty much everything prepared for this part.

1. We have initialized our Apollo Client cache, so we just need to update already existing cache fields
2. We can perform mutation and we get correct data back from the server

We only need to include the **update** method in the options object argument passed to the **useMutation** hook, and use it to write received data to the cache.
We do, however, need in instance of our client on which to use the **writeQuery** method to update our cache. The **update** method does get passed a **cache** argument, but we will not use it as the changes we make to cache that way might not be immediately rendered, while the **client** verion will. 

We can get access to our instance of the client from the **useMutation** hook, by destructuring it from the returned response object. This object will be **undefined** until we actually sucessfully perform our mutation, hence the **optional chaining operator** - the **?** sign in the body of the **update** method.

```js
    // login.page.ts
    const [loginMutation, { client }] = useMutation<LoggedUserInterface>(
        LOGIN_MUTATION_QUERY,
        {
            ...
            update: (_cache, { data }) => { // not using the cache argument
                client?.writeQuery({...})
```

To update the cache, we will use an options object with the same **query** that we used when we initialized our cache. The **data** object in the options will be of the same shape as the initialized one, too, but we will now assign values from our mutation response to its properties. The one cache field that we do not have in the response, the **isLoggedIn** property, we will just assign a boolean value of **true**, to indicate that there a logged user is now using our app. 

```js
    // login.page.ts
    const [loginMutation, { client }] = useMutation<LoggedUserInterface>(
        LOGIN_MUTATION_QUERY,
        {
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
                            },
                        },
                    });
                },
            ...
```

Great. Let's refresh our app and login again to see what happens with our cache in Apollo Client Developer Tools.

```js
    ROOT_QUERY
        login:
            {
                "__typename": "Me",
                "first_name": "karlo",
                "avatar_link": "https://source.unsplash.com/225x225/?portrait",
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTU5NTQwMDg0MSwiZXhwIjoxNTk1NDAyNjQxfQ.IHNDay4lALabeIYfVO3rqEFM9SkDDEmQKKIVF1JOKDw",
                "isLoggedIn": true
            }
```

Great. Cache has updated, and we have the logged user's data stored for use throughout the app. 

### Use login data from the cache in the Header component

The Header component is the only component (beside the **App** component) always seen in our app. Because of this we will use it to show information about the logged user.

We render current user's avatar and name in the header. Since there is no logged user when the app runs for the first time, there will be no user data in the cache, so the Header component will render empty strings. This is ok.

In this part we will: 

1. Use Apollo hooks in the Header component to fetch information about the logged user from the cache
2. Render user's name and avatar in the Header component

#### Use Apollo hooks in the Header component to fetch information about the logged user from the cache

We already have the Header component created, so we will just create our query and implement the **useQuery** hook. 
I did, however, adjusted the component to be a **container** instead of a plan view component. I changed its file name from **header.component.tsx** to **header.container.tsx**, and moved it from the **components** to **containers** folder. 
It is mostly a matter of preference, to do with organizing components in a way that those handling logic are considered **containers**, while those dealing only view presentation are **components**. It is a very blurry distinction, especially in this case where our Header does both tasks, but I just prefer to have components with logic sorted under **containers**.

Remember that we are now querying data from the cache, so we need to adjust our query to do so. We do it by adding **@client** after the query name:

```js
    // header.container.tsx
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
```

Next up, we implement the **useQuery** hook by passing it our query. The hook will query our cache because we included **@client** in the query, and it will always return a response. 

Notice that we destructure the **data** property from the response, and then destructure its own properties further down to finally reach **first_name** and **avatar_link** properties. To make TS know that these properties indeed exist, we cast the **useQuery** expression as an object of the same shape as the destructured **data**. 
We could have also used this same object as a concrete type for the **useQuery** hook, but that would allow for a possibility of **data** being **undefined**, and return destructurig would not be possible in the way we want it.

```js
    // header.container.tsx
    ...
    const { data: { login: { first_name, avatar_link }}} = useQuery(GET_LOGGED_USER_AT_CLIENT) as { data: { login: { first_name: string; avatar_link: string }}};
    ...
```

#### Render user's name and avatar in the Header component

We have defined **first_name** and **avatar_link** variables, and we can render them in the Header component:


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
                    <li className="navigation__option first-option">
                        <Link className="option__link-actual" to="/profile">
                            <div className="link-actual__avatar-container">
                                <img src={avatar_link} alt="" />
                            </div>
                            {first_name && (
                                <span className="link-actual__text">
                                    Hi, &nbsp; <strong>{first_name}</strong>
                                </span>
                            )}
                        </Link>
                    </li>
```

Great. Try and login now, and see what happens to the header. Login mutation should result in updating the cache, which should cause the name and avatar to change and update the header. 
In case no login happens, user image and name have a value of empty string, getting it from the cache initial state. 

#### Redirect client on successful mutation

Once our mutation completes, we want user to actually visit the home page.
We can use **React Router**'s **Redirect** component to do this. We will also need React's **useState** hook to create one state for the page we want to redirect the client to, and another state to control whether the redirection should happen or not. 

We could control both with one state, setting it initially to an empty string (the empty string being a "falsy" value, preventing **Redirect** component from being rendered), and then to **"home** once the mutation completes. This, however, would make it a bit harder to possibly redirect the client to a some other route in a future expansion of the app, so let's stick with two states.

All of the following code is written in the **Login** component.

Here are the states:

```js
    // login.page.tsx
    const LoginPage = () => {

        const [redirectRoute, setRedirectRoute] = useState<string>("home");
        const [doRedirect, setDoRedirect] = useState<boolean>(false);

```

Here is the conditional rendering of the **Redirect** component:

```js
    // login.page.tsx
    const LoginPage = () => {
        ...
        return (
            ...
                        </section>
                    {doRedirect && <Redirect to={`/${redirectRoute}`} />}
                </LoginStyled>
            </Layout>
        )
        ...
```

And finally, here is the the **onCompleted** method, setting the **doRedirect** state to true and redirecting the client to the **"/home"** route.

```js
    // login.page.ttsx
    const LoginPage = () => {
        ...
        const [loginMutation, { client }] = useMutation<LoggedUserInterface>(
            LOGIN_MUTATION_QUERY,
            {
                onCompleted: (data) => {
                setDoRedirect(true);
            },
        ...
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
7. Set up Apollo Client so we can work with cookies and headers
8. **Create login functionality**
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
