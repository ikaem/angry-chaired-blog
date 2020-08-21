---
title: 'GraphQL & React & PSQL: Apollo Client Pagination'
date: 2020-08-16 15:09:50
tags:
- apollo
- frontend
- pagination
- react
categories: graphql & react & psql
---

<!-- Step Content Start -->

#### Part 9 of 9 in GraphQL & React & PSQL

Ideally, we would not have all users instantly listed on our home page. We would want to have a part of it, maybe separated into pages, or extendable if a user wants so. 
Pagination means that, when fetching data, we only fetch a part of it. If a user wants to see more data, they interact with the app to tell it so, and the app fetches more data as a response.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 10. Create pagination

We need to:

- Determine how much data we want to fetch first time, and then same thing every time the user interacts. 
- We would have to include some markers in the request for data
- We would have to send an updated marker with each following request, to inform backend which new part of data to return.
- We would have to receive information from backend informing us if if there is any data left that was not sent to the client

That was a general idea.
When it comes to GQL and Apollo, they make it really easy to do pagination.
On the frontend, Apollo Client's **useQuery** hook's return contains another property called **fetchMore**. It is a method that we can call to send the hook's query again.
**fetchMore** can accept variables too, so we can send updated variables to backend resolvers to tell them which data we need. Commonly, values used to mark which parts of data we want are called cursors

On the backed, there are no special (as far as I know) features designed to do pagination. Regular types, queries and resolvers work just fine to provide support for pagination.

Here is what we will do:

1. Create a type and a query on backend **typeDefs** that to define and return paginated users
2. Create a resolver to resolve the paginated user type
3. On frontend, create a query to fetch paginated users
4. Implement **useQuery** hook to accept needed variables and return needed data
5. Set up a handler to hold the **fetchMore** function which needs accept necessary variables, and pass the handler prop to the **PagesControl** component.

### Create a type and a query on backend **typeDefs** that to define and return paginated users

We already have made a type and query for this, and included ithem in one of the first posts.

The type itself constists of several properties:

1. users - which is a list of users we get from the resolver
2. cursor - which is an integer representing a point which marks a point below which the resolver should not retrieve users. In our case, cursor will be a **user_id** of the last user we retrieve in each go of fetching paginated users. In the next go, this cursor will mark the beginning of the next batch of users.
3. hasNextPage is just a Boolean, indicating if there are any more users after the cursor
4. totalUsers is an integer representing total number of users in the database user tables. I wanted to use this property to show how many pages of users are there. I didn't go with it this time, though, but I did keep the property there, in case I do it in future. 
5. usersPerPage, indicating how many users we want to show per page. We are not going to use this property either, but it can be used, for instance, to let user decide how many users per page they want to be shown.

The query **getPaginatedUsers** takes only one argument - the cursor, because the resolver needs to know from which point it needs to start fetching users.

Here are both the query and the type:

```js
    // type-defs.ts on backend
    import { gql } from "apollo-server-express";

    export default gql`

        type Query {
        ...
            getPaginatedUsers(cursor: Int): PaginatedUsers
        }
        ...
        type PaginatedUsers {
            users: [User]
            cursor: Int
            hasNextPage: Boolean
            totalUsers: Int
            usersPerPage: Int
        }
        ...
