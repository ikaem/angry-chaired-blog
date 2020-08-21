---
title: "GraphQL & React & PSQL: Create PSQL database"
date: 2020-08-16 14:06:18
tags:
  - psql
  - database
categories:
  - graphql & react & psql
cover:
---

<!-- Step Content Start -->

#### Part 2 of 10 in GraphQL & React & PSQL

<!--more-->

#### See [Project Information](#Project-Information)

## Step 2. Create a PostgreSQL database and tables that hold user info

I am not going to explain installation of Postgres, but will focus on:

1. Create new database
2. Create tables
3. Make queries to manipulate tables

### Create new database

Start with opening any terminal and starting the pg shell – I guess that’s how this part is called. Note that I need to login with my postgres profile with:

```bash
postgres -U postgres
```

After this, psql will ask for password, and once entered, it will log the user in.

Next, create new database with:

```sql
CREATE DATABASE name_of_your_database
```

### Create tables

Now start DBeaver, connect to the database created, and create tables

Table for users’ login data

```sql
CREATE TABLE public.users_login (
    user_id serial NOT NULL,
    email varchar(100) NULL,
    hash varchar(100) NULL,
    refresh_token text NULL,
    CONSTRAINT email_unique UNIQUE (email),
    CONSTRAINT user_key PRIMARY KEY (user_id)
);
```

This table has columns:

1. user_id – of type bigserial, which is just an integer type that can be of a very big value, and it is serialized, meaning that each new entry will get user_id that is one whole number bigger than previous entry’s user_id
2. email – of type varchar(100), which means that this column accepts entries only in string format, and those strings can be max 100 characters long.
3. hash – of type varchar(100), used for storing users’ passwords. Same as email column, this column only accepts strings as values, up to 100 characters in length
4. refresh_token – not used in this post, this column is meant to store refresh tokens needed for user authentication. Will be used in the following post dealing with JWT authentication.

The table also has some constraints.
Constraints are, if I understand correctly, sort of limitations on specific columns.

For instance, in this case:

- We put a constraint on column user_id to tell PSQL that its entries should serve as a PRIMARY KEY – a value that connects this table to other tables in the database by way of referring to the value it holds in each row. This sounds complicated. I will think about making it sound less complicated…
- We also added a constraint to the email column, telling PSQL that the values in it should be unique – no two emails should be the same.

#### Table for users’ info data

Code for creating the table:

```sql
CREATE TABLE public.users_info (
    user_info_id int4 NOT NULL,
    first_name varchar(50) NULL,
    last_name varchar(50) NULL,
    country int4 NULL,
    city varchar(100) NULL,
    website text NULL,
    age int4 NULL,
    hobbies _text NULL,
    avatar_link text NULL,
    CONSTRAINT country_key FOREIGN KEY (country) REFERENCES countries(country_id),
    CONSTRAINT user_info_id_foreign_key FOREIGN KEY (user_info_id) REFERENCES users_login(user_id) ON DELETE CASCADE
);
```

The table’s columns:

1. user_info_id – of type integer, or int4 (same thing, I believe), and the value in it cannot be NULL – meaning I always have to provide value for this particular column
2. first_name – just a varchar type, which will store users’ first names
3. last_name – same thing as above, storing last names
4. country – of type integer
5. city – varchar
6. website – obvious
7. age – integer
8. hobbies – of type text array. Text array can be specified as text[] as well. I was deciding between using regular array type, and json type for this column, where I would be getting json object into the column and outside it, but the learning curve seemed a bit steep for now. I just wanted to get the thing running, so I went with regular array, which seemed pretty straightforward to use.
9. avatar is obvious

Constraints:

