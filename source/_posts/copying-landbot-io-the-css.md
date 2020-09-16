---
title: "Copying Landbot.io: The CSS"
date: 2020-08-23 07:19:24
tags:
  - landbot
  - css
categories: copy web
cover: frankie-cordoba-8veCmZCBltk-unsplash.jpg
creditArtist: Frankie Cordoba
creditSource: https://unsplash.com/@byfoul?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 4 of 4 in Copying Landbot.io

Stying my copy of [Landbot](https://landbot.io)'s home page was pretty simple. Aside from usual coloring and positioning, I mostly used Flexbox. There were few occasions where I got stuck and was not able to understand why something was done in original. However, the end product ended up looking pretty similar to its model.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 4: Write CSS

The biggest difference between the original and my CSS was the use of **float** property. In the original, **float** is used very often to position containers in a row or a grid, which I assume is a remnant of an old version of Bootstrap.
I didn't want to use **float** at all. I replaced it with Flexbox every time, and it worked well for me.

Let's take a closer look at what was happening. Again, I won't go over everything, but will focus on specific places where I had to stray from usual styling process such as coloring or positioning. Reasons for this for either simplification, my preference for a different approach, or, simply, lack of skills.

I divided the overview into five parts:

1. Page
2. Header
3. Main content
4. Footer
5. Interesting and problematic parts

### Page

This one is quick just to point out two things:

1. Fonts
2. Footer at the bottom of the page

#### Fonts

As already mentioned, Landbot's home page uses four fonts, two of which (Gotham Rounded and AvenirIt) are paid for, I guess. These are loaded into a user's brower via **@fontface** rules in the [homepage CSS stylesheet](https://assets.website-files.com/5e1c4fb5db4d5243c0021d34/css/landbotio.9dec42870.css).

Here is just an example for one of the faces of Gotham Rounded:

```CSS Gotham Rounded Typefaces are loaded via @typeface property
@font-face {
  font-family: 'Gotham Rounded';
  src: url('https://assets.website-files.com/5e1c4fb5db4d5243c0021d34/5e1c4fb5db4d525a8a021d52_GothamRnd-Book.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
}
```

Fonts that I used were all fetched from Google Fonts, using a single **@import** rule.

```css
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Nunito:wght@300;600;900&family=Poppins:wght@300;500;600;700&family=Nunito+Sans:wght@300;600;700&display=swap");
```

I find this approach more convenient usually, as I have all of my fonts with their weights loaded in the same place.
However, I can see how big projects benefit in terms of readability, as well as source and options management, by using the **@font-face** approach.

#### Footer at the bottom of the page

With the current style setup, the original home page does not make its footer always stick to the bottom of the page. I tried removing few sections from the original's body, and the footer moved up the page, to stay with the content.

I wanted to avoid this, so I made my copy's **body** element a Flexbox. I also had to make both **body** and its parent, **html**, have 100% height, in order to take up all the space possible.
Then I just made the **footer** always stick down by making its top margin taking all available space.

Here is the selection from my stylesheet:

```css Making footer stick to the bottom in my copy of Landbot's home page
/* ... */
body,
html {
  height: 100%;
}
/* ... */
body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: hidden;
}

.main-footer {
  margin-top: auto;
}
```

### Header

I want to go over two things related to the header:

1. Position and dimensions of the header itself
2. Dimensions and outline of the the navigation container
3. Position of navigation links

#### Position and dimensions of the header itself

The original made the header have siede paddings or 3%, and then hold the width of 100%, making its actual width flexible. This is what I did as well, as it seemed a simple way to always have a reliable width of the header.
The header is also a fixed one, laid on top of everything and stuck to the top of the page as we scroll.
Finally, the original home page has it with the height of 90 pixels. I couldn't set the height directly on the header, as that would pull its contents to the top margin, and I would have to make more adjustments to fix that. So I set minimum height on the child element of header, **.main-navigation**.

Here is the relevant seelction from the stylesheet:

```css Setting position and dimensions of the header
.main-header {
  padding: 0 3%;
  background-color: #fff;
  position: fixed;
  width: 100%;
  /* ... */
}

.main-header__main-navigation {
  /* ... */
  min-height: 90px;
}
```

#### Dimensions and outline of the the navigation container

Navigation container, the already mentioned **.main-navigation**, has its margins varying, depending on the size of the header. Its width, however, cannot exceed 1300px.
It is also a Flexbox container, and it positions its content verticaly cetered, and stuck to its edges.
Note that we do defined the actual **width** property to be 100%. This is in order for it to take those 1300px whenever possible, and not to adjust width to its contents.

```css Adjusting navigation container
.main-header__main-navigation {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1300px;
  min-height: 90px;
  width: 100%;
}
```

#### Position of navigation links

I had issues with links in the navigation section, that I couldn't solve completely. We are talking about the **.navigation-right** container in the original, and the **.header-links-wrapper\_\_header-options** in my copy.
Specifically, I couldn't get all the navigation labels to be in the same position.

In the original, **.navigation-right** is a flex container with width of 50%. It has first three navigation labels as individual elements, and two login links set in one container. The login container has the left margin be 30px and right of 0, while other labels, or their descendants, have side margins set to auto. There are few other padding rules for all elements in the right navigation, too.

Since I had all label elements be direct descendants of the right navigation, I set side margins to all of them, except the last two - login and sign up. I set the login label to have 30px for the left margin, but label positions were always a bit off. So I did what I could to get them as close as possible, and left it that way.

```css My solution for styling right navitaion in the header
.header-links-wrapper__header-options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-links__header-option {
  margin: 0 auto;
  padding: 20px;
  cursor: pointer;
  white-space: nowrap;
}

.header-links__header-option > * {
  color: var(--blandDarkBlueText);
  font-size: 15px;
}

.header-links__header-option.login-option {
  margin: 0 0 0 40px;
}

.header-links__header-option.register-option {
  margin: 0;
  padding: 0;
}
```

### Main content

Since main content is pretty big, we will go over few selected things that stuck with me. Generally, the style is pretty repetitive anyway.

Here is our checklist:

1. Width and margins of the **main** container
2. Canvas in the hero section
3. Clients logos container
4. Width of the Capterra stripe

#### Width and margins of the main container

As mentioned previously, the original's **body** element does not have a container for main content of the page. Instead, it leaves each section to take care of its own margins and width.
I didn't want to do that, so I placed all main content inside a **main** element.

As the page header is a **fixed** element laying on top of everything else, **main** was initially pushed up to touch top of the page.
Original style has its top padding set to 100 pixels, in order to move it below the header. I had margin set to 90px, to make it easier to do math relative to header for other elemenets in the **main** element.
I also set its side margins to auto, and its **max-width** to 940 pixels, to provide a consistent container for all elements inside

```css Width and margins of the <main> container
.main-content {
  margin: 90px auto 0 auto;
  max-width: 940px;
}
```

#### Canvas in the hero section

Canvas in the hero section is that blue box with three boxes pushing out of it.

We want to see how those boxes are positioned, and how those green lines are placed to connect them.

In the original, **float** is used to position the boxes. Again, I don't want to use that, so I went with Flexbox again.
I made the canvas a Flexbox container, and had it wrap its elements into another row when their total width exceeds the container width. I also had to set the last element in the container to have the left margin set to auto. This way, it gets pushed all the way to the end of the row, which is what the original has.

```css Using Flexbox instead of floats to position elements in canvas
.visual-description__canvas {
  /* ... */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
}
/* ... */
.google-sheets-container {
  /* ... */
  margin-left: auto;
  width: 178px;
}
```

As for the green lines, the pipes, they are just .png images. In the original, they were placed directly inside an element from which they come out.
For instance, the horizontal line is an **img** element placed in the pink demo button saying **"Complete Order"**. I did the same, but added a container to hold each image, as I usually do.

The key here is to have this image (or the image container in my case) be an absolutely positioned element, placed inside an alement that is not statically positioned. This way the image is out of the container's element flow, and can move about relative to the container, while other elements in the container can take up the image's place as if it was never there.
I also had to make the starting box (Stripe payment in this case) have a higher z-index than the pipe, so it covers any extra part of the line going into it.

Here are my CSS rules (almost the same as in the origianl) for the vertical green pipe:

```css Positioning of green lines in the canvas container
.canvas__service-container {
  position: relative;
  /* ... */
}
/* ... */
.stripe-payment-container {
  /* ... */
  z-index: 3;
}
/* ... */
.google-sheets-container__pipe-ver-container {
  position: absolute;
  width: 178px;
  bottom: 8px;
  left: 45px;
}
```

#### Clients logos container

The original has the clients containers set as a grid. Since there is always only one row of logos, I set the container as Flexbox.

```css Clients logos container set as a Flexbox instead of grid
.clients-section__clients-logos {
  width: 100%;
  display: flex;
  justify-content: space-between;
  /* ... */
}
```

Another thing that caught my eye here was that the original had each grid item (which is also a logo container) hold a width of 1fr, and padding of 30px. 1fr for each grid item equals to 175px, and finally comes down to 115px for each image when paddings are reduced.

On my side, I had my Flexbox hold image containers. I wanted my images to be 115px wide, so that is what I set as **width** for image containers, in addition to a background color. The problem now was that the image containers were actuall 115px wide, and images were actually 55px wide, after paddings were deducted.

To fix that, I had to adjust **box-sizing** for this particular element. Initially, I set this property to be **border-box** for all elements on the page. This caused both content and padding to be calculated into a the element's specified width. In this case, however, needed padding to be removed from this calculation, so that only image width goes into that 115px widht.
So I changed the rule to **content-box** for the container.

```css Client image container box-sizing changed to "content-box"
.clients__logos-logo-container {
  max-width: 115px;
  padding: 30px;
  box-sizing: content-box;
  /* ... */
}
```

#### Width of the Capterra stripe

This one is quick. Since the **main** container is centered in the middle of the page, not allowing its contents to ever touch the page edges, I had a problem to span that yellow strap accross the entire page.

Luckily, I saw how Landbot home page uses negative margins throughout the page, and I used it here.
I gave the stripe negative side margins of -1999px, and the problem was solved.

```css Negative margins on Capterra stripe
.main-section__capterra-stripe-outer {
  background-color: #fccc46f2;
  margin: 0 -1999px;
  /* ... */
}
```

### Footer

Nothing really here. It is pretty much a routine stuff.

That's it. It's over. I think the copied page looks quite decent, and I hope that the Landbot team won't mind me putting my copy online. They probably won't even see it. 

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
3. Write HTML
4. **Write CSS**

### Tech and Tools

1. Figma
2. HTML
3. CSS

### Experience with Tech & Tools

I can work with HTML and CSS, to a fine degree, I think. I can also do stuff in Figma. I did lot of things with these three tools combined.
The issue is actually getting it all together to make a nice looking website.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