```

### Create a resolver to resolve the paginated user type

The resolver needs to make sure it returns an object with the following properties:

1. users
2. cursor
3. hasNextPage
4. totalUsers
5. usersPerPage

I decided to have users per page. When I say page, I actually mean 3 users per fetch, since we will have new batches appended to previous list of users, and then render all new users on the same page. 
We could have pages, and "change" page every time we fetch new batch of users, but the code and logic take a bit longer to make. I decided to stick with the simpler approach here, to illustrate pagination.

Few things: 

- We will hardcode number of users per page, to 3. I assigned 3 to a variable, and called it **limit**. This is basically what **usersPerPage** property would be used for if we had an option to let users choose number of users per page.
- We will get an a client from the **node-postgres** connection pool. I want to fetch all needed data with the same client (not sure why, it just feels correct).
- When fetching a batch of users, we will fetch users whose **user_id** is higher than the cursor. For instance, if our cursor is 0, we fetch all users above 0, and later, when our cursor is 3, we fetch users with **user_id** higher than 3.
- We will actually fetch 3 + 1 users. We need this + 1 to see if there are any more users in the database after the fetch, and then to set the **hasNextPage** property to true or false
- We also retrieve total number of users from the database by querying the **users_login** table again with SQL **COUNT** function.
- Then, we will return only 3 users after all, slicing the last one away.
- We set the new cursor to have value of **user_id** of the last user in the sliced users array. 
- Finally, we return the object filled with the properties we retrieved and created.
- Note that we use the **ORDER BY** statement, to order returned items by **user_id**.

Here is the resolver:

```js
    // query.ts on backend resolvers
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
```

### On frontend, create a query to fetch paginated users

As mentioned before, the query requires only the **user_id** as an argument. The query needs to return:

- basic data needed for the **UserBrief** component
- cursor
- hasNextPage
- totalUsers
- usersPerPage

We do this in the **HomePage** component:

```js
    // home.page.ts
    const PAGINATED_USERS_QUERY = gql`
        query GetPaginatedUsers($cursor: Int) {
            getPaginatedUsers(cursor: $cursor) {
                users {
                    user_id,
                    avatar_link,
                    first_name,
                    last_name,
                    country { country_name },
                    city,
                    website
                },
                cursor,
                hasNextPage,
                totalUsers,
                usersPerPage
            }
        }
    `;
