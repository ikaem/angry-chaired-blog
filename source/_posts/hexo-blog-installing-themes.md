---
title: 'Hexo Blog: Installing Themes'
date: 2020-08-17 09:27:08
tags: 
- hexo
- blog
categories: hexo blog
cover: dino-aganovic-gKRk1-Zscuw-unsplash.jpg

creditArtist: Dino Aganović
creditSource: https://unsplash.com/@bur4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 6 of 8 in Hexo Blog

Hexo lists a selection of themes on their [website](https://hexo.io/docs/helpers.html). These seem to be made by its community, so one can see modern looking themes combined with those looking like they were from 2000s. 
Themes are also made with various technologies, some have bugs, and some seem to be forgotten. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 6: Install new theme

Installing a theme comes down to cloning it from Github, and then activating it in the root **_config.yml** file. I couldn't get some of them to work, however, so we will focus on two that worked.

Here is what we will do:

1. Install a theme
2. Configure the theme
3. Customize the installed theme

### Install a theme

First theme that we will install is a simple one, called [Clean Blog Hexo](https://github.com/klugjo/hexo-theme-clean-blog).

Installation is simple. We will just clone the theme from Github into the **source/themes/<theme-name>** folder, and activate it in the **_config.yml** file. 

Then, we will examine its documentation to see what we can do with it.

Let's do it:

```
git clone https://github.com/klugjo/hexo-theme-clean-blog.git themes/clean-blog
```

Next, we open the root **_config.yml** file and activate the new theme:
```yml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: clean-blog
```

That's it. Try restarting the server and them open the website. You can see that the blog looks very different. It is very neat. 

### Configure the theme

Let's check the theme's [documentation](https://github.com/klugjo/hexo-theme-clean-blog) to see what we can do.

For the menu, we can use [Fontawesome icons]() as labels. Let's do so for RSS, and also adjust all other labels to match what we had in the default theme.
We also change the **menu_title** field to hold the name of our blog.

```yml
# Header
menu:
  Home: /
  Archives: /archives
  About: /about
  Categories: /categories
  Angry Chaired web: 
    url: https://angrychaired.surge.sh
    icon: user
  Github:
    url: https://github.com/ikaem/
    icon: github
  Rss: 
    url: /atom.xml
    icon: rss

# Title on top left of menu. Leave empty to use main blog title
menu_title: Angry Chaired Blog
```

Whne you refresh the blog, you will notice that our mobile menu has Font Awesome icons stacked on top of each other. 
It doesn't look nice, and we will try to fix that in the next section.

Now we will change the background image of the header. This is adjusted with the **index_cover** field.

Currently, the image is sourced online, but I would like to use a local image instead.

Let's find an image and put it in the **source/images** folder.
Then, we will assign it to the **index_cover**:

```yml
index_cover: images/header-image.jpg
```

Great. Let's move on.

Next option, **default_post_title** defines the name of those posts created without a title. We won't touch this. 
We won't touch the **Comments** section either, as we will deal with comments in a later post.

In fact, last thing that we will adjust is the **favicon** field. We will give it the same value as in the default theme's config file:

```yml
# set your own favicon
favicon: /angry-chaired-blog/images/favicon.ico
```

That's it. We used the theme's **_config.yml** file to configure the theme, and now can move on to customizing the theme.

### Customize the installed theme

The theme's documentation shows few more features we can take advantage of.

First, it allows us to specify an **author** field in posts' front matter. This will make the author's name visible on the home page.

```yml
---
title: Welcome to Angry Chaired Blog
...
author: kaem
---
```

We can also specify a cover image for posts. 
This will override the main cover image we previously set. 
With this theme, we add field **cover**, and pass it a path to an image. 
Note that the path to the image is relative to the post's assets folder.

```yml
---
...
# photos: angrychair-umit_okan.jpg
cover: ./angrychair-umit_okan.jpg
# author: kaem
---
```

Unfortunately, this theme cannot use the excerpt solution we used with the default theme. Instead, it needs a **subtitle** field defined in the front matter.
Text assigned to the **subtitle** field will then be shown on the index page, as well as on the cover image we previously defined.

```yml
cover: ./angrychair-umit_okan.jpg
# author: kaem

subtitle: Angry Chaired Blog is a chronicle of my learning of web development. It is a collection of posts, usually belonging to a bigger project. While each project does have an idea and a set of overarching goals, posts are usually concerned with solving a specific problem.
---
```

It creates an impressive block of bold text on the post page, and not in a good way

On the other hand, the theme does allow for creation of **Categories** page.
We only need to create a page with that name, and define its type in frontmatter to be **categories**

```bash
hexo new page Categories
```

```yml
---
title: Categories
date: 2020-08-15 10:27:12
type: categories
---
```

Alright, that is it for the documentation. 

Let's see what we can do about those mobile menu icons.

The theme's style is controled by several **.styl** files, but the most promising one was **style.styl** at **source/themes/clean-blog/source/css/**.
It is a long file, so I am including only a snipper that looked promsing to me:

```styl
.fa-stack-1x, .fa-stack-2x
  bottom 0

.navbar-custom
  position absolute
  top 0
  left 0
  width 100%
  z-index 3
  @extend .sans-serif
  .navbar-brand
    font-weight 800
  .nav
    li
      a
        text-transform uppercase
        font-size 12px
        font-weight 800
        letter-spacing 1px
        text-decoration none
  @media only screen and (min-width: 768px)
    background transparent
    border-bottom 1px solid transparent
    .navbar-brand
      color white
      padding 20px
      &:hover, &:focus
        color white-faded
    .nav
      li
        a
          color white
          padding 20px
          &:hover, &:focus
            color white-faded
```

I also found EJS template that controled navigation, and conditionally added an **icon-label** to every **li** element that was passed a menu icon during the menu loop to create menu labels. 

The template, **menu.ejs**, is located at **source/themes/clean-blog/layout/_partial/**

```html
<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    <ul class="nav navbar-nav navbar-right">
        <% for (var i in theme.menu){ %>
            <li class="<%- theme.menu[i].icon ? 'icon-label' : '' %>"> <!-- My addition -->
                <a href="<%- theme.menu[i].url ? url_for(theme.menu[i].url) : url_for(theme.menu[i]) %>">
                    <% if (theme.menu[i].icon) { %>
                        <i class="fa fa-<%= theme.menu[i].icon %> fa-stack-2x"></i>
                    <% } else { %>
                        <%= i %>
                    <% } %>
                </a>
            </li>
        <% } %>
    </ul>
</div>
```

First, the **.styl** format was doing me no favors. It is similar to Sass, but is written in a pure text file. There is lot of selectors nesting, referencing and using of variables. Also, media queries are used all over the place. 

I managed to style the mobile navigation a bit. I wanted to arrange Font Awesome icons on the same line, instead of them being each on a separate one.
It turned out that some of it is styled by a Bootsrap stylesheet linked from a CDN, and some of it by a Font Awesome stylesheet linked in the same way. This meant I had to overwrite those styles, and make my rules have higher specificity. 

Here is the final .styl code. I don't know if this is best practice, as it is obviously written in the classic CSS way. But the thing workes, so we leave it as is.
I added it below the entire navigation section, to make sure no local specificity rules interfere with my efforts.

```scss
.nav .icon-label 
  display inline

.nav > .icon-label > a 
  display inline

.icon-label .fa.fa-stack-2x 
  display inline
  position static
  text-align left

@media only screen and (min-width: 768px) 
  .nav > .icon-label > a 
    display block
  
  .icon-label .fa.fa-stack-2x 
    display inline
    position absolute
    text-align centerđ
```

How about the excerpt? Well, it can be done too.
In fact, we leave the **subtitle** field in the frontmatter, because I don't know how to do that. We won't show it in the full post, though, so it is all good.

We remove the **subtitle** from the post in the **article-full.ejs** template at **source/themes/clean-blog/layout/_partial/**
We will just comment it out.

```html
<%
    var cover = item.cover || theme.index_cover;
%>
<header class="intro-header" style="background-image: url('<%- cover %>')">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                <div class="post-heading">
                    <h1><%- item.title || theme.default_post_title || "Untitled" %></h1>
                    <!-- <% if (item.subtitle && item.subtitle.length) { %>
                    <h2 class="post-subheading">
                        <%- item.subtitle %>
                    </h2>
                    <% } %> -->
                    <span class="meta">
                        <!-- Date and Author -->
                        <% if(item.author) { %>
                            Posted by <%- item.author %> on
                        <% } %>
                        <% if(item.date) { %>
                            <%= item.date.format(config.date_format) %>
                        <% } %>
                    </span>
                </div>
            </div>
        </div>
    </div>
</header>
```

In the same file we also move tags to the bottom of the post. The default setu to have both tags and categories on the top is just too much:

```html
<!-- Post Content -->
<article>
    <div class="container">
        <div class="row">

            <!-- Tags and categories -->
           <% if (item.categories && item.categories.length || item.tags && item.tags.length) { %>
                <!-- <div class="col-lg-4 col-lg-offset-2 col-md-5 col-md-offset-1 post-tags">
                    <% if (item.tags && item.tags.length){ %>
                        <%- partial('article-tags', {item: item}) %>
                    <% } else { %>
                        <%- partial('article-categories', {item: item}) %>
                    <% } %>
                </div> -->
                <div class="col-lg-4 col-md-5 post-categories">
                    <% if (item.tags && item.tags.length && item.categories && item.categories.length){ %>
                        <%- partial('article-categories', {item: item}) %>
                    <% } %>
                </div>
            <% } %>

            <!-- Gallery -->
            <!-- CUT FOR BREVITY -->

            <!-- Post Main Content -->
            <!-- CUT FOR BREVITY -->
            
            <!-- Custom placed tags -->
            <div class="col-lg-4 col-lg-offset-2 col-md-5 col-md-offset-1 post-tags">
                <% if (item.tags && item.tags.length){ %>
                    <%- partial('article-tags', {item: item}) %>
                <% } else { %>
                    <%- partial('article-categories', {item: item}) %>
                <% } %>
            </div>
            <!--  -->
```

We can also add that cover image to the home page. 
I just copied this section from the **article-full.ejs** file to **article-index.ejs** file that lives in the same folder:

```html
<%
    var cover = item.cover;
%>
```

This fetches the **cover** field from a post's front matter.

Then, I used the trick from when we assembled a link for featured image for the default theme, to define a source for featured image. 
I also added a class to the featured image container, so we can style it later.
Finally, I wrapped all of it in the already existing **anchor** tag to link the featured image to the post as well.

Note that we are rendering the featured image container only if the **cover** field exists. Otherwise, we will have an empty block of space because of the styling we are about to do.

```html
<div class="post-preview">
  <!-- test featured image -->
  <% var cover = item.cover %>
  <a href="<%- config.root %><%- item.path %>">
    <div class="post-preview__featured-image-container">
      <img src="<%-url_for(item.path) + cover%>" alt="" />
    </div>
    <%- console.log("path here:", url_for(item.path) + cover) %>
    <!--  -->
    <!-- <a href="<%- config.root %><%- item.path %>"> -->
    <h2 class="post-title">
      <%- item.title || theme.default_post_title || "Untitled" %>
    </h2>
    <% if (item.subtitle && item.subtitle.length) { %>
    <h3 class="post-subtitle">
      <%- item.subtitle %>
    </h3>
    <% } %>
  </a>
  <p class="post-meta">
    <!-- Date and Author -->
    <% if(item.author) { %> Posted by <%- item.author %> on <% } %> <%=
    item.date.format(config.date_format) %>
  </p>
</div>
<hr />
```

Finally, I styled the image in the same **base.styl** file we worked in before. 
I had to change the cursor for the image to be a pointer, and had to increase specificity to do it as any image wrapped in a **<a>** tag had a **zoom-in** cursor specified.

```scss
div.post-preview__featured-image-container
  width 100%
  height 200px
  > img 
    width 100%
    height 100%
    object-fit cover
    cursor pointer
```

And that is it for working with the new theme. 
I have personally learned a lot, especially when we started customizing the theme. 

In the next post we will add a comments feature to the blog. Hexo blogs usually implement [Disqus](https://tech.jocodoma.com/2018/10/16/hexo-next-disqus/) comments, but we will go with something else.
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
5. Customize default theme
6. **Install new theme**
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