- We have a constraint that makes the user_info_id column a FOREIGN KEY. Foreign key connects this table to another table’s PRIMARY KEY. In this case, this particular constraint will reference the PRIMARY KEY in the table users_login. This way, we can connect rows from the two tables, based on the same user id, and get complete data for a particular user.
- Same thing for the FOREIGN KEY for country column. We need to make the countries table yet, to be able to reference it. Ofc, that table should be created first, prior to connecting this table to it via FOREIGN KEY constraint.
- We also have ON DELETE CASCADE statement that extends the FOREIGN KEY constraint for user_info_id. This one was a bit tricky for me, but I think I got it. It basically tells PSQL to delete this entire row if row with user_id in users_login is deleted. Simply put, if a user is deleted from users_login table, the same user will be deleted in this table too.

Notes:

Usually, in either of these two tables two more columns are added. One to store date of creation of a user, and other to store date of modification. I didn’t go with it this time, but those would be of TIMESTAMP type, if I understood correctly.
These might be added for the JWT post, to maybe be able to tell when was the last time a user logged in.

#### Table for countries

Code for creation of the table:

```sql
CREATE TABLE public.countries (
    country_id serial NOT NULL,
    country_name varchar(75) NULL,
    CONSTRAINT country_id_key PRIMARY KEY (country_id),
    CONSTRAINT country_name_unique UNIQUE (country_name)
);
```

The columns:

1. country_id – of type serial, and integer, obviously, but not state, bc it is default to use int4 for serial, I guess…
2. country_name – obvious from the description.

Constraints:

- Same as above, really. country_id is a primary key, that the country_key (country column) in users_info references
- country_name is unique, to make sure we don’t add a country that already exists.

Notes:

This table is not really needed. I could have just had column country in users_info table be of type string, and store country names in there. But, I wanted to have this table too, so I can use it for a bit more complex GraphQL queries later.

### Make queries to manipulate tables

#### Insert data into tables

To insert data, we use this syntax with DBeaver’s SQL editor (and any terminal, really):

```sql
INSERT INTO
    table_name
    (
        column1_name,
        column2_name
    )
VALUES
    (
        value_for_column1_in_row1,
        value_for_column2_in_row1
    ),
    (
        value_for_column1_in_row2,
        value_for_column2_in_row2
    );
```

Obviously, we can enter values in more or less than 2 rows.
So, to insert data into the countries table:

```sql
INSERT INTO
    countries
    (
        country_name
    )
VALUES
    (
        'croatia'
    ),
    (
        'slovenia'
    ),
    (
        'serbia'
    ),
    (
        'bosnia and herzegovina'
    );
```

Notes:

We do not need to insert any values into country_id column, because this one is automatic due to serial type we specified it to be.
String (varchar and text) values need to be surrounded by single quotes. Double quotes won’t work.

Now, let’s fill our users’ tables with data. Let’s say we want to enter full information about one user. We have two tables that hold different information about the same user.
One table holds sensitive information about user login details, and the other one holds not so sensitive information. This is why we separated them. That’s what all the tutorials say is best practice, anyway.

So if we want to store complete information about a user, we have to separate it into 2 tables. Also, we want to make sure that:

1. Both of those tables have data in it
2. Both tables have the same user_id for the same user in their respective columns. This is necessary so we can later connect the data about the same user, and present it on the frontend.

This means that we cannot insert data about the same user in one table, and not in the other. If we do this, the data won’t be complete. This case could happen in case of, for instance, an error in syntax, problems with server, or incomplete data provided to the user.

#### Transactions

So what we want is to insert data in one table, and then insert it into other. And if there is any kind of error during either of those inserts, the whole process would just be cancelled, and inserts would be reverted, as if nothing happened.

For this, we use TRANSACTIONS. We start a transaction with keyword BEGIN, and end it with keyword COMMIT. We can also manually cancel the process with keyword ROLLBACK.

To use a transaction, we just put our inserts between BEGIN – COMMIT keywords.

```sql
BEGIN;

INSERT INTO
    table1_name
    (
        column_name
    )
VALUES
    (
        value_for_column
    );

INSERT INTO
    table2_name
    (
        column_name
    )
VALUES
    (
        value_for_column
    );

COMMIT;
```