```

### Implement **useQuery** hook to accept needed variables and return needed data

The query for paginated users needs to replace the original query that returns all users.
It also needs variable **user_id** for the cursor argument. In the beginning, this argument needs to be 0, to make sure the query fetches users from the beginning of the table. Subsequent queries will be made by the **fetchMore** function, and we will provide dynamic variables with that method. 
We will also need to adjust the props sent to the **UsersBriefMapper**, as we are now sending the paginated data. 

Here is the hook in action:

```js
    // home.page.ts
    const HomePage = () => {

        const { data: usersData, loading: usersLoading, error: usersError } = useQuery(USERS_LIST_QUERY);

        const { data: paginatedUsersData, loading: paginatedUsersLoading, error: paginatedUsersError, fetchMore: paginatedUsersFetchMore } = useQuery(PAGINATED_USERS_QUERY, {
            variables: {
                cursor: 0,
            }
        });
    ...
```
Here is the **users** props sent to the mapper component. Note that the users array is now nested deeper inside the response from the server.

```js
    // home.page.ts
    ...
    return (
    ...
        <div 
            className="people-section__users-brief-mapper-wrapper">
            {paginatedUsersError && <p>Unfortunately, there was an error fetching users. Please try again later. </p>}
            {paginatedUsersLoading && <p>Loading...</p>}

            {paginatedUsersData && <UsersBriefMapper 
                users={paginatedUsersData.getPaginatedUsers.users}
            />}
        </div>
    ...
```

### Set up a handler to hold the **fetchMore** function which needs accept necessary variables, and pass the handler prop to the **PagesControl** component.

Current setup is pretty much the same as when we had all users fetched and render on the **HomePage**.

The difference comes in form of **fetchMore** function. 
Destructured from the **userQuery** hook, the function can be used to repeat the query (it can also use a different query), use different variables, and append (or replace) received results to the existing data that the original hook called initially.

And this is exactly what we will do.

To make it easier and more readable, we will created a handler for the function, and place a call to the **fetchMore** function inside it. This way we can set it up in an isolated place, and not on an HTML element that will trigger it. 

So: 

1. Create handler function and set up the **fetchMore** function inside it
2. Pass the handler as a prop to the **PagesControl** and place it on an element to be called when the element is clicked.

#### Create handler function and set up the **fetchMore** function inside it

The handler function has an argument of event, which is of MouseEvent type. I am not sure that it is needed to have the event passed here, but I seem to recall that I can't pass non-event functions to an event such as **onClick** on an element. I am probably wrong, though. 

Anyway, important part is that the **fetchMore** function, here called **paginatedUsersFetchMore**, accepts an argument object that has a nested **cursor** variable in it. Its value is taken from the return of the original return **useQuery** hook. This means, when the hook executes first time, the **cursor** variable in it will be **3**, because that is the **user_id** of the last user in the **users** array. 
After that, all subsequent queries for paginated users are made by the **fetchMore** function. 

In the example below, we add another property to the function's object - **updateQuery**. This method accepts 2 arguments: previous result and new result. 
We can cobine old and new users into one array of users, and take all other returned properties from the new result, and return all of it to update the returned data in the original hook's return. 

```js
    // home.page.ts
    ...
    const handlePaginatedUsersFetchMore = (e: React.MouseEvent<HTMLButtonElement>) => {
        paginatedUsersFetchMore({
            variables: {
                cursor: paginatedUsersData.getPaginatedUsers.cursor
            },
            updateQuery: (prevResult: any, newData: any) => {
                const newCursor = newData?.fetchMoreResult.getPaginatedUsers.cursor;
                const newUsers = newData?.fetchMoreResult.getPaginatedUsers.users;
                const oldUsers = prevResult.getPaginatedUsers.users;
                const newTotalUsers = newData?.fetchMoreResult.getPaginatedUsers.totalUsers;
                const newHasNextPage = newData?.fetchMoreResult.getPaginatedUsers.hasNextPage;
                const newusersPerPage = newData?.fetchMoreResult.getPaginatedUsers.usersPerPage;

                return {
                    getPaginatedUsers: {
                        cursor: newCursor,
                        users: [
                            ...oldUsers,
                            ...newUsers
                        ],
                        totalUsers: newTotalUsers,
                        hasNextPage: newHasNextPage,
                        usersPerPage: newusersPerPage,
                        __typename: "PaginatedUsers",
                    }
                }
            }
        })
    }
    ...
```

#### 2. Pass the handler as a prop to the **PagesControl** and place it on an element to be called when the element is clicked.

Finally, we just pass the handler to the **PagesControl** component, together with the **hasNextPage** property, so we can disable the button for feching new user in case there is no more users to fetch:

```js
    // home.page.ts
    return (
    ...
        <div 
            className="people-section__pages-control-wrapper">
            <PagesControl 
                handlePagination={handlePaginatedUsersFetchMore}
                hasNextPage={paginatedUsersData?.getPaginatedUsers.hasNextPage}/>
        </div>
    ...
    )
```

And here is typing and use of the handler and **hasNextPage** in the **PagesControl** component. 
Note that there are buttons for previous and next page, but we are not really using the pagination that way. Those are remnants of the original idea to shift back and forth between the pages.

```js
    // pages-contro.component.ts
    interface PagesControlPropsInterface {
        handlePagination: (e: React.MouseEvent<HTMLButtonElement>) => void;
        hasNextPage: boolean;
    }

    const PagesControl = ({ handlePagination, hasNextPage }: PagesControlPropsInterface ) => {
        return (
        <PagesControlStyled className="people-section__pages-control">
            <button className="pages-control__previous-page">
            <span>{"<"}</span>
            <span> Previous Page</span>
            </button>
            <button 
                disabled={!hasNextPage}
                onClick={handlePagination}
                className="pages-control__next-page">
            <span>Next Page </span>
            <span>{">"}</span>
            </button>
        </PagesControlStyled>
        )
    }
    ...
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
5. Create GQL types, queries and resolvers on backend
6. Make simple frontend with React and TS
7. Set Apollo Client on frontend
8. Establish frontend and backend communication via Apollo Client
9.  **Create pagination**

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
