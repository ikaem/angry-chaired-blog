---
title: "Copying Landbot.io: The HTML"
date: 2020-08-22 14:01:54
tags:
  - landbot
  - html
categories: copy web
cover: ilya-mirnyy-fae9zsLMdw4-unsplash.jpg
creditArtist: Ilya Mirnyy
creditSource: https://unsplash.com/@mirnyy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 3 of 4 in Copying Landbot.io

HTML of the [Landbot](https://landbot.io)'s home page is filled with **&lt;div>** elements. I assume this is becuase they use [Bootstrap](https://getbootstrap.com/), which usually has lot of nested **div**s to position and assign roles to specific parts of HTML.
In any case, there is not much semantic HTML, the only one being **&lt;nav>** to indicate navigation in the header area.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 3: Write HTML

I wanted to write HTML that is more semantic, and that does not have as much nesting if not necessary. Of course, I am sure that the Landbot team had very good reasons for how they wrote their code. I just wanted to simplify it for myself.

Here is what we will look at:

1. Header
2. Main content
3. Footer
4. Interesting HTML code

We will not go into complete code. There is just too much of it. Instead, I will pick parts that are most representative of their sections and focus on that.
The "interesting code" part is mosly to show some things that I learned, or just generally found curious.

### Header

The original header is a **div** element with the class of **navigation-wrap**. Inside, there are two other **div**s, one for the desktop, and other for the mobile view of the page. We will focus on the desktop.
The desktop **div** has a class of **navigation w-nav**, and holds another **div**, the **.navigation-container**. Finally, this one holds two divs to separate left and right navigation. They are **.navigation-left** and **.navigation-right**, respecitively.

```html HTML: Header code down to left and right navigation divs
<div class="navigation-wrap">
  <!-- desktop navigation starts here -->
  <div class="navigation w-nav">
    <div class="navigation-container">
      <div class="navigation-left">
        <!-- ... -->
      </div>
      <div class="navigation-right">
        <!-- ... -->
      </div>
    </div>
  </div>
  <!-- desktop navigation ends here -->
  <!-- mobile navigation starts here -->
  <div class="navigation-mob-2 w-nav">
    <!-- ... -->
  </div>
  <!-- mobile navigation ends here -->
</div>
```

The left navigation **div** holds an **anchor** element as a link to the home page. It also holds an **image** element, which is the Landbot's logo.

```html HTML: Left navigation in the header
<div class="navigation-left">
  <a class="w-inline-block w--current">
    <img class="image-34" />
  </a>
  <!-- ... -->
</div>
```

The right navigtion gets a bit more convulted again. It holds two **div**s, an **anchor**, and a **nav** element. They contain navigation labels, as well as dropdown menus, and one of the **div**s holds login buttons.
The dropdowns are filled with nested elements, too many for me to list them all here.

```html HTML: Right navigation in the header
<div class="navigation-right">
  <div class="dropdown-2 w-dropdown">
    <!-- Product label -->
  </div>

  <nav class="nav-menu w-nav-menu">
    <!-- Resources label -->
  </nav>

  <a class="header-button w-nav-link">Pricing</a>

  <div class="login-buttons">
    <a class="header-button w-nav-link">Login</a
    ><a class="button-menu-2 w-button">
      <span class="text-span-34">Sign up</span>
    </a>
  </div>
</div>
```

Note that I removed all attributes from elements except for classes, as well as unused html elements, in order to make them everything readable. Still, that is a lot of code, but again, not surprising considerig the use of Bootstrap. In addition to this, there was additional code present for mobile navigation.

Since I was using plain CSS and worked only on the desktop copy, I ended up with much less code. Also, I wanted to use as much semantic HTML as I was familiar with and the original code allowed.

My header consists of a within a **&lt;header>** element, which holds a **nav** element. The **nav** then holds **.header-logo-navigation** and **.header-links-wrapper** divs. These are equivalent to the **.navigation-left** and **.navigation-right** divs in the original code.

```html HTML: My code of header down to logo navigation and links wrapper
<header class="main-header">
  <nav class="main-header__main-navigation">
    <div class="main-navigation__header-logo-navigation">
      <a href="" class="header-logo-navigation__logo-container">
        <img
          src="./images//logo/5f0dbc6a9770687655a95a98_logotype_nosybol (1).png"
          alt="Landbot logo"
          class="logo-container__logo-actual"
        />
      </a>
    </div>
    <div class="main-navigation__header-links-wrapper">
      <ul class="header-links-wrapper__header-options">
        <li class="header-links__header-option">
          <span class="header-option__label">Product</span>
          <i class="fas fa-chevron-down"></i>
        </li>
        <li class="header-links__header-option">
          <span class="header-option__label">Resources</span>
          <i class="fas fa-chevron-down"></i>
        </li>
        <li class="header-links__header-option pricing-option">
          <a href="#" class="header-link__label">Pricing</a>
        </li>
        <li class="header-links__header-option login-option">
          <a href="#" class="header-link__label">Login</a>
        </li>
        <li class="header-links__header-option register-option">
          <a href="#">Sign up</a>
        </li>
      </ul>
    </div>
  </nav>
</header>
```

You can see above that my inner HTML in the **.header-links-wrapper** is completely included, unlike the original one where it would take a lot of space to do so. My labels and links are nested within unordered list items.
Again, I had a much easier job, not creating the actual dropdowns and having to use Bootstrap's predefined components which required lot of divs.

### Main content

I won't do an overview of complete HTML of the main content. The nesting patterns repeat here as well, and there is no semantic HTML at all.

```html Landbot home page <body> contents
<body class="body">
  <!-- header -->
  <div class="landing w-container"><!-- ... --></div>
  <div class="info-1"><!-- ... --></div>
  <div class="section-3"><!-- ... --></div>
  <div class="info-2"><!-- ... --></div>
  <div class="cat2 padding-top-l2 padding-bottom-l"><!-- ... --></div>
  <div class="info-3"><!-- ... --></div>
  <div class="info-4"><!-- ... --></div>
  <div class="cat2 footer-bg"><!-- ... --></div>
  <!-- footer -->
</body>
```

Instead, we will only focus on two things:

1. There is no single container for the entire main content on the page.
2. Section titles are sometimes just regular text blocks in a **div** or **p** element.

#### There is no single container for the entire main content on the page.

I am used to placing entire main content in the **main** element. The Landbot home page, however, has each section placed as a top level element inside the **body** tag.

This causes few things:

- Each section has to be styled individually to have same side margins and same width
- It also made possible for that yellow stripe, the **"fake footer"**, to extend to the full width of the page.

In addition to this, Bootstrap classes are just not helpful when it comes to recognizing roles of elements in HTML.

The first point is probably not much of an issue when using Bootstrap, as predefined classes are probably applied to section containers to line them all up.

The second point turned out to be a bit of an issue for me. I did actually place entire main content in a **main** element, including the **"fake footer"**. Since I styled the **main** to have a max width of 940px, and positioned it in the center of the page, I had a problem extending the fake footer to the page ends.
We will see how I fixed it in the next post.

Here is my code:

```html My version of the Landbot home page <body> contents
<body>
  <!-- header -->
  <main class="main-content">
    <div class="main-content__intro-section"><!-- ... --></div>
    <div class="main-content__clients-section"><!-- ... --></div>
    <div class="main-section__landbot-features-text"><!-- ... --></div>
    <div class="main-section__landbot-features-visual"><!-- ... --></div>
    <div class="main-section__landbot-benefits"><!-- ... --></div>
    <div class="main-section__flow-building"><!-- ... --></div>
    <div class="main-section__instant-messaging"><!-- ... --></div>
    <div class="main-section__conversations"><!-- ... --></div>
    <div class="main-section__capterra-stripe-outer"><!-- ... --></div>
    <div class="main-section__final-call"><!-- ... --></div>
  </main>
  <!-- footer -->
</body>
```

As you can see, all content sections are **div**s, nested inside a **main** element.
I did want to use **&lt;section>** elements to actually hold section contents, but this would require a heading element to be nested directly inside. It could be done, of course. However, some sections would require me to use CSS Grid to position elements, or do some acrobatic positioning with margins to get same looks as the original one.

#### Section titles are sometimes just regular text blocks in a **div** or **p** element.

This one is a more of a curiosity than anything else.
Consider these two examples where obvious section titles are nested inside a **div** and a **p** element.

```html Section titles in div and paragraph elements
<div class="node-header-text">👋<strong> &nbsp;Live Chat</strong></div>
<!--  -->
<p class="paragraph paragraph-dark home">
  <strong class="bold-text-11">Empowering +50,000 businesses</strong> create
  memorable experiences
</p>
```

First example is from the intro section. It is a title of that box that also holds a gif of Ryan Reynolds. It just struck me as unusual that a **div** was used where one of the **heading** elements seemed like a natural choice.

The other one is title of the section with client logos. Seeing that it actually says an important thing, in addition to being a title, a heading seemed a better fit here as well.

Now, these people know their stuff, and I am sure they know better than me. I am just wondering.
Also, would a heading element be better for SEO? The first one is wrapped in a **strong** tag, but Internet is not 100% on it working better for SEO.

I wrapped all cases of this in headings.

### Footer

There is nothing really special in the original's footer. It is a **div** container that spans entire width of the page, and holds another, smaller **div** container. Inside, logo and navigation sections are nested, and all pretty similar, apart from the logo section having a logo, and the last section having social media icons instead of links to actual Landbot pages.

```html Footer of Landbot's home page
<div class="section-5">
  <div class="columns-12 w-row">
    <div class="column-54 w-col w-col-2">
      <!-- logo section -->
      <img class="image-17" />
      <div class="text-block-10">
        Copyright © 2020<br />
        HELLO UMI S.L.
      </div>
    </div>

    <div class="w-col w-col-2">
      <!-- example of navigation section -->
      <div class="head">Product</div>
      <a class="link-13">Features</a><a class="link-2">Pricing</a
      ><a class="link-2">Features</a>
      <div class="head sechead">Company</div>
      <a class="link-2">Jobs</a><a class="link-2">Terms &amp;&nbsp;Conditions</a
      ><a class="link-12">About Landbot</a>
    </div>

    <div class="w-col w-col-2"><!-- navigation section --></div>
    <div class="w-col w-col-2"><!-- navigation section --></div>

    <div class="w-col w-col-3">
      <!-- social media section -->
      <div class="head">Follow us</div>
      <div class="div-block-44">
        <a class="link-block-12 w-inline-block"
          ><img class="image-18 fb-logo"
        /></a>
        <a class="link-block-12 w-inline-block"
          ><img class="image-18 tw-logo"
        /></a>
        <!-- ... more social media links -->
      </div>
    </div>
  </div>
</div>
```

Generally, my code is pretty similar. I too, have a container, the **footer** element, that spans entire width of the page, and holds another container, the **.inner-footer** div. Inner footer is the one holding navigation sections.

Few things are different, and they actually make my code bigger.
First, I like to wrap an image inside a **div** container. This allows me to control image dimensions and position via the container, which I find makes more sense. Next, my navigation sections are **nav** elements, and I have my links set in an unordered list. Finally, my social media **anchor** elements hold [Font Awesome icons](https://fontawesome.com/icons), unlike the original, where icons are actualy images.

```html My code for the footer of Landbot's home page
<footer class="main-footer">
  <div class="main-footer__inner-footer">
    <div class="inner-footer__logo">
      <!-- logo section -->
      <div class="logo__image-container">
        <img
          src="./images/5f15693db0e62c76a760db3f_logotype_negative (1)-p-500.png"
        />
      </div>
      <div class="copyright">
        Copyright © 2020
        <br />
        HELLO UMI S.L.
      </div>
    </div>

    <nav class="inner-footer__nav-section">
      <!-- example of navigation section -->
      <h5 class="nav-section__title">Product</h5>
      <ul class="nav-section__options">
        <li class="nav-section___option">
          <a href="#" class="nav-section____link">
            Pricing
          </a>
        </li>
        <li class="nav-section___option">
          <a href="#" class="nav-section____link">
            Features
          </a>
        </li>
      </ul>
      <h5 class="nav-section__title company-title">Company</h5>
      <ul class="nav-section__options">
        <li class="nav-section___option">
          <a href="#" class="nav-section____link">
            Jobs
          </a>
        </li>
        <li class="nav-section___option">
          <a href="#" class="nav-section____link">
            Terms & Conditions
          </a>
        </li>
      </ul>
    </nav>

    <nav class="inner-footer__nav-section"><!-- navigation section --></nav>
    <nav class="inner-footer__nav-section"><!-- navigation section --></nav>

    <nav class="inner-footer__nav-section follow-us-section">
      <!-- social media section -->
      <h5 class="nav-section__title">Follow us</h5>
      <ul class="nav-section__options">
        <li class="nav-section___option">
          <a href="#" class="nav-section____link">
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>
        <li class="nav-section___option">
          <a href="#" class="nav-section____link">
            <i class="fab fa-twitter"></i>
          </a>
        </li>
        <!-- ... more social media links -->
      </ul>
    </nav>
  </div>
</footer>
```

### Interesting HTML code

Here I just want to show iteresting HTML code I found in the Landbot's home page.

#### &lt;video> and &lt;source> elements

I honestly did not know about these. They are used in the main section, to hold a video illustrating how instant messaging can help building user journeys.

Here is the original code:

```html &lt;video> and &lt;source> elements in Landbot's home page
<video
  preload="auto"
  autoplay="autoplay"
  loop="loop"
  muted=""
  width="300"
  height="100%"
>
  <source
    src="https://landbot.io/wp-content/uploads/2020/08/landbot-conversational-multi-channel-solution.mp4"
    type="video/mp4"
  />
  Your browser does not support the video tag.
</video>
```

It turns out that the **video** tag is used to insert a video into a document. 
Aside from the attributes in the code snippet above, it can also have a **src** attribute too. Of course, it would be used to point to a video file. 

As the code shows, however, we have a **source** element instead, nested inside the **video** element, and used to point to a video file, and specify its type. 
**source** element can be used multiple times inside the same **video** element, pointing to different types of the video. Browser will then use and render the one whose type it supports. The element is used not only for video, but for all kinds of media files.

As for the attributes on the **video** element:
- preload defines if the video should be downloaded when the page loads. **auto** value sets it to download, yes.
- autoplay and autoplay will make video start as soon as it is downloaded. Removing the attribute will prevent this.
- loop attribute makes the video loop. If the attribute is not present, there is no looping. 
- muted makes the video muted when playing. If no attribute, no mute.  

<br>

#### .navigation w-nav div has a role of "banner"

The **role** attribute is one of [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) attributes used to make Web more accessible to people with disabilities. The attribute defines semantic meaning of elements on the page, so that, for instance, blind people can get this information from an electronic reader. Roles can be **button**, **article**, **img** and so on.

The **banner** role is used to represent informative content usually placed at the beginning of a page. Fun thing is that the **header** element has identical semantic meaning to the **banner** role. So the Landbot home page did use semantic HTML after all :)

#### "srcset" attribute

**img** element in the header of the Landbot's home page has a **srcset** attribute on it. Its value is a string, which seems to hold paths to various images. So what is that about?

First, the code:

```html &lt;img> element with **srcset** attribute
<img 
    src="https://assets.website-files.com/5e1c4fb5db4d5243c0021d34/5f0dbc6a9770687655a95a98_logotype_nosybol%20(1).png" 
    srcset="https://assets.website-files.com/5e1c4fb5db4d5243c0021d34/5f0dbc6a9770687655a95a98_logotype_nosybol%20(1)-p-500.png 500w, 
    https://assets.website-files.com/5e1c4fb5db4d5243c0021d34/5f0dbc6a9770687655a95a98_logotype_nosybol%20(1)-p-800.png 800w, 
    https://assets.website-files.com/5e1c4fb5db4d5243c0021d34/5f0dbc6a9770687655a95a98_logotype_nosybol%20(1).png 826w" 
    sizes="(max-width: 991px) 100vw, 120px" 
    alt="" 
    class="image-34"
>
```

Well, there are two parts to this:

1. srcset attribute
2. sizes attribute

The **srcset** attribute deines a set of image options that the browser can choose from when loading a page. 
These options include a path to the image and the inherent width of the image stated in **w** units. In our case, we have three options that the browser can choose from.

The **sizes** attribute defines condition when a certain image option should be chosen. 
Here, the condition states that when the screen is at most 991px, first image option same or bigger than 100vw should be chosen. Depending on the viewport size, the browser will chose an option from the selection.
If the width of the viewport is more that 991 pixels, first option that is same or bigger than 120 pixels will be chosen. 

#### &lt;br> line break

This is obvious, but it never crossed my mind to break a line with a &lt;br> tag. 

```html Breaking lines with &lt;br> tag 
<div class="text-block-10">Copyright © 2020<br>HELLO UMI S.L.</div>
```

Cool, that's it for the HTML part. We saw how, apparently, Bootstrap makes a lot of decisions for a web designer in terms of HTML code organization. We got rid of lot of their **div** containers, and tried to use as much semantic HTML as possible.

In the last post, we will go over styling. Again, there is a lot of it, so we will not go over all of it. Instead, we will focus on their solutions that I had issues with, and how I solved them.
See you soon.

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at

- [Live project](http://kaem.freecluster.eu/web-copy-projects/landbot.io/)

### Goals

1. Just copy the website

### Steps

1. Draw framework in Figma
2. Draw design in Figma
3. **Write HTML**
4. Write CSS

### Tech and Tools

1. Figma
2. HTML
3. CSS

### Experience with Tech & Tools

I can work with HTML and CSS, to a fine degree, I think. I can also do stuff in Figma. I did lot of things with these three tools combined.
The issue is actually getting it all together to make a nice looking website.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
