---
title: 'GraphQL & React & JWT: Register Functionality'
date: 2020-08-16 21:26:21
tags:
- frontend
- jwt
- authentication
- graphql
- apollo
categories: graphql & react & jwt
cover: markus-spiske-KWQ2kQtxiKE-unsplash.jpg

creditArtist: Markus Spiske
creditSource: https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 12 of 12 in GraphQL & React & JWT

The last functionality is the **register** one. The functionality is very similar to the **login** one, in that we have a mutation that accepts arguments, which are extracted from references to form inputs on the register page.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 12. Create register functionality

Here is what we do:

1. Create register component
2. Gather user inputs for mutation submission and make sure they are valid and that the two passwords match
3. Create the mutation query, implement the **useMutation** hook with the **onError** options object property, and call mutation method inside the submit handler
4. Update Apollo Client cache on successful mutation
5. Redirect client on successful mutation

You probably noticed that these steps are exactly the same as the ones we had when we created the **login** functionality. Because of this, we will not go too deep in the whole thing.

### Create register component

We will just focus on the returned JSX here. Note that we have two password fields, the second one used to confirm the entered password.

```js
    // register.page.tsx
    ...
    return (
          return (
            <Layout>
                ...
                <form className="register-section__register-form" onSubmit={handleRegister} >
                    <label htmlFor="firstName" className="register-form__label">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="register-form__input"
                        ref={firstNameInput}
                        required
                    />
                    <label htmlFor="lastName" className="register-form__label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="register-form__input"
                        required
                        ref={lastNameInput}
                    />
                    <label htmlFor="email" className="register-form__label">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="register-form__input"
                        required
                        ref={emailInput}
                    />
                    <label htmlFor="password" className="register-form__label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="register-form__input"
                        required
                        ref={passwordInput}
                    />
                    <label htmlFor="confirmPassword" className="register-form__label">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="register-form__input"
                        required
                        ref={confirmPasswordInput}
                    />
                    <button type="submit" className="register-form__register-button">
                        Register
                    </button>
                </form>
                ...
            </Layout>
        );
    )
```

### Gather user inputs for mutation submission and make sure they are valid and that the two passwords match

We will use the **useRef** hook again, to create references to inputs. Then, we will create a mutation handler, and use it to verify that inputs are valid before we actually perform the mutation. We will also make sure that the **password** and **confirmPassword** inputs have same values.

Here are the references:

```js
    // register.page.tsx
    ...
    const RegisterPage = () => {
        const firstNameInput = useRef<HTMLInputElement>(null);
        const lastNameInput = useRef<HTMLInputElement>(null);
        const emailInput = useRef<HTMLInputElement>(null);
        const passwordInput = useRef<HTMLInputElement>(null);
        const confirmPasswordInput = useRef<HTMLInputElement>(null);
    ...
```

And here is the handler, with both simple input validation and password inputs check. Note that we are setting a placeholder on the **confirmPassword** input in case passwords do not match. We need to make sure that the passwords match before we can call the mutation method.

```js
    // register.page.tsx
    ...
    const RegisterPage = () => {
        ...
        const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const enteredFirstName = (firstNameInput.current as HTMLInputElement).value;
            const enteredLastName = (lastNameInput.current as HTMLInputElement).value;
            const enteredEmail = (emailInput.current as HTMLInputElement).value;
            const enteredPassword = (passwordInput.current as HTMLInputElement).value;
            const enteredConfirmPassword = (confirmPasswordInput.current as HTMLInputElement)
            .value;

            if (
                !enteredFirstName ||
                !enteredLastName ||
                !enteredEmail ||
                !enteredPassword ||
                !enteredConfirmPassword
            ) return;

            if (enteredPassword !== enteredConfirmPassword) {
                (confirmPasswordInput.current as HTMLInputElement).value = "";
                return (confirmPasswordInput.current as HTMLInputElement).setAttribute(
                    "placeholder",
                    "Passwords do not match"
                );
            }
            ...
```

### Create the mutation query, implement the **useMutation** hook with the **onError** options object property, and call mutation method inside the submit handler

The only difference from the **login** mutation query is that we provide more arguments. We still request the same data back, as both **login** and **register** mutation return the **Me** type. 

```js
    // register.page.tsx
    ...
    const REGISTER_MUTATION_QUERY = gql`
        mutation Register(
            $first_name: String!
            $last_name: String!
            $email: String!
            $password: String!
        ) {
            register(
                first_name: $first_name
                last_name: $last_name
                email: $email
                password: $password
            ) {
                first_name
                avatar_link
                access_token
            }
        }
    `;
    ...
```

The **useMutation** hook is a routine one, accepting an interface as a concrete type. Again, we do not require the **data** object returned from the mutaiton, but we do require the **client** instace.

```js
    // register.page.tsx
    ...
    interface RegisteredUserInterface {
        register: {
            __typename: string;
            first_name: string;
            avatar_link: string;
            access_token: string;
        };
    }
    ...

    const [registerMutation, { client }] = useMutation<RegisteredUserInterface>(REGISTER_MUTATION_QUERY, 
        {
            onError: (error) => {
                console.log(error);
                console.log(error.graphQLErrors);
            },
        }
    );
```

We can call the mutation method in the handler function. We will have it set variables via its options object.

```js
    // register.page.tsx
    ...
    const RegisterPage = () => {
        ...
        const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
            ...
            registerMutation({
                variables: {
                    first_name: enteredFirstName,
                    last_name: enteredLastName,
                    email: enteredEmail,
                    password: enteredPassword,
                },
            });
        };
        ...
```

### Update Apollo Client cache on successful mutation

We can use the mutation method in the handler function to update the cache too. This will login the user on the frontend, after the mutation has logged them in on the backend. 

Note the **refreshRequestHasFinished** field set to true as well. At this point, when we actually register a new user, this field should be **true** already because the **refreshAccessToken** has returned a response. We are including it, however, because cache update will overwrite the existing data, and we want to have this property in the cache too. 

```js
    // register.page.tsx
    ...
    const RegisterPage = () => {
        ...
        const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
            ...
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
                            __typename: data?.register.__typename,
                            first_name: data?.register.first_name,
                            avatar_link: data?.register.avatar_link,
                            access_token: data?.register.access_token,
                            isLoggedIn: true,
                            refreshRequestHasFinished: true,
                        },
                    },
                });
        };
        ...
```

### Redirect client on successful mutation

Finally, when the user registers, we can send them to their own profile to complete their profile. 

We can use the **onCompleted** method for this. Inside, we grab the received access token, extract user id from it, and use it to assemble a link to send the user to.

```js
    // register.page.tsx

    const RegisterPage = () => {
        ...
        const [redirectToEdit, setRedirectToEdit] = useState<number>();
        ...
        const [registerMutation, { client, data }] = useMutation<...>(REGISTER_MUTATION_QUERY, {
            onCompleted: ({ register: { access_token } }) => {

                const tokenDataString = access_token.split(".")[1];
                const jsonedData = atob(tokenDataString);
                const { userId } = JSON.parse(jsonedData) as { userId: number };

                setRedirectToEdit(userId);
            },
        ...
        return (
            ...
                {redirectToEdit && <Redirect to={`/editprofile/${redirectToEdit}`} />}
            </Layout>
        )
```

That's it. We have successfuly registered a user, logged them in, and then sent them to their own profile page. Excellent. 

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
11. Enable silent refresh of access token when it reaches its expiry period
12. **Create register functionality**

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
