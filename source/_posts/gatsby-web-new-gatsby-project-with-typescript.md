---
title: 'Gatsby Web: New Gatsby Project with TypeScript'
date: 2020-08-16 21:47:07
tags:
- gatsby 
- typescript
categories: gatsby web
cover: sangia-A4LzJf1cZeE-unsplash.jpg

creditArtist: Sangia
creditSource: https://unsplash.com/@sangia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 1 of 10 in Gatsby Web

This project relies heavily on the [Gatsby official tutorial](https://www.gatsbyjs.org/tutorial/). I did modify it somewhat, using TS instead of JS, messing with the filesystem plugin a bit, and straying on occasion when the website needed something different from the tutorial. 

The idea here is to create a website where I will eventually be able to show my projects, and then sometime in the future even move the blog to. 
I see Gatsby mentioned a lot around the web, so I figured to use it for this project. 

<!--more-->

#### See [Project Information](#Project-Information)

I wanted to test how it is to use Markdown for describing projects, and then converting that to HTML. I am not really impressed with how Gatsby turns it into HTML, but then again, there is probably lot that I don't know about it. Also, there is this thing called MDX, which is basically JSX in Markdown. I plan to use this for the blog project, and have a feeling I might be more comfortable with it. 

All in all, working with Gatsby turned out to be surprisingly simple. It is basically React, but with no server in the way I am used to it with React. Though, it could be, if one wants. I had to adjust my way of thinking a bit, since, when built, the website is static. 
I found working in TS a bit weird, though, as it doesn't use TS compiler, but instead uses Babel, so there is no type checking. It seems this can be changed, though, and I will check that in future series.

Finally, I am not happy with the end result. Thinking back on it, and knowing what I know now, I think I can make it better. I will work on my desing, HTML and CSS skills, and do a separate blog project, and will come back to Gatsby after. 

## Step 1. Create new Gatsby project with TS and create basic pages

Alright, let's start, straight into it, head first. 

In this part we will:

1. Create a new project with TS and see what is in the created project
2. Create basic outline of our pages
3. Navigate across our pages

### Create a new project with TS and see what is in the created project

Gatsby requires Node, Git and Gatsby CLI to work. 
I assume the first two are already installed, and move to Gatsby CLI from the terminal. We are installing it globally. 

```bash
    npm i -g gatsby-cli
```

The CLI enables us to actually create new projects. 
Once the CLI is installed, we create a new project from the terminal by calling **gatsby new** command. 
We add the name of the project (or a "." character if we want to create a project in the current folder) after, and a link to a starter project. 

```bash
    gatsby new hello-world https://github.com/gatsbyjs/gatsby-starter-hello-world
```

A starter project includes certain folders and files that are needed for a new site. 
There is a (list)[https://www.gatsbyjs.org/starters/?v=2] of Gatsby starters here.

Once the download and installation completes, we get a project whose structure is very similar to that of a classic React project.

Few most obvious differences are:

- There is no **index.js** file which holds the entire app
- There is no **app.js** file 
- There is a **gatsby-config.js** file
- There is a **src** folder which holds a **pages** folder. 

Inside **pages** folder there is an **index.js** file. If we look inside we will see a usual React component. 

Let's rename the file to **index.tsx**. We are now working with TypeScript in Gatsby. 

According to Gatsby documentation, it comes with TS support out of the box. However, it doesn't use TS compiler. Instead, it uses a Babel plugin to transpile (big word) TypeScript, and does not do type checking. This last part was a bit confusing for me, as types obviously mismatched on several occasions, but the site still worked. 

Let's now start the development server from the terminal, so we can see our app in action. 

```bash
gatsby develop
```

This will start a dev server, and we get access to our website on **localhost:8000**.
In case you want to change port, you can use the **-p** or **--port** flags, and specify port after it 

```bash
gatsby develop -p 4000
```

The development server, in theory, allows for hot reloading. It works in most cases, but there were few occasions when the server did not react to changes in the code.

### Create basic outline of our pages

The pages in question are just regular React components. What makes them pages is that they are placed in that **pages** folder. Gatsby then uses filenames of those components to create routes in our app. We will get to this.

We will create 4 pages:

1. Home page
2. About page
3. Contact page
4. 404 page

In this part we will create just rough sketches of these pages, and I will not go too deep into it. They are, after all, React components.

For **index.tsx**, the Home Page, replace the existing content with the one below:

```js
    // src/pages/index.tsx
    import React from "react"

    const HomePage: React.FC= () => {
        return (
            <h1>Home Page</h1>
        )
    }
```

About and Contact pages we create from scratch:

```js
    // src/pages/about.tsx
    import React from "react"

    const About: React.FC= () => {
        return (
            <h1>About Page</h1>
        )
    }
```

```js
    // src/pages/contact.tsx
    import React from "react"

    const Contact: React.FC= () => {
        return (
            <h1>Contact Page</h1>
        )
    }
```

We stay with the **404.tsx** component a bit longer.
If a component with this name exists in the **pages** folder, Gatsby will render it avery time an unknown route is requested. It is very convenient.
Note that this particular component will not be automatically shown in development. A default dev 404 page will be shown instead, but a link to our custom 404 will be shown.

Here is the sketch:

```js
    // src/pages/404.tsx
    import React from "react"

    const NoSuchRoute: React.FC= () => {
        return (
            <h1>Unfortunately, no such route :(</h1>
        )
    }
```

### Navigate across our pages

Go and visit the app again. On the **localhost:8000** you will see the Home Page.
Now try navigating to **localhost:8000/about**, and you will see the About page. Same thing with the **/contact** route. 

Now try typing **localhost:8000/blog**. Development 404 page shows up, telling us there is no such page, and listing all existing pages in our app. 
It also gives us a link to the custom 404 page we made. Click it and see the page.

That is how navigation works. If a component is in the **pages** folder, its filename becomes a route.

But how to navigate to pages from within components? 
Gatsby provides a **Link** component, similar to **React Router**'s **Link** component in React apps.

To use it, we import **Link** from **"gatsby"**, and include it into a our component. 
**Link** has a mandatory **to** attribute to which we assign a route in our app. Under the hood, **Link** returns a regular **anchor** element, but prevents refeshing of the page when we click it. 

Note that **Link** is used only for navigation within the app, and usual **anchor** element is used for any navigation that goes outside of the app. 

Let's import **Link** in our Home and About pages, and then link them to each other:

```js
    // src/pages/index.tsx
    import React from "react"
    import { Link } from "gatsby"

    const HomePage: React.FC= () => {
        return (
            <Link to="/about">To About</Link>
            <h1>Home Page</h1>
        )
    }
```

```js
    // src/pages/about.tsx
    import React from "react"
    import { Link } from "gatsby"

    const About: React.FC= () => {
        return (
            <Link to="/">To Home</Link>
            <h1>About Page</h1>
        )
    }
```

Now, let's visit the app again. On home page, click the **"To About** link, and find yourself on the **About** page. Magic. Now click the **"To Home"** link. Wow! We are home again. We are surfing now :).

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

1. **Create new Gatsby project with TS and create basic pages**
2. Create layout and its elements, and other components
3. Install Styled Components and its Gatsby plugin to style pages
4. Get data with Filesystem plugin and GraphQL
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
