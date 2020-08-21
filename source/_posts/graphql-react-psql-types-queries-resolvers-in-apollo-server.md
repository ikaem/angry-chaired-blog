---
title: 'GraphQL & React & PSQL: Types, Queries & Resolvers in Apollo Server'
date: 2020-08-16 14:40:21
tags: 
- graphql
- types
- queries
- resolvers
- apollo
- backend
categories: graphql & react & psql
---
<!-- Step Content Start -->

#### Part 5 of 9 in GraphQL & React & PSQL

GraphQL requires a quick setup to be able to fetch and modify data in the database. In particular, it needs to know what type of data it deals with, what are the possible queries it might receive in regards to data, and how to actually resolve those queries.
This is what we deal with in this post.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 5. Create GQL types, queries and resolvers on backend

Let's make these types, queries and resolvers. We will:

1. Create modules for **typeDefs** and **resolvers**, and use those for data manipulation
2. We will also create **context** on our instance of Apollo Server Express, and make the same connection pool available to all resolvers.

### Modules

Create folder **gql** in **src** folder.

#### TypeDefs module

Inside **gql** folder, add file called **type-defs.ts**.
Inside the file, import **gql** from apollo-server-express, then write the module as shown below.

Note the different types od data we created:

1. **User**
2. **UserForEdit**, which returns data of type User, as well as all countries available in the PSQL countries table 
3. **PaginatedUser**, returning an array with data of User type, as well as additional data of Int and Boolean type that will help us create paginatin later in the post.

```js
    // src/gql/type-defs.ts
    import { gql } from "apollo-server-express";

    export default gql`

        type Query {
            getUsers: [User]
            getUser(id: Int!): User
            getUserForEdit(id: Int): UserForEdit
            getCountries: [Country]
            getCountry(id: Int!): Country
            getPaginatedCountries(cursor: Int): PaginatedCountries
            getPaginatedUsers(cursor: Int): PaginatedUsers
        }

        type Mutation {
            newUser(
                email: String!
                password: String!
                first_name: String
                last_name: String
                country: Int
                city: String
                website: String
                age: Int
                hobbies: [String]!
                avatar_link: String
            ): User

            editUser(
                user_id: Int!
                email: String!
                first_name: String!
                last_name: String!
                country: Int!
                city: String!
                website: String!
                age: Int!
                hobbies: [String]!
                avatar_link: String!
            ): User

            deleteUser(user_id: Int): Boolean
            addCountry(country_name: String!): Country
        }

        type User {
            user_id: ID
            email: String
            first_name: String
            last_name: String
            city: String
            website: String
            age: Int
            hobbies: [String]
            country: Country
            avatar_link: String
        }

        type UserForEdit {
            user: User
            countries: [Country]
        }

        type Country {
            country_id: ID
            country_name: String
        }

        type PaginatedCountries {
            countries: [Country]
            cursor: Int
            hasNextPage: Boolean
            totalCountries: Int
            countriesPerPage: Int
        }

        type PaginatedUsers {
            users: [User]
            cursor: Int
            hasNextPage: Boolean
            totalUsers: Int
            usersPerPage: Int
        }
    `;
```

#### Resolvers modules

Now, create a new folder inside **gql**, and call it **resolvers**. We will put our resolvers modules here.

##### Query

First, lets make a module for **Query** resolvers. These are all resolvers that live directly inside the **Query** object on the resolvers object. Let's call this module - **query.ts**

Note the import of **Pool** from pg. We are doing this to use Pool as a type for pool connections that will eventually be provided to resolvers via **context**.

Few things: 

1. We are exporting an object, and include all resolvers in it as properties. 
2. We use context argument, that holds an instance of the to node-postgres' pool of connections. This way all resolvers have access to the same instance. We can call this instance with:

```js
    ontext.pgPool.query();
```

