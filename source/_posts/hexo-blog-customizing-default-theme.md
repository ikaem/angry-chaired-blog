---
title: 'Hexo Blog: Customizing Default Theme'
date: 2020-08-17 09:18:45
tags: 
- hexo
- blog
categories: hexo blog
cover: chronis-yan-DXnothBK1UM-unsplash.jpg

creditArtist: Chronis Yan
creditSource: https://unsplash.com/@chronisyan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 5 of 8 in Hexo Blog

For me, the default theme that Hexo comes with, is both bad and good. It looks bad, plain and simple. But, to be honest, I don't find other available themes very beginner friendly, so I stuck with this one. The good thing is that it is very simple in terms of configuration and technology it uses, so we can fix some of it.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 5: Customize default theme

As Hexo themes come with their own **_config.yml** file, we will inspect the default theme's one. Different themes have different options in it, depending on the features they offer, and this is the place to configure those features.

Here is the list of what we do here:

1. _config.yml for themes
2. Add favicon
3. Add rss to the blog
4. Remove categories from home page
5. ***Add categories page***
6. Customize header
7. Fix pagination labels
8. Add post featured image
9. Add custom stylesheet

### _config.yml for themes

Ok, everyone already knows that themes come with their own **-config.yml** file.

I am not going over all of the options. I don't understand all of it, and changing some didn't have any visible effect on my blog.


In the first section, **Header**, we define what menu links we have in the header. 
We can define local links, but we can also specify external ones, as I did with the **Angry Chaired Web** and **Github profile**.
You can also see that there is a **rss** field in the header. We will work on this soon.

```yml
# Header
menu:
  Home: /
  Archives: /archives
  About: /about
  Angry Chaired web: https://angrychaired.surge.sh
  Github profile: https://github.com/ikaem/
rss: /atom.xml
˙˙
```

Second section defines only two things: 

1. Label at the end of excerpts on the home page. This one is set to **"read more"**
2. If we use Fancybox, a tool to display multimedia on websites. I don't know much about Fancybox, but we will touch it every briefly a bit later, so we leave it active.

```yml
# Content
excerpt_link: Read More
fancybox: true
```

The next section, **Sidebar**, is very simple. 
We leave all widgets active, and keep their container, **sidebar** on the right side of our pages.

```yml
# Sidebar
sidebar: right
widgets:
- category
- tag
- tagcloud
- archive
- recent_posts
```

We skip a couple of sections and come to the **Miscellaneous** section.
We won't touch anything here, as I don't want to setup Google Analytics or Social media profiles.

However, this is the place where we insert a favicon into our blog.
We will do in in the following section.

```yml
# Miscellaneous
google_analytics:
gauges_analytics:
favicon: /favicon.png
twitter: twitter
google_plus:
fb_admins:
fb_app_id:
```

### Add favicon

Favicons are small icons that a browser will show when we visit a website. They are a quick way for us to identify a website, for instance, when we bookmark a page. It is just a branding thing, but it is a neat branding thing. And it is much better to see a favicon than that grey generic logo on a page without one.
Which is what we have one.

My experience show that favicons taste best in **.ico** format, and 32x32 pixel size. Plain is good.

