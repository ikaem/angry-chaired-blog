---
title: "Gatsby & MDX: Set up MDX"
date: 2020-08-30 07:40:09
tags:
  - gatsby
  - mdx
  - typescript
categories: gatsby & mdx
cover: jc-gellidon-UIp163xCV6w-unsplash.jpg
creditArtist: JC Gellidon
creditSource: https://unsplash.com/@jcgellidon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 1 of 4 in Gatsby & MDX

At the end the Gatsby Web project {% post_link gatsby-web-audit-optimize-deploy 'I did previously' %}, I said that I wasn't happy how the website turned out. I felt it was done clumsily, its folder structure being all over the place, and its design ugly. I also wasn't impressed with what Markdown turned out to be. So I figured I should return to Gatsby, and redo the page.
This is it.

<!--more-->

#### See [Project Information](#Project-Information)

In this series I only wanted to focus on two things: MDX and TypeScript. I wanted to try MDX, because I expected more out of regular Markdown in terms of content styling. As for TypeScript, I didn't like that there was no type checking in Gatsby.

As I worked on this project, both of these issues turned out to be pointless. Markdown is what it is, and, while I did use MDX in this project, I used it pretty much as if it was regular Markdown.
As for TypeScript, I did find a cool little plugin that actually does type checking, and it also automatically creates types for GraphQL queries. That was pretty neat. However, I got annoyed by it, as it seemed to contribute to my app slowing down. It also behaved like TypeScript should behave: it assumed that data from GQL queries could be undefined or null. I didn't like that :)

Alright, here we go.

## Step 1: Setup MDX and render MDX files as pages

Before we get into the setup, few words about MDX. MDX is a format that allows us to add JSX in Markdown documents. This means that we can import and add React components, and write any other JSX-specific syntax along with the usual Markdown syntax. That's it.

One last thing: I won't go into creation and setup of a Gatsby project. Instead, I will jump to MDX implementation and use immediately, as this is the focus of the series.

To use MDX in a Gatsby project, we have to install a Gatsby plugin that processes MDX documents, along with few other dependencies.

```bash Installing gatsby-plugin-mdx
npm i gatsby-plugin-mdx @mdx-js/mdx @mdx-js/react
```

Of course, we need to add and configure the plugin in the **gatsby-config.js** file's **login** array, too. Note that, by default, **gatsby-plugin-mdx** tracks only **.mdx** files, but we can configure it to track the **.md** ones too. We will do so in the configuration object:

```js gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
      }
    }
  ]
}
```

Now, **gatsby-plugin-mdx** requireds the **gatsby-source-filesystem** to be installed. We will install and configure that one too. For now, we will set it to track the **pages** folder for now.

```js gatsby-config.js
// ...
{
  resolve: "gatsby-source-filesystem",
  options: {
    name: "pages",
    path: `${__dirname}/src/pages`,
  },
},
```

With the basic setup done, we can move onto creating pages out of MDX documents. 

The quickest way to do it is to add an MDX document to the **pages** folder. Let's do that, and let's add some content to it as well. 

```yml test.mdx
---
title: Copying Landbot.io Home Page
date: 01/09/2020
published: true
featured: featured.jpg
type: finished
---
Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards. Continuing melancholy especially so to. Me unpleasing impossible in attachment announcing so astonished.
```

Nice. Now start (or restart) the Gatsby development server, and visit **localhost:8000/test**. You should see the content of your MDX document rendered on the page. The plugin has just turned the **test.mdx** document to a React component, which was then rendered as a page in the browser.

That's pretty cool. Still, we are currently just rendering simple text written inside MDX documents.
Let's add some of that JSX magic to it.

We can import React components into MDX files, so let's do that with the **Layout** component, and then let's immediately render it. 

```yml
---
title: Tester
date: 01/09/2020
published: false
type: finished
---

import Layout from "../components/layout.component"

<Layout>

Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards. Continuing melancholy especially so to. Me unpleasing impossible in attachment announcing so astonished.

</Layout>
```

As promised, this actually renders the Layout and all its nested components when we load the page. Now that's even prettier cool.

That's it for this post. We started with installing and configuring the plugin needed to work with MDX documents, and we managed to quickly render an MDX file in the browser. 
In the next post we will go a bit further and programmatically create pages from MDX documents. See you there.

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

1. **Setup MDX and render MDX files as pages**
2. Programmatically create pages with MDX
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
`````