```js
    import { Pool } from "pg";

    export default {
        getCountry: async(parent: any, args: { id: number}, context: { pgPool: Pool }) => {
            try {
                const getCountryRes = await context.pgPool.query(`
                    SELECT country_id, country_name
                    FROM countries 
                    WHERE country_id = ${args.id}
                `);

                return getCountryRes.rows[0];
            }
            catch(error) {
                console.log(error);
            }
        },
        getCountries: async(parent: any, args: any, context: { pgPool: Pool }) => {
            try {
                const getCountriesQuery = `
                    SELECT country_id, country_name
                    FROM countries
                `;
                const getCountriesRes = await context.pgPool.query(getCountriesQuery);
                return getCountriesRes.rows;
            }
            catch(error) {
                console.log(error);
            }
        },
        getUsers: async(parent: any, args: any, context: { pgPool: Pool }) => {
            try {
                const userQuery = `
                    SELECT 
                        users_login.user_id,
                        users_login.email,
                        users_info.first_name,
                        users_info.last_name,
                        users_info.city,
                        users_info.website,
                        users_info."age",
                        users_info.hobbies,
                        users_info.avatar_link
                    FROM 
                        users_login
                    
                    JOIN 
                        users_info
                    ON 
                        users_login.user_id = users_info.user_info_id;
                `
                const userSelect = await context.pgPool.query(userQuery);

                return userSelect.rows
                // res.json({data: userSelect.rows});
            }
        
            catch(error) {
                console.log(error);
                // res.json(error);
            }
        },
        getUser: async(parent: any, args: { id: number }, context: { pgPool: Pool} ) => {
            try {
                const userQuery = `
                    SELECT 
                        users_login.user_id,
                        users_login.email,
                        users_info.first_name,
                        users_info.last_name,
                        users_info.city,
                        users_info.website,
                        users_info."age",
                        users_info.hobbies,
                        users_info.avatar_link
                    FROM 
                        users_login
                    
                    JOIN 
                        users_info
                    ON 
                        users_login.user_id = users_info.user_info_id
                    WHERE 
                        users_login.user_id = ${args.id}
                `
                const userSelect = await context.pgPool.query(userQuery);
                return userSelect.rows[0];
            }
        
            catch(error) {
                console.log(error);
            }
        },

        getUserForEdit: async(parent: any, args: { id: number }, context: { pgPool: Pool} ) => {

            const client = await context.pgPool.connect();

            try {
                await client.query("BEGIN");

                const userQuery = `
                    SELECT 
                        users_login.user_id,
                        users_login.email,
                        users_info.first_name,
                        users_info.last_name,
                        users_info.city,
                        users_info.website,
                        users_info."age",
                        users_info.hobbies,
                        users_info.avatar_link
                    FROM 
                        users_login
                    JOIN 
                        users_info
                    ON 
                        users_login.user_id = users_info.user_info_id
                    WHERE 
                        users_login.user_id = ${args.id}
                `;
                const userSelect = await client.query(userQuery);
            
                const countriesQuery = `
                    SELECT 
                        country_id,
                        country_name
                    FROM 
                        countries
                `;

                const countriesSelect = await client.query(countriesQuery);

                await client.query("COMMIT");

                return {
                    user: userSelect.rows[0],
                    countries: countriesSelect.rows
                };
            }
        
            catch(error) {
                console.log(error);
                await client.query("ROLLBACK");
            }
            finally {
                client.release();
            }
        },
        getPaginatedCountries: async(parent: any, args: { cursor: number }, context: { pgPool: Pool }) => {

            const limit = 3;
            const client = await context.pgPool.connect();

            try {

                await client.query("BEGIN");

                const paginatedCountriesQuery = `
                    SELECT 
                        country_id,
                        country_name
                    FROM 
                        countries
                    WHERE 
                        country_id > ${args.cursor}
                    LIMIT ${limit + 1};
                `;

                const paginatedCountriesRes = await client.query(paginatedCountriesQuery);

                const numberOfCountriesQuery = `
                    SELECT 
                        COUNT(country_id)
                    FROM 
                        countries;
                `;

                const numberOfCountriesRes = await client.query(numberOfCountriesQuery);

                const hasNextPage = paginatedCountriesRes.rows.length > limit;

                const slicedCountries = paginatedCountriesRes.rows.slice(0, limit);

                const newCursor = slicedCountries[slicedCountries.length - 1].country_id;

                await client.query("COMMIT");

                return {
                    countries: slicedCountries,
                    cursor: newCursor,
                    hasNextPage,
                    totalCountries: numberOfCountriesRes.rows[0].count,
                    countriesPerPage: limit
                };

            }

            catch(error) {
                console.log(error);
                await client.query("ROLLBACK");
            }
            finally{
                client.release();
            }
        },
        getPaginatedUsers: async(parent: any, args: { cursor: number }, context: { pgPool: Pool }) => {

            const limit = 3;
            const client = await context.pgPool.connect();

            try {

                await client.query("BEGIN");

                const paginatedUsersQuery = `
                    SELECT 
                        users_login.user_id,
                        users_login.email,
                        users_info.first_name,
                        users_info.last_name,
                        users_info.city,
                        users_info.website,
                        users_info."age",
                        users_info.hobbies,
                        users_info.avatar_link
                    FROM 
                        users_login
                    
                    JOIN 
                        users_info
                    ON 
                        users_login.user_id = users_info.user_info_id
                    WHERE 
                        user_id > ${args.cursor}
                    ORDER BY users_login.user_id
                    LIMIT ${limit + 1};
                `;

                const paginatedUsersRes = await client.query(paginatedUsersQuery);

                const numberOfUsersQuery = `
                    SELECT 
                        COUNT(user_id)
                    FROM 
                        users_login;
                `;

                const numberOfUsersRes = await client.query(numberOfUsersQuery);

                const hasNextPage = paginatedUsersRes.rows.length > limit;

                const slicedUsers = paginatedUsersRes.rows.slice(0, limit);

                const newCursor = slicedUsers[slicedUsers.length - 1].user_id;

                await client.query("COMMIT");

                return {
                    users: slicedUsers,
                    cursor: newCursor,
                    hasNextPage,
                    totalUsers: numberOfUsersRes.rows[0].count,
                    usersPerPage: limit
                };

            }

            catch(error) {
                console.log(error);
                await client.query("ROLLBACK");
            }
            finally{
                client.release();
            }
        }
    }
```

