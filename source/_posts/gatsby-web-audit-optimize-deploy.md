---
title: 'Gatsby Web: Audit, Optimize & Deploy'
date: 2020-08-17 08:06:39
tags:
- gatsby
- deploy
- surge
categories: gatsby web
cover: roko-labrovic-k_2yK3NCLx0-unsplash.jpg

creditArtist: Roko Labrovic
creditSource: https://unsplash.com/@rlabrovi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 10 of 10 in Gatsby Web

After making our components, programmatically creating pages, inserting images and implementing messaging funcitonality, last thing to do is to actually put our website online. 

Before we do that, however, let's tweak it a bit more.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 10. Audit, optimize and deploy the website

Here is what we will do:

1. Audit the website to see what we need to tweak
2. Do the tweaking: make the website a progressive web app, implement offline support, and optimize for SEO
3. Deploy the website

### Audit the website to see what we need to tweak

To see how we can improve our website, let's build it:

```bash
gatsby build
```

And then let's serve it

```bash
gatsby serve
```

Then, let's open **localhost:9000** in Chrome's private window, to prevent any extensions from interfering with the audit.
Open the Chrome Developer Tools with CTRL + SHIFT + I, and go to the **Lighthouse** tab. There, click on the **Generate Report** button and wait until the audit is complete.

The results will show that our website is not a Progressive Web App, and that it has low accessibility and SEO scores.

So let's fix that.

### Do the tweaking: make the website a progressive web app, implement offline support, and optimize for SEO

Progressive Web App, or PWA, are websites that behave similar to regular applications on desktop or smartphones. They have offline functionality, can access hardware, and generally make web experience better. 

To consider a website a PWA, it has to satisfy several criteria. 
One of them is to have a manifest.

#### Manifest

Manifest is a simple JSON file that tells browser how a website should behave on phones or desktop.
Of course, Gatsby has a plugin to create a manifest, and when installed it will create it on every site build. 

Let's install the plugin:

```bash
npm i gatsby-plugin-manifest
```

