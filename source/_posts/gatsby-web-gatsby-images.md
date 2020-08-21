---
title: 'Gatsby Web: Gatsby Images'
date: 2020-08-17 07:50:36
tags: 
- gatsby plugins
- images
categories: gatsby web
cover: denis-tuksar-_MwA_-3vN0c-unsplash.jpg

creditArtist: Denis Tuksar
creditSource: https://unsplash.com/@dtuksar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 8 of 10 in Gatsby Web

Inserting local images into a Gatsby website can be very simple. We can simply put them into the [static folder](https://www.gatsbyjs.org/docs/static-folder) that exists in the root of our project, and that is it. 
Gatsby documentation, however, does not encourage it, and instead recommendes that we use a plugin for this.

This plugin is **gatsby-image**, and it is used in combination with few other plugins: **gatsby-transformer-sharp** and **gatsby-plugin-sharp**.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 8. Use Gatsby Image to work with images

In short, image manipulation is done via GraphQL. From what I understand, the **transformer** plugin creates image nodes from image types, and the **plugin-sharp** plugin provides functions for image processing withing GQL queries. 
The **gatsby-image** plugin itself provides a component that uses result of such GQL query to actually render images.

Here is what we will do:

1. Install and configure plugins
2. Use plugins to insert an image in the **About** page
3. Use plugins to insert a featured image into **LearnItem** component after converting a file path to image-sharp node.
4. Use the **gatsby-remark-images** plugin to process images in Markdown documents

### Install and configure plugins

We install all three plugins:

```bash
npm install gatsby-image gatsby-transformer-sharp gatsby-plugin-sharp
```

And then adjust the **plugins** array in **gatsby-config.js**. 
We add only **gatsby-transformer-sharp** and **gatsby-plugin-sharp** plugins. 
Be careful to place them **BEFORE** the **gatsby-source-filesystem** plugin configuration. This makes sure that later in the post we are able to convert a file path into an image-sharp node.

```js
// gatsby-config.js

module.exports = {
  /* Your site config here */
  // ...
  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-transformer-remark",
      // ...
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/src`,
      },
    },
```

That should be enough to configure the plugins.

### Use plugins to insert an image in the **About** page

To add an image into our components, first we need an image. So go ahead and find a nice, free photo on the internet. You can also visit [Unsplash](https://unsplash.com) and grab one from there.

Create a folder in the **src** folder, and call it **data**, and put another folder in it called **images**. Put your image in it and, assuming it is a jpg image, rename it to **my-image.jpg**.

Now move to the **About** component. Let's write a simple query there, to get the extension of the image we just saved to our project.

We are writing a page query, making a **file** query. This query is made possible by the **gatsby-source-filesystem** plugin. 
We are filtering the results by file relative path, and we set this relative path to point to our image. We are then requesting the file's extension field.

Bear in mind that the path is relative to the folder we set when we configured the **gatsby-source-filesystem** plugin.

```js
// src/pages/about.tsx
// ...
export const query = graphql`
  query {
    file(relativePath: { eq: "data/images/my-image.jpg" }) {
      extension
    }
  }
`
```

If we log the **data** prop passed to the **About** page, get the extension.

```js
data in about: 
  {file: {…}}
    file:
      extension: "jpg"
```

Let's adjust the query now, to make use of the plugins we installed. 
Instead of the extension, we will query for the **childImageSharp** field, and required its property **fixed**.
**fixed** accepts arguments, so we will provide two: **width** and **height**, indicating width and height of the image that we want to fetch.
Then, we will add another query inside **fixed**, the **...GatsbyImageSharpFixed**. This is known as a **query fragment**, and from what I see, they are generally used as as a shorthand for multiple other fields. 

```js
// src/pages/about.tsx
// ...
export const query = graphql`
  query {
    file(relativePath: { eq: "data/images/my-image.jpg" }) {
      childImageSharp {
        fixed(width: 200, height: 200) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
```

If we log the result of this query, here is what we get:

