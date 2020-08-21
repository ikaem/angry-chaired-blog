---
title: 'GraphQL & React & PSQL: Apollo Client & Backend-frontend communication'
date: 2020-08-16 15:05:54
tags:
- apollo
- backend
- frontend
- react
categories: graphql & react & psql
---

<!-- Step Content Start -->

#### Part 8 of 9 in GraphQL & React & PSQL

Now that we have the Apollo Client set up on the frontend, we can use it to communicate with the backend.
For this purpose, Apollo Client provides hooks that can be used to query and mutate data. There is probably one to subscribe to data, but I don't use it in this project. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 9. Establish frontend and backend communication via Apollo Client

The hooks that we will use turn out to have a very useful feature, that I initially found confusing. They also hold state in them, so we do not need to use the actual React's **useState** to hold data returned from the GQL query. 
In the beginning I thought this to be unnecessary, but of course, it turned out that I don't know much. It is a great feature.

This is what we will do:

1. Test Apollo Client's hooks to query and mutate country data in the PSQL database. 
2. Get all users from database and show them on the home page with the useQuery hook
3. Get a specific user for profile page with useQuery hook
4. Add new user with useMutation hook
5. Edit user with useMutation hook
6. Delete user with useMutation hook

### Test Apollo Client's hooks to query and mutate country data in the PSQL database

We will test the hooks by getting all countries from our PSQL database, getting a specific country, and by creating a new country. We will use console.log to see all of this data, instead of actuall rendering it on the page.

To get all available countries and a specific country, we will use the **useQuery** hook provided by Apollo CLient.
To add a new country to the database, we will use the **useMutation** hook.

We will do all of this inside the **App** component, under **"/** route. By visiting **localhost:3000/**, we will be able to see results of the **useQuery** hook, and after pressing a button to add a country, we will create a new country.

#### useQuery hook

First, we need to import the hook from **"@apollo/client**, together with the **gql** method. 
We will use **gql** to parse strings into GQL queries.

```js
    // app.tsx
    import { useQuery, gql } from "@apollo/client";
```

##### getCountries

Now, we will create a query to fetch all countries from our database.
We do this outside the component, probably best under all imports used in the component.

The query we will create is the same as the query we were using in the GraphQL Playground. 
We query for a particular property on the root Query type, and the resolver that matches the name of this property will do its thing and return appropriate data.

In this case we want to query the **getCountries** property, which will call **getCountries** resolver, and send use a response in form of array of Country types. Then, becuase this query returns Country data, which in turn has its own properties, we also need to specify which of those properties we want to have in the response.

Here is the query:

```js
    // app.tsx
    const GET_COUNTRIES_QUERY = gql`
    query GetCountries {
        getCountries {
            country_id,
            country_name
        }
    }
`;
```

The actual hook needs to be placed inside the component in which we want to use it. 
For this particular case, we will have it accept one argument - the query we just made. 
The hook returns an object with multiple properties, and for now we will destructure three properties from this object:

1. data - holding the data that we requested in our query, in case the query was successful
2. loading - evaluating to true or false, depending on whether the query is still being processed
3. error - holding an object with error information, in case an error happened and data could not be retrieved. 

Here is the **useQuery** in use:

```js
    // app.tsx
    const { data, loading, error } = useQuery(GET_COUNTRIES_QUERY);
```

We can now use the destructure properties to conditionally render contents of the component.
In this example, however, we will use them to conditionally console.log data.

```js
    // app.tsx
    const { data, loading, error } = useQuery(GET_COUNTRIES_QUERY);

    if(loading) console.log("loading")
    if(error) console.log(error);
    if(data) console.log(data);
```

The **data** property holds the respnse in form of another object. This object holds the name of the actual query that we called with the **gql** method. 

```js
    {getCountries: Array(12)}
```

And this object holds an array of countries what we required in our query.
Note the **__typename** property on the each item object in the array. It holds the name of the type of this object item, as defined in **typeDefs** in the Apollo Server Express instance.

```js
    getCountries: Array(12)
        0: {__typename: "Country", country_id: "1", country_name: "croatia"}
        1: {__typename: "Country", country_id: "2", country_name: "slovenia"}
        2: {__typename: "Country", country_id: "3", country_name: "serbia"}
        3: {__typename: "Country", country_id: "4", country_name: "montenegro"}
        4: {__typename: "Country", country_id: "5", country_name: "bosnia and herzegovina"}
        5: {__typename: "Country", country_id: "6", country_name: "germany"}
        6: {__typename: "Country", country_id: "7", country_name: "albania"}
        7: {__typename: "Country", country_id: "8", country_name: "kosovo"}
        8: {__typename: "Country", country_id: "9", country_name: "macedonia"}
        9: {__typename: "Country", country_id: "10", country_name: "hungary"}
        10: {__typename: "Country", country_id: "11", country_name: "bulgaria"}
        11: {__typename: "Country", country_id: "13", country_name: "romania"}
        length: 12
```

##### getCountry

Now, we will use the useQuery hook to get a specific country. 
This requires us to provide an argument to the query, which will be used by a corresponsing resolver on the backend to find and return the matching country.

Again, we will create the query first.
Note the syntax for providing information about arguments within the **gql** method: 

- First we declare the argument with **$** sign.
- Then we specify what is the type of the argument.
- Then, when we actually call the query **getCountry**, we specify that the **id** argument should be assign a variable of **$id**.

Here is the query:

```js
    const GET_SPECIFIC_COUNTRY_QUERY = gql`
        query GetCountry($id: Int!) {
            getCountry(id: $id) {
                country_id,
                country_name
            }
        }
    `;
```

For this example, we need to provide the query with the necessary variable. We do this by adding a second argument to the **useQuery** hook. 

This second argument is an object which has, among others, a property called **variables**. 
The **variables** property is an object as well, and inside we add our variables as key - value pairs, where keys match names of the variables we need. 

Here it is in action, together with conditional console.logging of responses from the query:

```js
    const { data: specificCountryData, loading: specificCountryLoading, error: specificCountryError } = useQuery(GET_SPECIFIC_COUNTRY_QUERY, {
        variables: {
            id: 8
        }
    });

    if(specificCountryLoading) console.log("loading")
    if(specificCountryError) console.log(specificCountryError);
    if(specificCountryData) console.log(specificCountryData);
```

Note few things:

