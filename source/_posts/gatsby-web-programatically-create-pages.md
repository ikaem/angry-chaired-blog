---
title: 'Gatsby Web: Programatically Create Pages'
date: 2020-08-17 07:35:15
tags: gatsby
categories: gatsby web
cover: cezar-sampaio-OfIVnZ-0gyA-unsplash.jpg

creditArtist: Cezar Sampaio
creditSource: https://unsplash.com/@cezarsmpio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 6 of 10 in Gatsby Web

As we mentioned in the previous post, this one will be about creating new pages. We will create them programatically, based on Markdown documents that exist in our project.
We will also create a template to hold project information that we get from Markdown documents.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 6. Programatically create pages from Markdown files

Here is the list of what we do:

1. Create a template component to eventually hold our project information
2. Use Gatsby's **onCreateNode** API to create a field on MarkdownRemark nodes to hold their relative path - the slug
3. Use another API of Gatsby's, **createPages**, to create new pages
4. Adjust project template to show project title and frontmatter excerpt, and link **LearnItem** to new pages


### Create a template component to eventually hold our project information

The template component that we are creating will be used as a container for all programatically create pages.
Other than that, there is nothing special about it. It is a regular React component, and because it will be used as a page, it can do page queries. We will do the query part later.

So let's create it.
Create a new folder called **templates** in the **src** folder, and put a file in it called **project.template.tsx**.
Then create a component inside it, with placeholders for **title**, **date**, and **excerpt**.

```js
// src/templates/project.template.tsx

import React from "react";

const ProjectTemplate: React.FC = () => {
  return (
    <Layout>
      <ProjectTemplateStyled className="project-template">
        <section className="project-template__details-section">
          <h1 className="details-section__project-title">Project Title</h1>
          <span className="details-section__publish-date">22/08/2020</span>
          <p className="details-section__project-lead">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
            maiores quidem quod suscipit veniam ullam alias ipsum et minima
            magnam quasi beatae tempora iste laboriosam, nemo, optio eos nobis.
            Voluptatum!
          </p>
        </section>
      </ProjectTemplateStyled>
    </Layout>
  );
};

export default ProjectTemplate;
```

### Use Gatsby's **onCreateNode** API to create a field on MarkdownRemark nodes to hold their relative path - the slug

Now, let's go and create pages.

Creation of pages consists of two parts:

1. We need to define a path to each new page
2. We need to actually create a new page for each MarkdownRemark node, assign a path to it, specify which template it uses, and provide a GraphQL variable to it so it can get its data.

When I saw this approach first time, I was a bit confused. I couldn't understand why are we creating this path, and later, why are we looping over all MarkdownRemark nodes to create pages.
Next.js, and React, have a way to specify a dynamic route which, when called, renders a specific component. Here, however, we are creating a path (the slug thing) that is very concrete, and is set for each page.
Moreover, Next and React approach makes it possible to use a part of the dynamic route to get data into the component. Gatsby, we will see, uses GraphQL, to get data into the template component.

Eventually, however, I realized this is just another approach. We scan Markdown files in the project, set a fixed path based on their names, and loop over them to create a page for each file.
And, it turned out, the GQL query that is used to get data into the template, is also using the page path (the slug) to find its data, similar to the dynamic route part in Next.

Ok, now that we dealt with my issues, let's move on.
This part deals with defining a path for each new page - the slug thing.

When Gatsby builds an app, it creates a node for each file (or at least, this is the way I understand it).
It is possible to tap into this node-creation process, and add our own logic to it.

We want to check when a created node is of **MarkdownRemark** type, assign a new field to any node of this type, and then let it move on.
The field that we want to create on the node is **slug** - just a property that holds a path to this specific node.

We create this slug from the name of the file that created the MarkdownRemark node.
And later, we use this lug to access specific page.

To be honest, from what I have seen so far, I don't think the slug thing is absolutely necessary. I could be wrong, but we could have new pages available by pointing to the node's **id** property which is there by default. Or we could hardcode a path, or a slug key into a Markdown document's frontmatter, and use that as the path to a new page.

However, the slug creation approach seems to be good practice, so let's go with it.

Gatsby provides an API that we can use to tap into the node creation process. It is a function called **onCreateNode**, and we can use it as a Node export in a file called **gatsby-node.js** that we make in the root of our project.

Like **gatsby-config.js**, **gatsby-node.js** needs to have this specific name.
We export the **onCreateNode** from it. The function is automatically passed an object with a **node** property in it, so let's log that **node** property to see how it looks like.

