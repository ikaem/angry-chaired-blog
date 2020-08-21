---
title: 'GraphQL & React & JWT: Authentication & GQL Resolvers'
date: 2020-08-16 17:43:56
tags:
- jwt
- graphql
- resolvers
categories: graphql & react & jwt
cover: greta-scholderle-moller-xe07ZDGZ-2Q-unsplash.jpg

creditArtist: Greta Schölderle Møller
creditSource: https://unsplash.com/@schoelderle?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 5 of 12 in GraphQL & React & JWT

Ok, this one is long. But, resolvers that we need to create largely follow the same logic as the ones we created in the last series. So that's good.

Resolvers are just functions which are (I guess) called by their matching mutations or queries. They need to return data in the the shape that their mutations or queries specify. They also get passed certain parameters, and have access to context that is provided by the Apollo Express Server.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 5. Create resolvers

Few special things about these resolvers, however:

1. They need to set and clear cookies
2. They need to read and set request and response headers
3. They need to deal with situations when authentication is not possible - due to invalid tokens or incorrect user inputs. We will handle these situations with errors provided by Apollo.

Ok, so we neet to make resolvers for 4 mutations:

1. login
2. refreshAccessToken
3. register
4. logout

Additionally, we want to adjust resolvers for **editUser**, **deleteUser**, and **newUser**, to make sure that only logged in users can access resources returned by those resolvers.

### Login resolver

What does the login reolver need to do? Briefly, it needs to check if a user exists in the database. If it does, it needs to check the provided password, and if all good, it needs to return the user's first name, avatar link and access token.

It also needs to generate that token, as well as a refresh one, which it needs to set as a cookie.

So, in order:

1. Get mutation arguments and grab a client from PSQL pool
2. Make sure a user exists and they have a valid password
3. Deal with cases when no matching user or invalid password
4. Grab user data required by the mutation.
5. Generate tokens and store refresh token in the database
6. Set cookie and return data from the resolver
7. Deal with possible errors

We already went through most of this stuff in the last series, so I will focus on the new things.
Note that we are using a transaction while accessing and working with the database.

**Getting arguments and grabbing a client from the connection pool**

```js
    // mutation.ts
    ...
    login: async (
        parent: any,
        args: { email: string; password: string },
        context: { pgPool: Pool; req: Request; res: Response }
    ) => {
        const { email, password } = args;
        const client = await context.pgPool.connect();
    ...
```

**Make sure a user exists and they have a valid password**

```js
    // mutation.ts
    ...
    try {
      await client.query("BEGIN");

      const userExistQuery = `
                SELECT
                    users_login.hash
                FROM
                    users_login
                WHERE
                    users_login.email = '${email}'
            `;

      const { rows }: QueryResult<{ hash: string }> = await client.query(
        userExistQuery
      );

      if (!rows[0]) throw new Error("No such user");

      const isPasswordValid = await compare(password, rows[0].hash);

      if (!isPasswordValid) throw new Error("Invalid password");
    ...
```

#### Deal with cases when no matching user or invalid password

This one is new in that we will use errors provided by Apollo. Those will repalce the simple, generic errors included aboice.
By using Apollo errors, we get better experience on the frontend, I think. These errors have more appropriate names, and include data specific to situations in which errors happened, making it easier to react to them on the frontend.

Anyway, Apollo errors come in 4 flavors:

1. AuthenticationError,
2. UserInputError,
3. ForbiddenError,
4. ApolloError

We will use the first two errors. I guess we could use the third one as well, for cases when a user attempts to edit or add a new user, but we will skip it this time.

For this particular resolver, we will use the **UserInputError**. We wil use it for cases when we cannot find a user with the email address that was provided, as well as when the password provided is not valid.

My implementation is very simple. In case when a condition is not true, I throw the said error, and include two arguments:

1. Generic message to be attached to the error
2. An object to be added to the error object, holding more info about the error

