---
title: "Gatsby & MDX: Programmatically Create Pages"
date: 2020-08-30 11:40:45
tags:
  - gatsby
  - mdx
categories: gatsby & mdx
cover: h-shaw-4TjWvcKElJA-unsplash.jpg
creditArtist: H Shaw
creditSource: https://unsplash.com/@hikeshaw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 2 of 4 in Gatsby & MDX

In the previous post we installed a plugin that allowed use to create pages by just placing MDX documents in the Gatsby's **pages** folder. While this is cool, the plugin allows us to also insert MDX content into any React component. Here, we will see how to do so with programmatically created pages.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 2: Programmatically create pages with MDX

Creating pages programmatically is {% post_link gatsby-web-programatically-create-pages 'always the same' %}. We use Gatsby's APIs, **onCreateNode** and **createPages** to generate slugs for new pages, and then to create those pages, respectively.

Now, while tutorials online use the same procedure for MDX, I found that MDX nodes already come with their own slugs. I am going to assumet this is automatically done by the **gatsby-plugin-mdx**, and won't look back.

Here is what we will do:

1. Use **createPages** API to create new pages for each MDX document in the project
2. Use **MDXRendered** component to render body.

### Use "createPages" API to create new pages for each MDX document in the project

For this part, I have partially followed Scott Pence's [exhaustive guide](https://scottspence.com/2019/10/31/build-an-mdx-blog/) to create a blog with Gatsby and MDX. Thanks Scott.

We will start with creating two folders inside **src**: **current-project** and **projects**.

I want the **projects** folder contain bunch of other folders, one for each project. They will be named after a project, and will each containe a single **index.mdx** file with the project contents.
With this setup, I make sure that slugs for my projects are names of the project folders. When creating pages with **createPage** method, I will assemble paths to project pages to be **project/<name-of-the-project-folder>**

As for the **current-project** folder, it will hold a single **index.mdx** file with details of the current project. This will make sure that slug for this MDX node is actually an empty string. I assume this is default behavior of the **gatsby-plugin-mdx** plugin when creating slugs, where it ignores the top level folder names inside the **src** folder. This works great for me, as I want my current project to be available at **/current/** path.

To make use of these two folders, we have to add them as instances to **source-filesystem plugin**:

```js gatsby-config.js
// ...
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "projects",
        path: `${__dirname}/src/projects`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "current-project",
        path: `${__dirname}/src/current-project`,
      },
    },
```

Next, we create the **gatsby-node.js** file in the root, and immediately require **path** in it, as we will need it to resolve absolute path to pages' templates. Plural, yes.

Main idea here is the same as in the post I already linked above. We query our MDX files, and then we loop over the edges to create a page for each edge.

```js Programmatically creating pages in "gatsby-node.js"
const path = require("path");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const currentProjectTemplate = path.resolve(
    "src/templates/current-project.template.tsx"
  );
  const finishedProjectTemplate = path.resolve(
    "src/templates/project.template.tsx"
  );

  const result = await graphql(`
    query AllMDX {
      allMdx(filter: { frontmatter: { published: { eq: true } } }) {
        edges {
          node {
            slug
            frontmatter {
              type
            }
          }
        }
      }
    }
  `);

  const projects = result.data.allMdx.edges;

  projects.forEach(({ node }) => {
    if (node.frontmatter.type === "finished") {
      createPage({
        path: `project/${node.slug}`,
        component: finishedProjectTemplate,
        context: {
          slug: node.slug,
        },
      });
    }
    if (node.frontmatter.type === "current") {
      createPage({
        path: `current/${node.slug}`,
        component: currentProjectTemplate,
        context: {
          slug: node.slug,
        },
      });
    }
  });
};
```

Few specifics are:

1. We obviously use **allMdx** query to get our MDX nodes.
2. We filter the nodes by their **published** value, to retireve only published content. I added **published** field to the frontmatter for drafting purposes.
3. In addition to **slug**, I also request the **type** field from the frontmatter. I do this to be able to assign current and finished projects to their respective templates
4. This is visible in the forEach loop, where I assign different templates to finished and current project (of which there is just one).
5. Finally, I assemble paths. Finished projects paths consist of the **"project"** string and **slug** value. Current project path gets **"current** string, and the **slug** value. Note that **slug** is not even needed, as it is empty string, but for the sake of consistency, I put it there.

### Use **MDXRenderer** component to render body.

We have now created pages and assigned paths to them. Obviously, those pages can be linked to the front page via their slugs (which need **/project/** and **/current/** strings prepended to them), but we will not deal with that.

Instead, we will head over to one of the two templates, **project.template.tsx** i the **tempaltes** folder, to see how we can insert finished project data in it.

To do so, **gatsby-plugin-mdx** provides component **MDXRenderer**. This component wraps around the **body** field retrieved from the GQL **mdx** query. 

Here it is in action, together with the query that uses GQL variable from the context we provided to each page when we created them.

```jsx MDXRenderer component renders MDX body
import React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
// ...

const ProjectTemplate: React.FC<ProjectTemplateProps> = ({ data }) => {
  const {
    body,
    frontmatter: { date, title },
  } = data.mdx;

  return (
    <Layout>
      <ProjectTemplateStyled className="main-content_project-article">
        <div className="project-article_project-details">
          <h2 className="project-details_title">{title}</h2>
          <span className="project-details_date">{date}</span>
          <div className="project-details_remark-insert">
            <MDXRenderer>{body}</MDXRenderer>
          </div>
        </div>
      </ProjectTemplateStyled>
    </Layout>
  );
};

export default ProjectTemplate;

export const query = graphql`
  query ProjectPage($slug: String!) {
    mdx(slug: { eq: $slug }) {
      body
      excerpt
      frontmatter {
        date
        title
      }
    }
  }
`;
```

**MDXRenderer** component does not wrap the **body** in any HTML elements, so that is neat. 

That is it. As you can see, programmatically creating pages out ouf MDX document is very similar to the way we do it with regular Markdown. We didn't have to create slugs, which was cool (for some reason I am super annoyed by the whole slugs concept), and we used a dedicated component to render MDX body. 

In the next post we will see another way how to create pages with the **gatsby-plugin-mdx**. This is a more **"MDX"** way, taking advantage of the fact that we can use JSX inside MDX documents. 
See you soon.

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at

- [Github repository](https://github.com/ikaem/angry-chaired-v2/)
- [Live website](https://angrychaired.surge.sh)

### Goals

1. Use MDX to provide content for programmatically created pages
2. Get better TypeScript support in Gatsby project

### Steps

1. Setup MDX and render MDX files as pages
2. **Programmatically create pages with MDX**
3. Create pages with default layouts and gatsby-plugin-page-creator
4. Additional things learned

### Tech and Tools

1. Gatsby
2. TypeScript
3. MDX

### Experience with Tech & Tools

I have previously created a Gatsby website, and wrote about it on this blog. I have also used TypeScript before, including the mentioned project. I haven't used MDX, but from what I see, it is basically a way to write React components in Markdown files.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.

