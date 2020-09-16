---
title: "Gatsby & MDX: Additional Things Learned"
date: 2020-08-30 16:58:27
tags:
  - gatsby
  - mdx
  - typescript
  - styled-components
  - javascript
categories: gatsby & mdx
cover: national-cancer-institute-701-FJcjLAQ-unsplash.jpg
creditArtist: National Cancer Institute
creditSource: https://unsplash.com/@nci?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 4 of 4 in Gatsby & MDX

As I was working on the website, I bumped into interesting things that either didn't have direct connection to MDX, or would make too short of a post. I decided to write about all of them in once place, as I felt they provided some value to me.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 4: Additional things learned

Note that these will be brief, and might seem out of context.

Here is what we will go over:

1. gatsby-plugin-ts
2. gatsby-remark-images with MDX
3. Declaring media TS modules
4. Passing generic types to Styled Components
5. Global style with gatsby-browser
6. Custom hook for siteMetadata
7. multipart/form-data format for sending forms

### gatsby-plugin-ts

We start with the **gatsby-plugin-ts**. As I already mentioned, the plugin provides support for type checking inside Gatsby project. Also, it has a cool feature where it automatically generates types for GQL queries, both page and static ones.

It requires installation of typescript compiler, so we install all together with:

```bash
npm i typescript gatsby-plugin-ts
```

Of course, we need to add it to the plugin array in **gatsby-config.js**

```js gatsby-config.js
// ...
  plugins: [
    {
      resolve: "gatsby-plugin-ts",
      options: {
        typeCheck: process.env.NODE_ENV !== "production",
        fileName: "types/graphql-types.ts"
      },
    },
  ],
// ...

```

