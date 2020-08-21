---
title: 'GraphQL & React & PSQL: Setup Apollo Server Express'
date: 2020-08-16 14:23:41
tags:
- node
- express
- apollo
- server
- graphql
- backend
categories: graphql & react & psql
---

<!-- Step Content Start -->

#### Part 4 of 10 in GraphQL & React & PSQL

We reached an important point. It is the main reason I actually did this small project. I wanted to learn to use GrapqhQL, and figured I should create a small app to find out how it works. 
I am not going to explain GQL in depth. I am not even close to being able to do that. Instead, I will show how to use Apollo's tools to be able to fetch, create and edit data via GrapqhQL.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 4. Set up Apollo Server Express

I will try to explain what GQL is on a very superficial level. For this particular case, it is an alternative to REST. It is a way to get data from and to a database. Apparently, it is a faster, more modern, and more flexible way to deal with data. With GQL, we can read data from the database (query), write data to the database (mutate), or stream data from the database (subscribe - I don't know if this description is correct). 
GQL is kind of a mediator between the server and database, from what I gather.  
It took me a while to wrap my head around it, but I think I like it now. 

Apollo has tools to make dealing with GQL easier. One of those tools is Apollo Express Server. It integrates with Express, and then listens to requests from frontend. Then, it reacts to those requests, does something, and returns some data to the client.

Lets do it. 

Things we are going to do: 

1. Install necessary dependencies
2. Create an instance of Apollo Express Server
3. Create test blueprints for data we will return to the front end
4. Create test functions to get data to and from database
5. Get data with GQL via GraphQL Playground
   
### Install necessary dependencies

We need to install:

1. grapqhl
2. apollo-server-express
3. dotenv

```bash
    npm i graphql apollo-server-express dotenv
```

We use dotenv package to be able to work with enviromental variables. Those are constant, hidden variables that exist in the enviroment in which our process (our server, in this case) is executing. The environemnt in this case is Node.js.
We dont actually need environmental variables, but it is considered a good practice to store certain data in them. We will use it to store information about the port we will use. We could also use it to store password, address, and name of our database connection as well. 

### Create an instance of Apollo Express Server

First thing, we will actually create that environmental variable

**Create .env file in the root of the project**

Add PORT = 4000 to it

- We will use this variable to have our server run on port 4000 of our localhost
- Note that this setup will be valid only for the development build of the server. 

```
    // .env
    PORT = 4000
```

In src/server.ts file, we:

- Import dotenv and initialize it.
- Declare variable PORT to have variable of the PORT environmental variable we just created in the .env file. 

```js
    // src/server.ts
    import dotenv from "dotenv";
    dotenv.config();
    ...
    const PORT = process.env.PORT || 4000;
```

Next, we create instance of Apollo Express Server and attach it to our Express Server.

We import ApolloServer class and gql method from "apollo-server-express"

```js
// src/server.ts
...
import { ApolloServer, gql } from "apollo-server-express";
...
```

**We create an instance of the ApolloServer, and attach it to our existing Express server**

ApolloServer accepts one argument, which is an object.
This object needs two mandatory properties:

1. Blueprints for data we will return to the front end - we call this **typeDefs**. This is basiclly shape of data that GQL will be dealing with. GQL needs these blueprints 
2. Functions to get data to and from database - we call these **resolvers**. These are used by GQL to access databse and return data from database

Then we just attach our instance of ApolloServer to Express server, and specify the path on which our Apollo Express Server will be available, within existing Express server.
We do this via **applyMiddleware** method which accepts an argument of an object, which has properties of:

1. app - which is used to hold value of our Express server
2. path - which holds value to path on which our Apollo Express will be available. Default path is "/graphql", which in the end makes the full url in our case be "http:localhost:4000/graphql".

```js
    // src/server.ts
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
    server.applyMiddleware({ app, path: "/grapqhl"});
    ...
```

### Create test blueprints for data we will return to the front end

Now, the Apollo Express Server will not work until we provide those two properties.  
Here, we make the blueprints, or usually called **typeDefs**.  

We will make these inside the server.ts for now, and later we will have them be in their own module

So, lets just make few test ones above our Apollo Express Server instance.
We use the **gql** method for creation of typeDefs. We imported that method from "apollo-server-express".

typeDefs consists of top level:

- Mandatory Query type
- Our own custom types. We create them to define shape of the data that we need in our app, and that GQL will be dealing with
- Optional Mutation and Subscription types. We will not deal with Subscriptions here

#### The mandatory Query type

It holds optional properties. With these properties, we define what GQL returns to us when we call them.
For instance, here we created variable typeDefs with the gql method:

- We define that the mandatory type Query holds property called **hello**, which, when called, will return data of type **String**.
- We also define another property of Query type, which is **notHelloButNumber**. This property, when called, will return a data of type **Int**, which is just a regular integer.

Note that inside gql method we are not writing JS or TS here. Query is not a JS object, but is instead GraphQL syntax. 

```js
    const typeDefs = gql`
        type Query {
            hello: String
            notHelloButNumber: Int
        }
    `;
```

#### Our own custom types

To define our own, custom types, we use the similar GQL syntax, and add a new top level type to the typeDefs.

Here we define the **User** type. It holds properties:

- user_id, that returns an integer, when called.
- email, which returns a string, when called.
- hobbies, which returns an array of strings, when called.

Then, we add another property to the Query type, and call it, **getUser**. When getUser is called on Query type, it will return data of type User.
This means that it will return:

- user_id, that returns an integer, when called.
- email, which returns a string, when called.
- and hobbies, which returns an array of strings, when called.

Note that getUser property accepts an argument of type Int. We will use this argument to find the actual user in the database

```js
    const typeDefs = gql`
        type Query {
            hello: String
            notHelloButNumber: Int
            getUser(id: Int): User
        }
        type User {
            user_id: Int
            email: String
            hobbies: [String]
        }
    `;
```

We can go even deeper. Let's define another type, **UsersInfo**, which holds properties:

- users, that return an arry of User type, when called 
- numberOfUsers, that returns data of Int type, when called

Now, we define another propery on Query type, **called getUsersInfo**. When called, this property will return data of type UsersInfo.

```js
    const typeDefs = gql`
        type Query {
            hello: String
            notHelloButNumber: Int
            getUser(id: Int): User
            getUsersInfo: UsersInfo
        }
        type User {
            user_id: Int
            email: String
            hobbies: [String]
        }

        type UsersInfo {
            users: [User]
            numberOfUsers: Int
        }
    `;
```

So, the Query type seems to be the main thing when talking about queries here - it is the main type. We use its properties to return other data types. 

#### Optional Mutation type

We use the **Mutation** type for cases when we want to modify data in the database. 
Its syntaxt is pretty similar to the one of the Query type, with the only difference being its name - Mutation.

We define properties on the type that, when called, return a certain type of data. 

- This returned data can be of basic GQL type - String, Int, Boolean...
- Or, it can be any of the custom types we created - for example, the **User** type we created previously.

Property that we call can, but it doesn't have to accept an argument. In our case, however, the **newUser** mutation property does accept arguments:

- email, of string type
- hobbies, of array of strings type 

We do not need argument for user_id, because when we create a new user in the database, user_id will be automatically created

Finally, the mutation returns data of User type.
At this point, it doesn't matter what actuall happens in the database in the time between us calling the the mutation property and getting a data returned. Important is that we call it, and we get some data back.

```js
    const typeDefs = gql`
        type Query {
            hello: String
            notHelloButNumber: Int
            getUser(id: Int): User
            getUsersInfo: UsersInfo
        }

        type Mutation {
            newUser(email: String, password: String, hobbies: [String]): User
        }
        type User {
            user_id: Int
            email: String
            hobbies: [String]
        }

        type UsersInfo {
            users: [User]
            numberOfUsers: Int
        }
    `;
```

### Create test functions to get data to and from database

Ok, now we have our type defs, written in the server.ts file. It holds queries and mutations that we can call, in order to work with data in the database.  
But, now we need to make it possible to actually work with the data, since those queries and mutations only define what we can do and what we get back from the data.

To actualy perform the grunt work, we need functions that these properties will call. We call these functions **resolvers**.

We will define resolvers, again, in server.ts, just below our typeDefs definition.
Resolvers is an object that, for our needs, contains 2 properties:

- Query
- Mutation

The **Query** property is an object as well, and so is the **Mutation** property.
Each contains properties that have same name as their respective properties in the **typeDefs** definition. And each of those properties is a function that interacts with the database.

A resolver's name must match a property name on a type in **typeDefs** definition.
Resolver accepts 3 arguments:

- parent - which is a variable that contains data coming the the resolver from the type that called the resolver, in case the resolver needs it. We will get to this. 
- args - a variable containing arguments provided to the resolver when it was called
- context - variable containing data provided by the instance of Apollo Express Server, and available to all existing resolvers 

Resolver needs to return data in shape that its property on its parent type is set to return.
So if we have a property "hello" on the Query type, and it returns data of type String, the "hello" resolver needs to return data of string type

Ok, here is an example with the "hello" resolver on the **Query** property:. We have resolvers object, that holds Query object, that in turn holds hello property, that is a function that returns "hello" string

```js
    // src/server.ts
    const resolvers = {
        Query: {
            hello: async () => "Hello",
        }
    }
```

Let's do another one, and create resolver for **getUser** query. 

We need to make sure we use arguments available for resolvers. We know that this resolver has an argument of **id** of Int type

We will also use the **pgPool** connection to the database, available in the server.ts. Later, we will have the database connection be passed to all resolvers through their context arguments. 
**Remember**, context argument is the same for all resolvers, passed down by the instance of Apollo Express Server.

Note the TS typing with the arguments. It is something I don't understand much, but TS did require me to type those arguments. So in this case, args is typed as an object that has an argument of **id**, which is of type **number**. 

```js
    // src/server.ts
    const resolvers = {
        Query: {
            hello: async() => "Hello",
            getUser: async(parent: any, args: { id: number }, context: any) => {
                try {
                    const userQuery = `
                        SELECT 
                            users_login.user_id,
                            users_login.email,
                            users_info.hobbies,
                        FROM 
                            users_login
                        
                        JOIN 
                            users_info
                        ON 
                            users_login.user_id = users_info.user_info_id
                        WHERE
                            users_login.user_id = ${+args.id};
                    `
                    const userSelect = await pgPool.query(userQuery);
                    const user = userSelect.rows[0];
                    return user;
                }

                catch(error) {
                    console.log(error);
                }
            }
        }
    }
```

**Few things here:**

The code in the resolver is pretty similar to the REST route **getUser** we already have in the rest-router.ts module. So, GQL and REST both serve similar pupropse - they get data to and from the database. 

Also, for my purposes and from my perspective, **resolvers** themselves are pretty much the same as the actual REST routes. 
The difference comes in form of **typeDefs**, where we actually define shape of our data. And, as we will see a bit later, where we make possible to choose which properties of a specific type we want to fetch from the server. 

PSQL query uses the **id** property on the **args** argument on the resolver method.
The resolver returns an object that has to have shape of the type that is returned by the property that calls this resolver.
In this case, the type returned by the property is **User**, with the following shape: 

- user_id - of type **Int**
- email - of type **String**
- hobbies - of type **String array - [String]**

The return of the resolver has the same shape, so we are good here. 

Next, here is an example of a mutation resolver on the **Mutation** type.
Again, note that the resolver is pretty similar to the **newUser** REST Route **newUser**.

- We pull a client from the node-postgres connection pool
- We hash the password provided by the user
- We do the transaction to place data in the database
- We release client back to the connection pool once we are done. 

Also, I declared an interface for the **args** argument on the **newUser** resolver. I placed it in the same **server.ts** file, and specified that **args** will be an object with 3 properties, **email**, **password**, and **hobbies**. This is for 2 reasons:

- Because arguments in this method need to be typed when working in TS
- And also, because I want to keep the arguments of the method more readable and clean.

```js
    interface newUserArgs {
        email: string,
        password: string,
        hobbies: string[]
    }
```

```js
    const resolvers = {
        Query: {
            hello: async() => "Hello",
            ...
        },
        Mutation: {
            newUser: async(parent: any, args: newUserArgs, context: any ) => {
                const client = await pgPool.connect();

                try {
                    const hashed = await hash(args.password, 10);

                    await client.query("BEGIN");

                    const users_loginQuery = `
                        INSERT INTO users_login (email, hash)
                        VALUES ('${args.email}', '${hashed}')
                        RETURNING user_id, email;
                    `;
                    const users_loginInsert = await client.query(users_loginQuery);

                    const users_infoQuery = `
                        INSERT INTO users_info(	
                            user_info_id,
                            hobbies
                        )
                        VALUES (
                            ${users_loginInsert.rows[0].user_id},
                            '{${args.hobbies}}'
                        )
                        RETURNING                 
                            hobbies;
                    `;

                    const users_infoInsert = await client.query(users_infoQuery);
                    await client.query("COMMIT");

                    const loginData = users_loginInser.rows[0];
                    const infoData = users_infoInser.rows[0];

                    return {
                        ...loginData,
                        ...infoData
                    }
                }
                catch(error) {
                    await client.query("ROLLBACK");
                    console.log(error);

                }
                finally {
                    client.release();
                }
            },
        }
    }
```

### Getting GQL Data with GraphQL Playground

Ok, so we did it. We:

1. Created an instance of Apollo Express Server
2. We attached it to an existing Express server
3. We created typeDefs and resolvers, to be used in manipulation of data in the database

Now, how do we actually manipulate data?

1. Well, we can do it from the client, of course, such a browser, or a mobile app.
2. Also, we can do it through a tool called GraphQL Playground that Apollo gives us access to.

We can access GQL Playground at "localhost:4000/graphql". It is the url that we set when we created the instance of AES. In it, we just type queries, and we get results back. 

So let's type some queries in the middle section.

#### To make queries:

Type **query**, and open curly braces
Inside, type name of the query property that we put inside the Query type in typeDefs. In this case, we will type **hello**. 

1. This **hello** will call the **hello** resolver on the **Query** property in the resolvers object we created
2. Finally, we will get a result of "hello", because this is what we return from the resolver
3. The return of the resolver is a string, and return of the hello query on the Query type is also a strinbg, so we are good here


```
    query {
        hello
    }
```

And here is what we get back:

```js
    {
        "data": {
            "hello": "Hello"
        }
    }
```

Ok, let's make another query get with the **getUser** query.

Here, we have few interesting things:

1. We provide an argument to the **getUser** query. This argument is of shape that we defined in the **typeDefs**. It is called **id**, and it is of **Int** type
2. Next, unlike the **hello** query, we actually require a specific property from the **getUser**. This is because getUser query returns an object that has several properties on it. And, this is mandatory - we need to specify which properties we want back from the object that the query returns

Just a quick note - if a property inside object that the getUser returns was another object that we had a resolver for - we would need to specify which properties we want from that object as well - **We will get to this**

```
    query {
        getUser(id:18) {
            user_id
        }
    }
```
And here is what we get back:
```js
    {
    "data": {
        "getUser": {
        "user_id": "18"
        }
    }
    }
```

#### To make mutations:

1. Instead of **query**, now type **mutation**, and open curly braces.
2. Inside, type the name of the mutation and provide needed arguments.
3. Finally, include names of the properties on the returned object to tell GQL that we want to get back that specific data. 

```
    mutation {
        newUser(email: "email@email", password: "password", hobbies: ["writing", "writing"]) {
            user_id
        }
    }
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
4. **Set up Apollo Express Server**
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