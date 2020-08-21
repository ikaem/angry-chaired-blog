---
title: 'GraphQL & React & JWT: Middleware && JWT Validity'
date: 2020-08-16 17:06:46
tags: 
- jwt
- middleware
- express
categories: graphql & react & jwt
cover: arseny-togulev-GKLQ8PJuCzI-unsplash.jpg

creditArtist: Arseny Togulev
creditSource: https://unsplash.com/@tetrakiss?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 3 of 12 in GraphQL & React & JWT

When a user sends a request to our backend, we want to check if their access token is valid. 
We will set up requests to have a place for access token in their headers. This way access token will be sent to the backend with every request.
The only thing we need to do on backend is to inspect the token - does it exist at all, and if yes, is it valid. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 3. Setu up middleware to check if tokens are valid

We could do this in our resolvers, by accessing the **headers** property on our request, searching for a specific header that holds our token, and extracting and verifying it. 

We can also use a middleware in our server.ts file. Middlewares intercept requests made to the server, do something, and then pass requests on, to wherever they need to go. 

We will two middlewares in our case:

1. A middleware to check if access token is valid
2. A middleware to check if the middleware above threw a specific error, and handle the error

The first middleware, a package called **express-jwt**, creates a **user** property on our request, and stores token payload inside it. This only happens if the access token is verified. If the verification fails, the middleware throws an error, and our app breaks. 
I didn't want this, so we will use the second middleware to deal with this.

We will also need to adjust a TS type (interface, actually) for the Express requests, so we get a TS support for that **user** property created on our requests.

So here is what we do:

1. Implement **express-jwt** middleware
2. Implement middleware to handle a specific token-related request error
3. Adjust Express request type to get better Typescript support

### Implement **express-jwt** middleware

First, we need to install **express-jwt**

```bash
    npm install express-jwt
```

Since we are using TypeScript, and epxress-jwt doesn't come with included types, we need to install those as well. 
We install them as a dev dependency

```bash
    npm i -D @types/express-jwt
```

Next, we need to actually include the package in our app.

We will import it into our **server.ts**:

```js
    // server.ts
    import expressJwt from "express-jwt";
```

To use the package, we have have to pass the **expressJwt** to our express instance, **app**

The **expressJwt** accepts an argument itself - an object which holds multiple properties. We will have it hold 3:

1. **secret**, a string holding the secret key that we used to actually generate an access token
2. **algorithms**, an array specifying algorithmas we used to sign the token. In our case we have a default one - "HS256"
3. **credentialsIsRequired**, a boolean to specify whether the middleware will throw an error in case there is no token in the header. We will use **false** to let the middleware know that no token is fine.

Here is the code

```js
    // server.ts
    ...
    app.use(
        expressJwt({
            secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
            algorithms: ["HS256"],
            credentialsRequired: false,
        })
    );
```

With this setup, our requests should first be intercepted by the middleware to check for a valid access token. If the token is valid, the middleware will create a **user** property on the request, and we will have our user id in this object. 
If there is no access token in the headers (the value of "" - empty string), this is fine too.

And, if the access token is not valid, such as being expired, or maybe incomplete, or invalid in any other way, the middleware will throw an error, halting our application. 

### Implement middleware to handle a specific token-related request error

Now, I don't want the middleware to halt my application just because the access token was invalid. Invalid tokens happen - they can expire, and why should the whole app suffer for it?

To avoid breaking the app, we will introduce another middleware - an error handling middleware. 
Same as with the **express-jwt**, we will pass it as an argument to the express instance, **app**. This way, if any of the middlewares throw an error, this error will be automatically passed to our error handling middleware, in which we decide what to do about it.

In this case, we will check if the error is an **UnauthorizedError** - a type of error thrown by the **express-jwt** in case a token is invalid.
If the thrown error is a such error indeed, we will create a **user** property on the request, give it a value of **null**, and move on.
With this approach, we will get a **user** property on each request, no matter what. Then, we can simply check that propery in our resolvers, and act accordingly.

To move on with the code execution, we call the **next()** function, which is passed to middlewares as a way to pass requests on to wherewer they need to go.