```js
data in about: 
  {file: {…}}
    file:
      childImageSharp:
        fixed:
          base64: "data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAUABQDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAECAwUE/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAIDAf/aAAwDAQACEAMQAAABmsazOa6LXriB4gt//8QAGxABAAICAwAAAAAAAAAAAAAAAQIDABETISL/2gAIAQEAAQUC82llBPOEi9BF22m5VAs3UmS5/8QAFxEBAAMAAAAAAAAAAAAAAAAAAAEQEf/aAAgBAwEBPwFiK//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8BH//EABwQAAICAgMAAAAAAAAAAAAAAAABESECYRAxMv/aAAgBAQAGPwLQrhkZd6PNCkrJcyf/xAAbEAEAAgMBAQAAAAAAAAAAAAABABEhMUFhgf/aAAgBAQABPyHAXI5cPQuVxadR8QeITBNEhwZoViKbLjomzXkRs5n/2gAMAwEAAgADAAAAEBTXP//EABcRAAMBAAAAAAAAAAAAAAAAAAABETH/2gAIAQMBAT8QgkmGhKo//8QAFxEBAQEBAAAAAAAAAAAAAAAAAQAhMf/aAAgBAgEBPxAdlY5AX//EAB4QAQADAAIDAQEAAAAAAAAAAAEAESExQVFhkYGh/9oACAEBAAE/EKd1CloidVD7ooaD0kaC2o/H8iEaBry869MYu7StM8wwQgiPN/ZXfruV2cDfdM+Rmq3if//Z"
          height: 200
          src: "/static/3df9ed0d4465cca674246443f2292248/8295c/my-image.jpg"
          srcSet: "/static/3df9ed0d4465cca674246443f2292248/8295c/my-image.jpg 1x,↵/static/3df9ed0d4465cca674246443f2292248/25e3f/my-image.jpg 1.5x,↵/static/3df9ed0d4465cca674246443f2292248/6e63d/my-image.jpg 2x"
          width: 200
```

Note that image-sharp query fragments are not available in GraphiQL, but we can use the other fields we received in the response, and replace query fragments that way: 

```js
// graphiQL query
query MyQuery {
  file(relativePath: {eq: "data/images/my-image.jpg"}) {
    childImageSharp {
      fixed(width: 100, height: 100) {
        src
        srcSet
        base64
        height
        width
      }
    }
  }
}
```

Great, we got some data, but what do we do with it? 
Well, this is where we use the **Img** component provided by the **gatsby-image** plugin.

Let's import it first:

```js
// src/pages/about.tsx

import Img from "gatsby-image"
```

Next, we insert the **Img** into our React component, and pass it two props:

1. fixed, and give it value of our **fixed** property from the query result
2. alt, which gets a string specifiying **alt** attribute of the rendered image

```js
// src/pages/about.tsx
// ...

  return (
    // ...
    <Img
      className="about-section__my-profile-image"
      fixed={data.file.childImageSharp.fixed}
      alt="my profile image"
    />
```

Great. Go ahead and check the **About** page. There is a small picture there, right?

This is all good, but I needed an image that is not defined it size, but can change its size depending on its container. Something similar to when we use CSS **object-fit** rule would be better. 
Gatsby-image provides exactly that behavior with its **fluid** field, instead of **fixed**. Fluid generates an **object-fit** set image, and we can then define its dimensions with CSS using the class on the **Img** component. 

Here is the query, using **fluid** instead of **fixed**, and defining max width and height. Note that we are now using query fragment **GatsbyImageSharpFluid** too.

