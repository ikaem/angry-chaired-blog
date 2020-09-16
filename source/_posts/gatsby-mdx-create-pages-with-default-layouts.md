---
title: "Gatsby & MDX: Create Pages with Default Layouts"
date: 2020-08-30 14:24:49
tags:
  - gatsby
  - mdx
categories: gatsby & mdx
cover: rusty-watson-TercK6ss7F4-unsplash.jpg
creditArtist: Rusty Watson
creditSource: https://unsplash.com/@rustyct1?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 3 of 4 in Gatsby & MDX

In the previous post we programmatically created pages from MDX documents. In this post we will create pages by specifying a folder whose MDX documents will be turned to pages automatically, and then specifying a default layout which will be used for every page.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 3: Create pages with default layouts and gatsby-plugin-create-pages

This approach consists of three parts:

1. Setting up gatsby-plugin-page-creator plugin to convert documents inside a folder into pages
2. Definining default layout which will be used to as a template for pages
3. Using **MDXProvider** component to render contents of MDX documents

So let's start.

### Set up gatsby-plugin-page-creator plugin to convert documents inside a folder into pages

The **gatsby-plugin-page-creator** is automatically included in all websites by Gatsby. It is normally used to create pages out of all components inside **src/pages** folder, but we can add another instance to specify more **pages** directories.

Let's install the plugin with:

```bash
npm install --save gatsby-plugin-page-creator
```

Next, we will create another folder isnide **src**, and called it **next**. Let's place a file called **next.mdx** inside it, too, and add some content to it.

```yml next.mdx
---
title: Multiplayer Chess with Socket.io
date: 30/09/2020
published: false
---
### Hello next project

Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards. Continuing melancholy especially so to. Me unpleasing impossible in attachment announcing so astonished.
```

To make all MDX components inside this folder become pages, we will add the installed plugin's configuration object to the **plugins** array, and specify its **path** property to point to our new folder.

```js gatsby-config.js
// ...
{
    resolve: "gatsby-plugin-page-creator",
    options: {
    path: `${__dirname}/src/next`,
    },
},
```

If we visit **localhost:8000/next**, we will see contents of the MDX component rendered on the page.

Of course, the page is pretty bland. So let's fix that.

### Definining default layout which will be used to as a template for pages

The **gatsby-plugin-mdx** plugin allows us to specify layout which will be used for rendering MDX components. We can specify a default layout, as well as layouts that will specifically be used to render MDX components found in specific source instances, as defined in **source-filesystem** configuration objects.

Here we specify a general default layout to point to **templates/next.template.tsx**, as well as a layout used for all MDX components whose source instance name is **testmdx**.
We will not be using the latter one, and I include it here only as an example. The procedure to render MDX components is the same, though.

```js gatsby-config.js
//...
{
    resolve: "gatsby-source-filesystem",
    options: {
    name: "testmdx",
    path: `${__dirname}/src/testmdx`,
    },
},
// ...
{
    resolve: "gatsby-plugin-mdx",
    options: {
    extensions: [".mdx", ".md"],
    defaultLayouts: {
        testmdx: path.resolve("./src/templates/testmdx.template.tsx"),
        default: path.resolve("./src/templates/next.template.tsx"),
    },
// ...
```

Finally, we can render MDX component in our layout. MDX components are passed as a **children** prop to the layout component, and all we have to do is render it:

```jsx next.template.tsx
import React from "react";

const TestTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h1>This is inside Next Template </h1>
      {children}
    </div>
  );
};

export default TestTemplate;
```

Now open the **localhost:8000/next**, and you should see the same page as before, but with the heading rendered as well.

### Using "MDXProvider" component to customize contents of MDX documents

Now that we managed to render (yet again) MDX components, we can actually customize the style of rendered MDX components, and we can provide other React components to all MDX components.

To do this, we need to import the component from **@mdx-js/react**, and then wrap the component around the **children** prop.

```jsx next.template.tsx
import { MDXProvider } from "@mdx-js/react"

const NextTemplate = ({ children }: { children: React.ReactNode }) => {

  return (
    <div>
        <h1>This is inside Next Template </h1>
        <MDXProvider>
            {children}
        </MDXProvider>
    </div>
  )
```