##### User

In the **User** type, we defined that it has a property of **country**, which returns data of **Country** type. Note, however, that none of the resolvers that normally return User type, actually return any country-related data.  
This is because we will create a separate resolver that will independently return country data for the User type, and it will do it every time User type is returned. Let's do it now.

Create another file, and call it **user.ts**. We wil use this file as a module, to hold resolvers for all User's properties that have more complex data types - that is, all properties that are not of basic types such as String or Integer.

In our case, the only such property is country. Since this property on the User type is called **country**, this is how we will call our resolver too.
Now, each time we query for **User** type, if we also require its **country** property, this particular resolver will be called

This is the case where we use the **parent** argument. The **parent** argument can hold all of the properties that the parent query returns.

- Parent query of the country resolver is the **User** type
- And the property of User type that we need is its **user_id** - we need it to get the country of this user.

Finally, we just export all resolvers (only **country** in our case) that we need.

```js
    import { Pool } from "pg";

    export default {
        country: async(parent: { user_id: number }, args: any, context: { pgPool: Pool }) => {
            console.log(typeof parent.user_id);
            console.log(parent.user_id);
            try {
                const getUserCountryQuery = `
                    SELECT 
                        countries.country_id,
                        countries.country_name 
                    FROM 
                        countries
                    JOIN 
                        users_info
                    ON 
                        countries.country_id = users_info.country 
                    WHERE
                        users_info.user_info_id = ${parent.user_id};
                `;

                const getUserCountryRes = await context.pgPool.query(getUserCountryQuery);
                return getUserCountryRes.rows[0];
            }
            catch(error) {
                console.log(error);
            }
        }
    }
```

##### Mutation