And here is a transaction to insert actual user data into users_login and users_info tables:

```sql
BEGIN;

INSERT INTO
    users_login
    (
        email,
        hash
    )
VALUES
    (
        'karlo@karlo.com',
        'karlo'
    );

INSERT INTO users_info (
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
    (
        SELECT user_id FROM users_login WHERE email = 'karlo@karlo.com'),
    'karlo',
    'lastname',
    'country',
    'city',
    'www.website',
    35,
    '{
        "football",
        "writing",
        "reading"
    }'
);

COMMIT;
```

Note that we are using a subquery in the second INSERT INTO query.
The subquery is fetching user_id we inserted into the users_login table during the first INSERT INTO query. This user_id will go into the user_info_id column, to make sure we have the same user id in both tables for the same user.
This is the reason we are doing the transaction. We need to have one value that is same on both tables, to be able to connect user data for the same user. In this example, we use the user id for that purpose.

We get to fetching data with SELECT in the next paragraph.
When we get to fetching database data from Node, however, we will not be using this method. Instead, we will use node-postgres package to do it, in my opinion. a bit more elegantly.

#### Selecting data from tables

We use SELECT keyword to get data from tables. To do it, we query a table with a query as shown below.
This particular query will return a temporary table holding as many rows as it exists in the actual table taht we are querying. Each row in the temporary table will present a different user, and with columns being those we included in the SELECT statement.

```sql
SELECT
    column1_name,
    column2_name
FROM
    table_name;
```

We can also query table for a specific row of data.

The following query will test table rows, to see which one has a column thwith a value of ‘some_value’. If it finds any, it will return them:

```sql
SELECT
    column1_name,
    column2_name
FROM
    table_name
WHERE
    some_column = 'some_value';
```

Here is a query for users_info where we want to get last name and age of user whose first name is ‘test’

```sql
SELECT
    last_name,
    age
FROM
    users_info
WHERE
    first_name = 'test';
```

#### Joining data from tables

Our users’ data is split between 3 tables:

1. users_login for sensitive data
2. users_info for personal information about the user
3. countries for info about the country they are from

If we want to fetch complete data for one user, we need to join data from all different tables.
We JOIN tables with PRIMARY and FOREIGN keys we set up when we created the tables. For instance, we join users_login and users_info based on user_id, and then we join user_info and countries via user_info.country column.

Here is the query syntax where we fetch data from 3 different tables:

```sql
SELECT
    table_name.column1_name,
    table_name.column2_name,
    joined_table1.column1_name,
    joined_table2.column1_name
FROM
    table_name
JOIN
    joined_table1
ON
    table_name.column1_name = joined_table1.column1_name
JOIN
    joined_table2
ON
    joined_table1.column1.name = joined_table2.column1_name
WHERE
    table_name.column1_name = 'some value';
```

And here is the query to get simple user data from all 3 tables – login, info and countries.

We will have returned the user’s email, first name, and country name. We do it for a user with user_id 15.

We can use lowercase statements for queries too:

```sql
select
    users_login.email,
    users_info.first_name,
    countries.country_name

from
    users_login
join
    users_info
on
    users_login.user_id = users_info.user_info_id
join
    countries
on
    users_info.country = countries.country_id
where
    users_login.user_id = 15;
```

### Updating data in tables

Finally, we can also update data. Here is the syntax:

```sql
UPDATE table_name
SET
    column_name = 'some value'
WHERE
    some_column = 'some value again';
```

And here is the actual query:

```sql
UPDATE
    users_info
SET
    first_name = 'post test'
WHERE
    first_name = 'another';
```

Of course, updates can be wrapped in transactions too.

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
2. **Create a PostgreSQL database and tables that hold user info**
3. Use node-postgres to connect backend to database
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