You can create one [here](https://www.favicon.cc/), or with your favorite image editor (you will probably have to [convert](https://favicon.io/) the created image to an .ico format)

Grab your favicon now, renamed to **favicon.ico**, and put it in the **source/images** folder.

We now return to our theme's **_config.yml** file, and set the path to our favicon. 
The path has to be relative to our website to make sure all pages can find the favicon:

```yml
# Miscellaneous
google_analytics:
gauges_analytics:
favicon: /angry-chaired-blog/images/favicon.ico
twitter:
google_plus:
fb_admins:
fb_app_id:
```

That's it, easy.

### Add rss to the blog

Let's equip our blog with an RSS feed too. 
To do this, we will have to install a plugin that will generate our feed. 

The [plugin](https://github.com/hexojs/hexo-generator-feed), **hexo-generator-feed**, is first installed:

```
npm install hexo-generator-feed
```

The, we configure ot in the root (not the theme) **_config.yml** file, by adding following fields:

```yml
feed:
  type: atom
  path: atom.xml
  limit: 20
  hub:
  content:
  content_limit: 140
  content_limit_delim: ' '
  order_by: -date
  icon: icon.png
  autodiscovery: true
  template:
```

Let's go over some of the fields:

- **type** refers to the type of feed. We can choose between **atom**, a more recent standard, or **rss2**, for which I don't know what to say. [This guy] did know how to explain the difference, though. We use the default. 
- **path** specifies path for our feed. Since we are using atom, we will keep path for atom. Note that we could use both, in which case we would add both types and both paths as lists in their respective fields
- **limit** specifies maximum number of posts in the feed. 0 would show all posts
- **hub** is irrelevant for us
- **content** set to **true** would include entire posts in the feed
- **icon** is used to set a custom feed icon. I couldn't get it to work.
- **autodiscovery**, set to true, makes possible for browsers to automatically find a site's RSS feed.

Now when we have configured the plugin, we can go the the theme's **_config.yml** file, to make sure we have a link to the RSS feed. 
Indeed, our **rss** link is defined as **/atom.xml**, and we can confirm this by restarting the server and clicking on the RSS icon in the top right corner.

Great. Our RSS feed works. While here, let's take a look at the **Welcome to Angry Chaired Blog** entry, and examine its **summary** element.
We can see that its content is actually the excerpt of the post as we defined it inside the post file. 

The **hexo-generator-feed** provides few other ways how to specify content for **summary** of our feed entries. 
We can do it in posts' front matter, by adding either **intro**, **description**, or **excerpt** field, and provide content for them.

Here are all options, commented out because I didn't want to use any of them, but kept the default body excerpt behavior

```yml
---
title: Some post 
# intro: this can be summary for the rss feed - intro
# description: this can be summary for the rss feed - description
# excerpt: this can be summary for the rss feed - excerpt
---
```

And that is it. Our blog now has an RSS feed. 

### Remove categories from home page

If you visit the blog, you will see that posts' categories are listed just aboive the post, both on the home page, and on the each post page. And it doesn't look very pretty, either. 
Now try to shrink your window as much as possible, or use Chrome Developer Tools to open it in the mobile device mode. The list now breaks, justifying in the middle, scarring the eyes. 

I think the blog would look much better if those categories were not there. After all, they are listed on the post page anyway, just under the post, so why having them there twice.  

Ok, let's open our **themes** folder, expand the **layouts** folder, and then open the **post.ejs**. The EJS syntaxt is a bit off, but we can see that it calls something called **_partial/article**. 
**_partial** folder does indeed exist in the **layout** folder, so let's open it and find the **article.ejs** inside. 

Let's see what is inside ():

```ejs
<article id="<%= post.layout %>-<%= post.slug %>" class="article article-type-<%= post.layout %>" itemscope itemprop="blogPost">
  <div class="article-meta">
    <%- partial('post/date', {class_name: 'article-date', date_format: null}) %>
    <%- partial('post/category') %> <!-- OF INTEREST! -->
  </div>
  <div class="article-inner">
  <!-- cut for brevity -->
```

We see that there is a line calling another file in the **post** folder. The file in question seems to be listing these categories, but frankly, I don't care. 
I will just comment (or remove) this line.

If we refresh our home page, the categories are gone from above posts. It all looks much better now.

### Add categories page

Unfortunately, I wasn't able to figure this one out in the short time I played with it. It would definitely involve manipulating EJS templates and the jQuery code in the **script.js** of the theme, and I just can't be dealing with it now. 

### Customize header

What we can do is to customize the looks of the blog's header.

The header has that nasty background image and height that hides half of our posts.
So let's deal with that.

If we return to that **layout** folder, we will see a **layout.ejs** file in it. This file seems to be organizing the whole website. 
Near the top we can see a line that seems to be calling a **header.ejs** file in the **_partials** folder.

```ejs
<%- partial('_partial/header', null, {cache: !config.relative_link}) %>
```

If we open it, we can see that there is a **div** element with and id of **banner**.
Let's try commenting that out and see what happens when we refresh our blog.

As suspected, the background image is gone (together with the #banner container that surrounded it).
Still, the header remains big, and its background is now very ugly. I guess we need to style it.

Landscape theme uses something called Styl to style our blog. I haven't worked with it, but when I open the **header.styl** file at **source/themes/landscape/source/css/_partial/**, the code looks very much like CSS.

I inspected the header with Chrome Developer Tools, and found out that an elemement with id of **header** has height of 300px.
The **header.styl** file does have a selector for **#header**, whose height is set to **"height: banner-height"**

```
#header
  height: banner-height
  position: relative
  border-bottom: 1px solid color-border
```

Seeing that we got rid of the banner, let's set that height to 130px.
Boom! It worked.

The header also has a weird background color, and I would like to change it to the same one used in the footer: **#262a30**.
It turns out that there are **::after** and **::before** pseudo-selectors on the **#header** element, and both of them have a **background** rule defined. 

Let's get completely rid of the pseudo-elements that these pseudo-selectors created, and set **background** rule on **#header** to be **#262a30**.

```
#header
  height: 130px
  position: relative
  border-bottom: 1px solid color-border
  background-color: #262a30
```

Finally, let's move the logo to the left and up, and reduce its font size a bit:

```
#header-title
  text-align: left
  height: logo-size
  position: absolute
  top: 40%
  left: 20px


$logo-text
  text-decoration: none
  color: #fff
  font-weight: 300
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3)

#logo
  @extend $logo-text
  font-size: 2.2rem
  line-height: logo-size
  letter-spacing: 2px
```

There. I think that looks much better. Don't get me wrong - the theme is still ugly, but we did see that we can work on it. 

### Fix pagination labels

We don't have enough posts to trigger the pagination, so let's just make ten copies of either of the current ones. 

Refresh the website, and scroll all the way down to the bottom. We see that the we can move between pages to see all existing posts, but the button for the next page shows **Next &raquo;** instead of only **Next**. 
Let's fix that.

Strangely enough, we can find this **&raquo** thing in the **archive.ejs** file, at **source/themes/landscape/layout/_partial/**. 

Here is the shady part, located at the very bottom of the file:

```
<% if (page.total > 1){ %>
  <nav id="page-nav">
    <% var prev_text = "&laquo; " + __('prev');var next_text = __('next') + " &raquo;"%>
    <%- paginator({
      prev_text: prev_text,
      next_text: next_text
    }) %>
  </nav>
<% } %>
```

Let's just delete **&laquo;** and **&raquo;**, leaving the empty strings instead. Refresh the website, and all should look fine.

### Add post featured image

We continue with manipulation of the theme's EJS templates.

At the moment we have an image in one of our post's excerpt, and that image is visible on the home page too.
However, this is image is not a featured image. It would be nicer if the image was placed above the post title, completely filling the available space down to the post title.

We will start by adding a **photos** field to the post's frontmatter, and giving it a value of **code-styled-comp.jpg**.

```
---
title: Welcome to Angry Chaired Blog
date: 2020-08-13 22:16:35
tags:
- angry chair
- introduction
- about
- blog
categories:
- [angry chaired, random rant]
- [angry chaired, feature introduction]
photos: code-styled-comp.jpg
---
```

This **photos** field value is the name of the image that live in the post's assets folder, and we will use it as a slug to get a full path to it and render it.

Next up, we return to the **artice.ejs** file from which we deleted the ugly **banner** div.
The file is located at **source/themes/landscape/layout/_partial/**.

Near the top of the file, a line calls a **gallery** file in the **post** folder. 

```
...
  <div class="article-inner">
    <%- partial('post/gallery') %>
...
```

This is what the **galerry.ejs** file looks like:

```
<% if (post.photos && post.photos.length){ %>
<div class="article-gallery">
  <div class="article-gallery-photos">
    <% post.photos.forEach(function(photo, i){ %>
      <a class="article-gallery-img fancybox" href="<%- url_for(photo) %>" rel="gallery_<%= post._id %>">
        <img src="<%- url_for(photo) %>" itemprop="image">
      </a>
    <% }) %>
  </div>
</div>
<% } %>
```

So what is going on here?
Well, it seems that EJS checks if there is a **photos** variable present in a post. If there is, EJS loops over existing photos and renders an anchor element that wraps an image element whose **src** gets the photo's URL, resolved by the **url_for** function. 
**url_for** is a Hexo's [helper](https://hexo.io/docs/helpers.html) that returns a URL relative to the root of the website.

Strange thing is that we know our post has a **photos** field holding an image slug. Still, no featured image is rendered.

We can actually tap into the logic in this template, and log the present variables.
The output will be shown in the terminal, however, as we are working with Node, and not in the browser. 

```
<% if (post.photos && post.photos.length){ %>
<div class="article-gallery">
  <div class="article-gallery-photos">
    <% post.photos.forEach(function(photo, i){ %>
      <a class="article-gallery-img fancybox" href="<%- url_for(photo) %>" rel="gallery_<%= post._id %>">
        <img src="<%- url_for(photo) %>" itemprop="image">
        <% console.log(url_for(photo)) %>
      </a>
```

Output that we get shows that the photo should live in the root of the website:

```
/angry-chaired-blog/angrychair-umit_okan.jpg
```

Of course, this is not true.
Luckily, the **post** gives us another variable: its own **path**. 
If we log that, resolved by the **url_for** helper, we get:

```
/angry-chaired-blog/2020/welcome-to-angry-chaired-blog/
```

This is the full path to the post's folder. As we know that our image lives in this folder, we can just concatanate the resolved post's path with the photo's slug, and we should get a valid path to the image. 

Let's have that be the value of the **src** attribude of the **img** element.
We also have to adjust the link to the photo, so when we click on it, we can get it to open:

```
<% if (post.photos && post.photos.length){ %>
<div class="article-gallery">
  <div class="article-gallery-photos">
    <% post.photos.forEach(function(photo, i){ %>
      <a class="article-gallery-img fancybox" href="<%- url_for(post.path) + photo %>" rel="gallery_<%= post._id %>">
        <img src="<%- url_for(post.path) + photo %>" itemprop="image">
      </a>
    <% }) %>
  </div>
</div>
<% } %>
```

Boom! It worked. Both home page and the post show the featured image property. Life is good.

Note that, even though the code above checks for multiple images, and and loops over all of them, it will always show just one. I am sure this has to do with one of the JS files at **source/themes/landscape/source/fancybox**, but I haven't had time to dig into it.

### Add custom stylesheet

Finally, let's add own CSS to the blog.

Since we don't need that chair image in the excerpt anymore, let's move it to the bottom of the post, and give it a class of **post-bottom-image**:

```
...
## Who am I? 

Meh, who cares really... 

{% asset_img post-bottom-image angrychair-umit_okan.jpg '"alt text" "title text"' %}
```

I would like to style this image now, so it has a height of 160px.
So we create a new CSS file in **source/css** folder, and call it **custom-post-style.css**:

```css
.post-bottom-image {
    height: 160px;
}
```

Next, we actually need to link the css file to the blog's HTML documents.

We can do it in the usual way, of course, by inserting a <link> element to an EJS template, and specifying its **href** attribute to point to our stylesheet. 

We will use the Hexo's css helper, and insert that one into a template. 

This is the syntax of the helper:

```
<%- css(path, ...) %>
```

The css helper takes one argument of JS type:
- a string for a single stylesheet, 
- array if we want to add multiple stylesheets , 
- or an object if we want to specify custome attributes on the generated **<link>** element

Note that the helper automatically prepends **/root/** of the website to the path, so we will add **"css/custom-post-style"** as an argument.

We will use the string argument, and insert the helper at the bottom of the **head.ejs** template. 

The template is available at **source/themes/landscape/layout/_partial/**

```
...
    <link
      href="//fonts.googleapis.com/css?family=Source+Code+Pro"
      rel="stylesheet"
      type="text/css"
    />
    <% } %> 
    <%- css('css/style') %> 
    <%- css('css/custom-post-style.css') %>
  </head>
</html>
```

Alright, restart the server and check the **Welcome to Angry Chaired Blog** post. The image aat the bottom should be smaller now, and this is what we wanted. Lovely.

We reached the end of this post. It was fun, and we got our blog to be a bit more functional. We messed with the theme's template to remove and add things from HTML, and we managed to add an RSS feed. That's pretty cool.

In the next post we will install a brand new theme, and see how that works. 
See you there.

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at 

- [Github](https://github.com/ikaem/angry-chaired-blog) 
- [Live project](https://ikaem.github.io/angry-chaired-blog/)

### Goals

1. Create Hexo blog
2. Write Markdown posts and migrate from Wordpress
3. Style the blog
4. Deploy to Github Pages

### Steps

1. Create a Hexo project
2. Create content
3. Configuring the blog
4. Customizing posts
5. **Customize default theme**
6. Install new theme
7. Add comments to the blog
8. Deploy blog to Github Pages


### Tech and Tools

1. Hexo
2. Comments by Hyvor

### Experience with Tech & Tools

I have only tried to install and create a Hexo blog before, to see what it is about. I had trouble with styling and property deploying to Gihub pages, and the whole thing seemed too much trouble. 
Since I didn't really need a blog, I quickly gave up.
I have some experience with Markdown, which is normally used to create content for Hexo blogs. 
I did a Web Dev basics course some time ago, where I was introduced to EJS, in which Hexo templates are written, so there is that too.
And that is pretty much all that is needed to get a lot from Hexo, it turned out.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
