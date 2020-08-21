---
title: 'Gatsby Web: Manipulate Markdown with Transformer Remark Plugin'
date: 2020-08-16 22:37:15
tags: 
- gatsby plugins
- markdown
categories: gatsby web
cover: lucas-messere-OYCsjGZHzAg-unsplash.jpg

creditArtist: Lucas Messere
creditSource: https://unsplash.com/@lucasmessere?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 5 of 10 in Gatsby Web

The idea of this project was to create a portfolio of learning projects I worked on. To do that, I need a way to store project information, and this would ideally be in form of a file. 
Of course, I could have had a database, and store this information there. We are working with Gatsby, however, and Gatsby can use Markdown, so we use Markdown.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 5. Write projects content in Markdown, transform and query them with the transformer-remark plugin

Markdown is a way to style and organize text. This is how I see it. Before I started working on this project, I imagined Markdown to be something where I could select pieces of text, and then place them around an HTML template that I prepared.
It is not like that (well, it could be, but it is a pain). It is meant to style text, and then we can use that styled text and insert it into our website. This turned out to be a problem for me, but we will get there.

Anyhow, we will still use Markdown.

Here is what we will do in this part:

1. Create Markdown files that hold project information
2. Install **gatsby-transformer-remark** plugin to be able to transform our Markdown files
3. Query Markdown documents on the Home page and map over it to render a list of projects

## Create Markdown files that hold project information

Let's make few Markdown files that will hold information about our projects.
Create a folder **projects** inside the **pages** folder, and then create four more folders inside. Name them **project-1**, **project-2**, **project-3**, and **project-4**, and place an **index.md** inside each one of them.

Now, lets put some data inside these files. For now, let's make all **index.md** files same, except for the project title and number of the project in the **frontmatterExcerpt**

```
// src/pages/projects/project-1.md -> do not include in the file
---
title: Project 1
learningPeriod: 30 June 2020 to 5 July 2020
date: "2020-08-05"
frontmatterExcerpt: This is the Project 1 content.
---
# This is project heading 1
This is project paragraph

## This is project heading 2
This is another paragraph

[This is a link to Google](https://google.com)

### Below is an unordered list:

- List item
- Another list item

#### And below is an ordered list

1. List item again
2. More, more items...
```

So what do we have here? 
The area between the triple dashes is known as **frontmatter**. It consists of key-value pairs that are used to describe a Markdown document. 
We can put whatever we want in there, as long as the value is of string type.
Once we start querying this data, GQL will have frontmatter keys available as fields, and we will be able to retrieve their values individualy.

The area below is the body of the Markdown document. 
Text that starts with # is a heading equivalent to **h1** in HTML. The one that has two pound signs is equivalent to **h2**, and so on.
Text with no signs in front is a regular paragraph, **p** in HTML
Text with the \[square bracketed](syntax) turns to an **a** element in HTML
And any unordered and ordered list turns into an **ul** and **ol** list in HTML
Body of the Markdown document is usually retrieved all together as a single string value holding HTML representation of the body. 

Great. We have Markdown files with project information. What do we do with it now?
We should find a way to transform Markdown syntaxt into something we can work with.

## Install **gatsby-transformer-remark** plugin to be able to transform our Markdown files

To query and transform Markdown syntax into HTML, we will use **gatsby-transformer-remark** plugin. 

Transformer plugins are those that transform content into something that Gatsby can actualy make use of. In this case, we will use the **gatsby-transformer-remark** plugin to transform raw Markdown files made available by the **gatsby-source-filesystem**. 
Source plugins get raw content, transfomer ones make them usable. 

Ok, to install the plugin:

```bash
npm i gatsby-transfomer-remark
```

And then add it to the plugins array in **gatsby-config.js**.
We will add it to the array as a simple string, but we could also include it as a configuration object in case we needed to adjust its options. 

```js
// gatsby-config.js

module.exports = {
  /* Your site config here */
  // ...
  plugins: [
    // ...
    "gatsby-transformer-remark",
```

Good. Restart the development server and head over to GraphiQL and refresh it in case you had it open.
Once refreshed, GraphiQL should show two new options in the left area: **allMarkdownRemark** and **markdownRemark**.
Let's select the first one, to query all of our trasnformed Markdown files. The other option allows us to query a specific one.

**allMarkdownRemark** offers similar options as the **allFile** query. Select **edges**, **node**, and then open the **frontmatter** field. 
Inside, we get all keys we created in the frontmatter section of our Markdown documents.
Select **title** and **frontmatterExercpt**, and also select **html** field outside of the **frontmatter**.

```
query MyQuery {
  allMarkdownRemark {
    edges {
      node {
        frontmatter {
          title
          frontmatterExcerpt
        }
        html
      }
    }
  }
}
```

Run the query and see what we get. 
The result shows four nodes, which corresponds to four Markdown documents that we have. 
We see that we got values for **title** and **frontmatterExcerpt** from **frontmatter**, as well as the value of **html** field. It is a string that contains HTML representation of our Markdow docuemnts' bodies. The **transformer-remark** plugin has successfully transformed markdown to HTML.