In this particular configuration, we are disabling type checking in production mode. We are also specifing that the automatically generated GQL types are stored in the **types** folder in the root of the project.
According to the plugin [documentation](https://www.gatsbyjs.com/plugins/gatsby-plugin-ts/), the shouldn't be placed in the **src** folder as that would cause infinite loop.

Finally, we should also create a **tsconfig.json** file ourselves:

```bash
tsc --init
```

And we should configure it to look like this:

```js
"compilerOptions": {
    "target": "ES2018",    /* or at least ES2015 */
    "module": "ESNext",    /* or at least ES2015 */
    "lib": ["dom"],             /* <-- required! */
    "jsx": "preserve",          /* <-- required! */
    "moduleResolution": "node", /* <-- required! */

    /* for mixed ts/js codebase */
    "allowJS": true,
    "outDir": "./build"    /* this won't be used by ts-loader */
    /* other options... */
}
```

That's it. It worked.
I did get a continuous warning saying that GQL types for certain pointers couldn0t be found. According to the [plugin's Github page](https://github.com/d4rekanguok/gatsby-typescript), it has to do with Gatsby moving folders of plugins' fragments. They do provide a solution, but I couldn't get it to work.

More annoying were a seemingly big effect the types generation had on hot reloading times, as well as unfamiliar types it used for GQL queried data. This has to do with me, of course.

### gatsby-remark-images with MDX

I already used this plugin in the previous Gatsby project, when I needed to render images inserted into Markdown documents via Markdown syntax.
The plugin's use is almost the same here, except that after its installation we pass it to plugin arrays of **gatsby-plugin-mdx** instead of **gatsby-transformer-remark**.

Note that we pass it to two plugin arrays inside the **gatsby-plugin-mdx** configuration object.

```js gatsby-config.js
// ...
{
    resolve: "gatsby-plugin-mdx",
        options: {
        extensions: [".mdx", ".md"],
        defaultLayouts: {
            default: path.resolve("./src/templates/next.template.tsx"),
        },
        gatsbyRemarkPlugins: [
            {
            resolve: "gatsby-remark-images",
            options: {
                maxWidth: 566,
            },
            },
        ],
        plugins: [
            {
                resolve: "gatsby-remark-images",
                options: {
                    maxWidth: 566,
                },
            },
        ],
    },
},
// ...
```

### Declaring media TS modules

I wanted to import an image that will be used as a background for my website.

```jsx
import backgroundImage from "../data/images/repeating-chevrons-background.svg";
```

When I did it, I was warned that the import's module of corresponding type declarations couldn't be found.
Googling helped, to find, duh, that I only had to declare the module somewhere in the project.

```ts media-typings.d.ts
declare module "*.svg";
```

### Passing generic types to Styled Components

Similar duh to the one above: I wanted to pass props to a styled component. I know that I could type the prop inside the actual component:

```jsx
// ...
> p {
    background-color: ${(props: { isMessageSuccess: boolean }) => (props.isMessageSuccess ? "#3bbb7e" : "var(--red)")};
```

But, we can do generic types on the actual styled component, by assigning it to the actual element we are styling:

```jsx
const MessageFormStyled =
  styled.form <
  { isMessageSuccess: boolean } >
  `
`;
```

### Global style with gatsby-browser

I wanted to import fonts from Google Fonts, but couldn't be bothered to install another plugin.
It turned out I didn't have to. Only thing I had to do was create a css stylesheet in the project, and import fonts there, and then import that stylsheet into **gatsby-browser.js** file in the root of the project.

```js gatsby-browser.js
import "./src/styles/global.css";
```

From what I understand, this will insert the stylesheet into the document once it is rendered in the browser.
It also [turned out](https://www.narative.co/articles/understanding-the-gatsby-lifecycle/) that **gatsby-browser** is one of the Gatby's API files, and is used to manage the website once it is rendered in the browser.

### Custom hook for siteMetadata

One other small, but helpful thing that never crossed my mind, and it should have, is to create a custom hook for fetching siteMetadata (or anyhing else, really).

This one is thanks to Scott Pence [once again](https://scottspence.com/2019/10/31/build-an-mdx-blog/), and it is very simple. We just create and export a function that queries siteMetadata by way of **useStatic** query hook.
The function returns metadata properties that we actually need.

```ts use-site-metadata.ts
import { graphql, useStaticQuery } from "gatsby";

import { SiteMetadataQuery } from "../../custom-typings/graphql-typings";

const useSiteMetadata = () => {
  const data: SiteMetadataQuery = useStaticQuery(
    graphql`
      query SiteMetadataQuery {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  return data.site.siteMetadata;
};

export default useSiteMetadata;
```

### multipart/form-data format for sending forms

Finally, I discovered that form data is sent in **multipart/form-data** format. 

Same as in previous {% post_link gatsby-web-implement-messaging-feature 'series' } with Gatsby, I used **getform.io** to implement messaging on the website.

Unlike the first solution where **axios** was used to send data to **geform.io**, I wanted to use regular **fetch** to do so. I thought that form data was to be sent as a json string, but no. It was to be sent as a regular **FormData** object, which was in **multipart/form-data** format by default. Boom

```js 
    // ...
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const response = (await fetch(
        process.env.GATSBY_MESSAGING_ENDPOINT as string,
        {
          method: "post",
          body: formData,
        }
      )) as {
        ok: boolean
        redirected: boolean
        status: number
      }
```


There, that's it. The website is done. 

Actually, one last thing left is how furious I got with Gatsby at one point. When I first started the project, React wasn't installed for some reason, so I had to install all dependencies with **npm install**. From that point the whole app has been laggy, taking a long time to start and restart development server, and to build static files. 
I felt that the installation of the typescript plugin made things worse, too. 
And then, when I almost finished the whole thing, built the static site, and wanted to serve it locally, I couldn't render the website in the browser. I tried fixing it, going over my queries and components, but no success. 
I almost quit here, and went to rebuild the site with Next.js. But, finally I decided to build the site again in Gatsby. I dropped the the TS plugin, and went with the default TS support, and finished the site again. Still, the website wouldn't render in the browser.

It turned out that the problem was a service worker installed by the offline plugin in the previous Gatsby project. Argh. 

Anyway, the site is here now. It looks good.

It turned out that the app wasn't a problem at all. The issue was 

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
3. Create pages with default layouts and gatsby-plugin-page-creator
4. **Additional things learned**

### Tech and Tools

1. Gatsby
2. TypeScript
3. MDX

### Experience with Tech & Tools

I have previously created a Gatsby website, and wrote about it on this blog. I have also used TypeScript before, including the mentioned project. I haven't used MDX, but from what I see, it is basically a way to write React components in Markdown files.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
