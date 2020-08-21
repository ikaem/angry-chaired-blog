---
title: 'Gatsby Web: Styled Components'
date: 2020-08-16 22:19:00
tags:
- gatsby
- styled components
categories: gatsby web
cover: filip-baotic-bapQrN7zcg8-unsplash.jpg

creditArtist: Filip Baotić
creditSource: https://unsplash.com/@filipbaotic?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 3 of 10 in Gatsby Web

At the moment, our app looks pretty dry. In fact, it is ugly. We have to style it a bit. 
Official Gatsby tutorial goes with CSS Modules when it comes to styling. 
However, I prefer Styled Components. It allows us to have styles in the same file as React components, we can nest style rules like with Sass, and we can define global styles with it, too. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 2. Install Styled Components and its Gatsby plugin to style pages

There is a small issue when it comes to importing fonts, but its Gatsby, so there is a plugin for that. 

Here is what we will do:

1. Install Styled Components, its TS types, and its Gatsby plugin
2. Define global styles for the app
3. Install a plugin to enable Google fonts in global styles
4. Get footer icons with FontAwesome
5. Style the **PageTitle** component

Again, to stay on point, we won't go into styling all the components we made so far. This is all available in the project code on Github.

### Install Styled Components, its TS types, and its Gatsby plugin

To use Styled Components with Gatsby, we install 3 packages:

- Actual **styled-components** package
- A Gatsby plugin for the package, **gatsby-plugin-styled-components**
- Babel plugin for Styled Components, **babel-plugin-styled-components**, which apparently enables server-side render ability and makes style bundles smaller in size, among other things.

```bash
npm install --save gatsby-plugin-styled-components styled-components babel-plugin-styled-components
```

Of course, since we are working with TS, we need to install TS types for styled-components:

```bash
npm i -D @types/styled-components
```

