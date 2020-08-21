---
title: 'GraphQL & React & JWT: Create JSON Web Tokens'
date: 2020-08-16 16:56:29
tags: jwt
categories: graphql & react & jwt
cover: abigail-keenan-8-s5QuUBtyM-unsplash.jpg

creditArtist: Abigail Keenan
creditSource: https://unsplash.com/@akeenster?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 2 of 12 in GraphQL & React & JWT

We will stray from the GQL path a bit, to get introduced to JSON Web Tokens and figure out how to create them.
From what I understand, JWT are signed strings that hold data. They are used to prove certain claims on both ends of our app. For instance, we would have our server create a JWT, which would claim that a user for which this token is created is in fact logged into their account. Our client would then accept this claim as a proof of successful login, and would treat current user as logged in. 
This is a very simple and very limited explanation. It works for me, however, so let's move on.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 2. Create functions to generate JSON Web Tokens

When we create a JWT, we can:

1. Choose which data it will hold
2. Specify when it will expire
3. Choose a secret key with which we will sign 

To do the above things, we will use a package called **jsonwebtoken**. 
We will also use the package to **verify** that our tokens are in fact valid.

Ok, so in this part we will 

1. Install jsonwebtoken
2. Create utility functions to generate access and refresh tokens

### Install jsonwebtoken

Easy, this one really. In the root folder of our project, we just intall the package from npm

```bash
    npm i jsonwebtoken
```

As jsonwebtoken package doesn't come TS ready, and we are using TS in our app, we also need to install types so that TS compiler can work with the package.
We install this as a dev dependency, because we only need the types during developing phase.

```bash
    npm i -D @types/jsonwebtoken
```

### Create utility functions to generate access and refresh tokens

To create a token, jsonwebtoken package provides the **sign** method. We get this method as a named import from the jsonwebtoken package

The method accepts 4 arguments:

1. Payload, or the data that we want our JWT to hold
2. A key used to sign, and later verify the token
3. An object holding additional options such as expiration period
4. Optional callback function. In case a callback function is provided, the sign method acts asynchronously, returning a type **void**. The actuall callback gets passed an error and token arguments, which we can work with. With no callback, the sign function returns the actual token, of **string** type.

Here are examples of both sync and async implementations:

```js
    import { sign } from "jsonwebtoken";

    const syncSign = sign(
        { userId: 3 }, // payload
        "hello", // secret key
        { expiresIn: "30min" } // options
    );

    const asyncSign = sign(
        { userId: 3 }, // payload
        "hello", // secret key
        { expiresIn: "30min" }, // options
        (err, token) => {
            if(err) thrown new Error("some message");
            console.log(token);
        } // the callback
    );
```

To check if a token is valid, we can use the **verify** method provided by the jsonwebtoken package.

The **verify** method accepts 3 arugments;

1. Actual token that we want to verify
2. The key that we used to create the token in the first place
3. Optional callback function which, if provided, makes the **verify** an async method. It accepts an error and a decoded arguments. With no callback, the **verify** method returns a decoded object holding data that we originally included in the token, while the callback makes the method return the **void** type

Here are the examples: 

```js
    import { verify } from "jsonwebtoken";

    const decoded = verify( // returning string | object
        test, // token
        "hello" // secret key
    );

    const decoded = verify( // returning "void"
        test, // token
        "hello", // secret key
        (err, decoded) => {
            if(err) return console.log(err);
            console.log(decoded);
        } // the callback
    );
```

Now that we have that figured out, lets create functions to generate access and refresh tokens. We will use these functions to generate new tokens withing resolvers for this project's mutations.

To briefly introduce access and refresh tokens, the two are both valid tokens, used for authentication, and created in pretty much the same way. 
They do, however, serve different purposes in the flow of user authentication. 

The access token is used to log in a user, and to prove that they are authorized to access certain resources. For example, we use it to allow a user to create a new user, or edit an existing user.

Refresh token, on other hand, is used to prove that a user has been logged into their account at some point during the refresh token's validity period. It is used, in our case at least, to seamlessly keep a user logged in during their time spent using the app. It is also used to automatically log in a user should they return to our app, without them needing to actually log back in manually.

#### Function to generate access token

Prior to creating functions, we will generate secret keys as environmental variables. This way we will always have them available for signing and verifying tokens. 

We can use any string for a secret key, but we will generate one by using Node's **crypto** module. This way we get a neat combination of random characters (I guess).

To get a string, we just enter Node console in the terminal:

```bash
    node
```

Then, we require the crypto module, call the **randomBytes** function on it, and covert the result to string in **Base64** form.

```bash
    require("crypto").randomBytes(64).toString("base64");
```

The output is our string, and we can use it as a secret key.

We will get two of these, and assigned them as values for JWT_ACCESS_TOKEN_SECRET and JWT_REFRESH_TOKEN_SECRET in our already existing **.env** file in the root of the project:

```

// .env

    PORT = 4000

    JWT_ACCESS_TOKEN_SECRET = Vjn65E5O4d5N3SZ080fspfIywWu8TTHQXyqDBo329NJrYBlDfPjL2ePanhgoxdv25YeaVqbUIpgTd8NF0vxXmw==
    JWT_REFRESH_TOKEN_SECRET = Bf3FZPE6zoxnocrNtVjzeKqa7RAw6cIifksAeYZ3eU4Y0R++QQvHA3CmMjaZ2iddUHIUZ7lMITzLnujJkkIhoA==

```

Now on to creating the function.

We create another folder in the **src** folcer of our project, and we call it **utils**.
Inside, we create a file called **tokens.ts**

Now, in the file, we will import two things from the **jsonwebokenpackage**:

1. The **sign** method,
2. And the **Secret** TS type

```js
    // utils/ tokens.ts
    import { sign, Secret } from "jsonwebtoken";
```

Next, we will create two constants in which to store our environmental variables we just created. 
We will cast these expressions as **Secret**, to make sure the secret constants don't have a possible **undefined** value. 
Passing a possbile **undefined** value as a key to the **sign** method would cause TS to throw an error, telling us that undefined cannot be used as a parameter of type **Secret**

```js
    // utils/ tokens.ts
    ...
    const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as Secret;
    const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as Secret;
```

Finally, we create the function. It is a simple function that just accepts a single parameter, and return the result of the **sign** method.
We will also export it as a named export.

The token inside will:

- Hold a user id
- Be signed with **ACCESS_SECRET**
- Last for 30 minutes

```js
    // utils/ tokens.ts
    ...
    export const generateAccessToken = (userId: number) => {
        return sign({ userId }, ACCESS_SECRET, { expiresIn: "30min" });
    };
```

The validity period of this token will cause it to become invalid 30 minutes after it was generated. Any attempt to access a backend resource that requires authentication after this period will fail, and user will need to login again.

Of course, we don't want the user to be logging in every 30 minutes. 

#### Function to generate refresh token

Refresh token comes in to the rescue. 

The function that generates a refresh token is pretty much the same as the above one. The only difference is that the token it generates is valid for 10 days. 
This way, if a user has a valid refresh token stored somewhere in the app, we can use it to automatically log them in. 

Here is the function:

```js
    // utils/ tokens.ts
    ...
    export const generateRefreshToken = (userId: number) => {
    return sign({ userId }, REFRESH_SECRET, { expiresIn: "10 days" });
    };
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

1. Create types and mutations
2. **Create functions to generate JSON Web Tokens**
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
