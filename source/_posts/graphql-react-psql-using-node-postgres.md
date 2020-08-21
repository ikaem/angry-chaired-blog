---
title: 'GraphQL & React & PSQL: Using node-postgres'
date: 2020-08-16 14:15:50
tags: 
- node
- express
- node-posgres
- psql
- backend
categories: graphql & react & psql
---

<!-- Step Content Start -->

#### Part 3 of 10 in GraphQL & React & PSQL

Node-postgres is a tool to connect Node.js with PSQL database and interact with it. That is what I know about it in terms of describing it. It is very easy to use, and it uses PSQL syntax for queries.  
There is another tool that I tried called Knex. Knext has its methods for inserting, selecting, updating, transactions and so on. It feels like I have to learn another language.  
With node-postgres, I can just use PSQL knowledge that I have. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 1: Use node-postgres to connect backend to database

Here is what we will do:
1. Install node-postgres
2. Setup a connection
3. Create test REST routes to get all users, and create a new user
   
### Install node-postgres

Install node-pg with:

```bash
    npm i pg
```

Install pg TS types as a dev dependency

```bash
    npm i -D @types/pg
```

### Setup a connection between Express server and PSQL database

Ok, so node-postgres gives us two options to create a connection to a database

**Client connection**
- It creates a client on the server every time a request to the database is created
- Once the request is done, the client needs to close the connection to the server
- Apparently, there is an issue with this approach, that the server has hard time coping with large number of requests, bc it needs to create lot of connections. Or something like that.

**Pool connection**
- Apparently, this is a better approach. It creates a pool of clients to connect to the database, and then randomly assigns those clients to frontend requests that come to the server. Once the request is done, it automatically closes connection, and returns that client to the pool of connections. Or something like that. This is the approach we will use. 

We will create a new folder inside 'src' folder, and we will call it 'pg'. We will use this folder to store all database related files.  
Spoiler: it is just this one file for now. 

Inside this folder we create a file pg-connection.ts, and put the following data in it, and export it to create a module:

```js
    // pg/pg-connection.ts
    import { Pool } from "pg";

    const pgPool: Pool = new Pool({
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "karlo",
        database: "gql",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
    });

    export default pgPool;
```

So: 
We import the Pool class from the node-postgres package

Then we create a new instance of the Pool class, which is our connection to the db now
Pool class accepts an argument of an object, with the following properties
1. host - indicating the url of our database - something like that
2. port - on which the database is
3. user - username with which we access our database
4. password - password with whih we access the database. Note that we should not put the password directly in the code. Instead, it would probably be much better to put the password in an environmental variable, and get it from there. We will not go into it here. 
5. database - name of the database we will be using
6. max - number of client connections the pool will hold
7. idleTimeoutMillis - number of miliseconds a client that is connected must sit in a pool and not be used, before it is disconnected from the database and returned to the pool?
8. connectionTimeoutMillis - according to the documenttion, this is a number of miliseconds to wait before timing out when connecting a new client. In my words, it is time to wait for a free client from the pool before giving up. 


Next, we import module with the created pool into our server.ts, to be used for connecting to the database.

```js
    // server.ts
    import cors from "cors";
    import express from "express";

    import pgPool from "./pg/pg-connection";

    const app = express();

    app.use(cors());

    app.listen(4000, () => {
        console.log(`the server is listening on port 4000`);
    });
```

Great, now we can access the database.

### Create test REST routes to get all users, and create a new user

#### Bcrypt

Prior to actually making a few simple REST routes, we will make a quick stop to learn how to work with bcrypt.  
Bcrypt is a package commonly used to hash (encrypt?) password so they are stored as a string of random characters instead of a human readable text that the user provides when registering. This way they are more secure.  

The way it is normally used, is that it provides few methods to deal with passwords. For instance, its **hash** method is used to create encrypted (hashed) passwords. It accepts an argument of the actual password we are trying to hash, and a number of salt rounds. A salt round is, way I understand it, time used to calculate the hash - the encrypted string that represents the password. I am probably wrong about it. 

With bcrypt, async way of generated a password is the recommended one, and used in an async/await function, it looks like this:

```js
    import bcrypt from "bcrypt";

    const wrapperAsyncFunction = async() => {
        // "karlo" is our password in human readable form, and 10 is the number of salt rounds. 
        // 10 is the default number of salt rounds
        const hashedPassword = await bcrypt.hash("karlo", 10);

        // now we can store the password in a database
        someDatabase.someMethodForStoringPassword(hashedPassword);
    }
```

We can also use bcrypt to check if the password that a user provides (for instance, when logging in), matches that one that is stored in their profile - if it is a valid password.

We use the async **compare** method for this, and again, we can use it inside the async/await function. 

```js
    import bcrypt from "bcrypt";

    const wrapperAsyncFunction = async() => {

        // compare method returns true or false in this case

        const isPasswordValid = await bcrypt.compare(userProvidedPassword, hashFromDatabase);

        // now we can login the user if the password is true, and login the user, or not login
        if(isPasswordValid) login();
        if(!isPasswordValid) console.log("passwords do not match");
    }
```

#### REST Router module

Ok, lets make a few simple REST routes, and use them to access the database and send the data to the client asking for it. 

We could create the routes directly in the server.ts file, but lets put them in their own module as well, to have clearer code. 