```js
export const query = graphql`
  query {
    file(relativePath: { eq: "data/images/my-image.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 900, maxHeight: 450) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
```

And here is the **Img** component, together with some styling. Note that is prop is **fluid** now, instead of **fixed**:

```js
  return(
    //...
    <Img
      className="about-section__my-profile-image"
      fluid={data.file.childImageSharp.fluid}
      alt="my profile image"
    />
    //...
  )

  // CSS
  .about-section__my-profile-image {
    margin: 0.25rem 0 0.5rem;
    width: 100%;
    height: 200px;
  }

```

Go ahead and check the page now. Try to widen and narrow your browser window. See how the image behaves, expanding and shrinking with the window?

### Use plugins to insert a featured image into **LearnItem** component after converting a file path to image-sharp node.

Ok, the title of this section says nothing, I know. 
What we want here is to add another field to the frontmatter of our Markdown documents. This field would hold a path to an image, and we want to show this image as the featured image in the project items on the Home page.

So grab another four images from the internet and place one in each project folder containing a Markdown **index.md** document. Now each project has a Markdown and an image document. Name all images **featuredImage.jpg**

```yaml
# src/pages/projects/project-3
---
title: Project 3
learningPeriod: 30 June 2020 to 5 July 2020
date: "2020-08-11"
frontmatterExcerpt: This is the Project 3 content.
featuredImage: ./featuredimage.jpg
tech: ["react", "grapqhl"]
---
```

The **featuredImage** field points to an image in the same folder as the index.md document.

The way we get the **featuredImage** is to query for this particular field on frontmatter, the **featuredImage**, and then try to convert it to a file node. The we can query its **childImageSharp** field
Luckily, we can do just that. As explained by [Gatsby docs](https://www.gatsbyjs.org/docs/working-with-images-in-markdown/), if a file path points to an actual image, it is transformed to a file node. Say no more. 

Here is an example from GraphiQL, queryig **MarkdownRemark** nodes:

```
query MyQuery {
  allMarkdownRemark {
    edges {
      node {
        frontmatter {
          featuredImage {
            childImageSharp {
              fixed(height: 10, width: 10) {
                base64
                height
                src
                srcSet
                width
              }
            }
          }
        }
      }
    }
  }
}
```

See how featuredImage

BTW, this is why we placed image plugins before the filesystem plugin in the **plugins** array of **gatsby-config.js**. I am not sure what happens exactly, but I had to juggle it to make it work, and this way worked. 

Alright, now we know this. 
Where do we query for this image, though? As each featured image is specific to a Markdown document, best would be to do query for it together with all project items in the **Home** page component. 
So let's head over there, and add few more fields to an already exsting query.

We want to query for the **featuredImage** on frontmatter. Since this is a path to an image, this field will be transformed to a **File** node, and we can then query it for **childImageSharp**, and continue down the chain to get the **fluid** field:

```js
// src/pages/index.tsx
// ...
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
            featuredImage {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
```

Since the frontmatter data is included in the **edges** array, featuredImage is already passed to the **ILearnMapper** component as the **projects** prop, and then to the **LearnItem** component as a part of the **frontmatter** prop.
We only have to accept is in the **LearnItem**, and use the **Img** component to render the **fluid** image. 
Note that I typed the **fluid** field as **any**, so as not to type all those properties it contains.

```js
// src/components/learn-item.tsx
// ...
interface LearnItemProps {
  frontmatter: {
    title: string
    date: string
    frontmatterExcerpt: string
    featuredImage: {
      childImageSharp: {
        fluid: any
      }
    }
  }
  slug: string
}

const LearnItem: React.FC<LearnItemProps> = ({
  frontmatter: { title, date, frontmatterExcerpt: excerpt, featuredImage },
  slug,
}) => {
  return (
    <LearnItemStyled className="learn-item">
      <Img
        className="learn-item__featured-image"
        fluid={featuredImage.childImageSharp.fluid}
        alt={title}
      />
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
```

There. This should do it. The **Img** component gets its fluid prop, and it renders a responsive image for each project listed on the **Home** page.

## Use the **gatsby-remark-images** plugin to process images in Markdown documents

Finally, the last thing is to fix the issue from the previous post. There, we included images in our Markdown documents, but when Gatsby built our website, the images were not visible. 

```yaml
<!-- src/pages/projects/project-4/index.md -->
...

## Screenshots Lorem

1. ![Screenshot 1](./screen1.jpg)
1. ![Screenshot 2](./screen2.jpg)
1. ![Screenshot 3](./screen3.jpg)
2. ![Screenshot 4](./screen4.jpg)

...
```

It turned out that, even though we placed these screenshot images in the same folder as Markdown documents, they were not included in the final built, meaning there was no such images in the folders where our index.html project files were.

To fix this, we will use another plugin - **gatsby-remark-images**. This [plugin](https://www.gatsbyjs.org/packages/gatsby-remark-images/) makes images in Markdown documents availabl in production builds. 
It also makes images responsive, similar to the **fluid** field with **gatsby-image** plugin. 
In fact, in order to use this plugin, we need to have the **gatsby-image-sharp** plugin installed too, like we did with the **gatsby-image** plugin.

We need to install this plugin:

```bash
npm i gatsby-remark-images
```

Then, we need to add it to the plugins array in the **gatsby-config.js** file.
We don't add it directly to the **plugins** array, however. Instead, we add it to the **plugins** array of the **gatsby-transformer-remark** configuration object, as we need it to work with Markdown nodes.

First, change the **gatsby-transformer-remark** entry to be an object istead of string, and then have it hold an **options** object with its own **plugins** array. 
Inside this array we will add and configure the **gatsby-remark-images** plugin:

```js
// gatsby-config.js

module.exports = {
  // ...
  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-react-helmet",
    // "gatsby-transformer-remark",
    {
      resolve: "gatsby-transformer-remark",
      options: {
       plugins: [
         {
           resolve: "gatsby-remark-images",
           options: {
             maxWidth: 800,
           }
         }
       ]
      },
    },
  //...
```

Nice. Now try restarting the development server and go to a project page. There should be a list of images at the end of the page.

We have now finished with creating project pages. Of course, there is lot that can be done, but this is a good start. 
In the next post we will set up the **Contact** page so that users can send us a message directly from the page. Then, the last post will quickly show how to do some finishing touches and deploy the page.
See you.

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
8. **Use Gatsby Image to work with images**
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