Error handling middleware accepts four arguments. The first one has to be an **error** argument, of type **Error**, to indicate this is indeed an error handling middleware. 
Others are **request**, **response**, and the already-mentioned **next** arguments, each of their own matching types.

Here is the code:

```js
    // server.ts
    app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (err.name === "UnauthorizedError") {
            req.user = null;
            }
        next();
    }
    );

```

### 3. Adjust Express request type to get better Typescript support

With both of our middlewares worked into the app, we will always get a **user** property on our requests. 
But, the **Express**' default** **Request** type does not specify this property as a part of requests coming to the server. 

Because of this, us assigning **req.user** to have a value of **null** in the error handler will make TS complain that this property does not exist on the **Request** type. 

To fix this, we can adjust the **Request** type to actually have this property, and remove the TS error. Additionaly, we will get a nice autocompletion bonus that will list all properties avaialble on the **request** object, when accessing it.

To adjust the type, we will make use of something called **declaration merging**. It is a way to merge multiple definition of the same interface into one, complete interface, extending an object with properties that we require.

There are 2 ways to do this:

1. We can declare a new defintion in the actual file that we are working in
2. Or we can declare a new defition in a new, separate file, making it kind of specialized for this particular task. 

Both of these appraches have a global effect, meaning new properties will be recongized by TS in any file in the app. 

Here is the **first approach**. What we do is declaring a global namespace called **express**, and adding an interface called **Request** to it. 
Inside **Request** interface we define that the **user** property can be either **null**, or an object containing:

- **userId**, which is a number
- **iat**, again a number type,
- and **exp** property, which is a number again

The **iat** and **exp** properties are added to the token payload object by default - **iat** holds is a number indicating when the token was created, and **exp** holds a number indicating when the token expires. 
**userId** is a property that we added to the token's payload.

```js
    // server.ts
    declare global {
        namespace Express {
            interface Request {
                user: {
                    userId: number,
                    iat: number,
                    exp: number
                } | null;
            }
        }
    }

    import express from "express";
    ...
```

The **second approach**, the **declaration merging**, uses the same code. However, we place the code in a separate file.

Let's create a folder called **@types** in the root of our project, and then create another folder called **express** inside it. 
Inside the **express** folder, we create a new file called **index.d.ts**, to specify that this is where we store our TS defitionitions for extending default Express types.

Note that this folder and file structure mimics the default folder structure for TS types that exists in the **node_modules** folder. There too, we have a folder called **@types** which houses the an **express** folder, which in turn holds a file called **index.d.ts**.
This is the key to the apprach. Our folder structure has to match the default one in order for the mergining to work.

Now, in the newly created **index.d.ts** file, we place the same code as above (sans the express import, ofc):

```js
    // index.d.ts
    declare global {
        namespace Express {
            interface Request {
                user: {
                    userId: number,
                    iat: number,
                    exp: number
                } | null;
            }
        }
    }

    export {}
```

Note that we added an export statement at the end of the file. The export makes the file become a module, which is necessary for the .ts file to actually be used by TS (if I understand the whole thing correctly). We can, but we do not need to actually export anything - having an export statement there is enough. 
This part could also be omitted if we actually imported something to this module. For instance, we could have imported a type definition for the **user** property. This import would then be enough to make the file a module. 

Finally, we have to let TS know that we have a folder with type definitions in our project. 
We do this in the **tsconfig.json** file, where we enable the **typeRoots** property, and add names of folders with type defitions to its array. 
In this case, we first add our own **@types** folder, and then we add the originial **node_modules/@types** folder, both relative to the location of the **tsconfig.json** file.

```js
    // tsconfig.json
    ...
    "typeRoots": ["./@types", "./node_modules/@types"] /* List of folders to include type definitions from. */,
    ...
```

With this setup, TS should be able to recongize the **user** property as a part of the **request** object. Further, it also knows that it could be of **null** type, or an object that contains three properties - **userid**, **iat**, and **exp**.

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
3. **Set up middleware to check if tokens are valid**
4. Set up Cors and Apollo Express be able to deal with tokens and cookies
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