Unfortunately, this package does not come with TS types, and I couldn't find ones to install.
I did find a [way](https://mdxjs.com/advanced/typescript) to declare its types manually, however, by declaring a module **@mdx-js/react**. The module defines a type called **ComponentType**, which is then used to type props that exist on the **MDXProvider** component.

```ts mdx-typings.d.ts
declare module "@mdx-js/react" {
  import * as React from "react";
  type ComponentType =
    | "a"
    | "blockquote"
    | "code"
    | "delete"
    | "em"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "hr"
    | "img"
    | "inlineCode"
    | "li"
    | "ol"
    | "p"
    | "pre"
    | "strong"
    | "sup"
    | "table"
    | "td"
    | "thematicBreak"
    | "tr"
    | "ul"
    | "Header"
    | "Footer";

  export type Components = {
    [key in ComponentType]?: React.ComponentType<{ children: React.ReactNode }>;
  };
  export interface MDXProviderProps {
    children: React.ReactNode;
    components: Components;
  }
  export class MDXProvider extends React.Component<MDXProviderProps> {}
}
```

I have to admit that I find the mentioned types of this particular component a bit confusing, but it works, so leat's move on.
What the types do is make the **components** prop mandatory, so let's add it to the **MDXProvider** component.

The prop holds an object which we can use to customize our MDX Components. For instance, we can make all **h3** headings in MDX components be red, or assign a class to all paragraphs.

Let's do exactly that.
We will create an object outside of the template's return, and have it hold two properties.

The **h3** one will hold a function that returns an **h3** element, styled to be red.
The **p** one will hold a function that returns a **p** element with a class of **custom-class**.

Note that both functions accept a **props** argumet, which is then destructured in the element. I can't tell you exactly why this is. I tried looking for it, but I couldn't find much about it.

```jsx next.template.tsx
const NextTemplate = ({ children }: { children: React.ReactNode }) => {
  
  const componentsMapping = {
    h3: (props) => <h3 {...props} style={{ color: "red" }} />,
    p: (props) => <p {...props} className="custom-class"/>
  }
  // ...
```

Next, we will pass this object to the **components** prop. This will effectively replace **h3** and **p** elements with the elements that created, coloring headings red, and assigning a class to paragraphs.

```jsx next.template.tsx
//..
return (
    <div>
        <MDXProvider components={componentsMapping}>
        {children}
        </MDXProvider>
    </div>
```

We could have assigned values to object keys inline, in JSX. However, this could negatively [impact the site performance](https://mdxjs.com/advanced/components), among other issues, so always declare components as constants outside JSX.

The **components** prop can also be used to pass React components to MDX components. We have already seen that MDX components can import React components. However, with this approach we can pass components to all MDX components that use this particular layout, instead of doing it individually.

```jsx 
import { Link } from "gatsby"

import Footer from "../components/footer.component"
import Header from "../components/header.component"


const NextTemplate = ({ children }: { children: React.ReactNode }) => {

  const componentsMapping = {
    h3: (props) => <h3 {...props} style={{ color: "red" }} />,
    p: (props) => <p {...props} className="custom-class"/>,
    Link,
    Header,
    Footer
  }

// ...
```

Let's head over to our **next.mdx** component, and use the newly available React components:

```yml next.mdx
---
title: Multiplayer Chess with Socket.io
date: 30/09/2020
published: false
---

<Header />

### Hello next project

Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards. Continuing melancholy especially so to. Me unpleasing impossible in attachment announcing so astonished.

<Link to="/">Let's go home</Link>

<Footer />
```

There. We have successfully inserted React components into MDX components. Massive.

Cool. That's pretty much it for MDX. We have seen how to create pages out of MDX documents by specifying page layouts and folders. We have also seen how we can style and give MDX componets access to React components. 

In the next one we will go over few other things I found interesting while working on the website. Use of **gatsby-plugin-ts** and **gatsby-remark-images** are among them, so see you there.

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
2. Programmatically create pages with MDX
3. **Create pages with default layouts and gatsby-plugin-page-creator**
4. Additional things learned

### Tech and Tools

1. Gatsby
2. TypeScript
3. MDX

### Experience with Tech & Tools

I have previously created a Gatsby website, and wrote about it on this blog. I have also used TypeScript before, including the mentioned project. I haven't used MDX, but from what I see, it is basically a way to write React components in Markdown files.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