Now, we get into Gatsby territory. 
In the root of our project, there is a file called **gatsby-config.js**. This file is used for configuring plugins, metadata, and other things in our application. Name of this file is predefined, and Gatsby expects to find it in the root of the project. We cannot change its name or extension.
[Here](https://www.gatsbyjs.org/docs/api-files-gatsby-config/) is the Gatsby's own overview of the file.

Right now, the **gatsby-config** file in our app is empty, and looks like this: 

```js
  /**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [],
}
```

We can remove comments, and add a new item to the **plugins** array. 
The item will be a string representing the Gatsby plugin for styled-components. If you go back to when we installed the plugin, you can see that its name was **gatsby-plugin-styled-components**. This exact name is what we will add to the **plugins** array.

```js
// gatsby-config.js

module.exports = {
  plugins: ["gatsby-plugin-styled-components"],
}
```

That's it (as far the SC plugin is concerned). We can now use styled components in our app.

### Define global styles for the app

Defining a global style with SC is not an exclusive Gatsby thing. It did, however, introduce me to a problem that I solved by... intalling a new plugin. 
This is a common thing in Gatsby, it seems: there is a problem, and then there is a plugin that solves the problem.

We will create the global style component in the **Layout** component. It is the most natural place, and [recommended by the Gatby team](https://www.gatsbyjs.org/docs/styled-components/#creating-global-styles), as **Layout** is where all other components sit in.

Global style is created with the named **createGlobalStyle** imported function. It returns a styled component, which we can then place at top of our **Layout** component. 

Here it is:

```js
// src/components/layout.component.tsx

...
import { createGlobalStyle } from "styled-components"
...

const Layout: React.FC<LayoutProps> = ({ children, path }) => {
  return (
    <div className="layout">
      <GlobalStyle />
      <Header />
      ...
    </div>
  )
}

export default Layout

const GlobalStyle = createGlobalStyle`

    @import url("https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400;900&display=swap");
    @import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,900;1,700&display=swap");

    /* variables */
    :root {
        --red: #FF715B;
        --bluegreen: #F1F4F4;
        --smudgedblue: #5D6A6A; 
        --textblue: #373f3f;
        --touchedwhite: #FBFCFF;
        --usedyellow: #FFEF5B;
    }

    /* fonts */
    html {
        font-family: 'Lato', sans-serif;
        font-size: 100%;
    }

    /* reset */
    * {
        box-sizing: border-box;
    }

    body, #___gatsby, #gatsby-focus-wrapper {
        height: 100%;
    }

    body {
        overflow-x: hidden;
    }

    body, h1, h2, h3, h4, ul, a, p {
        margin: 0;
        padding: 0;
        text-decoration: none;
        list-style: none;
    }

    ol {
        margin: 0;
        padding-left: 1rem;
    }

    img {
        display: block;
    }

    button, input, textarea {
        font: inherit;
        padding: 0;
        margin: 0;
    }

    button:focus, 
    input:focus, 
    textarea:focus {
        outline: none;
    }
`
```

Ok, so far so good. If you go and check the Home page, you can see that element margins and paddings are now removed, and that links in navigations are no longer bulleted. 

### Install a plugin to import Google fonts in global styles

With the **GlobalStyles** component, we have reset our stylesheet, and set general styles. However, there is an issue with global fonts. 
We are importing fonts from Google Fonts in our global styles component, and then using one of them, **Lato**, as the default font in the app. Unfortunately, this font is never actually applied. Instead, a default serif font is used.

This has to do with Styled Components itself, and [this guy](https://scottspence.com/2020/02/06/globally-style-gatsby-styled-components/) points to it, and offers a solution in the form of another plugin - the **gatsby-plugin-google-fonts**.

This plugin, when installed, is also added to the **plugins** array. However, unlike the **styled-components** plugin, this one is added in the form of a JS object with properties that configure it. 
As we will see throughout this series, some plugins are included in the plugins array as a simple string, some require a configuration object, and some packages are not included there at all. Wonders...

Anyway, we install the plugin:

```bash
npm i gatsby-plugin-google-fonts
```

Then, we create a new entry in the **plugins** array in the **gatsby-config.js** file. 
This entry is an object, resolving to **gatsby-plugin-google-fonts**, and specifying Google fonts that we want to bring into our app. 
The fonts are defined as an entry in the **fonts** array, consisting of the font name and required font weights.
Font display option is also specified, which is **swap** in this case, instructing the browser to use our serif font until it manages to replace it with our chosen font. 

```js
// gatsby-config.js

module.exports = {
  plugins: [
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: [`Playfair Display SC\:400,700,900`, `Lato\:400,700`],
        display: "swap",
      },
    },
```

Note that I had trouble with specifying fonts in lowercase letters, as done on Gatsby website and in the mentioned article. Instead, I typed names of fonts in the way they are written on Google Fonts website. 

Alright, that should be it. We need to restart our development server after modifying **gatsby-config.js** (CTRL+C to stop it, and **gatsby develop** to start again), and **Lato** font should be used everywhere. Everywhhere, I tell you.

### Get footer icons with FontAwesome

While we won't bother with styling the footer here, I am including this because I initially wanted to use **Styled Icons** to get icons into the app. Styled Icons is an icon library by Styled Components, so this is the connection I was going for. Plus, I used styled icons before, and I liked it, so I figured to use them again. 
Unfortunatly, I couldn't get it to work, so I chose FontAwesome icon library instead. 
I still kept the section in the blog series, however. Packages that we will use here don't require a Gatsby plugin, so we get to see a case where a dependency in Gatsby does not require a plugin. 

I only needed three icons to use in the footer - Facebook, Twitter, and a simple envelope as an icon for email. 

For this, we need to install 4 packages. For 3 measly icons= A bit of an overkill, huh?

- @fortawesome/fontawesome-svg-core package, that will give us an access to icons library
- @fortawesome/free-solid-svg-icons, from which we will grab our envelope icon
- @fortawesome/free-brands-svg-icons, for Facebook and Twitter icons
- @fortawesome/react-fontawesome, which provides a component to render the icons

Now, let's build a library to house our 3 icons, so we can use them anywhere in the app. We need to get our money's worth, right?

Create a new folder in **src**, and call it **utils**. We can use it for any utility functions needed for our app. 
Inside, create a new file called fontawesome.ts, and import the **library** object from the **"core"** package. This object will hold whatever icons we need, making them available all over the app.

```js
// utils/fontawesome.ts
import { library } from "@fortawesome/fontawesome-svg-core";
```

Now, in the same file, let's get the icons that we need. 
We will get the Facebook and Twitter ones from the **brands** package, and the **envelope** one from the **solid** package:

```js
// utils/fontawesome.ts
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelopeSquare } from "@fortawesome/free-solid-svg-icons";
import { faFacebookSquare, faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
```

Great. Now, in the spirit of overkill, we need to add them to the library. Same file, we call the **add** function available on the **library** object, and pass in all our icons.

```js
// utils/fontawesome.ts
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelopeSquare } from "@fortawesome/free-solid-svg-icons";
import { faFacebookSquare, faTwitterSquare } from "@fortawesome/free-brands-svg-icons";

library.add(faEnvelopeSquare, faFacebookSquare, faTwitterSquare);
```

The icons library is now filled, and we can move on to use the icons.
To be able to use them, we have to initialize the library first. 
We can do this in the **Layout** component again, as this component wraps everything else. We could initialize the library in the **Footer** too, but then only footer would have access to the library.

To initialize the library, we simply import the **fontawesome.ts** file:

```js
// src/components/layout.component.tsx
...
import "../utils/fontawesome"
```

Next, we go to the Footer component. 
To render our icons, we need to import the **FontAwesomeIcon** component from the **"react-awesome** package. 

```js
// src/components/footer.component.tsx
...
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
```

To render an icon, we provide a string value to the **icon** attribute on the **FontAwesomeIcon**. In our case, we want to use that envelope icon we added to the library, so we will provide its icon string - **envelope-square**

```js
// src/components/footer.component.tsx
...
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
...
const Footer = () => {
  return (
    <FooterStyled className="main-footer">
      ...
      <ul className="main-footer__social-links">
        ...
        <li className="social-links__link">
          <a href="#">
            <FontAwesomeIcon icon="envelope-square" />
          </a>
        </li>
      </ul>
    </FooterStyled>
  )
}
...
```

The icon strings are just names of icons in string format. You can find those on the [FontAwesome page](https://fontawesome.com/icons?d=gallery), when searching or browsing icons. Icon strings will be written below each icon. 

Try to open the website and look at the footer. Do you see the envelope? 

Let's add that Facebook icon too. Try the same thing, add use its string - **facebook-square**.

```js
<FontAwesomeIcon icon="facebook-square" />
```

Visit the site. No good, right? Nothing shows. This is because FA icons come with prefixes that identify their types. The envelope icon is a solid icon, making its prefix **fas** - font awesome solid. The Facebook one (and the Twitter one, too) on the other hand, is a **brand** icon - **fab**.

When we provide icon names as strings, like we do here (yes, there are [other](https://medium.com/@johnny02/how-to-add-font-awesome-to-a-gatsby-site-89da940924d5) [ways](https://github.com/FortAwesome/react-fontawesome#build-a-library-to-reference-icons-throughout-your-app-more-conveniently)), the **FontAwesomeIcon** component assumes that the icon type (prefix) is **fas**. If we want to change that, we have to explicitly tell it otherwise.

We do this by providing an array value to the **icon** attribute, and setting the array's first value to be the neccessary prefix. 
Like this:

```js
<FontAwesomeIcon icon={["fab", "facebook-square"]} />
```

Now, it should work.
If we want to resize these icons, or change their color, we do it simply by treating the **FontAwesomeIcon** components as fonts, and using selectors and CSS rules as we would to manipulate fonts. 

### Style the **PageTitle** component

We will only show how to style this small component.
Its style adds up to the style of each page, where **PageTitle** is a part of a flex-box. 
When rendered on the Home page, I want it to be shown in the center, and when on other pages, I want it to be aligned all the way to the left. 

To get this, we will use the **path** prop we already have available in the Home page component. It will allow for some conditional styling of **PageTitle**

```js
// src/elements/page-title.element.tsx

import React from "react"
import styled from "styled-components"

interface PageTitleProps {
  pageTitle: string; 
  path?: string; 
}

const PageTitle: React.FC<PageTitleProps> = ({
  pageTitle,
  path,
}) => {
  return <PageTitleStyled path={path}>{pageTitle}</PageTitleStyled>
}

export default PageTitle

const PageTitleStyled = styled.h1`
  color: var(--smudgedblue);
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  align-self: ${(props: { path: string }) => (props.path ? "center" : "flex-start")};
  padding-bottom: 0.25rem;
  border-bottom: ${(props) => (props.path ? "16px solid var(--red)" : "8px solid var(--usedyellow)")};;

  @media (min-width: 40rem) {
    font-size: 1.75rem;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }
`
```

Note how are are typing that prop passed to the styled component. We have to type it just once, and after that TS knows what's up, and doesn't require typing for this particular property (path) anymore. 

Alright, that is it. We saw how to use plugins.
Next is the big one, the thing that makes Gatsby really cool - use of GraphQL to pull data into components. 

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
3. **Install Styled Components and its Gatsby plugin to style pages**
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