Prior to using the errors, we have to import them from "apollo-server-express".

```js
    // mutation.ts
    ...
    import { UserInputError, AuthenticationError } from "apollo-server-express";
    ...
```

Here is the errors code:

```js
    // mutation.ts
    ...
    try {
    ...

      const { rows }: QueryResult<{ hash: string }> = await client.query(
        userExistQuery
      );

      if (!rows[0])
        throw new UserInputError("Failed to login due to validation error", {
          type: "EMAIL_NOT_IN_USE",
        });

      const isPasswordValid = await compare(password, rows[0].hash);

      if (!isPasswordValid)
        throw new UserInputError("Failed to login due to validation error", {
          type: "INCORRECT_PASSWORD",
        });
    ...
```

This way, as soon as an error is thrown, the **try** block breaks, and code execution jumps to the **catch** block.

Moving on to **grab user data required by the mutation.**

```js
    // mutation.ts
    ...
    try {
    ...
    const userLoginDataQuery = `
        SELECT
            users_login.user_id,
            users_info.first_name,
            users_info.avatar_link
        FROM
            users_login
        JOIN
            users_info
        ON
            users_login.user_id = users_info.user_info_id
        WHERE
            users_login.email = '${email}';
    `;

    const {
        user_id,
        first_name,
        avatar_link,
    }: {
        user_id: number;
        first_name: string;
        avatar_link: string;
    } = await client.query(userLoginDataQuery).then(({ rows }) => rows[0]);
    ...
```

#### Generate tokens and store refresh token in the database

While we haven't done this before, it is a pretty straightforward thing.
We import our two functions for generating tokens, and then use previously acquired **user_id** to actually generate access and refresh tokens.

Then, we will access our database again, to store the newly generated refresh token into the user's account. This way we will have a valid token to compare against, when a request to refresh access token arrives to our server.

```js
    // mutation.ts
    ...
    try {
    ...
    const accessToken = generateAccessToken(user_id);
    const refreshToken = generateRefreshToken(user_id);

    const storeRefreshTokenQuery = `
        UPDATE users_login
        SET
            refresh_token = '${refreshToken}'
        WHERE
            user_id = ${user_id}
        RETURNING
            refresh_token;
    `;

    const {
        refresh_token: storedRefreshToken,
    }: { refresh_token: string } = await client
        .query(storeRefreshTokenQuery)
        .then(({ rows }) => rows[0]);

    await client.query("COMMIT");
    ...
```

#### Set cookie and return data from the resolver

We will use a cookie to store our refresh token on front end. We will use a **http-only** cookie, which is apparantely safe against ...some type of attacks... I really am not sure, and this is something to dive into sometime in the future.
For our purposes, cookies fit well into the flow of authentication, and they are easy to work with.

Once we set a cookie, its contents, and its validity period, the cookie will stay in the user's browser until it expires, even if the user closes their browser. Because of this, we can simply use this cookie to retrieve its refresh token, and automatically log a user back in when they return to our app. We will create a part of this mechanism with the **refreshAcessToken** resolver, and we will finish it when we switch to work on the frontend.

Few notes on the expiration period of a cookie:

- If we do not set the expiration of a cookie, browsers will delete it once they close. Obviously, this is not what we want.
- The **expires** property that we use in this case accepts a date in GMT format (Mon, 26 Mar 2018 17:04:05 UTC). JS **new Date** constructor returns this format by default, it seems.
- We have set the cookie to expire in 10 days from the time of its creation. You will remember that this is the same validity period as the one of our actual refresh token. The code to get this date uses **new Date** constructor to get the date right now, and then sets hours of that date to current hours + 240 hours. This results in a date ten days in future from now.

Finally, let's set that cookie. We will use the **cookie** method available on the HTTP **response** object.
The method accepts 3 arguments:

1. Name of our cookie - we will name it **refreshToken**
2. The actual data we want to store in the cookie - we store our refresh cookie
3. Options object - this one can hold several properties to define the cookie in more details. We will use only 2 - the already mentioned **expires**, and **http-only**, which we set to **true**