Manifest requires a favicon, an icon associated with a website. You can create a simple one at [X-Icon Editor](http://www.xiconeditor.com/). Once you are done, click export and save it to your project, in **src/data/images** as **favicon.icon**.

Then, we need to add the **gatsby-plugin-manifest** to the **plugins** array in **gatsby-config.js**. The manifest plugin needs to be added to the array as a configuration object, with its **options** object containing several properties. 


```js
// gatsby-config.js
// ...
{
  resolve: "gatsby-plugin-manifest",
  options: {
    name: "Angry Chaired",
    short_name: "AngryCh",
    start_url: "/",
    background_color: "#FBFCFF",
    theme_color: "#FF715B",
    display: "minimal-ui",
    icon: "./src/data/images/favicon.ico"
  }
}
```

- **start_url** is used to point to the starting point of the website
- **background_color** defines color of the splash screen when the app is first launched on mobile
- **theme_color** is UI color on mobile
- **display** defines how the website should be displayed on mobile. For PWA purposes, display should be **"standalone"**, **"minimal-ui"** or **"fullscreen"**
- **icon** defines path to our favicon, relative to the root of the project


More info can be found [here](https://developers.google.com/web/fundamentals/web-app-manifest/#display).

#### Offline support

Another PWA requirement is that the site can be used offline.
We can accomplish that with another plugin, **gatsby-plugin-offline**.

The plugin is a script that decides whether the app should use network or cached data, and it does it based on network connectivity

The setup is very simple. We just need to install the plugin and add it to the **plugins** array in **gatsby-config.js**

```bash
npm install gatsby-plugin-offline
```

```js
// gatsby-config.js
{
  resolve: "gatsby-plugin-manifest",
  options: {
    name: "Angry Chaired",
    short_name: "AngryCh",
    start_url: "/",
    background_color: "#FBFCFF",
    theme_color: "#FF715B",
    display: "standalone",
    icon: "src/data/images/favicon.ico"
  }
},
"gatsby-plugin-offline",
// ...
```

#### SEO optimization

SEO is not connected to PWA, but is important in its own right. Good SEO will make a website rank better with search engines and increase organic popularity with users.

To optimize SEO, we will use **React Helmet**, a popular component that manages document head in React components. 
Gatsby also requires its own React Helmet plugin, so we will install both and add the Gatsby plugin to the **plugins** array.

```bash
npm i react-helmet gatsby-plugin-react-helmet
```

```js
// gatsby-config.js
"gatsby-transformer-sharp",
"gatsby-plugin-sharp",
"gatsby-plugin-react-helmet",
{
  resolve: "gatsby-plugin-manifest",
  options: {
    name: "Angry Chaired",
    short_name: "AngryCh",
    start_url: "/",
    background_color: "#FBFCFF",
    theme_color: "#FF715B",
    display: "standalone",
    icon: "src/data/images/favicon.ico"
  }
},
// ...
```

React Helmet requires TS types to be installed as well, so let's do that:

```bash
npm i -D @types/react-helmet
```

Let's create an **SEO** component that will incorporate **React Helmet**. 
This component will fetch our site's metadata in **gatsby-cofig**, and it will accept props. It will then assign the received queried and props data to the **React Helmet**'s props. **React Helmet** will then do its magic to set metadata of every page that uses the **SEO** component.

First, the component. We import **Helmet** from **"react-helmet"**

```js
// src/components/seo.component.tsx
import React from "react"
import { Helmet } from "react-helmet"

const SEO: React.FC = () => {

  return (
    <Helmet />
  )
}

export default SEO
```

Then, we assign some default props that come into our component. 
We want to have **lang**, **meta** and **description** props no matter what. 
Notice that the **lang** prop is set to **"en"** by default, and that the **meta** prop is an empty array.

We also create an interface for the same props possiblly coming from a parent component, in which case they will overwrite the default ones. 
We are making the passed props optional (except the **title** prop) to ensure that they don't have to be passed in since we have the default ones. 

```js
// src/components/seo.component.tsx
import React from "react"
import { Helmet } from "react-helmet"

interface SEOProps {
  lang?: string
  meta?: { name?: string; content?: string }[]
  description?: string
  title: string
}

const SEO: React.FC<SEOProps> = ({ lang, meta, description, title }) => {

  return (
    <Helmet />
  )
}

export default SEO

SEO.defaultProps = {
  lang: "en",
  meta: [],
  description: "",
}

```

Next, we will use the **useStaticQuery** hook to fetch site metadata from **gatsby-config.js**. 
We will then assign that data to props of the **Helmet** component

```js
// src/components/seo.component.tsx
import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

interface MetadataQueryInterface {
  site: {
    siteMetadata: {
      title: string
      description: string
      author: string
    }
  }
}

interface SEOProps {
  lang?: string
  meta?: { name?: string; content?: string }[]
  description?: string
  title: string
}

const SEO: React.FC<SEOProps> = ({ lang, meta, description, title }) => {
  const { site } = useStaticQuery<MetadataQueryInterface>(graphql`
    query {
      site {
        siteMetadata {
          author
          description
          title
        }
      }
    }
  `)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`${site.siteMetadata.title} | %s `}
      meta={([
        {
          name: "description",
          content: description || site.siteMetadata.description,
        },
      ] as {}[]).concat(meta)}
    />
  )
}

export default SEO

SEO.defaultProps = {
  lang: "en",
  meta: [],
  description: "",
}

```

Few things might need explanation:

- **htmlAttributes** is used here to define the language of the HTML body
- **title** will define title of the page
- **titleTemplate** defines the shape of the title on the browser tab. In this case, we specify that the title from the queried site metadata is shown first, then a verical bar ("|") is shown, and then the value of the **title** prop on the **Helmet** component is shown. Note how **"%s"** stands for the **title** prop. The whole affair makes the browser tab show **"Angry Chaired | Home Page"**.
- **meta** prop holds an array of meta entries. It can contain numerous entries, and here we only specify one, and concatanate the array with whatever might be passed to the SEO component as a **meta** prop. In this case, the meta tag that will be added holds description of our website, which can either passed to the component as a valid prop, or a description from the site metadata.

Now, we just have to include the **SEO** component in one of our pages. Let's do it in the **Home** page. 
We will pass the **title** prop to it, as it is mandatory.

```js
// src/pages/index.tsx
// ...
return (
  <Layout path={pathname}>
    <SEO title="Home page"/>

```

This should do it. If we want, we can add more meta entries in our SEO, but this should do it for now.

### Deploy the website

Finally, we deploy the website.

We do the basic one, as explained in [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-one/).

We use Surge, a static site host, that makes this whole thing super easy.

First, we need to install Surge on our system. We install it globally with:

```bash
npm install --global surge
```

Then, we need to build our site, which we already know how to do

Next, we login and create an account with Surge:

```bash
surge login
```

The command will take us through short registration process

Finally, we deploy the site:

```bash
gatsby public
```

Once the deployment starts, we can define the domain, or we can let surge generate a random one. 

That's it. After the deployment is finished, visit the website and that is it.

Indeed, that is it. It has been fun doing this. I learned a lot making the website, and then I learned tons more just writing about it. 
I can't say I am happy how the website turned out, though. Writing about it made me see tons of silly mistakes I made, as well as areas for improvement. I am already planning to return to it. I am particularly interested in MDX, a Markdown extension that allows for use of React components withing Markdown documents. 
See you then
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
4. Get data with Filesystem plugin and GraphQL
5. Write projects content in Markdown, transform and query them with the transformer-remark plugin
6. Programatically create pages from Markdown files
7. Insert Markdown files into pages with the transformer-remark plugin
8. Use Gatsby Image to work with images
9. Create send message feature on the contact page
10. **Audit, optimize and deploy the website**

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

---