Finally, lets create resolvers for the **Mutation** type.

Create file **mutation.ts**, and Include code from the code block below, to create and export mutations that exist on the Mutation type.

Note the interfaces for arguments on **newUser and editUser** resolvers.

1. This is required by TS
2. We have a base interface that holds properties that both resolvers's arguments have
3. And then we create new interface for each of those resolvers, that extends the base interface, adding only a property specific for that particular interface. 

We also use bcrypt in these resolvers.

```js
    import { Pool } from "pg";
    import { hash } from "bcrypt";

    interface mutateUserArgs {
        email?: string;
        first_name?: string;
        last_name?: string;
        country?: number;
        city?: string;
        website?: string;
        age?: number;
        hobbies?: string[];
        avatar_link?: string;
    }

    interface newUserArgs extends mutateUserArgs {
        password?: string;
    }

    interface editUserArgs extends mutateUserArgs {
        user_id: number
    }

    export default {
        addCountry: async(parent: any, args: { country_name: string }, context: { pgPool: Pool }) => {
            try {
                const newCountryQuery = `
                    INSERT INTO countries(country_name)
                    VALUES('${args.country_name}')
                    RETURNING country_id, country_name;
                `;
                const newCountryRes = await context.pgPool.query(newCountryQuery);

                return newCountryRes.rows[0];
            }
            catch(error) {
                console.log(error);
            }
        },
        deleteUser: async(parent: any, args: { user_id: number }, context: { pgPool: Pool }) => {
            
            try {
                const userDeleteQuery = `
                    DELETE FROM users_login
                    WHERE user_id = ${args.user_id}
                `;

                const userDelete = await context.pgPool.query(userDeleteQuery);
                return Boolean(userDelete.rowCount);
            }
            catch(error) {
                console.log(error);
            }
        },
        editUser: async(parent: any, args: editUserArgs, context: { pgPool: Pool }) => {
            const { user_id, email, first_name, last_name, country, city, website, age, hobbies, avatar_link } = args;

            const client = await context.pgPool.connect();

            try {

                await client.query("BEGIN");
                const users_loginUpdateQuery = `
                    UPDATE users_login
                    SET 
                        email = '${email}'
                    WHERE 
                        user_id = ${user_id}
                    RETURNING 
                        user_id, 
                        email;
                `;
                const users_loginUpdate = await client.query(users_loginUpdateQuery);
        
                const users_infoUpdateQuery = `
                    UPDATE users_info
                    SET 
                        first_name = '${first_name}',
                        last_name = '${last_name}',
                        country = ${country},
                        city = '${city}',
                        website = '${website}',
                        "age" = ${age},
                        hobbies = '{${hobbies}}',
                        avatar_link = '{${avatar_link}}'
                    WHERE 
                        user_info_id = ${user_id}
                    RETURNING 
                        first_name, 
                        last_name,
                        city,
                        website,
                        "age",
                        hobbies,
                        avatar_link
                `;
        
                const users_infoUpdate = await client.query(users_infoUpdateQuery);
                await client.query("COMMIT");
        
                return { 
                    ...users_loginUpdate.rows[0], 
                    ...users_infoUpdate.rows[0]
                };
            }

            catch(error) {
                await client.query("ROLLBACK");
                console.log(error);
            }
            finally {
                client.release();
            }
        },

        newUser: async(parent: any, args: newUserArgs, context: { pgPool: Pool }) => {

            const { email, password, first_name, last_name, country, city, website, age, hobbies, avatar_link } = args;


            const client = await context.pgPool.connect();

            try {

                const hashed = await hash(password, 10);

                await client.query("BEGIN");
                const users_loginQuery = `
                    INSERT INTO users_login (email, hash)
                    VALUES ('${email}', '${hashed}')
                    RETURNING 
                        user_id, 
                        email;
                `;

                const users_loginInsert = await client.query(users_loginQuery);
        
                const users_infoQuery = `
                    INSERT INTO users_info(	
                        user_info_id,
                        first_name,
                        last_name,
                        country,
                        city,
                        website,
                        "age",
                        hobbies,
                        avatar_link

                    )
                    VALUES (
                        ${users_loginInsert.rows[0].user_id},
                        '${first_name}',
                        '${last_name}',
                        ${country},
                        '${city}',
                        '${website}',
                        ${age},
                        '{${hobbies}}',
                        '${avatar_link}'

                    )
                    RETURNING             
                        first_name,
                        last_name,
                        city,
                        website,
                        age,
                        hobbies,
                        avatar_link

                `;
        
                const users_infoInsert = await client.query(users_infoQuery);

                await client.query("COMMIT");

                return { 
                    ...users_loginInsert.rows[0], 
                    ...users_infoInsert.rows[0] 
                };
            }

            catch(error) {
                await client.query("ROLLBACK");
                console.log(error);
            }
            finally {
                client.release();
            }
        },
    };
```