```js
// gatsby-node.js
exports.onCreateNode = ({ node }) => {
  console.log("this is node:", node);
};
```

There is a lot of nodes printed out, but here we show a React component node and a MarkdownRemark node.

React component:

```js
this is node: {
  internalComponentName: 'ComponentIndex',
  path: '/',
  matchPath: undefined,
  component: 'D:/WebDev/Ja/angry-chaired-web/angry-chaired/src/pages/index.tsx',
  componentChunkName: 'component---src-pages-index-tsx',
  isCreatedByStatefulCreatePages: true,
  context: {},
  pluginCreator___NODE: '7c78aecd-c771-5557-a879-7fed842b1ab2',
  pluginCreatorId: '7c78aecd-c771-5557-a879-7fed842b1ab2',
  componentPath: 'D:/WebDev/Ja/angry-chaired-web/angry-chaired/src/pages/index.tsx',
  id: 'SitePage /',
  parent: null,
  children: [],
  internal: {
    type: 'SitePage',
    contentDigest: 'f3d4de75721b4415d567a5d5ea73f193',
    description: '7c78aecd-c771-5557-a879-7fed842b1ab2',
    counter: 98,
    owner: 'internal-data-bridge'
  }
}
```

MarkdownRemark:

```js
this is node: {
  id: '36a198e8-5d00-5114-bedb-452922e75a97',
  children: [],
  parent: '2f473a24-cdd2-50c4-b688-80a43781b47e',
  internal: {
    content: '# This is project heading\r\n' +
      'This is project paragraph\r\n' +
      '\r\n' +
      '## This is project heading 2\r\n' +
      'This is another paragraph\r\n' +
      '\r\n' +
      '[This is a link to Google](https://google.com)\r\n' +
      '\r\n' +
      '### Below is an unordered list:\r\n' +
      '\r\n' +
      '- List item\r\n' +
      '- Another list item\r\n' +
      '\r\n' +
      '#### And below is an ordered list\r\n' +
      '\r\n' +
      '1. List item again\r\n' +
      '2. More, more items...',
    type: 'MarkdownRemark',
    contentDigest: 'b172aacf4b71470216cce8b562a12e4e',
    counter: 88,
    owner: 'gatsby-transformer-remark'
  },
  frontmatter: {
    title: 'Project 2',
    learningPeriod: '30 June 2020 to 5 July 2020',
    date: '2020-08-05',
    frontmatterExcerpt: 'This is the Project 2 content.',
  },
  excerpt: '',
  rawMarkdownBody: '# This is project heading\r\n' +
    'This is project paragraph\r\n' +
    '\r\n' +
    '## This is project heading 2\r\n' +
    'This is another paragraph\r\n' +
    '\r\n' +
    '[This is a link to Google](https://google.com)\r\n' +
    '\r\n' +
    '### Below is an unordered list:\r\n' +
    '\r\n' +
    '- List item\r\n' +
    '- Another list item\r\n' +
    '\r\n' +
    '#### And below is an ordered list\r\n' +
    '\r\n' +
    '1. List item again\r\n' +
    '2. More, more items...',
  fileAbsolutePath: 'D:/WebDev/Ja/angry-chaired-web/angry-chaired/src/pages/projects/project-2/index.md'
}
```

As we are trying to create pages from MarkdownRemark nodes, let's look at the second one.
Few properties are interesting to us:

- parent, holding a string which is an id(I assume) of the Markdown file from which this node was created.
- internal.type, indicating type of the node - MarkdownRemark
- frontmatter object, holdling all keys and values that exist in the MarkdownRemark node

Let' also take a look at the **fileAbsolutePath**, just to illustrate what is our slug going to look like once we make it.
I want the slug to be everything after **".../pages"**, without the final file extension. That means that, for this particulal node, the slug would be **"/projects/project-2/index"**.

How do we do that?
First, we do this whole process only if the type of a node is **MarkdownRemark**.
Then, we get another property from that arguments object automatically passed to **onCreateNode**. This one is a function called **GetNode**, and we can use it to get access to the node's parent, which is the Markdown file itself.

```js
// gatsby-node.js

exports.onCreateNode = ({ node, getNode }) => {
  if (node.internal.type === "MarkdownRemark") {

    const nodeParent = getNode(node.parent);
    console.log("this is parent of the node:", nodeParent);
}
```

I cut the log a bit, but kept what we are interested in:

