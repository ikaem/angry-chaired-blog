---
title: 'Gatsby Web: Insert Markdown in Gatsby Pages'
date: 2020-08-17 07:43:48
tags: 
- gatsby plugins
- markdowns
categories: gatsby web
cover: vasyl-s-ODJ2f2JPY_0-unsplash.jpg

creditArtist: Vasyl S
creditSource: https://unsplash.com/@vasslobodian?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 7 of 10 in Gatsby Web

Before we even start, I need to say that Markdown is meant to style text, and not websites. Unfortunately, I went into this expecting to style a page in a certain way, and then just insert pieces of Markdown body into their places, or to style elements in the Markdown document directly. 
While this is possible, it is a bit of a pain, and more importantly, it goes against the point of Markdown. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 7. Insert Markdown body content into pages with the transformer-remark plugin

From what I have seen so far, inserting Markdown content in pages could be done in 2 ways:

1. By writing regular HTML inside Markdown document body, and assigning ids to each element. Then, we would query **htmlAst** field from MarkdownRemark node, which would return an object holding entire HTML representation of the document in the form of array of objects. These object hold information about each element that exist in the document. We would then go over the array, search elements by their ids to store each element into their own variable. It is an interesting approach, but it involves a lot of code.
2. By writing HTML inside Markdown doucuments, complete with all classes and ids for which styling is already defined in our app. I tried using this approach, but a Markdown document filled with HTML ruins its purpose. 

The most common approch is just to write pure Markdown, aided by HTML where Markdown syntax is not enough, and then just dump everything into a React component. 
Specific data that we might need to place in exact places on the page can be stored in the frontmatter section. 

Before I said that frontmatter values can be only strings. This is not true. I just learned they can be arrays too:

```
---
title: Project 1
learningPeriod: 30 June 2020 to 5 July 2020
date: "2020-08-11"
frontmatterExcerpt: This is the Project 1 content.
featuredImage: ./image.jpg
tech: ["react", "grapqhl"]
---
```

Let's insert some more content into our Markdown documents. We will make them all have same content in the body.

```yaml
<!-- src/pages/projects/project-4/index.md -->

---
title: Project 4
learningPeriod: 30 June 2020 to 5 July 2020
date: "2020-08-11"
frontmatterExcerpt: This is the Project 4 content.
featuredImage: ./featuredimage.jpg
tech: ["react", "grapqhl"]
---
## Lorem Ipsum bacon
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium optio at adipisci facilis delectus tempore, aut error tempora assumenda perspiciatis impedit dicta, eveniet quis expedita, commodi molestiae atque voluptatem voluptates?

## Lorem Ipsum bacon more bacon
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium optio at adipisci facilis delectus tempore, aut error tempora assumenda perspiciatis impedit dicta, eveniet quis expedita, commodi molestiae atque voluptatem voluptates? [This is a link to Google](https://google.com) delectus tempore, aut error tempora assumenda. **Delectus** tempore, aut error tempora *assumenda*.

## Lorem List Dolorem

- Lorem Lorem React something
- Think again

## No Tired of Lorem Lists

- Lorem Lorem React something
- Think again

## Screenshost Lorem

1. ![Screenshot 1](./screen1.jpg)
1. ![Screenshot 2](./screen2.jpg)
1. ![Screenshot 3](./screen3.jpg)
2. ![Screenshot 4](./screen4.jpg)

<h3>An example HTML element</h3>
```

Now, back in our **ProjectTemplate** component, we will add an additional field in our query: **html**

```js
export const query = graphql`
  query MyQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        date
        title
        frontmatterExcerpt
      }
      html
    }
  }
`
```

Let's log it to see what we get:

```
querying html field: 
    <h2>Lorem Ipsum bacon</h2>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium optio at adipisci facilis delectus tempore, aut error tempora assumenda perspiciatis impedit dicta, eveniet quis expedita, commodi molestiae atque voluptatem voluptates?</p>
    <h2>Lorem Ipsum bacon more bacon</h2>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium optio at adipisci facilis delectus tempore, aut error tempora assumenda perspiciatis impedit dicta, eveniet quis expedita, commodi molestiae atque voluptatem voluptates? <a href="https://google.com">This is a link to Google</a> delectus tempore, aut error tempora assumenda. <strong>Delectus</strong> tempore, aut error tempora <em>assumenda</em>.</p>
    <h2>Lorem List Dolorem</h2>
    <ul>
        <li>Lorem Lorem React something</li>
        <li>Think again</li>
    </ul>
    <h2>No Tired of Lorem Lists</h2>
    <ul>
        <li>Lorem Lorem React something</li>
        <li>Think again</li>
    </ul>
    <h2>Screenshost Lorem</h2>
    <ol>
        <li><img src="./screen1.jpg" alt="Screenshot 1"></li>
        <li><img src="./screen2.jpg" alt="Screenshot 2"></li>
        <li><img src="./screen3.jpg" alt="Screenshot 3"></li>
        <li><img src="./screen4.jpg" alt="Screenshot 4"></li>
    </ol>
    <h3>An example HTML element</h3>
```

We go pure html here.

Now, we can insert this html into our component.

We do it with an attribute on **div** element called **dangerouslySetInnerHTML**. We give it a value of an object holding property called **__html**, which has a value of our **html**:

```js
// src/templates/project-template.tsx

...
const ProjectTemplate: React.FC<ProjectTemplateProps> = ({ data }) => {
  const { html } = data.markdownRemark;
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
        <div dangerouslySetInnerHTML={{__html: html }}></div>
      </ProjectTemplateStyled>
    </Layout>
  )
}
...
```

If we now go our page, we will see our content rendered. It is unstyled, but we can use CSS to style it by using element and pseudo selectors.

We do have a problem, however. Our images that we have set in our Markdown documents are not visible on the page.
This is a bit convulted for me, and it has to do with the location of our images. Currently, we have screenshot images set in the same folder as our Markdown documents. However, when Gatsby builds our app, those images are no longer present there. The only file that is in the **project-1** folder of the build app is **index.html**. 
Obviously, pointing to the file that doesn't exist in this folder doesn't work. 

We could use the **static** folder available in the root of our project, as explained in [Gatsby's documentation](https://www.gatsbyjs.org/docs/static-folder).

However, a better solution is to use **gatsby-remark-images**, togethe with another plugin, **gatsby-plugin-sharp**.

Since we are dealing with images in general, and with the **sharp** plugins in particular in the next post, we will fix this issue there.

For now, we have our projects content on new pages. Is good.

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
7. **Insert Markdown files into pages with the transformer-remark plugin**
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