##### Uniting all resolvers into a single module

At the moment we have these modules living separately, and not combined into one object.
Good practice is to combine them into one object, and than import that object into server.ts, to be used by the instance of Apollo Server Express.
We want the shape of our resolvers object to be as in the code block below:

```js
    resolvers = {
        Query: {
            different,
            resolvers,
            here
        },
        Mutation: {
            ...
        },
        User {
            ...
        }
    }
```

So let's have a place where we import all these resolvers and unite them into one object to give resolvers the necessary shape.

Create **index.ts** in the **resolvers** folder, and import all resolvers into it.
Then, export all imported resolvers as properties of the default exported object:

```js
    // src/gql/resolvers/index.ts

    import User from "./user";
    import Query from "./query";
    import Mutation from "./mutation";

    export default {
        User,
        Query,
        Mutation
    }
```

Now we can import both type-defs and index.ts modules into server.ts.

1. Delete test typeDefs and resolvers variables that exist in server.ts
2. Import typeDefs and resolvers from gql and resolvers folders
3. **typeDefs** and **resolvers** properties on the argument to ApolloServer class now refer to out imported modules

```js
    import typeDefs from "./gql/type-defs";
    import resolvers from "./gql/resolvers/index";
    ...
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    server.applyMiddleware({ app, path: "/grapqhl"});
```

### Setting up the context on the instance of Apollo Server Express

We need a way to provide access to connection clients to PSQL database.  
We will use context for this.

Add another property to ApolloServer's object argument, and call it **context**.
It is a function to which we will not provide any arguments at this point

We will have it return an object. This object will hold a reference to our instance of Pool connection

That's it, we are done. Our resolvers now have access to the PSQL database

```js
    ...
    import pgPool from "./pg/pg-connection";
    ...
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => {
            return {
                pgPool
            }
        }
    });
```

<!-- End Step Content -->
<!-- Project Information -->

## Project Information

### Available at 

[Github](https://github.com/ikaem/graphql-jwt-react.git) 

### Goals

1. Create an app that uses GrapqhQL on frontend and backend
2. Use PSQL for database
3. Use Typescript on both ends
4. The app should be hold a list of users that can be created, viewed, edited, and deleted.

### Steps

1. Make simple Node and Express server with TypeScript
2. Create a PostgreSQL database and tables that hold user info
3. Use node-postgres to connect backend to database
4. Set up Apollo Express Server
5. **Create GQL types, queries and resolvers on backend**
6. Make simple frontend with React and TS
7. Set Apollo Client on frontend
8. Establish frontend and backend communication via Apollo Client
9.  Create pagination

### Tech and Tools

1. React
2. React Router
3. Styled Components
4. Node
5. PSQL
6. GraphQL
7. Apollo Server Express
8. Apollo Client
9. Bcrypt
10. TypeScript
11. Express

### Experience with Tech & Tools
I am new to Typescript, have super little experience with PSQL and GQL and just a tiny bit more skills with Node and Express.
I am relatively ok with JS, React and other frontend stuff from the list but I am no way even close to be a seasoned frontend person.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.