```js
this is parent of the node: {
  id: 'c07dfab0-94ae-5cff-afc8-a6ab46107cf2',
  children: [ 'cea3be53-d913-5c3f-99f8-b57e4850097f' ],
  parent: null,
  internal: {
    contentDigest: 'c583e570cf478a07d1375275829ac972',
    type: 'File',
    mediaType: 'text/markdown',
    description: 'File "src\\pages\\projects\\project-4\\index.md"',
    counter: 79,
    owner: 'gatsby-source-filesystem',
    content: '---\r\n' +
      'title: Project 4\r\n' +
      'learningPeriod: 30 June 2020 to 5 July 2020\r\n' +
      'date: "2020-08-04"\r\n' +
      'frontmatterExcerpt: This is the Project 4 content.\r\n' +
      'featuredImage: ./image.jpg\r\n' +
      '---\r\n' +
      '# This is project heading\r\n' +
      'This is project paragraph\r\n' +
      '\r\n' +
      '## This is project heading 2\r\n' +
      'This is another paragraph\r\n' +
      '\r\n' +
      '[This is a link to Google](https://google.com)\r\n' +
      '\r\n' +
      '### Below is an unordered list:\r\n' +
      '\r\n' +
      '- List item\r\n' +
      '- Another list item\r\n' +
      '\r\n' +
      '#### And below is an ordered list\r\n' +
      '\r\n' +
      '1. List item again\r\n' +
      '2. More, more items...'
  },
  sourceInstanceName: 'src',
  absolutePath: 'D:/WebDev/Ja/angry-chaired-web/angry-chaired/src/pages/projects/project-4/index.md',
  relativePath: 'pages/projects/project-4/index.md',
  extension: 'md',
  // rest is cut...
}
```

We see that the parent is actually an .md file. We can also see the that it has **sourceInstanceName** of **"src"**, which is what we defined as a name for data set when we configured the **gatsby-source-filesystem** plugin.
We also see that this file has a **relativePath** property. Since we want our slug to be **"/projects/project-4/index"**, we could just slice that **pages** substring, as well as the **.md** one, and the slug is there.

Or we could use the **createFilePath** function provided by the **gatsby-source-filesystem** plugin, and skip all of this parent stuff, letting the function create the slug.
The function, imported from **"gatsby-source-filesystem"**, returns finished slug, and accepts an argument object with three properties:

- node object
- getNode function
- basePath, which is a string representing part of the relative path we want removed. We want the **"pages"** part removed.

```js
// gatsby-node.js
const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateNode = ({ node, getNode }) => {
  if (node.internal.type === "MarkdownRemark") {

    const slug = createFilePath({ node, getNode, basePath: "pages" })
    console.log("this is slug:", slug);
}
```

Here is what we get:

```
this is slug: /projects/project-1/
this is slug: /projects/project-2/
this is slug: /projects/project-3/
this is slug: /projects/project-4/
```

You might be wondering where is the **"index"** part? Well, we dont need it. If there is no file specified in the URL, index.html file will be rendered, and this is what will be built by Gatsby. So we are good.

So we have the slug. Now what?
Well, we should create a new field on the MarkdownRemark node, name it **"slug"** and give it the value of our slug.

We do it with a function that we get from yet another property on the argument object passed to the **onCreateNode** function.
The property name is **actions**, and the function inside it that we need is called **createNodeField**

We call **createNodeField** and pass it an arguments object with three properties:

- node
- name of the field - **"slug"** in this case
- value - **slug**

```js
// gatsby-node.js
const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === "MarkdownRemark") {
    const { createNodeField } = actions;
    const slug = createFilePath({ node, getNode, basePath: "pages" })
    createNodeField({
        node,
        name: "slug",
        value: slug
    })

    console.log("this is slugged node:", node);
}
```

If we log the node again, after we added the **slug** field to it, we will see that the new field is there:

```js
  ...
  rawMarkdownBody: '# This is project heading\r\n' +
    'This is project paragraph\r\n' +
    '\r\n' +
    '## This is project heading 2\r\n' +
    'This is another paragraph\r\n' +
    '\r\n' +
    '[This is a link to Google](https://google.com)\r\n' +
    '\r\n' +
    '### Below is an unordered list:\r\n' +
    '\r\n' +
    '- List item\r\n' +
    '- Another list item\r\n' +
    '\r\n' +
    '#### And below is an ordered list\r\n' +
    '\r\n' +
    '1. List item again\r\n' +
    '2. More, more items...',
  fileAbsolutePath: 'D:/WebDev/Ja/angry-chaired-web/angry-chaired/src/pages/projects/project-4/index.md',
  fields: { slug: '/projects/project-4/' }
}
```