By making the cookie http-only, we make sure that this cookie is available only to the server, and not to the client.

Ok, here is the code:

```js
    // mutation.ts
    ...
    try {
    ...
    await client.query("COMMIT");
    ...
    context.res.cookie("refreshToken", refreshToken, {
        expires: new Date(new Date().setHours(new Date().getHours() + 240)),
        httpOnly: true,
    });
```

Once we have set the cookie, we can return data from the resolver:

```js
    // mutation.ts
    ...
    try {
    ...
    return {
        first_name: first_name,
        avatar_link: avatar_link,
        access_token: accessToken,
    };
```

#### Deal with possible errors

Our **catch** block should catch all errors that arise in the **try** block. I found it useful to actually return that error too. This way, the frontend gets more info on what actually happened in terms of errors, and then it can provide better feedback to the user

```js
    // mutation.ts
    ...
    try {
    ...
    } catch (error) {
        console.log(error);
        await client.query("ROLLBACK");
        return error;
    }
```

Ok, this should be it.

Let's test our resolver now.
We can start our backend's developer server:

```bash
    npm run dev
```

This will make our app's GraphQL Playground be available on **http://localhost:4000/grapqhl**

Now, lets try to login.
Providing the two arguments, and existing email and a valid password, our login mutation should look like this:

```
    mutation {
        login(
            email:"karlo@email.com",
            password:"karlo"
        ){
            first_name,
            avatar_link
            access_token
        }
    }
```

And here is the GQL response:

```js
    {
        "data": {
            "login": {
                "first_name": "karlo",
                "avatar_link": "https://source.unsplash.com/225x225/?portrait",
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTU5NTA2MDI3NSwiZXhwIjoxNTk1MDYyMDc1fQ.XvLbxh7goEP0qawkdOAy5OujLyaY_ZaHxVzmSh6YyRo"
            }
        }
    }
```

You see that our resolver returned name and avatar link, and it also returned our access token to us. Very cool.

Remember that we also set a refresh cookie in the resolver? Let's see how that turned out.
Open your browser's developer tools (CTRL + SHIFT + I), and go to the **Application** (Chrome) or **Storage** (FIrefox) tab. On the left hand side you should see a menu with the **cookies** option. Open it and see that there is ...no cookies?
This is ok. GraphQL Playground doesn't set cookies in your browser by default. We can change this, however, by visiting its settings (the wheel icon on the top right), and changing the value of **request.credentials** from **omit** to **include**.

Save the settings, try to login, and voila - your new cookie is here, complete with http-only check-mark and an expiration date. Lovely.

Now, let's try to error a bit.

Let's adjust our login mutation, and provide an incorrect email.

This is what we get:

```js
    {
    "errors": [
        {
        "message": "Failed to login due to validation error",
        "locations": [
            {
            "line": 2,
            "column": 3
            }
        ],
        "path": [
            "login"
        ],
        "extensions": {
            "type": "EMAIL_NOT_IN_USE",
            "code": "BAD_USER_INPUT",
            "exception": {
                "type": "EMAIL_NOT_IN_USE",
                "stacktrace": [
                    "UserInputError: Failed to login due to validation error",
                    "    at D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:186:15",
                    "    at step (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:44:23)",
                    "    at Object.next (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:25:53)",
                    "    at fulfilled (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:16:58)",
                    "    at processTicksAndRejections (internal/process/task_queues.js:97:5)"
                ]
            }
        }
        }
    ],
    "data": {
        "login": null
    }
    }
```

This looks pretty cool to me. With this, we can see exaclty what went wrong on the backend, and provide good feedback to the user.

### refreshAccessToken resolver

