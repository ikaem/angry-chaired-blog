---
title: 'Gatsby Web: Getting Data with GraphQL & Filesystem Plugin'
date: 2020-08-16 22:28:18
tags:
- gatsby
- graphql
- gatsby plugins
categories: gatsby web
cover: mikusa-martin-nY3QuSiCG8Q-unsplash.jpg

creditArtist: Mikusa Martin
creditSource: https://unsplash.com/@marooxd?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 4 of 10 in Gatsby Web

Gatsby is all about GraphQL. We incorporate our site's metadata into pages with it, we use it to get data from files, and to get and work with images, and so on. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 4. Get data with GraphQL and Filesystem plugin

Here is what we will do in this part: 

1. Configure site metadata and use GQL to query it
2. Install and configure plugin to access the file system
3. Use GQL to query the file system inside the app

### Configure site metadata and use GQL to query it

We use meta data to describe websites, and make it easier for search engines to know what websites are about.
With Gatsby, we can prepare information about our website, and then use GQL to query and provide that information to whichever tool needs it to assemble the metadata. 

We will not assemble this metadata just yet. We will, however, prepare that information, query it, and use queried data to set content on the **About** page, and to set logo in our header.

To prepare site metadata information for querying, once again we go to the **gatsby-config.js** file. 
There, we add another property to the exported object, and call it **siteMetadata**. siteMetadata is an object holding three properties (or more, if you want) defining title, description and author of the website:

```js
// gatsby-config.js

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: "Angry Chaired",
    description: "Portfolio of my Web Development learning",
    author: "kaem",
  },
  plugins: [
  ...
```

Nice. Now, we can query this data and use it in our page. 
There are 2 types of queries in Gatsby:

1. Page queries
2. Static queries

#### Page queries

Let's go to the **About** page component, and import **graphql** from **"gatsby"**. This is a tag function that we will use to query data we just created.

```js
// src/pages/about.tsx
...
import { graphql } from "gatsby"
```

Now, we query. 
Gatsby pages have access to so-called page queries. These queries can take variables, like normal GQL queries, but are only available in Gatsby pages. 

Page queries are defined outside of componenent defintions, and need to be exported. 
Data that they return is automatically passed as a prop to the component that lives in the same file. This prop is called **data**.

Here we are making a page query for author and title of our site, log the queried data, and then pass it on to other components.

```js
// src/pages/about.tsx
import { graphql } from "gatsby"

interface AboutProps {
    data: {
        site: {
            siteMetadata: {
                title: string;
                author: string;
            }
        }
    }
 }

const About: React.FC<AboutProps> = ({ data }) => {

  console.log("data in about:", data);

  const { site: { siteMetadata: { title, author }}} = data;

  return (
    // ...
        <section className="about-page__about-section">
          <PageTitle pageTitle={`About ${title} by ${author}`} />
        </section>
    // ...
  )
}

export default About

export const query = graphql`
  query {
    site {
      siteMetadata {
        title 
        author
      }
    }
  }
`
```

Here is what is logged in the console: 

```js
data in about: 
    {site: {…}}
        site:
            siteMetadata:
                author: "kaem"
                title: "Angry Chaired"
```

Note that the name of our query (and the object in the **data** prop ) is **site**. This is how GQL knows that it needs to query the site. 

We can also give an alias to the query, in case we need the queried data to have a different name. 
We do so by adding a custom name and a colon before **"site"**:

```js
// ...
export const query = graphql`
  query {
    metadata: site {
      siteMetadata {
        title 
        author
      }
    }
  }
`
```

Now, we can find the queried data by its alias:

```js
data in about: 
    { metadata: {…}}
        metadata: {siteMetadata: {…}}
```

#### Static queries

What about those other components, you ask? How do they query? 
They can. They can use static queries. Unfortunately, these cannot use variables, something that caused headache for me at one point.

Still, they can query data. 
We will go to our **Header** component, and import a hook from **"gatsby"** called **useStaticQuery**. We will also import **graphql** too. 