Uf, that was lot of logging.

### Use another API of Gatsby's, **createPages**, to create new pages

Now we move to the part where we actually create pages.
We will use another API given to us by Gatsby. It is a function again, **createPages**, that is again exported from the **gatsby-node.js** file.

In short, here we will query MarkdownRemark nodes, and then use another function to create a page for every node we have.
We will define a path to the page, set the template to be used for the page, and also set a context for each new page. This context will make a GraphQL variable avialble in each new page, which will come in handy when we get to populating the template with data.

Alright. As we said, we export **createPages** from **gatsby-node.js**. This function is passed an argument object holding 2 properties:

- graphql
- actions

The **graphql** property is a function that returns a promise in this case, so we will make entire **createPages** an async function.
Inside, we destructure **createPage** function from **actions**, and then query **allMarkdownRemark** to get a slug of each MarkdownRemark node.

```js
// gatsby-node.js

exports.onCreateNode = ({ node, getNode, actions }) => {//...

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
```

The result variable that we have is an object that holds a **data** property, which in turn contains **allMarkdownRemark** property.
Here is the log of **result**:

```js
{
  "data": {
    "allMarkdownRemark": {
      "edges": [
        {
          "node": {
            "fields": {
              "slug": "/projects/project-2/"
            }
          }
        },
        {
          "node": {
            "fields": {
              "slug": "/projects/project-1/"
            }
          }
        },
        {
          "node": {
            "fields": {
              "slug": "/projects/project-3/"
            }
          }
        },
        {
          "node": {
            "fields": {
              "slug": "/projects/project-4/"
            }
          }
        }
      ]
    }
  }
}
```

Seeing that **edges** is an array of **edge** objects containing **node** objects, we can now loop over **edges**, and create a page for each **edge**.
The **createPage** method that we use to create a page takes an argment object, with three properties:

- path, which defines a relative path to new pages from the **/pages** path
- component, which defines an absolute path to a template component that renders when we hit the path
- context, which defines a variables that pages will be able to access in their page queries. In this case we will use the **slug** as a variable, as we can use it to get particular MarkdownRemark nodes from the filesystem.

```js
// gatsby-node.js

exports.onCreateNode = ({ node, getNode, actions }) => {//...

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
}

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve("./src/templates/project.template.tsx"),
      context: {
        slug: node.fields.slug,
      },
    })
  })
```

And that's it. We have now programmatically created new pages. 
Each new page is accessible via **"projects/NAME_OF_THEIR_MARKDOWN_NODE_FOLDER"**.

Since we haven't linked Home page list items to new pages, let's try to access a URL that doesn't , like **"http://localhost:8000/oo"**. The development 404 page will list all existing routes, and we can find URLs to new pages there.

### Adjust project template to show project title and frontmatter excerpt, and link **LearnItem** to new pages

When we see the project, it looks a bit dry, and it would be good to fill it with some data. 
Since the template is being used as a page, we can do a page query inside it.
Also, we have access to that context variable that we provided to each new page. This variable is called **slug**, and we can access it as **$slug**

Let's assemble the query in GraphiQL, and then we can just copy it to the template.

We want to access a specific MarkdownRemark node, so we choose the **markdownRemark** option. 
We want to filter it by **fields**, and then **slug**. Check the **eq** option, and hover above it to show a small **$** icon. Click on it, and the query will automatically insert **$eq** variable in the query and define it as an empty string. 
Since our variable is actually called **$slug**, and we don't want to define it in the query, manually correct the query to following:

```
query MyQuery($slug: String!) {
  markdownRemark(fields: {slug: {eq: $slug}})
}
```

Then, add frontmatter **title**, **frontmatterExcerpt** and **data** fields to the query, and specify date format if you wish.

```
query MyQuery($slug: String!) {
  markdownRemark(fields: {slug: {eq: $slug}}) {
    frontmatter {
      date(formatString: "DD/MM/YYYY")
      title
      frontmatterExcerpt
    }
  }
}

```

Finally, we define the **$slug** variable in GraphiQL itself. There is a **QUERY VARIABLES** bar at the bottom of the screen. 
Open it and add following JSON data to it:

```json
{
    "slug": "/projects/project-1/"
}
```

Hit play now. 
We get data for the first project.

