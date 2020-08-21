---
title: 'Gatsby Web: Gatsby & React Components'
date: 2020-08-16 22:08:44
tags:
- gatsby
- react
categories: gatsby web
cover: sam-barber-x4Jk1vRLKRA-unsplash.jpg

creditArtist: Sam Barber
creditSource: https://unsplash.com/@milltownphotography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 2 of 10 in Gatsby Web

Now when we have our basic pages, let's add some structure to our website.
Since all websites have header and footer, it would probably be good that our site has those as well.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 2. Create layout and its elements and other components

I wanted each page to have the same general look, consisting of:

- Header
- Information bar
- Footer
- Welcome bar exclusive to Home Page

We will put all those elements inside a **layout** component. We will then import that layout into each page component, and then pass page contents to the Layout component as children.

Here is a a rough sketch of this applied to Home and About pages:

```
    // Header --> Layout element
    // Welcome -- > Layout element
    // Information Bar --> Layout element

        // Home - Home Page Component

    // Footer --> Layout element
```

```
    // Header --> Layout element
    // Information Bar --> Layout element

        // About - About Page Component

    // Footer --> Layout element
```

This is a common practice in React projects as well.
One drawback I found, in case of React, is that it causes each page to render new header, for instance. In the last blog series this caused problems with updating state of unmounted components when navigating away from pages.

In addition to the layout components, we will also create few other ones that our app needs:

- A mapper component to map over list of projects
- An item component to show brief info about each project on the Home page
- A page title component

Alright, enough of that. Let's see what we do:

1. Create Layout component
2. Create Header
3. Create Welcome
4. Create information bar and Footer components
5. Create rest of the components

### Create Layout component

Layout is just a wrapper component that renders its children. We will add Header and Co. to it later, when we make those, but for now we will keep it simple.

We create **components** folder inside the **src** folder, and put **layout.component.tsx** file inside it. We also type its props, which is **children**, that it receives from its parent components.
We pass the types definition as concrete types to the **React.FC** generic function - the React functional component.

```js
// src/components/layout.component.tsx
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      Layout component
      {children}
    </div>
  );
};
```

Ok, we do usual stuff now. Import this component in each page, and have it wrap page content.
Here is the **Home Page** case, with that **Link** component removed from it:

```js
// src/pages/index.tsx
import React from "react";
import Layout from "../components/layout.component";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <h1>Home Page</h1>
    </Layout>
  );
};
```

Try and visit the pages now. All of them should have the **Layout component** text at the top. Is good.

### Create Header

We will now create the **Header** component, and place it inside the **Layout**. This should get the same header to all of our pages.

Inside the header, we place a simple logo, and mobile and desktop navigations, and a button and logic to toggle the mobile navigation on and off.
The code is shortened for the sake of space and focus. Full final code is available on Github, via link at the top of the post.

```js
// src/components/header.component.tsx
import React, { useState } from "react";
import { Link } from "gatsby";

const Header: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState < boolean > false;

  return (
    <header className="main-header">
      <div className="main-header__logo-container">
        <Link to="/">
          <h1 className="logo-container__logo-header-actual">Angry Chaired</h1>
        </Link>
        ...
      </div>
      <nav className="main-header__navigation-desktop">
        <ul className="navigation-desktop__links">
          <li className="desktop__links-link-wrapper">
            <a target="_blank" href="https://angrychaired.wordpress.com">
              Blog
            </a>
          </li>
          ...
        </ul>
      </nav>
      <div
        className="main-header__mobile-nav-toggle"
        onClick={() => setIsMobileNavOpen((prevState) => !prevState)}
      >
        ...
      </div>
      <nav className="main-header__navigation-mobile">
        <ul className="navigation-mobile__links">...</ul>
        <button
          className="navigation-mobile__btn-close"
          onClick={() => setIsMobileNavOpen((prevState) => !prevState)}
        >
          <span className="btn-close__label">X</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
```

Then we just import and render **Header** in the **Layout** component.

```js
// src/components/layout.component.tsx
import React from "react";

import Header from "./header.component";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      Layout component
      {children}
    </div>
  );
};
```