```js
// src/components/header.component.tsx
// ...
import { Link, graphql, useStaticQuery } from "gatsby"
```

The **useStaticQuery** hook is used inside component definitions. It accepts an argument, which is a GQL query made with the **grapqhl** function. 

Let's use the hook in the Header component, and pass it that same query that we used on the **About** page (minus the **author**). 
Again, we log the result, and render the **title** as logo in the header.

```js
// src/components/header.component.tsx
// ...

const Header: React.FC = () => {
  // ...
  const data = useStaticQuery<{ site: { siteMetadata: { title: string } } }>(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  console.log("header static query data:", data);

  const { site: { siteMetadata: { title }}} = data;

  return (
    <HeaderStyled className="main-header">
      <div className="main-header__logo-container">
        <Link to="/">
          <h1 className="logo-container__logo-header-actual">{title}</h1>
        </Link>
        ...
```

The logged result is the same as the one with the page query:

```js
header static query data: 
  {site: {…}}
    site: 
      siteMetadata: 
        {title: "Angry Chaired"}
```

### Install and configure plugin to access the file system

Now that we see how GQL querying works in Gatsby, how about we try to query files in our project?

For this, we need a source plugin. Source plugins are used to fetch data from a source, and in this case we need a source plugin for the file system. 
After installing and configuring the plugin, we will be able to go query files in our project.

The plugin we need is conveniently called **gatsby-source-filesystem**, and we install it, as one would assume, with:

```bash
npm i gatsby-source-filesystem
```

Next up is the plugin configuration.

We do it, as usual, in the **gatsby-config.js** file, by adding the plugin to the **plugins** array.
The **gatsby-source-filesystem** requires a JS object to be added to the array. The object holds a **resolve** property, which is a string with the name of the plugin, and an options object. This object in turn holds a **path** property, pointing to the folder we want the plugin to work in.
In this case, we want the plugin to "cover" the entire **src** folder, so we can query all files inside it.

```js
// gatsby-config.js

module.exports = {
  /* Your site config here */
  // ...
  plugins: [
    // ...
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src`,
      },
    },