```json
{
  "data": {
    "markdownRemark": {
      "frontmatter": {
        "date": "11/08/2020",
        "title": "Project 1",
        "frontmatterExcerpt": "This is the Project 1 content."
      }
    }
  }
}
```

Now we can just copy this data into a page query in the project template. We don't need to include the slug variable, however, as each programmatically created page already has this variable included in its context.

Then we can accept the **data** prop passed to the template by the page query, and include the data into HTML.

```js
// src/templates/project.template.tsx
// ...
interface ProjectTemplateProps {
  data: {
    markdownRemark: {
      frontmatter: {
        title: string;
        date: string
        frontmatterExcerpt: string;
      }
    }
  }
}

const ProjectTemplate: React.FC<ProjectTemplateProps> = ({ data }) => {

  const { title, date, frontmatterExcerpt } = data.markdownRemark.frontmatter;

  return (
    <Layout>
      <ProjectTemplateStyled className="project-template">
        <section className="project-template__details-section">
          <h1 className="details-section__project-title">{ title }</h1>
          <span className="details-section__publish-date">{ date }</span>
          <p className="details-section__project-lead">
            { frontmatterExcerpt }
          </p>
        </section>
      </ProjectTemplateStyled>
    </Layout>
  )
}

export default ProjectTemplate

export const query = graphql`
  query MyQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        date
        title
        frontmatterExcerpt
      }
    }
  }
`
```

Cool. Now we have somewhat decent-looing project pages.

Last thing to do is to link **LearnItem** component to each new page. 
To do this, we can include query for the slug field in the **Home** page component, together with all other fields needed for project list. The slug us then passed to the **ILearnMapper** as a part of each **node** in the **edges** list.

```js
// src/pages/index.tsx
// ...

const HomePage: React.FC<HomePageProps> = ({...
    return (
        ...
          <ILearnMapper projects={data.allMarkdownRemark.edges} />
        ...
    )
}
export default HomePage

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD/MM/YYYY")
            frontmatterExcerpt
          }
          fields {
            slug
          }
        }
      }
    }
  }
```

Then, we pass the **slug** from the mapper to the **LearnItem** component:

```js
// src/containers/i-learn-mapper.tsx
...
interface ILearnMapperProps {
  projects: Array<{
    node: {
      frontmatter: {
        title: string
        date: string
        frontmatterExcerpt: string
      }
      id: string
      fields: {
        slug: string
      }
    }
  }>
}

const ILearnMapper: React.FC<ILearnMapperProps> = ({ projects }) => {

  return (
    <ILearnMapperStyled className="i-learn-mapper">
      {projects.map(({ node: { id, frontmatter, fields } }) => (
        <LearnItem key={id} frontmatter={frontmatter} slug={fields.slug}/>
      ))}
    </ILearnMapperStyled>
  )
}
...
```

Finally, we use the slug in the **LearnItem** component to link to project pages:

```js
// src/components/learn-item.component.tsx
// ...
interface LearnItemProps {
  frontmatter: {
    title: string
    date: string
    frontmatterExcerpt: string
  }
  slug: string
}

const LearnItem: React.FC<LearnItemProps> = ({
  frontmatter: {
    title,
    date,
    frontmatterExcerpt: excerpt,
  },
  slug
}) => {

  return (
    <LearnItemStyled className="learn-item">
      <div className="learn-item__learn-points">
        <Link to={slug}>
          <h3 className="learn-points__title">{title}</h3>
        </Link>
        <span className="learn-points__date">{date}</span>
        <p className="learn-points__other">{excerpt}</p>
      </div>
    </LearnItemStyled>
  )
}

export default LearnItem

// ...
```

Alright. Go to the Home page and try to click on a project title. It should take you to its project page. 

That's all folks, as far as this part is concerned. We created pages from our Markdown documents. 
First we create a template to hold data for our new pages. We also created slugs that we use as paths to access newly created pages. Then we added those slugs to nodes created from Markdown documents. 
With slugs ready, we were able to create pages for each Markdown document. We specified how to access them, which template they use, and what context they have available. 
We did well, I think.

In the next one we will see how we can insert Markdown body into our components. Out of all things, this is the one that annoyed me the most. It was because I was not able to style inserted data in the way I imagined the page to look. Because of this I tried several ways to deal with it.
We will see what those ways are.

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
6. **Programatically create pages from Markdown files**
7. Insert Markdown files into pages with the **transformer-remark** plugin
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

