---
title: 'Copying Landbot.io: The Design'
date: 2020-08-21 21:41:51
tags:
  - landbot
  - figma
  - design
categories: copy web
cover: spencer-davis-v26urzoDLk4-unsplash.jpg
creditArtist: Spencer Davis
creditSource: https://unsplash.com/@spencerdavis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 2 of 4 in Copying Landbot.io

Style of the [Landbot.io](https://landbot.io) home page is fun. There are happy colors, shapes curving and moving about, and there is a grey Ryan Reynolds. 

I used Figma to copy all of those things and get a static version of the page that I could say I built. By drawing it, I could see how lot of the page is actually made out of few things, copied, modified and assembled into new things. 

<!--more-->

#### See [Project Information](#Project-Information)


## Step 2: Draw design in Figma

Landbot's home page is also very airy. Together with alternation of few colors, white space is the most prominent thing we see on the page.

You can see my copy of the full Landbot's home page at the [end](#Full-design-image) of the post.

Ok, so here is what we will look at:

1. Colors
2. White space
3. Fonts 
4. Shapes
5. Patterns
6. Graphics

### Colors

Blue, pink and yellow and their variations seem to be the most used in the page. 

Blue is used as a kind of grounded color, creating a stable context for both text content and visuals. 
Calls to action and interesting bits are often pink, and often on that blue background, too. 

In the header and hero section, these two colors alone give us the whole page. 
The logo is blue, the chatbot scheme is blue, and the information about the service is blue. 
If we want to interact with the service, we go pink. Pink is also the surrounding color of the selected clients's logos. 

Two colors only. I think it is beautiful

{% asset_img design-colors-pink-blue.jpg '"Pink and blue colors in header and hero section" "Pink and blue colors in header and hero section"' %}

As for the yellow color, it always gives a golden impression, and is used in context of customers. I guess customers are as valuable as gold, huh?

{% asset_img design-colors-yellow.jpg '"Yellow color in the context of work with customers" "Yellow color in the context of work with customers"'%}

### White space

Just for the record, I am not graphic designer. 
But, that Landbot home page sure is airy. 

First, sections are clearly distinguishable by just having a decent amount of empty space between them. 

Second, I really liked how the hero section visuals are using empty space to illustrate the mechanism of chatbot providing a service and making money. 
Boxes on the blue canvas are spread to give a clearing impression that a process exists here. It is an understandable process that goes from completing order to data being entered in a sheet, to payment processing.

{% asset_img design-whitespace-hero.jpg '"White space in the hero section" "White space in the hero section"'%}

This is how the hero section would look like if there was no white space between the boxes:

{% asset_img design-whitespace-no-whitespace-hero.jpg '"White space in the hero section - case with no white space" "White space in the hero section - case with no white space"' %}

I also have a feeling that white space compensates for the use of all those colors and shapes. If the page wasn't so much fun, there wouldn't be a need for so much white space, and the other way around. 

### Fonts 

The page uses four fonts. 

1. Gotham Rounded
2. Poppins
3. Lato
4. Avenir

Two of these, [Poppins](https://fonts.google.com/specimen/Poppins) and [Lato](https://fonts.google.com/specimen/Lato), are Google Fonts.

Gotham Rounded is the most prominent font. It is used in almost all titles and paragraphs. 
I though the font fit well with the page. It is rounded, so it matched rounded borders of boxes and curvy shapes on the background.

It is a paid one, though, so I used a Google Font replacement instead: [Nunito](https://fonts.google.com/specimen/Nunito?category=Sans+Serif&thickness=6&preview.text=The+Most+Intuitive&preview.text_type=custom&query=nunit). 

AvenirIt is another paid one, and I replaced it with [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans?query=nunito+sans&preview.text=lato&preview.text_type=custom&sidebar.open=true). 

AvenirIt and Poppins are used in the footer and header, respectively, and Lato is used only in paragraphs to describe two of the Landbot's features.

{% asset_img design-fonts-lato.jpg '"The Lato font is used only in two paragraphs" "The Lato font is used only in two paragraphs"' %}

Frankly, I thought four fonts was a bit too many. I did seem to notice that font use changed while I was working on the project, so maybe they are changing this.

Font sizes seemed all over the place, too. I am not sure how font sizes are decided on in big projects, however.
Here, I counted 15 different font sizes, ranging from 14 pixels to 50px. Also, there were almost no sizes which could be reduced to 16, which I usually find it easier to work with. Instead, sizes were 14px, 16.67px, 17px, 32.6px and so on.

That was another thing - font sizes were always defined in pixels, while I was used to work with **rem** units.

### Shapes

When it comes to shapes, everything is rounded. Most prominent were large curvy shapes on the bacgkround. They gave a bit of an impression that the page was actually lifted a bit above the background. 

As I mentioned before, the main font is rounded, too, as well as the content boxes and backgrounds behind titles. 

{% asset_img design-shapes-rounded.jpg '"Rounded shapes on Landbot home page" "Rounded shapes on Landbot home page"' %}

It's a pretty soft, cushiony design. It was kind of a heureka thing for me, because I usually go with straight lines. They are a default solution when creating boxes, and I am kind of afraid to stray await from it, so as not to ruin the looks.

### Patterns

When I say patterns, I am referring to two things that repeat a lot on the page. By repeating, they create a kind of rhytm and reliability. I thing this technique will help me a lot in future.

First one is just swapping sides between image and text blocks when the two are arranged side by side. I already mentioned this in the previous post, but here we can see it in its full effect.

{% asset_img design-patterns-image-text.jpg '"Swapping image and text positons in the side-by-side boxes arrangement" "Swapping image and text positons in the side-by-side boxes arrangement"'%}

The other pattern is also visible in the image above. It is the use of a colored background in a part of title. This establishes what Landbot is about, without the need to read. It also creates an interesting experience when scrolling down the page, because we get a fun color in the middle of a dark and grounded title. 

### Graphics

As for the graphichs, I just wanted to list some of the visuals that I think really enhance the page.

The colorful splotchy background is a large .svg file. It is not tiled, but is in fact large enough to cover the whole page. I guess it would tile if the viewport was big enough.
It really helps to bring things to life.
Here is the page with the background removed:

{% asset_img design-graphics-no-background.jpg '"Landbot home page with no fun background" "Landbot home page with no fun background"' %}

Next two are the green "pipes" that connect boxes in the hero section. These are just regular .png images, but their positioning really makes a point.  

{% asset_img design-graphics-pipes.jpg '"Pipes visuals illustrating relationshipo between hero section elements" "Pipes visuals illustrating relationshipo between hero section elements"' %}

Then we have an actual .mp4 video of an Iphone receiving WhatsApp, Slack, Mailchimp and other notifications related to a Landbot campaign. It is a neat way to show the service in action.

{% asset_img design-graphics-iphone.jpg '"Landbot notifications in action on Iphone" "Landbot notifications in action on Iphone"' %}

There are more visuals on the page, like the one showing WhatApp integration, or illustrating customer satisfaction on Capterra. The point is that all of them bring something to the home page. They either show how the service works, or they give a little bit more life to site to make it more interesting to the user. 

Ok, we briefly went over design elements in this post. I am in no way a graphic designer, but I did want to see if I could break down the design into parts, to make it easier to understand. 

In the next post we will quickly go over both the original and my HTML. We will see how the Landbot team structured their code, and then we will see what did I do to simplify it on my end.
See you soon.



#### Full design image

{% asset_img design-full.jpg '"My copy of the full Landbot home page" "My copy of the full Landbot home page"' %}

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at

- [Live project](http://kaem.freecluster.eu/web-copy-projects/landbot.io/)

### Goals

1. Just copy the website

### Steps

1. Draw framework in Figma
2. **Draw design in Figma**
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