Out of all the functionality of the app, I find this one the most fun.
Think about it. This resolver will log you in if you return to the website (provided you haven't actually logged out), and it will also keep you logged in during your time on the website. It is a heavy duty resolver, and it was fun to wrap my head around it.

So let's do that - let's wrap our heads around it.
The resolver needs only the refresh token. It doesn't get any arguments.
It fetches the refresh token from the cookie, and extracts the **user id** from it.
It then goes to find that user, and compare the cookie's refresh token with the token stored in the user's account. If they match, we are in business. The resolver generates new access and refresh tokens, stores new refresh token in the user's account, and retrieve's the user's name and avatar link. It then sets the cookie again to hold the new refresh token, and returns all data that its muatation requires.
That's it.

Alright, in a bit more organized order:

1. We extract refreshToken cookie from cookies if it exists, and handle the error if there is no refreshToken cookie
2. We verify the refresh token, extract user id, and handle a possible error if no user id.
3. We grab a client from the connection pool and start a transaction
4. We get refresh token from the database, and throw an error if there is no refresh token in the database, or if the database refresh token is not the same as the cookie refresh token
5. We generate new tokens and update the database refresh token and get user data from the database
6. We set the refreshToken cookie, close the transaction and return data from the resolver.
7. We deal with any possible errors in the catch block

#### Extract refreshToken cookie from cookies if it exists, and handle the error if there is no refreshToken cookie

Our **refreshToken** cookie lives in the **cookies** object on the **request** object, made available to resolvers via the **context** argument.

The **cookie-parser** middleware that we installed and implemeneted in our Express app makes this possible, and now we can simply access our refreshToken cookie.

It is also possible that our refreshToken cookie does not exist. This would happen if, for instance, a user has never logged in before, or they logged out last time when they used the app (we will implement this functionality later).
In case the refreshToken cookie is not found, we will throw an **AuthenticationError**, notifying the client that its loging session has expired.
This means that no refreshToken was found (maybe 10 days passed), and we need the client to login again, to receive a new refresh token.

Note that the **AuthenticationError** doesn't get passed a second argument, like we did with the **UserInputError**. It is becuase AuthenticationError doesn't accept the second argument, so we work with what we have.

Ok, here is the code:

```js
    // mutation.ts
    ...
    refreshAccessToken: async (
        parent: any,
        args: any,
        context: { pgPool: Pool; req: Request; res: Response }
    ) => {
        const { refreshToken } = <{ refreshToken?: string }>context.req.cookies;

        if (!refreshToken) throw new AuthenticationError("Your session has expired. Please login again");
    ...
```

#### Verify the refresh token, extract user id, and handle a possible error if no user id.

Next up is actually getting that user id from the token.
We will use the **jsonwebtoken**'s **verify** method to do this. The method checks out token to make sure it is valid, and if everything is good, it decodes the payload and returns an object with the payload.
If there is an issue with verification, the method will throw an error, which will be returned by the resolver.

We already saw the **verify** method in action when we created functions to generate tokens, so we won't go into it much.

The user id that we get return is just one property in the returned object, so we destructure it, and then also check if it actually has a truthy value, before we move on to work with the database.

```js
    // mutation.ts
    ...
    const { userId } = <{ userId: number | undefined }>(
      verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!)
    );

    // const { userId } = <{ userId: number | undefined }>(
    //   verify(refreshToken, "incorrect secret")
    // );

    if(!userId) throw new AuthenticationError("Unknown user. Please login again");
    ...
```

**Grab a client from the connection pool and start a transaction**

```js
    // mutation.ts
    ...
    const client = await context.pgPool.connect();

    try {
      await client.query("BEGIN");
    ...
```

**Get refresh token from the database, and throw an error if there is no refresh token in the database, or if the database refresh token is not the same as the cookie refresh token**

```js
    // mutation.ts
    ...
    try {
      await client.query("BEGIN");

      const getUserRefreshTokenQuery = `
        SELECT
          users_login.refresh_token
        FROM
          users_login
        WHERE
          user_id = ${userId}
      `;

      const { refresh_token: dbRefreshToken } = <
        { refresh_token: string | undefined }
      >await client.query(getUserRefreshTokenQuery).then(({ rows }) => rows[0]);

      if(!dbRefreshToken) throw new AuthenticationError("Your session has expired. Please login again.")

      if (refreshToken !== dbRefreshToken)
        throw new AuthenticationError(
          "Your session has expired. Please login again."
        );
    ...
```

**Generate new tokens and update the database refresh token and get user data from the database**

```js
    // mutation.ts
    ...
    try {
    ...
        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = generateRefreshToken(userId);

        const updateUserRefreshTokenQuery = `
            UPDATE users_login
            SET
            refresh_token = '${newRefreshToken}'
            WHERE
            user_id = ${userId}
            RETURNING
            user_id,
            refresh_token;
        `;

        await client.query(updateUserRefreshTokenQuery);

        const getUserInfoQuery = `
            SELECT
            first_name,
            avatar_link
            FROM
            users_info
            WHERE
            user_info_id = ${userId}
        `;

        const { first_name: refreshFirstName, avatar_link: refreshAvatarLink } = <
        { first_name: string; avatar_link: string }
        >await client.query(getUserInfoQuery).then(({ rows }) => rows[0]);
    ...
```

**Set the refreshToken cookie, close the transaction and return data from the resolver.**

```js
    // mutation.ts
    ...
    try {
    ...
    context.res.cookie("refreshToken", newRefreshToken, {
        expires: new Date(new Date().setHours(new Date().getHours() + 240)),
        httpOnly: true,
    });

    await client.query("COMMIT");

    return {
        first_name: refreshFirstName,
        avatar_link: refreshAvatarLink,
        access_token: newAccessToken,
    };
    ...
```

**Deal with any possible errors in the catch block**

```js
    // mutation.ts
    ...
    catch (error) {
        console.log(error);
        await client.query("ROLLBACK");
        return error;
    }
    ...
```

Ok, that's it. Let's test this resolver too.

To successfully test it, we just need to have a valid refreshToken cookie stored on our client. We can use the **login** mutation to get one, and then we can call the **refreshAccessToken** too.

```
    mutation {
        refreshAccessToken {
            first_name,
            avatar_link,
            access_token
        }
    }
```

The response we get is the same as the one for the **login** mutation, and this is exactly what we want:

```js
    {
        "data": {
            "refreshAccessToken": {
                "first_name": "karlo",
                "avatar_link": "https://source.unsplash.com/225x225/?portrait",
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTU5NTA3NjI0NiwiZXhwIjoxNTk1MDc4MDQ2fQ.r9j1Uc-9IYXRJyjO3_7avb22HPVxCzqvwarWJehX7u8"
            }
        }
    }
```

Should we test an error? Let's do it. Let's try to call this mutation with no refreshToken cookie present on our client.
We can delete the cookie by going to the browser's developer tools, then to **Application/Storage** tab, **Cookies** option, select the url there (probably **localhost:4000**), and then right click on the refreshToken in the right-hand panel and delete the cookie.

Try to run the mutation now.
Here is the response:

```js

    {
    "errors": [
        {
        "message": "Your session has expired. Please login again",
        "locations": [
            {
            "line": 2,
            "column": 3
            }
        ],
        "path": [
            "refreshAccessToken"
        ],
        "extensions": {
            "code": "UNAUTHENTICATED",
            "exception": {
            "stacktrace": [
                "AuthenticationError: Your session has expired. Please login again",
                "    at D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:411:13",
                "    at step (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:44:23)",
                "    at Object.next (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:25:53)",
                "    at D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:19:71",
                "    at new Promise (<anonymous>)",
                "    at __awaiter (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:15:12)",
                "    at refreshAccessToken (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\src\\gql\\resolvers\\mutation.ts:404:59)",
                "    at field.resolve (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\node_modules\\graphql-extensions\\src\\index.ts:274:18)",
                "    at field.resolve (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\node_modules\\apollo-server-core\\src\\utils\\schemaInstrumentation.ts:103:18)",
                "    at resolveFieldValueOrError (D:\\WebDev\\Ja\\quickies\\GrapQL JWT\\graphql-jwt-api\\node_modules\\graphql\\execution\\execute.js:486:18)"
            ]
            }
        }
        }
    ],
    "data": {
        "refreshAccessToken": null
    }
    }
```

Beautiful. It is exactly what we need.

### Register resolver

The **register** resolver is not much more complicated than the **login** one.
We want it to check the database to see if there is a user using a provided email, we generate tokens, we set a cookie an store a refresh token in database, and we return the same data.

Few differences that we have concern not allowing a new user to use an already used email address (we don't neccessarily need to do this - we could aim to have a unique combination of a name and email, and set a constraing in PSQL to reflect that) and hashing and storing password. So not that much really.

Let's go over it:

1. Destructure arguments and grab a client form the connection pool
2. Make sure that the provided email is not in use
3. Hash and store password, store email, and retrieve the new user's id
4. Generate refresh and access tokens, and store refesh token and user data in database
5. Set cookie and return data from the resolver
6. Deal with any possible errors

**Destructure arguments and grab a client form the connection pool**

```js
    // mutation.ts
    ...
    register: async (
        parent: any,
        args: {
            email: string;
            password: string;
            first_name: string;
            last_name: string;
        },
        context: { pgPool: Pool; req: Request; res: Response }
    ) => {
        const { email, password, first_name, last_name } = args;
        const client = await context.pgPool.connect();
    ...
```

**Make sure that the provided email is not in use**

```js
    // mutation.ts
    ...
    try {
      await client.query("BEGIN");

      const isUserExistQuery = `
        SELECT
          users_login.user_id
        FROM
          users_login
        WHERE
          users_login.email = '${email}';
      `;

      const isUserExistResponse: QueryResult<{
        user_id: number;
      }> = await client.query(isUserExistQuery);

      if (isUserExistResponse.rows.length > 0)
        throw new UserInputError("This email address is already in use.", {
          type: "EMAIL_IN_USE",
        });
    ...
```

**Hash and store password, store email, and retrieve the new user's id**

```js
    // mutation.ts
    ...
    try {
    ...
    const hashedPassword = await hash(password, 10);

    const registerUserLoginQuery = `
        INSERT INTO
          users_login(email, hash)
        VALUES
          (
            '${email}',
            '${hashedPassword}'
          )
        RETURNING
            user_id;
    `;

    const { user_id }: { user_id: number } = await client
        .query(registerUserLoginQuery)
        .then(({ rows }) => rows[0]);
    ...
```

**Generate refresh and access tokens, and store refesh token and user data in database**

```js
    // mutation.ts
    ...
    const accessToken = generateAccessToken(user_id);
    const refreshToken = generateRefreshToken(user_id);

    const insertRefreshTokenQuery = `
        UPDATE
            users_login
        SET
            refresh_token = '${refreshToken}'
        WHERE
            email = '${email}';
    `;

    await client.query(insertRefreshTokenQuery);

    const registerUserInfoQuery = `
        INSERT INTO
            users_info(user_info_id, first_name, last_name, avatar_link)
        VALUES
            (
            ${user_id},
            '${first_name}',
            '${last_name}',
            'https://api.adorable.io/avatars/225/abott@adorable'
            )
        RETURNING
            first_name as registered_first_name,
            avatar_link as registered_avatar_link;
    `;

    const {
    registered_first_name,
    registered_avatar_link,
    } = await client.query(registerUserInfoQuery).then(({ rows }) => rows[0]);

    await client.query("COMMIT");
    ...
```

**Set cookie and return data from the resolver**

```js
    // mutation.ts
    ...
    context.res.cookie("refreshToken", refreshToken, {
        expires: new Date(new Date().setHours(new Date().getHours() + 240)),
        httpOnly: true,
    });

    return {
        first_name: registered_first_name,
        avatar_link: registered_avatar_link,
        access_token: accessToken,
    };
    ...
```

**Deal with any possible errors**

```js
    // mutation.ts
    ...
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
      return error;
    ...
```

Another one down.

You can go and test it yourself. You need to call **register** mutation, provide 4 arguments, and request some data back - **first_name**, **avatar_link**, or **access_token**, or all of them.
Go for it.

### Logout resolver

Logout resolver is very simple and short. Id doesn't require any arguments, instead getting its data from the access token.

It does only 3 things:

1. Delete refresh token from the user's account
2. Delete refreshToken cookie
3. Returns true or false

Since it is very short and simple, here is the whole thing here.

Note how we delete the **refreshToken** cookie: we set the value to empty string, and we backdate the **expires** property in the options object. This will cause the browser to remove the token.

Also, see that **AuthenticationError**? It is thrown when the **user** property (made by **express-jwt** middleware) on the **request** object is null. It means that there is no access token in headers, or the access token is invalid. 

```js
    // nmutation.ts
    ...
    logout: async (
        parent: any,
        args: any,
        context: { pgPool: Pool; req: Request; res: Response }
    ) => {
        const {
        req: { user },
        } = context;

        if (!user) throw new AuthenticationError("User is already logged out");

        const client = await context.pgPool.connect();

        try {
        await client.query("BEGIN");

        const LOGOUT_QUERY = `
            UPDATE users_login
            SET
            refresh_token = 'd'
            WHERE
            user_id = ${user.userId}
        `;

        await client.query(LOGOUT_QUERY);

        context.res.cookie("refreshToken", "", {
            expires: new Date(new Date().setHours(new Date().getHours() - 240)),
            httpOnly: true,
        });

        await client.query("COMMIT");
        return true;

        } catch (error) {
            console.log(error);
            await client.query("ROLLBACK");
            return false;

        } finally {
            client.release();
        }
    },
```

Let's test the logout mutation. Since the mutuation requires request headers to have an access token, we need to supply one. 

So make the login mutation first, and copy that access_token from the response. Nice. We are logged in now.  
Then open the **HTTP HEADERS** bar on the bottom of your GraphQL playground window, and enter the following in the code area:

```js
    {
        "authorization": "Bearer <YOUR_ACCESS_TOKEN_WITHOUT_THESE_POINTY_BRACKETS>"
    }
```

In the same GraphQL Playground tab make a logout mutation:

```
    mutation {
        logout
    }
```

And what do we get? 

```js
    {
        "data": {
            "logout": true
        }
    }
```

### Adjust existing resolvers 

To adjust **editUser**, **deleteUser**, and **newUser** resolvers, we just have to make sure there is a valid **user** object on the **request** object. The **express-jwt** does majority work for us, and we only have to check to make sure this object is not null, to allow the resolver to proceed with its code. 

Here are relevant snippets from all resolvers combined:

```js
    // mutation.ts
    ...
    newUser: async (
        parent: any,
        args: newUserArgs,
        context: { pgPool: Pool; req: Request; res: Response }
    ) => {
        const { req: { user } } = context;
        
        if (user === null) throw new AuthenticationError("Please login to add a new profile");
    ...
    editUser: async (
        parent: any,
        args: editUserArgs,
        context: { pgPool: Pool; req: Request }
    ) => {
        const { req: { user } } = context;
        if (user === null) throw new AuthenticationError("Please login to edit profile");
    ...
    deleteUser: async (
        parent: any,
        args: { user_id: number },
        context: { pgPool: Pool; req: Request }
    ) => {
        const { req: { user } } = context;
        if (user === null) throw new AuthenticationError("Please login to edit profile");
    ...
```

Thats it. Go and test these resolvers with and without access tokens.

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
5. **Create resolvers**
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