```

Right on. Let's query our files now. 
Gatsby comes with a great tool to do querying outside the app we are developing. The tool is called **GraphiQL**, and it is available at **localhost:8000/___graphql**.

After starting the tool, a window with three areas show up. 
The left one lists all possible queries, the middle one is used for writing queries, and the right one returns query results. 
It is really an amazing tool. 

Before we use the filesystem plugin, lets try to query our site for that same metadata we queried in the app. 
In the left area, click on the **site** option. The option expanded to show a dropdown with more options, and two of them are called **siteMetadata**. Click on the bottom, blue one. It is the same one that we used in the app. 
Now look at the middle screen. As we click options on the left, we select them, and they are automatically entered into the query area. Not bad, right?
Go back to the left area and select **author** from under **siteMetadata**. The **author** field is added to the query.

```
query MyQuery {
  site {
    siteMetadata {
      author
    }
  }
}
```

Finally, click that big **play** button just above the query area. QraphiQL does a bit od work, and comes up with a result in the right area. We just go our site author. 

```js
{
  "data": {
    "site": {
      "siteMetadata": {
        "author": "kaem"
      }
    }
  }
}
```

GrapqhiQL makes it possible to easily assemble queries. We can see what options we have available, and do sorting and filtering in an easy way. Finally, when we have a query just the way we want it, we can simply copy it into our app.

How about making use of that filesystem plugin we just installed? 
Select **allFile** option in the left area, and then click on the **edges** option in the middle. The **edge** field represents a single query result, which in turn points to a **node**. So select the **node** field too. Node is an object, a file, a discrete unit in the filesystem. We can now access properties that describe this node thing. 
So let's select **relativePath** and **prettySize**.

```
query MyQuery {
  allFile {
    edges {
      node {
        relativePath
        prettySize
      }
    }
  }
}
```

Click play again, and see what we get. GrapqhiQL return a list of all files in the **src** folder, together with their path relative to **src**, and their size in KB. Very good

```js
{
  "data": {
    "allFile": {
      "edges": [
        {
          "node": {
            "relativePath": "index.css",
            "prettySize": "0 B"
          }
        },
        {
          "node": {
            "relativePath": "components/currently.component.tsx",
            "prettySize": "1.53 kB"
          }
        },
        {
          "node": {
            "relativePath": "components/layout.component.tsx",
            "prettySize": "2.01 kB"
          }
        },
  // ...
```

Let's go back to the app real quick. 
We can have multiple sets of options for the **gatsby-source-filesystem** plugin, to indicate that we work with multiple filesystem locations (data sets), and need one filesystem plugin for each data set. 

When doing this, we add a **name** property to the **options** object, and give it a string value with which we can indentify this particular data set.
Note that the **path** properties in these configuration objects would then point to different folders, none of which can be nested inside each other. 

Let's say that we want to have two data sets: one for our pages, and the other one for the components. Here is what I mean:

```js
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "components",
        path: `${__dirname}/src/components`,
      },
    },
```

Restart the devlopment server and move back to GrapqhiQL. 
We can now query our data sets separately, by using their names to indicate which one we want to work with. 
We specify a data set by filtering files by **sourceInstanceName**, which we want equal to name of a data set.

GrapqhiQL makes it easy. 
Click on **allFile**, **filter**, **sourceInstanceName**. Chjeck the **eq** option, and type **"pages"** in the empty field.
Finally, move a bit down to find the **totalCount** field, and select it. This will return total number of files in this particular data set.

```
query MyQuery {
  allFile(filter: {sourceInstanceName: {eq: "pages"}}) {
    totalCount
  }
}
```

Press play, and see the result:

```js
{
  "data": {
    "allFile": {
      "totalCount": 15
    }
  }
}
```

Now rename the sourceInstanceName to equal **"components"**, and press play:

```js
{
  "data": {
    "allFile": {
      "totalCount": 7
    }
  }
}
```

Wow. See. Two data sets, and we can switch between them. Lovely.

Let's go back to just one data set, though, as it makes this whole writing thing easier. 

```js
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "src",
      path: `${__dirname}/src`,
    },
  },
```

Don't forget to restart the development server after changing **gatsby-config.js**

### Use GQL to query the file system inside the app

This part is really not complicated now. 
We already know how to do page queries and static queries, and we know how to query the filesystem.

So let's just log the total number of files we have in the **src** folder.
We can do it in the **Contact** page.

```js
// contact.tsx

import { graphql } from "gatsby"

const Contact: React.FC<{ data: { allFile: { totalCount: number }}}> = ({ data }) => {

  console.log("allFile data:", data);
  ...

  return(...)

}

export default Contact

export const query = graphql`
  query {
    allFile {
      totalCount
    }
  }
`
```

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at 

- [Github](https://github.com/ikaem/angry-chaired-gatsby) 
- [Live project](https://angrychaired.surge.sh/)

### Goals

1. A Gatsby website with a list of projects on home page
2. Dedicated pages for each project
3. Write project information in Markdown
4. Functional message form 
5. Deployed website

### Steps

1. Create new Gatsby project with TS and create basic pages
2. Create layout and its elements, and other components
3. Install Styled Components and its Gatsby plugin to style pages
4. **Get data with Filesystem plugin and GraphQL**
5. Write projects content in Markdown
6. Programatically create pages from Markdown files
7. Insert Markdown files into pages with MarkdownRemark plugin
8. Use Gatsby Image to work with images
9. Create send message feature on the contact page
10. Audit, optimize and deploy the website

### Tech and Tools

1. React
2. Gatsby
3. Markdown
4. TypeScript
5. Getform.io
6. Surge
7. Styled Components

### Experience with Tech & Tools

Prior to this project, I had very little experience with Gatsby. I did a little something with Next.js, another React framework that focuses on server-side rendered websites. I am ok with GraphQL, on which Gatsby heavily relies to get its data, and I am ok with TS too.  

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