1. Create file rest-router.ts in src folder
2. Import Router from express into it and initialize it into a router variable
3. We will also import out Pool module into it. I know there is already one in the server.ts, but we will not use that one for the test REST routes.
(Even though we could. There is a <a id="q1-ctx" href="#q1">question</a> for you?)
4. We are also importing hash method from bcrypt that we will use when creating a new user, to encrypt password before we store it into database.
5. Next, we create routes - two routes in this case, and use the pool to get or send data from and to the database.

```js
    // rest-router.ts
    import { Router } from "express";
    import { hash, hashSync, compare } from "bcrypt";

    import pgPool from "./pg/pg-connection";

    const router = Router();

    const getUser = router.get("/user/:id", async(req, res) => {
        const { id } = req.params;

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
                    countries.country_id,
                    countries.country_name
                FROM 
                    users_login
                
                JOIN 
                    users_info
                ON 
                    users_login.user_id = users_info.user_info_id
                
                JOIN 
                    countries 
                ON 
                    users_info.country = countries.country_id 
                
                WHERE
                    users_login.user_id = ${+id};
        
            `
            const userSelect = await pgPool.query(userQuery);
            res.json({data: userSelect.rows[0]});
        }

        catch(error) {
            console.log(error);
            res.json(error);
        }
    });

    const newUser = router.post("/newuser", async(req, res) => {
        const { email, password, first_name, last_name, country, city, website, age, hobbies } = req.body;

        const client = await pgPool.connect();

        try {
            const hashed = await hash(password, 10);

            await client.query("BEGIN");
            const users_loginQuery = `
                INSERT INTO users_login (email, hash)
                VALUES ('${email}', '${hashed}')
                RETURNING user_id, email, hash;
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
                    hobbies
                )
                VALUES (
                    ${users_loginInsert.rows[0].user_id},
                    '${first_name}',
                    '${last_name}',
                    ${+country},
                    '${city}',
                    '${website}',
                    ${+age},
                    '{${hobbies}}'
                )
                RETURNING                 
                    first_name,
                    last_name,
                    country,
                    city,
                    website,
                    "age",
                    hobbies;
            `;

            const users_infoInsert = await client.query(users_infoQuery);
            await client.query("COMMIT");

            res.json({ data: {...users_loginInsert.rows[0], ...users_infoInsert.rows[0] }});
        }
        catch(error){
            await client.query("ROLLBACK");
            console.log(error);
            res.json(error);
        }
        finally {
            client.release();
        }
    });

    export default [
        getUser,
        newUser
    ];
```

Ok, so summary is in order. I am skiping creation of the actual REST routes, and go to dealing with PSQL.

We use try and catch blocks to put our async code in. 

First we have the getUser route, which returns a specific user. 

We create a variable that will hold our query. It is a variable that evaluates to a string, but wrapped in backticks, so we can use variables in it as well. 

1. The string holds query to select user information from users_login
2. Joins users_info table via user_login.user_id and user_info.user_info_id - PRIMARY KEY and FOREIGN KEY relationship between the tables to make sure we get information about the same user
3. Then it also joins country information via country_id PRIMARY KEY - FOREIGN KEY relationship between countries and user_info tables. 
4. Finaly, it users id variable (cast as a number) to specify user_id of the user we are looking for.

Then, we use **query** method available on our pool connection. It accepts our query variable, and returns data we need.
Our data is actually contained in the **rows** array available on our response, and in this case it is the first (and only) item in the array. If there were more rows to return, we would have had more items in the rows array. 

The **catch** block catches any errors which might happen in the **try** block.

In case of the newUser route, we do things a bit differently.
We actually pick one of the connection clients from the connection pool, and assign it to variable **client**.

1. We do this because of the transaction we use to insert the user data into different tables. 
2. We want to make sure to use the same client to do the whole transaction process.
3. If we did not do this, and used **pool.query** for each transaction part, we would get a new, random client, for each transaction part. And that is not good. Apparently. 

Inside try block, we created hashed password with bcrypt's **hash** method. 
Then, we start transaction via client.query.

Next, we create a query string for the first insert

1.  There is a RETURNING keyword at the end of this query. 
2.  RETURNING just returns data we specify after our insert. In this case, we want user_id, email, and hash.

We didn't use RETURNING in the DBeaver's SQL editor, because, frankly, I couldn't figure out if I could return stuff after each insert, so I could use them in next insert.

Now we can do actual query with our client, passing our query variable to the client's query method.

1.  Because of RETURNING, our users_loginInsert variable now contains (if no error) user_id, email and hash
2.  We can now use the user_id in the users_loginInsert to insert it into the users_info table, and have the user's data connected accross the two tables.

Next query string and actual query is obvious
Next, we finish the transaction with COMMIT

Now, in case of error, we do ROLLBACK in the **catch** block
Finally, we use **finally** block to release the used connection client back to the client pool.

And, second finally, we create the module, by exporting the create routes as an array of routes

1.  I discovered this by chance. First I tried it as an object, to have the module export multiple routes, but it didn't work. Array of routes worked fine.

Finally, we import our module into the server.ts, and can now get specific user, or create user via postman application, for instance. 

```js
// src/server.ts
app.use(restRouter);
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
3. **Use node-postgres to connect backend to database**
4. Set Apollo Express Server
5. Create GQL types, queries and resolvers on backend
6. Pause
7. Make simple frontend with React and TS
8. Set Apollo Client on frontend
9. Establish frontend and backend communication via Apollo Client
10. Create pagination

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