---
title: 'Copying Landbot.io: The Framework'
tags: 
- landbot
- html
- css
- figma
- design
categories: copy web
cover: natalya-letunova-FYr3roIu51g-unsplash.jpg

creditArtist: Natalya Letunova
creditSource: https://unsplash.com/@naletu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 1 of 4 in Copying Landbot.io

I wanted to start a little ongoing project to copy website design. Ideally, I would like to find a nice website, and then copy it to make it simpler in terms of HTML and CSS. Because that is what I am about, simple :).

<!--more-->

#### See [Project Information](#Project-Information)

I would also like to change tech when copying. For instance, this first project was styled using Bootstrap, and I copied it by using pure CSS. I hope to do a next one by converting pure CSS to a CSS framework, then use Sass, a different framework, and so on.

Why did I do it? Well, I feel I am struggling with page design. I did some courses, and read some books, but the shapes, and placements, and colors, and layout, it all escapes me. That's why. 

This first project was me copying the [Landbot](https://landbot.io/)'s home page. Landbot provides a way to implement a chatbot into a website. So much for that. 

Few things to mention:

1. I only copied one size of the website, the desktop one. 
2. I did not do any animations, any hovers, nor any interactivity.
3. The website changed a bit during the period I worked on the copy (4 days).
4. I tried to make the thing as simple as possible, in all phases. 
5. I am not sure if it is legal in any country to copy a website and then put that copy online. I am counting on Landbot team to understand that this is for learning purposes. 

We will start with the framework of the website.

## Step 1: Draw framework in Figma

I wanted to do framework to see how the elements on the page are actually laid out. It took some time to place all major elements where they belong, but it worked out well.
Note that the framework does not represent the actual HTML elements. It is merely showing the most prominient elements on the page. 

Here is the full framework:
{% asset_img full-framework framework-full.jpg 200 200 '"Full Landbot framework" "Full Landbot framework' %}

Generally, the page is centered in the middle, with a lot of white space. 
Two patterns dominate the main content area: 

- Section with two side-by-side boxes
- Section with stacked boxes

More specifically, the page is split into four sections:

1. Header
2. Main content
3. Some sort of fake footer area
4. Footer

### Header
   
Header is pretty simple. As far as the framework is concerned, it is just a container holding two side by side boxes. 
The right box holds the navigation, while the much smaller one on the left is the logo.

### Main content

Main content in nicely aligned in the middle. 

The first, hero section, has that general side-by-side pattern. It also has some boxes scattered all over the right one. I wasn't really sure how to approach that. 

Othe content in this section is pretty simple. Lot of it actually repeats, by either switching sides of images and text in the side-by-side pattern, or by replacing a row of images with a text box in the stacked pattern.

3. Fake footer area

Fake footer area is a stripe that spans entire length of the page, and then has an additional boxes under it. 
I actually messed up this part when writing HTML. I wrapped both second and third section into the **&lt;main\>** element, and then centered the **&lt;main\>** and set its width smaller than the page. Luckily, I learned a trick from HTML in the orignal page, and got away with it. We will see it later. 

4. Footer

It is just a regular footer, with bunch of links. 
The only thing remotely interesting is that the links box on the far end does not extend all the way to the end of the content container.

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at 

- [Github](https://github.com/ikaem/angry-chaired-blog) 
- [Live project](https://ikaem.github.io/angry-chaired-blog/)

### Goals

1. Just copy the website

### Steps

1. **Draw framework in Figma**
2. Draw design in Figma
3. Write HTML
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