All of our pages should now have a header. Admittedly, it is an ugly header, but we will make it nicer soon enough.

### Create Welcome

Welcome is a component that will be shown only on the Home page.
I considered putting it directly there. However, I wanted all of my page components' structure to be same, and **Welcome** component would push **Home** outside of that shape.

Anyway, here is the component:

```js
// src/components/welcome.component.tsx
import React from "react";

const Welcome: React.FC = () => {
  return (
    <div className="welcome">
      <div className="welcome__crooked-welcome-container">
        <div className="crooked-welcome-container__lead">
          <h2 className="lead__greeting lead-item">Welcome to Angry Chaired</h2>
          <p className="lead__description lead-item">
            A personal portfolio of Web Dev things learned, to be learned, and
            in the process of learning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
```

Now, we need to place it in the **Layout** component.

```js
// src/components/layout.component.tsx
...
import Welcome from "./welcome.component"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <Welcome />
      {children}
    </div>
  );
};
...
```

With this approach, however, the component will always be rendered, no matter the page we are on. We don't want that.

We have to render it conditionally, but how to do that?
Well, we only want to render it in case the url is exactly **"ourwebsiteeaddress/"**. With this path - the **"/"**, **Home Page** is rendered in the browser.
Now we just have to find a way how to check if we are on this route.