```js
{
  "data": {
    "allMarkdownRemark": {
      "edges": [
        {
          "node": {
            "frontmatter": {
              "title": "Project 4",
              "frontmatterExcerpt": "This is the Project 4 content."
            },
            "html": "<h1>This is project heading</h1>\n<p>This is project paragraph</p>\n<h2>This is project heading 2</h2>\n<p>This is another paragraph</p>\n<p><a href=\"https://google.com\">This is a link to Google</a></p>\n<h3>Below is an unordered list:</h3>\n<ul>\n<li>List item</li>\n<li>Another list item</li>\n</ul>\n<h4>And below is an ordered list</h4>\n<ol>\n<li>List item again</li>\n<li>More, more items...</li>\n</ol>"
          }
        },
        // Projects 3 and 2 cut
        {
          "node": {
            "frontmatter": {
              "title": "Project 1",
              "frontmatterExcerpt": "This is the Project 1 content."
            },
            "html": "<h1>This is project heading</h1>\n<p>This is project paragraph</p>\n<h2>This is project heading 2</h2>\n<p>This is another paragraph</p>\n<p><a href=\"https://google.com\">This is a link to Google</a></p>\n<h3>Below is an unordered list:</h3>\n<ul>\n<li>List item</li>\n<li>Another list item</li>\n</ul>\n<h4>And below is an ordered list</h4>\n<ol>\n<li>List item again</li>\n<li>More, more items...</li>\n</ol>"
          }
        }
      ]
    }
  }
}
```

Note that **node** has a field called excerpt. This is a default field available on the node which, if selected, returns first 140 characters of the document's body. This can be increased or decreased. 
I have chosen to ignore this default excerpt option and instead define my own in frontmatter, to be able to fully control what excerpt shows.

## Query Markdown documents on the Home page and map over it to render a list of projects

Now that we know how to query and transform Markdown documents, why not list all of our projects on the Home page?

We can run a page query to get a list of MarkdownRemark data, and pass it from the HomePage to the **ILearnMapper** component. The mapper will go over the list, rendering an **LearnItem** component for each item in the list.
Let's do it. 

First, let's make that page query in the **Home** component. The query will return data and pass it as a prop to the component. 

We need to query allMarkdownRemark for:

1. id - it is a field that exists on every node. We need as a key for each list item 
2. frontmatter title
3. frontmatterExcerpt
4. frontmatter date - note how we can define a returned format on the date from the frontmatter. I have defined date in the frontmatter in format "YYYY-MM-DD", and requested the query to return "DD/MM/YYYY". I have also changed frontmatter dates in all Markdown documents, so they are all different. 

Here is the page query in the **Home** page, together with passing the query results to the **ILearnMapper** component:

```js
// src/pages/index.tsx
// ...
const HomePage: React.FC<HomePageProps> = ({
  location,
  data,
}) => {

  // ...
  return (
    // ...
        <section className="home-page__i-learn">
          {/*...*/}
          <ILearnMapper projects={data.allMarkdownRemark.edges} />
        </section>
    // ...
  )
}

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
        }
      }
    }
  }
`
```

Notice that we are sorting the queried results by the **frontmatter___date** field, in the **DESC** order.

```
allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {...
```

We could have also sorted it in ascending order, or chose any other frontmatter field for sorting. 
I used GraphiQL to set this up.


Next up, we are mapping over the MarkdownRemark results in the **ILeanMapper** component, and render a **LearnItem** component for every item in the results lists.

```js
// src/containers/i-learn-mapper.container.tsx
const ILearnMapper: React.FC<ILearnMapperProps> = ({ projects }) => {

  return (
    <ILearnMapperStyled className="i-learn-mapper">
      {projects.map(({ node: { id, frontmatter } }) => (
        <LearnItem key={id} frontmatter={frontmatter}/>
      ))}
    </ILearnMapperStyled>
  )
}
```

And finally, let's accept and render all those props in the **LearnItem** component:

```js
// src/components/learn-item.component

// ...

interface LearnItemProps {
    frontmatter: {
      title: string
      date: string
      frontmatterExcerpt: string
    }
  }
  
  const LearnItem: React.FC<LearnItemProps> = ({
    frontmatter: {
      title,
      date,
      frontmatterExcerpt: excerpt
    }
  }) => {
  
    return (
      <LearnItemStyled className="learn-item">
        <div className="learn-item__learn-points">
            <h3 className="learn-points__title">{title}</h3>
            <span className="learn-points__date">{date}</span>
            <p className="learn-points__other">{excerpt}</p>
        </div>
      </LearnItemStyled>
    )
  }
  
  export default LearnItem
```

Nice. Let's visit the Home page now. We should have a list of four projects there, sorted by date. We have successfully used the **transformer-remark** plugin together with the **source-filesystem** plugin to list all of our projects. Progress.

Alright. We now know how to transform Markdown to HTML, and how to extract data from such documents.
In the next post we will use Markdown files to create project pages. We will create a component which will be used as a template for project pages. We will define a path for each project page, and we will create as many pages as we have Markdown files.
We will also return to the **LearnItem** component, and link its title to a project page which corresponds to its title.
Then, in the following post, we will attempt to insert body content from Markdown documents into newly created pages, and see what options does Gatsby offer to do that.

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
5. **Write projects content in Markdown, transform and query them with the transformer-remark plugin**
6. Programatically create pages from Markdown files
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