- We hardcoded the value of the variable inside the useQuery hook. Normally, we wouldn't do this, but would instead get the value from the url, for instance.
- We also assigned values of response data, loading and error to other variables, to avoid name clashing with the previous query for all countries.
- The variable definition and type (this is how I call it, i don't know if this is exactyl what it is) sets the **$id** to be of type **Int!**. The "!" is important, because this is the way se set this particular query on the backedn in typeDefs.

Again, the response we receive from the backend is an object holding a single property with the name same as the actual query - **getCountry** in this case. This property contains values that we requested - country_id and country_name

```js
    {getCountry: {…}}
```
```js
    getCountry:
        country_id: "8"
        country_name: "kosovo"
        __typename: "Country"
```

##### addCountry

Next up, we use the **useMutation** hook. 
Same as with the previous hook, we need to import it from "@apollo/client" first

```js
    import { useMutation, gql } from "@apollo/client";
```

Again, we will first create the mutation query that we will pass to the hook.

Since we are creating new entry in our database, we need the query to send some data to GQL resolvers on the backend. We will use variables to do this.

Same as before, first we need to define and type variables that we plan to use, and then include them in the actual mutation query.
Then, we specify which data we want to receive back from the resolver. 

In this case, we will have only one variable in the query, which will send the new country's name to the resolver.
And once the mutation is over, we request the new country's id and name back in the response data.

Here is the query:

```js
const ADD_COUNTRY_MUTATION_QUERY = gql`
    mutation AddCountry($country_name: String!) {
        addCountry(country_name: $$country_name) {
            country_id,
            country_name
        }
    }
`;
```

Note that the type of query is not "query" anymore, but instead it is "**mutation**", as stated right at the start of string inside the **gql** method.

Ok, now we get to use the **useMutation** hook.

Unlike the **useQuery** hook which returns an object with exact names of properties that we can destructure, the **useMutation** hook returns an array.
This means that, when destructuring the returned array's items, we can give them any names that we want. On the other side, however, we do have to destructure them in a specific order, to make sure we get correct items from the array.

The **useMutation** hook returns an array with these 2 items, in this specific order:

**mutationMethod**
The method to do actual mutation. This method needs to be called somewhere inside to do the actual mutatioh, since the hook itself doesn't really perform the mutation.

**dataObject**
The object containing several properties:

- data - obviously, the property that contains data returned from the mutation
- loading - loading
- error - error information, in case of error
- called - a boolean, telling us if the **mutationMethod** was called
- client - instance of our ApolloClient, that we can use to update or read cache, for instance. We will not deal with it in this post. 

Next, the **useMutation** hook itself accepts 2 arguments:

- The actual mutation query
- Object that can hold properties like **variables** object, **onCompleted** method specifying actions to be exectured after successful mutation, **onError** in case of error, and so on.

Alright, here is the hook in use, with the variables property defined in the arguments to the **useMutation** hook:

```js
    const [ addCountryMutation, { data: addCountryMutationData, loading: addCountryMutationLoading, error: addCountryMutationError } ] = useMutation(ADD_COUNTRY_MUTATION_QUERY, {
        variables: {
            country_name: "turkey",
        }, 
        onCompleted: (data) => console.log("data after mutation is completed:", data);
    });
```

Note the **onCompleted** property on the hook's arguments object. If the mutation succeeds, the property (method) receives the response as an argument, and the we log that response. 

Now we actually need to perform the mutation to create a new country entry in the database, give the country the name of "turkey", and have the mutation return the country's id and name back to us. 

Normally, we would have entire form and appropriate inputs to have user provide name of the country. Here, we will only have a button that will send the hardcoded country's name to the backend. 

The button will have the React's onClick event listener attached to it, that will, when clicked, call **addCountryMutation** method. This method will then perform the mutation. 

Here it is in code:

```js
  return (
    <Switch>
      <Route exact path="/">
        <div>
          <button onClick={() => addCountryMutation()}>
            Add Country
          </button>
        </div>
      </Route>
      ...
    <Switch>
```

That's it, very simple. 
The mutation method (**addCountryMutation** in this case) also accepts argument of an object, and one of its properties can be the **variables** object. This makes it possible to dynamically change variable's value, for instance.

/////////////////////////////////////////////////////////////////////////////////////////

### Get all users from database and show them on the home page with the useQuery hook

Now that we know how to do queries and mutations from the frontend, let's use the knowledge to fill the app pages with data.

We will use the **useQuery** hook to fetch all users from the database, and show them on the **home page** that lives on the **"/"** route.

We will make such query that it only returns five pieces of data for each user:

1. user_id
2. avatar_link
3. first_name
4. country_name
5. city,
6. website url

We will use this data to create a brief description of each user. When clicked on the name, React Router's **Link** component will take us to that user's full profile.

Here are steps:

1. We will create the query with **gql** method
2. We will use the **useQuery** hook to query the Apollo Server Express for a list of users
3. We will create component - a container more specifically. We will call it **UsersBriefMapper**, and will use it to map over the list of users returned form the Apollo Server Express, and then return **UserBrief** component described below, for each user in the list. We will not go into details of this particular component here. 
4. Create a component that renders brief data for each user. We will call this component **UserBrief**, and will not go into details of creating it here.

#### Create the query with **gql** method

As we already know, we need to import the **gql** method, and, since we are doing it, might as well import the **useQuery** hook. 
We import it from "@apollo/client, and we do it in the **home.page.tsx** file.

```js
    import { useQuery, gql } from "@apollo/client";
```

Time for the query. Note the subquery for the country property.

```js
    // home.page.tsx
    const USERS_LIST_QUERY = gql`
        query GetUsersList {
            getUsers {
                user_id,
                avatar_link,
                first_name,
                last_name,
                country { country_name },
                city,
                website
            }
        }
    `;
```

#### Use the **useQuery** hook to query the Apollo Server Express for a list of users

Let's do this part. 
We already have the hook imported, so we only need to pass it the query, and destructure its returned object.

```js
    // home.page.tsx
    const { data: usersData, loading: usersLoading, error: usersError } = useQuery(USERS_LIST_QUERY);
```

Next, we conditionally render the HomePage comcponent content, and pass the users to the UsersBriefMapper.

```js
    // home.page.tsx
    return(
        ...
        <div 
            className="people-section__users-brief-mapper-wrapper">
            {usersError && <p>Unfortunately, there was an error fetching users. Please try again later. </p>}
            {usersLoading && <p>Loading...</p>}
            {usersData && <UsersBriefMapper 
                users={usersData.getUsers}
            />}
        </div>
    )

```

#### Use the **UsersBriefMapper** component to map over the list of users

In this part we will:

1. Set TS types for props coming to the UsersBriefMapper component
2. Map over the users, and render **UserBrief** component for each user

##### TS types

We will create an interface inside the **users-brief-mapper.container.tsx** file, to set the shape and type of props coming into this component.

The interface defines shape of all props, holding name of a prop, and its shape. 
In this case, we have only **users** prop coming into the component, which is an array of objects with multiple properties.
Then, we declare the compoent, and set the type of its props.  

```js
    // users-brief-mapper.container.tsx
    ...
    interface UsersBriefMapperProps {

        users: Array<{
            avatar_link: string;
            city: string;
            first_name: string;
            last_name: string;
            user_id: string;
            website: string;
            country: {
                country_name: string;
            }
        }>
    }

    const UsersBriefMapper = ({ users }: UsersBriefMapperProps ) => {
    ...
```

##### Map over users

It is simple, really. We just map over the users, and return the **UserBrief** component, and pass it props.

```js
    // users-brief-mapper.container.tsx
    return (
    ...
        { users.map(user => {
            return (
                <UserBrief 
                    key={user.user_id}
                    user={user}
                />
            );
        })}
    ...
```

#### Use the **UserBrief** component to render each user in the list

This part is pretty similar to the previous one.

1. Set TS types for props coming to the UserBrief component
2. Inside the component, render the user data


##### TS Props Types

Interface for the props here is the same as in the Mapper component, except for it being just a single user object instead of an array of user objects.

We could have also destructured the entire user object when setting props from the mapper component, and have the UserBrief component accept already destructured user properties. 
I prefere this approach, though. I find it a bit cleaner, especially when there are other props not related to the user. 


```js
    // user-brief.component.tsx
    ...
    interface UserBriefProps {
        user: {
            avatar_link: string;
            city: string;
            first_name: string;
            last_name: string;
            user_id: string;
            website: string;
            country: {
                country_name: string;
            }
        }
    }

    const UserBrief = ({ user }: UserBriefProps) => {
    ...
```

##### Render User data

Finally, the render itself is simple enough. 
We can destructure the **user** props, and just render the values in the component.

```js
    // user-brief.component.tsx
    ...
    return (
    ...
        <div className="person-item__avatar-container">
            <img src={ avatar_link } alt=""/>
        </div>
        <Link className="person-item__link" to={`/profile/${user_id}`}>
            <span className="person-item__name">
                { first_name } { last_name }
            </span>
        </Link>
        <span className="person-item__country">
            { country.country_name }
        </span>
        <span className="person-item__city">
            { city }
        </span>
        <span className="person-item__website">
            <a href={ website }>{ website }</a>
        </span>
    ...
    )
    ...
```

/////////////////////////////////////////////////////////////////////////////////////////

### Get a specific user for profile page with useQuery hook

This one is pretty similar to the previous one, except for the fact that we are fetching a single user, with full data, and we need to provide and argument for the resolver to identify user.

We will use the data to provide content to the **ProfilePage** component in the **profile.page.tsx** file, rendered on the **"/profile/:user_id** route. 
This means that we will use the **user_id** parameter on the route to provide value for the variable used in the **getUser** GQL query.

Here are the properties that we will be retrieving with the query: 

1. user_id,
2. email,
3. first_name,
4. last_name,
5. city,
6. website,
7. age,
8. hobbies,
9. country_name,
10. avatar_link

The steps:

1. Create the query
2. Retrieve user id from the React Router's **useParams** hook.
3. Get user data with **useQuery** hook, and pass it to a view component for render.
4. Use the view component to render user data.

### Create the query

The query lives in the **profile.page.tsx** file, and uses imported **gql** method, as usual.
It declares a **$user_id** variable of **Int** type, and then uses it as the value to the **id** argument in **getUser** query.

```js
    const USER_DETAILED_QUERY = gql`
        query GetUserDetailed($user_id: Int!) {
        
            getUser(id: $user_id) {
                user_id,
                email,
                first_name,
                last_name,
                city,
                website,
                age,
                hobbies,
                country { country_name },
                avatar_link
            }
        }
    `;
```

### Retrieve user id from the React Router's **useParams** hook

React Router provides a hook to extract parameters from urls. 
The method is called **useParams**, and we need to import it from "react-router-dom", and then extract the user_id from it.

In this case, we just destructured it from the hook, and can now use it in the component.

```js
    // profile.page.tsx
    import { useParams, Redirect } from "react-router-dom";
    ...

    const ProfilePage: React.FC = () => {

        const { user_id } = useParams();
    ...
```

### Get user data with **useQuery** hook, and pass it to the view component for render.

We already know how to do this. 

We need to destructure the properties from the hook's returned object.
We also need to provide the hook with two arguments: the actual query and the object that contains variables property.

Note that the user_id destructured from the url needs to be coerced into a number, because the query expects $user_id variable to be of Int type.

```js
    // profile.page.tsx
    ...
    const { data: userData, loading: userLoading, error: userError } = useQuery(USER_DETAILED_QUERY
        , {
        variables: {
          user_id: +user_id
        }
      }
    );
    ...

```

Now when we have the needed user data, we can pass it as props to the **UserProfileDetailed** component, which will render it. 

```js
    // profile.page.tsx
    ...
    return (
    ...
        <div 
            className="people-section__profile-detailed-wrapper">
            {userError && <p>Unfortunately, there was an error fetching user. Please try again later. </p>}
            {userLoading && <p>Loading...</p>}
            {userData && <UserProfileDetailed 
                user={userData.getUser}
            />}
        </div>
    ...
    )
```

### Use the view component to render user data

The view component in this case is **UserProfileDetailed**. 

We need to type the incoming props, and then just render them in the component. 

##### Typing props

Interface for the props is almost the same as the one in the **UserBrief** component, with this one having few more properties.

Later, when we add functionality to delete user, we will just add another type to the interface, to be able to type the **delete** mutation coming into the component as props. Simple. 
Its typing, though, its a bit trickier. We will get there.

```js
    // user-profile-detailed.component.tsx
    ...
    interface UserProfileDetailedProps {

        user: {
            age: number;
            avatar_link: string;
            city: string;
            country: {
                country_name: string;
            };
            email: string;
            first_name: string;
            last_name: string;
            hobbies: string[];
            user_id: string;
            website: string;
        };
    }

    const UserProfileDetailed = ({ user }: UserProfileDetailedProps) => {

        const { age, avatar_link, city, country, email, first_name, last_name, hobbies, user_id, website } = user;
    ...
```

##### The render

The render is very simple. Just render that data coming in.

```js
    return (
    ...
        <div className="profile-section__avatar-container">
            <img src={avatar_link} alt=""/>
        </div>

        <div className="profile-section__basic-info">
            <h2 className="basic-info__name">{first_name} {last_name}</h2>
            <h3 className="basic-info__email">{email}</h3>
            <Link className="basic-info__edit-profile" to={`/editprofile/${user_id}`}>Update my profile</Link>
        </div>

        <div className="profile-section__details-info">
            <span className="details-info__key">Country:</span>
            <span className="details-info__value country-value">{country.country_name}</span>
            <span className="details-info__key">City:</span>
            <span className="details-info__value city-value">{city}</span>
            <span className="details-info__key">Website:</span>
            <span className="details-info__value">
                <a href={website}>{website}</a>
            </span>
        </div>
        <div className="profile-section__additional-info">
            <span className="additional-info__key">Age:</span>
            <span className="additional-info__value">{age}</span>
            <span className="additional-info__key">Hobbies:</span>
            <ul>
                { hobbies.map(hobby => {
                    return (
                        <li 
                            key={hobby}
                            className="additional-info__value">{hobby}</li>

                    );
                })}
            </ul>
        </div>
    ...
    )
```

/////////////////////////////////////////////////////////////////////////////////////////

### Add new user with useMutation hook

Ok, so we reached the part with the mutation.
This is still pretty simple, I think, with the whole thing been added few more factors to the process in order to remain interesting.

We will have 2 components dealing with the addition of a new user. 

- **AddProfilePage**, which will house the logic
- **AddEditProfileForm**, which will house the actual form. This component will be shared between the AddProfilePage and EditProfilePage, as these two need almost the same input elements to perform their function. 

Also, we will need some kind of state where we will store the input data for the new user before it has been submited to the Apollo Server Express.

Finally, we will need to use **useQuery** hook, to query for all countries for the **select** HTML element in the form component.

So, ordered plan:

1. Create state for user input
2. Query for all countries
3. Use **useMutation** hook to create mutation method
4. Use form component to connect form inputs to the new user state and mutation method, and to render all countries in the **select** element
5. Redirect the user to the full profile once the mutation is successful.

#### Create state for user input

Since I wanted to checkout the **useReducer** hook provided by React, the state for new user is created as a reduced state. 

I don't know if it is better to use **useReducer** instead of **useState** (which is possible, too), but I just went with the reduced state for this one. 
This did introduce few problems for me, as I spent lot of time figuring out how to type the actual reducer and the actions but it worked out in the end.

Here is just a general idea how reduced state works. 

1. We have initial state object
2. We have a reducer function that manipulates the state
3. We have actions that the reducer uses to decide which part of the state to manipulate, and how to do it. Actions can hold value that the reducer will use to manipulate the state. Actions are just objects with properties. Commonly, actions have a **type** and **payload** properties. **Type** indicates what type of action is the reducer going to perform on the state, while **payload** is used by the reducer to update the state.
4. We have a dispatch function that sends actions to reducers

Here is the plan again, because this was a bit of a pain for me. We are working in the **AddProfilePage** component, btw, living in **add-profile.page.tsx**.

1. Create initial state and its type
2. Create type for the action sent to the reducer
3. Create reducer function
4. Use **useReducer** to get state and dispatch function
5. Pass the state as props to the form component

##### Create initial state and its type

We will create an object that will represent the original shape of our state. 
Reduced state is usually an object, and not a simple, single value, from what I understand. **useState** hook can deal just fine with simple states. 

We will also need to create an interface for this object. We will use this interface in the reducer function later. 

Anyway, outside of the component define the initial state object. 
The state reflects the arguments needed to create a new user with **addUser** mutation, which we prepared on the backend. We will go into this in more details when we get to the **useMutation** hook.

```js
    // add-profile.page.tsx
    const initialFormState = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        country: 0,
        city: "",
        website: "",
        avatar_link: "",
        age: 0,
        hobbies: [""],
    }
```

Next, we need to type the initial state object. Most of the properties are of string type, as shown below. 

```js
    // add-profile.page.tsx
    interface FormStateInterface {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        country: number;
        city: string;
        website: string;
        avatar_link: string;
        age: number;
        hobbies: string[];
    }
```

##### Create type for the action sent to the reducer

Now, we need to type action sent to the reducer. Note that we are not creation the actual action here. Actions are created in the actual component, when, for instance, handling input change, or a click on a button. 

But, even if we don't know what each of our actions is going to be, we know a general action shape.

Our action is going to be an object, holding 2 properties:

- **type**, which will be of **string** type. Reducer will use this proeprty to know which part of the state it needs to manipulate
- **payload**, which will be of **any** type. This property holds actual values that will be used to update the state.

Note that the **any** type in the **payload** property is probably incorrect. With this type, TS switches off its type checks for this variable, and we get usual JS behavior. Unfortunately, I was not able to figure out how to set different type, and make it all work. 
This particular property can be either a string, an array of strings, or a number. But when typed in such way, TS complains of following errors:

```
    Argument of type '(state: AddEditProfile, action: Action) => { hobbies: string | number | string[]; user_id?: number | undefined; first_name: string; last_name: string; email: string; ... 5 more ...; age: number; }' is not assignable to parameter of type 'ReducerWithoutAction<any>'.

    Overload 2 of 5, '(reducer: (state: AddEditProfile, action: Action) => { hobbies: string | number | string[]; user_id?: number | undefined; first_name: string; last_name: string; email: string; ... 5 more ...; age: number; }, initialState: never, initializer?: undefined): [...]', gave the following error.

    Argument of type 'AddEditProfile' is not assignable to parameter of type 'never'.  TS2769
```

I will keep the **any** type for now, and hope to solve it when I learn more about TS.

##### Create reducer function

Next up is the function that will be updating the state - the reducer function.

Few things here:

- Reducer function always takes 2 arguments in: current state, and an action sent to the reducer
- Then, the reducer checks the type property in the action object, and reacts to as per its own setup that we create. 
- Finally, it returns a new state

Also, note that we type the reducer's arguments - the state and action are both typed with interfaces we created earlier. 

With all of that in mind, here is the reducer the for our state:

```js
    // add-profile.page.tsx
    const formStateReducer = (state: FormStateInterface, action: ActionInterface) => {
        switch(action.type) {
            case "firstName":
                return { ...state, first_name: action.payload }
            case "lastName":
                return { ...state, last_name: action.payload }
            case "email":
                return { ...state, email: action.payload }
            case "password":
                return { ...state, password: action.payload }
            case "country":
                return { ...state, country: +action.payload }
            case "city":
                return { ...state, city: action.payload }
            case "website":
                return { ...state, website: action.payload }
            case "avatar_link":
                return { ...state, avatar_link: action.payload }
            case "age":
                return { ...state, age: +action.payload }
            case "hobbies": 
                return { ...state, hobbies: action.payload }
            case "editUser": 
                return { ...action.payload }
            default:
                return state
        }
    }
```

So what is going on here? 
As mentioned, the reducer accepts state and action arguments. This is handled by the **useReducer** hook and dispactch function, created later in the post.

Then, the reducer uses the **switch** block to check the action argument's **type** property. 
Depending in what is the value of the property, the reducer modifies the state.

In case that the reducer doesn't recongize a type property, unmodified state is returned.

##### Use **useReducer** to get state and dispatch function

Finally, we implement the **useReducer** hook to unite everything done so far. 

First, we need to import the hook from "react"

```js
    // add-profile.page.tsx
    import { useReducer } from 'react'
```

Then, inside the component, we use it.
**useReducer** takes in 2 arguments - a reducer and an initial state object.
It returns an array that we can destructure to get two items

- Actual state that we can use in the app. This state is the result of the reducer's manipulation - it is the freshest state available.
- Dispatch method, which we use to send actions to the reducer.

Here is how it looks:

```js
    // add-profile.page.tsx
    const [ formState, formStateDispatch ] = useReducer(formStateReducer, initialFormState);
```

##### Pass the state as props to the form component

And, one more thing - we just pass the state as props to the component that will house the form for adding a new user.

```js
    // add-profile.page.tsx
    return (
    ...
    <div className="add-edit-profile__form-wrapper">
        <AddEditProfileForm 
            formState={formState}
        />
    </div>
    ...
    )
```

#### Query for all countries

We still work inside the **add-profile.page.tsx** file.

We will now put the state business on pause for a bit, and move to getting the list of all coutries in our database.
We need this list to provide country options when creating a new user.

We need both country_id and country_name properties for each country. We will use the id as the value on **option** element, and we will use the name as the string rendered by the element. 

Now, we don't need to work much here. We already have this pretty much prepared from when we tested the **useQuery** hook in the **App** component. So we will just copy it from there, together with the hook's import. 

##### The query and the hook

Here are the query and the **useQuery** hook:


```js
    // add-profile.page.tsx
    import { useQuery, gql } from "@apollo/client";
    ...
    const GET_COUNTRIES_QUERY = gql`
        query GetCountries {
            getCountries {
                country_id,
                country_name
            }
        }
    `;
    ...
    const AddProfilePage = () => {
    ...
        const { data: countriesData, loading: countriesLoading, error: countriesError } = useQuery(GET_COUNTRIES_QUERY);
    ...
```

##### Pass countries as props to the form component

We also need to pass the countries data to the form component.
Note that we are conditionally passing the countries prop with the **?** sign after **countriesData** variable. 
This is a new JS syntax, from what I understand. If we didn't use the question mark, the expression would result in an error, because **countriesData** is undefined when the component mounts, and it has no properties on it.
If we use the question mark, the expression will only continue checking for properties after the question mark in case the **countriesData** is a truthy value. 
At least, that's the way I understood it.

Also, we are adding an additional object to the countries array. This object has an id of 0, and an empty country_name property. We will use it to set the initial, empty option on the **select** element inside the form. 

```js
    // add-profile.page.tsx
    return (
    ...
    <div className="add-edit-profile__form-wrapper">
        <AddEditProfileForm 
            countries={countriesData?.getCountries.concat({ country_id: 0, country_name: "" })}
            formState={formState}
        />
    </div>
    ...
    )
```

#### Use **useMutation** hook to create mutation method

Now, we are creating a mutation to add a new user.
This means that we will have a lot of arguments passed to the mutation.
It also means that we will have a lot of variables to pass into the query.
Also, don't forget that the **useMutation** hook creates a mutation method that we have to call to do the actual mutation.
Once the mutation is complete, we want to redirect the user to the actual profile page. We will use React Router's **Redirect** component to do this. 

So here is the plan:

1. Create the mutation query
2. Import and set up the React Router's **Redirect** component
3. Implement the **useMutation** hook and make sure that variables are ready
4. Use props to pass the mutation method to the form component

##### Create the mutation query

###############################################

Important thing here is that we have lot of variables to include in our query, and they need to match the arguments in the **typeDefs** in the Apollo Server Express instance on the backend. 
Also, we will return only 1 property back from the mutation - the user_id. We will use it to create a link to the user profile, and redirect the user there once the mutation is complete.

Again, we are working in the **add-profile.page.tsx** file. 

```js
    // add-profile.page.tsx
    const NEW_USER_MUTATION = gql`
        mutation NewUser(
            $email: String!
            $password: String!
            $first_name: String!
            $last_name: String!
            $country: Int!
            $city: String!
            $website: String!
            $age: Int!
            $hobbies: [String]!
            $avatar_link: String!
        ){
            newUser(
                email: $email
                password: $password
                first_name: $first_name
                last_name: $last_name
                country: $country 
                city: $city
                website: $website
                age: $age
                hobbies: $hobbies
                avatar_link: $avatar_link
            ) {
                user_id
            }
        }
    `;
```

##### Import and set up the React Router's **Redirect** component

Redirect component works in a way that, when returned by a React component, it redirects the client to any url specified in the Redirect's **to** attribute. 

However, we only want to redirect the user once our mutation is done, so we will conditionally render the Redirect component - if we complete the mutation, we return it. 

We will also use the React's useState hook to hold a number value. If the mutation has not been completed, the state's value will be undefined, and if the mutation has completed, the state's calue will be the **user_id**, returned from the mutation. 

The Redirect component will conditionally rendered based on this state's value, and will use the state's value to assemble a link to the new user's profile, too.

Let's see what I mean.

The **Redirect** component's import: 

```js
    // add-profile.page.tsx
    import { Redirect } from "react-router-dom";
```

The **useState** hook import and implementation:

```js
    // add-profile.page.tsx
    import { useState } from 'react'
    ...
    const AddEditProfilePage = () => {

        const [ pathToNewUser, setPathToNewUser ] = useState<number> ();
    ...
```

Implementation of **Redirect**:

```js
    // add-profile.page.tsx
    return(
    ...
        {pathToNewUser && <Redirect to={`/profile/${pathToNewUser}`} />}
    ...
    )
```

##### Implement the **useMutation** hook and make sure that variables are ready

Next up is to implement the **useMutation** hook.

First, we need to import the hook from "react":

```js
    import { useMutation } from "@apollo/client";
```

Then, we implement it inside the component.
We will pass 2 arguments to the hook - the actual query, and an object containing variables and the **onCompleted** property. 

We will set the variables by destructuring the form state inside the **variables** object. This will make the whole thing a bit quicker, even if it is less readable.

We also need the onCompleted property to set the value of **pathToNewUser** once the mutation has completed. 

On the other side, we will destructure (or spread? I don't know what is the term for array) the hook's return into a **createUser method**, and again destructure the **data** object from the second item in returned array.

Here it is: 

```js
    // add-profile.page.tsx
    const [ createUser, { data } ] = useMutation(NEW_USER_MUTATION, {
        variables: {
            ...formState
        },
        onCompleted: ({newUser}) => {
            console.log("mutation is complete: ", newUser);
            setPathToNewUser(newUser.user_id);
        }
    });
```

##### Use props to pass the mutation method to the form component

Finally, we need to pass the mutation method to the form component, because a button in its form is the one that actually triggers the mutation when it is clicked.

Again, I had few problems with TS types here, and was only able to get around it, I think. We will get to it a bit later. 

Anyway, we can pass the method to the form component in the way it is - as a prop. Or, we can put inside a handler function, and pass the handler instead.

I chose to pass the handler, primarily because I wanted to do some logging when the mutation query is sent, but also because of the annoying TS typing thing.

Here is the handler function that wraps the mutation method. Note that we need to type the argument of handler. The argument is the React' form event.

```js
    // add-profile.page.tsx
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createUser();
    }
```

And here is us passing it as a prop to the form component:

```js
    // add-profile.page.tsx
    return (
    ...
        <div className="add-edit-profile__form-wrapper">
            <AddEditProfileForm 
                countries={ countriesData?.getCountries.concat({ country_id: 0, country_name: ""}) }
                handleSubmit={handleSubmit}
                formState={formState}
            />
        </div>
    ...
    )
```

#### Use form component to connect form inputs to the new user state and mutation method, and to render all countries in the **select** element

The form component is the one that renders the form for adding a new profile. It accepts props such as state properties, as well as change and submit handlers, and the countries array, so the user can choose a country. 

We will not go into creation of the actual component here. We will only make sure that the neccessary props are passed to it, and that handlers do their job.

The plan:

1. Create change handler in the **AddProfilePage** component, and pass it to the **AddEditProfileForm** component
2. Create interface for props coming into **AddEditProfileForm**
3. Use **AddEditProfileForm** component to render form and change and submit data.

##### Create change handler in the **AddProfilePage** component, and pass it to the **AddEditProfileForm** component

We are creating the **handleChange** function in the **AddProfilePage**.
This function will be using the dispatch function destructured from the **useReducer** hook to send an action to the reducer. The action will include type and payload properties. 
It will also hold some logic, in order to shape the **action** before it reaches the reducer.

So here is the **handleChange** function, together with the TS type required for the handler's argument:

```js
    // add-profile.page.tsx
    ...
    type HandleChangeType = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>
    ...
    const AddEditProfilePage = () => {
    ...
        const handleChange = (e: HandleChangeType) => {
            const { name, value } = e.target;

            const payloadValue: string | string[] = name === "hobbies"? value.split(",").map(hobby => {
                return hobby.trim();
            }): value;

            formStateDispatch({ type: name, payload: payloadValue });
        }
    ...
```

A bit of explanation: 

1. handleChange accepts an argument of **event**, for which we created TS type. The type is React's ChangeEvent type - either for regular input element, textarea element, or select element. I am not sure if this is correct what I just wrote.
2. Inside the handler, we destructure name and value from the element that triggered the event. 
3. Then, we created the payloadValue to be included in the action. If we are changing the **hobbies** input, we are making it an array of strings to be inluded in the state. In all other cases, we just assign the input value to the payload. 
4. Finally, we use the dispatch function to send the action to the reducer. We set the type to have value of the **name** attribute on the input, and include payloadValue as the **payload** property. 

Now we just have to pass the handler to the **AddEditProfileForm** component. 

```js
    // add-profile.page.tsx
    return (
    ...
        <div className="add-edit-profile__form-wrapper">
            <AddEditProfileForm 
                countries={countriesData?.getCountries.concat({ country_id: 0, country_name: ""})}
                handleChange={ handleChange }
                handleSubmit={handleSubmit}
                formState={formState}
            />
        </div>
    ...
    )
```

##### Create interface for props coming into **AddEditProfileForm**

We are now working in the **AddEditProfileForm** component. This component is used by both **AddProfilePage** and **EditProfilePage**.
Because of this, we have two cases of optional properties included in the interface.

Default behavior of properties included in interface is that they are all mandatory. This means that if a property is included in the interface, the object that uses this interface for its type has to have that property.
We can, however, specify that certain properties are optional by using a question mark next to the property name. This way a property does not need to exist in the object.

In case of React and our component, we will have **user_id** and **password** propeties be optional.
This is because **user_id** is not used when we create a new user, and such property does not exist in the state of **AddProfilePage**. On the other hand, **password** does will not exist in the state of **EditProfilePage**, because we will not have an option to edit password when editing a user. It is just the way I decided to have the edit functionality. 

All other properties are same for both adding and editing users.

Here is the interface, defined and in use with props:

```js
    // add-edit-profile-form.component.tsx
    ...
    interface AddEditProfileFormProps {
        countries: { country_id: string, country_name: string }[];
        handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        formState: {
            user_id?: number;
            first_name: string;
            last_name: string;
            email: string;
            password?: string;
            country: number;
            city: string;
            website: string;
            avatar_link: string;
            age: number;
            hobbies: string[];
        }
    }

    const AddEditProfileForm = ({ countries, handleChange, handleSubmit, formState }: AddEditProfileFormProps) => {
    ...
```

##### Use **AddEditProfileForm** component to render form and change and submit data.

This part is simple, classic React. We just use the props to render data or enable changing inputs and updating state.

Few things though:

1. We render **password** label and input only if the **password** prop is truthy - when we are actually creating a new user.
2. Initial value of **select** element is 0, as taken from the state for new user. Remember that we also concatanated a new object into countries prop, to add it id of 0, and name of "". In the code for **option**, we also specify that we disable and hide option entry for that particular object in the array, so it becomes unclickable and not visible. 

```js
    // add-edit-profile-form.component.tsx
    return (
    <div
        onSubmit={handleSubmit}
        className="add-edit-profile-section__add-edit-profile-form">
        <div className="add-edit-profile-form__basic-info">
            <label htmlFor="firstName" className="add-edit-profile-form__label">First Name: {typeof user_id} </label>
            <input 
                type="text" id="firstName" 
                name="firstName" 
                className="add-edit-profile-form__input"
                value={first_name}
                onChange={handleChange}
                />
            <label htmlFor="lastName" className="add-edit-profile-form__label">Last Name</label>
            <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                className="add-edit-profile-form__input"
                value={last_name}
                onChange={handleChange}/>
            <label htmlFor="email" className="add-edit-profile-form__label">Email</label>
            <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="add-edit-profile-form__input"
                    value={email}
                    onChange={handleChange}/>
            { password !== undefined && (
            <>
                <label htmlFor="password" className="add-edit-profile-form__label">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    className="add-edit-profile-form__input"
                    value={password}
                    onChange={handleChange}/>
            </>
            )}
        </div>

        <div className="add-edit-profile-form__personal-info">
            <label htmlFor="country" className="add-edit-profile-form__label">Country</label>
            <select 
                value={country}
                name="country" 
                id="country"
                className="add-edit-profile-form__input"
                onChange={handleChange}>
                { countries && countries.map(({ country_id, country_name }) => {
                    return (
                        <option 
                            key={country_id}
                            value={country_id}
                            disabled={country_name === ""}
                            hidden={country_name === ""}>
                                {country_name}
                        </option>
                    );
                })}
            </select>

            <label htmlFor="city" className="add-edit-profile-form__label">City</label>
            <input 
                type="text" 
                id="city" 
                name="city" 
                className="add-edit-profile-form__input"
                value={city}
                onChange={handleChange}/>
            <label htmlFor="website" className="add-edit-profile-form__label">Website</label>
            <input 
                type="text" 
                id="website" 
                name="website" 
                className="add-edit-profile-form__input"
                value={website}
                onChange={handleChange}/>
            <label htmlFor="avatar_link" className="add-edit-profile-form__label">Profile Picture</label>
            <input 
                type="text" 
                id="avatar_link" 
                name="avatar_link" 
                className="add-edit-profile-form__input"
                value={avatar_link}
                onChange={handleChange}/>
            <label htmlFor="age" className="add-edit-profile-form__label">Age</label>
            <input 
                min="18" 
                type="number" 
                id="age" 
                name="age" 
                className="add-edit-profile-form__input"
                value={age}
                onChange={handleChange}/>
            <label htmlFor="hobbies" className="add-edit-profile-form__label">Interests</label>
            <textarea 
                id="hobbies" 
                name="hobbies" 
                className="add-edit-profile-form__input"
                placeholder="Please separate your interests with commas" 
                value={hobbies.join(", ")}
                onChange={handleChange}
            />
        </div>
        <button type="submit" className="register-form__add-edit-submit-button">Submit</button>
    </div>
    ...
    )

```

Mutation for a new user is now done. Our change handler updates the state for new user, and clicking the submit button in the form triggers the submit handler, which calls mutation method provided to use by the **useMutation** hook. A new user is created, and the client is redirected to its profile page.

/////////////////////////////////////////////////////////////////////////////////////

### Edit user with useMutation hook

This part is pretty similar to the previous one. In fact, it is much quicker and easier because we can use lot of the previous' part code.

- We will reuse the **AddEditFormComponent**
- Props that we will be passing to to the component from **EditProfilePage** are already typed in the **AddEditFormComponent**

There are few differences, however. We need to fetch data for the user that we want to edit, and then put that data into correcsponding input fields in the form component. 
Same as before, we need the list of countries, but we don't want to fetch them with the separate query. Instead, we created a GQL type on the backend that returns the user for edit, as well as all the countries. This way we will get all necessary data in one go. 

Here are the type and the query, so you don't have to go back and search for it in previous posts.

```js
    // type-defs in the backend
    import { gql } from "apollo-server-express";

    export default gql`
        type Query {
            ...
            getUserForEdit(id: Int): UserForEdit
            ...
        }
        ...
        type UserForEdit {
            user: User
            countries: [Country]
        }
```

Quick summary of data flow when editing a profile:
**useQuery** hook queries a user for edit data and, when done, assigns user data to the reduced state that exists in the component. The state itself is passed as props to the form component, togher with the countries array coming from the same GQL query. Change and submit handlers are also passed to the form component. When submit button is clicked, the submit handler calls mutate function returned by the **useMutation** hook. The hooks itself again uses the whole state as variables for the mutation query.

Plan:

1. Create query for to get user for edit, and mutation query for editing user
2. Use React Router to get id of the user for edit
3. Create reduced state for edited user and useState for **Redirect** component. 
4. Implement **useQuery** and **useMutation** hooks
5. Create change and submit handlers and pass them to the **AddEditProfileForm** component
6. Use **Redirect** component to navigate to edited profile when mutation is complete
7. We don't need to do anything in the form comonent bc all is ready from the previous mutation.

#### Create query for to get user for edit, and mutation query for editing user

For the **getUserForEdit query**, we will require both the user, with its full properties, and all countries, with both the id and name. 
The only argument the query needs is the user id.

Here is the query: 

```js
    // edit-profile.page.tsx

    const GET_USER_FOR_EDIT_QUERY = gql`
        query GetUserForEdit($user_id: Int!) {
            getUserForEdit(id: $user_id) {
                user {
                    user_id,
                    email,
                    first_name,
                    last_name,
                    city,
                    website,
                    age,
                    hobbies,
                    # country,
                    country { country_id },
                    avatar_link
                },
                countries {
                    country_id,
                    country_name
                }
            }
        }
    `;
```

In case of the mutation query, we need to provide arguments for all properties that the user has. 
I tried to figure out a way to include only edited properties, but it seems that this would require lot of code on both frontend and backend, so decided to stick with all of it.
We will require just the **user_id** property back from the mutation, and we will use the property to navigate to the user profile page.

Here is the mutation query: 

```js
    // edit-profile.page.tsx

    const EDIT_USER_MUTATION = gql`
        mutation EditUser(
            $user_id: Int!
            $email: String!
            $first_name: String!
            $last_name: String!
            $country: Int!
            $city: String!
            $website: String!
            $age: Int!
            $hobbies: [String]!
            $avatar_link: String!
        ){
            editUser(
                user_id: $user_id
                email: $email
                first_name: $first_name
                last_name: $last_name
                country: $country 
                city: $city
                website: $website
                age: $age
                hobbies: $hobbies
                avatar_link: $avatar_link
            ) {
                user_id
            }
        }
    `;
```

#### Use React Router to get id of the user for edit

We have already done this before when we fetched user data for the profile page.

Here is the import of the **useParams** hook, as well as destructuring of its **user_id** parameter. 

```js
    // edit-profile.page.tsx

    import { useParams } from "react-router-dom";
    ...
    const EditProfilePage = () => {
        const { user_id } = useParams();
        ...
    }
    ...
```

#### Create reduced state for edited user

We have experience with this part as well. The reduced state parts are almost the same as in the **AddProfilePage** component. 

Few differences are: 

1. Interface for state and initial state both miss the **password** properties
2. Instead, they have the **user_id** properties.
3. Switch block in the reducer also misses the case for "password" action type. 
4. The switch block in the reducer has 2 other cases: case for **userId**, and case for completely replacing the state. We will use this option to assign queried user data to the state when the **useQuery** hook completes. 

So let's do it.

The intial state and its interface, as well as the interface for **action**:

```js
    // edit-profile.page.tsx

    const initialFormState = {
        user_id: 0,
        first_name: "",
        last_name: "",
        email: "",
        country: 0,
        city: "",
        website: "",
        avatar_link: "",
        age: 0,
        hobbies: [""],
    }
```

```js
    // edit-profile.page.tsx

    interface FormStateInterface {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        country: number;
        city: string;
        website: string;
        avatar_link: string;
        age: number;
        hobbies: string[];
    }

    interface ActionInterface {
        type: string;
        payload: any;
    }
```

The reducer, with its arguments typed:

```js
    // edit-profile.page.tsx

    const formStateReducer = (state: FormStateInterface, action: ActionInterface) => {
        switch(action.type) {
            case "userId": 
                return { ...state, user_id: +action.payload }
            case "firstName":
                return { ...state, first_name: action.payload }
            case "lastName":
                return { ...state, last_name: action.payload }
            case "email":
                return { ...state, email: action.payload }
            case "country":
                return { ...state, country: +action.payload }
            case "city":
                return { ...state, city: action.payload }
            case "website":
                return { ...state, website: action.payload }
            case "avatar_link":
                return { ...state, avatar_link: action.payload }
            case "age":
                return { ...state, age: +action.payload }
            case "hobbies": 
                return { ...state, hobbies: action.payload }
            case "userForEdit": 
                return { ...state, ...action.payload }
            default:
                return state
        }
    }
```

Finally, implementation of the **useReducer** hook:

```js
    // edit-profile.page.tsx
    ...
    const EditProfilePage = () => {
        const [ formState, formStateDispatch ] = useReducer(formStateReducer, initialFormState);
    ...
```

And now, we will just pass the state to the form component. Props are already typed on the form component, with **password** and **user_id** being optional

```js
    // edit-profile.page.tsx

    return (
    ...

        <div className="edit-profile__form-wrapper">
            <AddEditProfileForm    
                formState={formState}
            />
        </div>
    ...
```

Last thing, we will create a simple state with **useState** hook, to hold **user_id** when edit user mutation completes. I know we already know the user's id, but I still prefer to do it this way. It makes code more readable and consistent with the code in **AddProfilePage**. We could also have this state just return true or false, and set the Redirect's **to** attribute to hold the **useParams** user_id parameter. It's a choice, really. 

```js
    // edit-profile.page.tsx
    ...
    import { useState } from 'react'
    ...
    const [ pathToEditedUser, setPathToEditedUser ] = useState<number> ();
    ...
```

#### Implement **useQuery** and **useMutation** hooks

As already established wwhen we made the query, with **useQuery** we will be fetching the actual user, as well as all the country that exist in the database. 
We have the **user_id** paramater from the React Router's **useParams** hook, which we will use as an argument to the query. Once the data is fetched, we will assign the user data to the **formState** that we created. Then, its properties can be used as values for edit inputs in the form component.

So here is the hook implementation. Note that we are using the **useReducer's** dispatch method to replace the whole state with what we received from the Apollo Server Express. 

```js
    // edit-profile.page.tsx
    const { data: userForEditData, loading: userForEditLoading, error: userForEditError } = useQuery(GET_USER_FOR_EDIT_QUERY, {
        variables: {
            user_id: +user_id,
        },
        onCompleted: (data) => {

            const { __typename, ...restOfUser } = data.getUserForEdit.user;

            const userForState = {
                ...restOfUser,
                country: +restOfUser.country.country_id,
                user_id: +restOfUser.user_id,
            }
            formStateDispatch({
                type: "userForEdit",
                payload: userForState,
            })
        }
    });
```

Since the query returned the countries data as well, we can now pass that data to the form component. 
This time we don't have to concatanate an additional object into the array, becuase the **select** element will get it's value from the **formState**, and it's value will be a country that the user is from. 

```js
    // edit-profile.page.tsx
    return (
    ...

        <div className="edit-profile__form-wrapper">
            <AddEditProfileForm    
                countries={userForEditData?.getUserForEdit.countries}
                formState={formState}
            />
        </div>
    ...
```

As far as the **useMutation** hook goes, its not much different from what we did with the **AddProfilePage** component. We will use the mutation query that we prepared, and will include the whole **formState** into the hook's variables object. Once the mutation completes, it will return the user id, and assign it to the **pathToEditedUser** state. This, in turn, will trigger rendering of the **Redirect** component, and the client will be redirected to the user's profile page. 

Here is the whole thing:

```js
    // edit-profile.page.tsx
    ...
    const [ editUser, { data } ] = useMutation(EDIT_USER_MUTATION, {
        variables: {
            ...formState
        },
        onCompleted: ({ editUser }) => {
            setPathToEditedUser(editUser.user_id);
        },
        onError: (error) => {
            console.log(error)
        }
    });
    ...
```

#### Create change and submit handlers and pass them to the **AddEditProfileForm** component

We can copy both handlers from the **AddProfile**, and just replace the **createUser** mutation method with this component's **editUser** mutation.

```js
    // edit-profile.page.tsx
    ...
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        editUser();
    }

    const handleChange = (e: HandleChangeType) => {
        const { name, value } = e.target;

        const payloadValue: string | string[] = name === "hobbies"? value.split(",").map(hobby => {
            return hobby.trim();
        }): value;

        formStateDispatch({ type: name, payload: payloadValue });
    }
    ...
```

Then, we just pass the handler's as props to the form component:

```js
    // edit-profile.page.tsx
    return (
    ...

        <div className="edit-profile__form-wrapper">
            <AddEditProfileForm    
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                countries={userForEditData?.getUserForEdit.countries}
                formState={formState}
            />
        </div>
    ...
```

#### Use **Redirect** component to navigate to edited profile when mutation is complete

This part is the same as in the **AddProfilePage**. Once **pathToEditedUser** is a truthy value, the client is redirected to the user's profile page.

Here it the code:

```js
    // edit-profile.page.tsx
    ...
    import { Redirect } from "react-router-dom";
    ...
    {pathToEditedUser && <Redirect to={`/profile/${pathToEditedUser}`} />}
```

////////////////////////////////////////////////////////////////////////////////

### Delete user with useMutation hook

When it comes to deleting user, we have set up the mutation query and the resolver on the backend. 
The mutation takes in an integer argument, and returns a boolean to indicate of the user has been deleted. Maybe we don't need this boolean, but I guess we do need the query to return something. Also, since I plan to use the **useMutation**'s **onCompleted** argument property, and I have a suspicion that it will execute anytime the mutaiton completes, even if the user has not been deleted, using a boolean seems like a plan. 

More detailed plan is to:

1. Create a delete mutation query in the **ProfilePage** component
2. Create state to hold a boolean indicating id a user has been deleted once the mutation completes
3. Use React Router's **useParams** hook to get the user's id.
4. Implement the **useMutation** hook, and add the user's id as a variable
5. Pass and type the mutation method to the profile view component as a prop and add a delete button in the **UserProfileDetailed** view component.
6. Implement **Redirect** component to redirect to **"/home** once the mutation completes

#### Create a delete mutation query in the **ProfilePage** component

Nothing to it here:

```js
    // profile.page.tsx
    const USER_DELETE_MUTATION_QUERY = gql`
        mutation DeleteUser ($user_id: Int) {
            deleteUser(user_id: $user_id) 
        }
    `;
```

#### Create state to hold a boolean indicating id a user has been deleted once the mutation completes

Just a simple state with the **useState** hook. It holds a boolean:

```js
    // profile.page.tsx
    const [ isProfileDeleted, setIsProfileDeleted ] = useState<Boolean> (false);
```

#### Use React Router's **useParams** hook to get the user's id.

We actually already have this one, from when we fetched the actual user info for the page.

#### Implement the **useMutation** hook, and add the user's id as a variable

We've done this many times now. Once the mutation completes, we will set the state of **isProfileDeleted** to whatever the mutation returns. We could kinda hardcode a **true** in it instead of the mutation return, but I have suscpicions that the mutation might call the **onCompleted** method even if the mutation doesn't actually delete the user. 

Here is the hook implementation, with only mutation method being destructured from the hook's return:

```js
    // profile.page.tsx
    const [ deleteUser ] = useMutation(USER_DELETE_MUTATION_QUERY, {
        variables: {
            user_id: +user_id,
        }, 
        onCompleted: (data) => {
            console.log("data from deletion", data);
            setIsProfileDeleted(data.deleteUser);
        }
    })
```

#### Pass and type the mutation method to the profile view component as a prop and add a delete button in the **UserProfileDetailed** view component.

We will pass the actual mutation method to the view component this time. It is still an issue that I don't know how to type it in the interface, so I will just type it as an **any** type. 

Here is the props passing from the **ProfilePage** component:

```js
    // profile.page.tsx
    return (
    ...

        <div 
            className="people-section__profile-detailed-wrapper">

            {userError && <p>Unfortunately, there was an error fetching user. Please try again later. </p>}
            {userLoading && <p>Loading...</p>}

            {userData && <UserProfileDetailed 
                user={userData.getUser}
                deleteUser={deleteUser}
            />}
        </div>
    ...
```

And here is the interface in the **UserProfileDetailed** component:

```js
    // user-profile-detailed.component.tsx
    ...
    interface UserProfileDetailedProps {

        user: {
            age: number;
            avatar_link: string;
            city: string;
            country: {
                country_name: string;
            };
            email: string;
            first_name: string;
            last_name: string;
            hobbies: string[];
            user_id: string;
            website: string;
        };
        deleteUser: any;
    }

    const UserProfileDetailed = ({ user, deleteUser }: UserProfileDetailedProps) => {
    ...
```

Finally, we add a button (well, a paragraph actually) to delete user, and attach event listener on it to call the delete function (which has to be a callback in this case, probably becuase i didn't type it?) when clicked.

```js
    // user-profile-detailed.component.tsx
    ...
    return (
    ...
        <p 
            onClick={deleteUser}
            className="basic-info__delete-profile">Delete profile
        </p>
    ...
```

#### Implement **Redirect** component to redirect to **"/home** once the mutation completes

Finally, we use the **Redirect** in the **ProfilePage** to be rendered depending on the **isProfileDeleted** state.

```js
    // profile.page.tsx
    return (
    ...
        {isProfileDeleted && <Redirect to="/home" />}
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
8. **Establish frontend and backend communication via Apollo Client**
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