I found several sources on how to check current route with Gatsby. One of them was [this article on CSS-Tricks](https://css-tricks.com/how-to-the-get-current-page-url-in-gatsby/) that presents several options and explains difference between getting the domain name during build time and runtime. It is an interesting piece that offers several ways to deal with this.

However, there is also an easy way to get the current route.
Each page component in our app has access to a prop called **location** that is automatically passed to it.
This prop looks like this:

```js
Object;
    hash: "";
    host: "localhost:8000";
    hostname: "localhost";
    href: "http://localhost:8000/";
    key: "initial";
    origin: "http://localhost:8000";
    pathname: "/";
    port: "8000";
    protocol: "http:";
    search: "";
    state: null;
```

As you can see, we can get search queries, hostname, port and more information.
We need the **pathname** property.

So let's get the location prop in the **Home** page, and pass its **pathname** property to the layout.
We can then conditionally render the **Welcome** component, depending on the value of the **pathname** prop in the **Layout** component.

Here is the **Home** page, together with its props interface and **pathname** passed to the **Layout** component.

```js
// src/pages/index.tsx
import React from "react";
import Layout from "../components/layout.component";

interface HomePageProps {
  location: {
    pathname: string,
  };
}

const HomePage: React.FC<HomePageProps> = ({ location }) => {
  const { pathname } = location;

  return (
    <Layout path={pathname}>
      <h1>Home Page</h1>
    </Layout>
  );
};
```

Now, we have to make sure that **Layout** component can actually accept the **path** prop.
Let's define and interface with the type for the **path** and **children** props, accept the **path** prop, and use it to conditionally render the **Welcome** component.

Note that we are defining the **path** prop as optional. This way, we don't need to pass it from other components, which will make it **undefined**, and the **Welcome** component will not render.

```js
// src/components/layout.component.tsx
import React from "react"

import Header from "./header.component"
import Welcome from "./welcome.component"

interface LayoutProps {
  children: React.ReactNode
  path?: string
}

const Layout: React.FC<LayoutProps> = ({ children, path }) => {


  return (
    <div className="layout">
      <Header />
      {path === "/" && <Welcome />}
      {children}
    </div>
  )
}

export default Layout
```

### Create information bar and Footer components

Information bar seems a bit vague, I know. It is a place where I imagine two links pointing to a page with the project that I am currently working on, and to the newest blog post.
So lets call this component **Currently**.

It is a simple component:

```js
// src/components/currently.component.tsx

import React from "react";

const Currently: React.FC = () => {
  return (
    <div className="currently">
      <div className="currently__new-blog-post">
        <span className="currently___key">New Blog Post:</span>
        <span className="currently___value">
          Create New Gatsby Project with TypeScript
        </span>
      </div>
      <div className="currently__current-project">
        <span className="currently___key">Current Project:</span>
        <span className="currently___value">Gatsby Portfolio</span>
      </div>
    </div>
  );
};

export default Currently;
```

Here is the **Footer** component, also very simple:

```js
// src/components/footer.component.tsx
import React from "react";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="main-footer__logo-container">
        <h1 className="logo-container__logo-footer-actual">Angry Chaired</h1>
        ...
      </div>
      <ul className="main-footer__social-links">
        <li className="social-links__link">
          <a href="#">Facebook</a>
        </li>
        ...
      </ul>
    </footer>
  );
};
export default Footer;
```

Finally, we can put both in the Layout:

```js
// src/components/layout.component.tsx
...
import Currently from "./currently.component"
import Footer from "./footer.component"
...
const Layout: React.FC<LayoutProps> = ({ children, path }) => {

  return (
    <div className="layout">
      <Header />
      {path === "/" && <Welcome />}
      {children}
      <Currently />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
```

### Create rest of the components

We keep this part simple as well.

The mapper component that we create sits in the **Home** page component. It will eventually accept a list of projects from the **Home** page, and render another component for each project in the list. This component, **LearnItem**, will then render brief project information passed to it by the mapper.

We will start with the **LearnItem**, currently without props, unstyled, and rendering a hardcoded image, project title and project description:

```js
// src/components/learn-item.tsx
import React from "react";

const LearnItem: React.FC = () => {
  return (
    <li className="learn-item">
      <div className="learn-item__image-container">
        <img src="https://source.unsplash.com/350x350/?nature" alt="" />
      </div>
      <div className="learn-item__learn-points">
        <h3 className="learn-points__title">Lorem ipsum dolor</h3>
        <p className="learn-points__other">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti aut
          dolorem exercitationem suscipit, ipsam, eos ipsum officiis alias ea
          nihil optio. Id soluta qui incidunt numquam tenetur dolores temporibus
          exercitationem.
        </p>
      </div>
    </li>
  );
};

export default LearnItem;
```

The mapper component imports and renders a **LearnItem** component for each item in its projects list. At the moment it is only mapping over a simple array.
Since the mapper is focused only on logic, I placed it in the **containers** folder, and see it as a **container component**.

```js
// src/containers/i-learn-mapper.container.tsx
import React from "react";

import LearnItem from "../components/learn-item.component";

const ILearnMapper: React.FC = () => {
  return (
    <ul className="i-learn-mapper">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <LearnItem key={index} />
      ))}
    </ul>
  );
};

export default ILearnMapper;
```

Let's now make that page title component, too. We will use it to render page title for each page. I choose to do it this way to have uniform style of titles on all pages.
We will have it accept a title prop here, as well, but we won't style it yet.

I have put it in folder called **elements**. I don't know if this is a common thing to do, but as this component is very simple, and is basically just a simple element, it makes sense not to actually consider it a full-blown component in terms of the role it plays in the app.

```js
// src/elements/page-title.element.tsx

import React from "react";

interface PageTitleProps {
  pageTitle: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ pageTitle }) => {
  return <h1>{pageTitle}</h1>;
};

export default PageTitle;
```

That's it. Now we just have to import and render all of these components. We will use **Home**
page as an example again, as it holds both the **ILearnMapper** and **PageTitle** component, while other pages will only have the latter one.

```js
// src/pages/index.tsx
import React from "react";

import ILearnMapper from "../containers/i-learn-mapper.container"
import PageTitle from "../elements/page-title.element"
...

const HomePage: React.FC<HomePageProps> = ({ location }) => {
  ...

  return (
    <Layout path={pathname}>
      <main className="home-page">
        <section className="home-page__i-learn">
          <PageTitle pageTitle={"I learn:"} />
          <ILearnMapper />
        </section>
      </main>
    </Layout>
  );
};
```

Lovely. The home page should look very ugly now, unstyled, and with bunch of Lorem Ipsum text. Good thing it is not the [Ipsun Bacon one](https://baconipsum.com/)... :)

Ok, this marks the end of mostly React and HTML part. Starting with the next post, we go more into Gatsby stuff, installing plugins, and then working with GraphQL and data. See you there.

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
2. **Create layout and its elements, and other components**
3. Install Styled Components and its Gatsby plugin to style pages
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
