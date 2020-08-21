---
title: 'Hexo Blog: Configuring the Blog'
date: 2020-08-17 08:56:24
tags: 
- hexo
- blog
categories: hexo blog
cover: torsten-muller-tfoqHmi-MOg-unsplash.jpg

creditArtist: Torsten Muller
creditSource: https://unsplash.com/@neptunian?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 3 of 8 in Hexo Blog

In this post we will configure our new blog with the **_config.yml** file. Hexo's configuration file helps with SEO and prepares the website for deployment. It is also used to configure permalinks, installed plugins, themes, and much more. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 3: Configuring the blog

The **_config.yml** file is located in the root of the project, and comes with predefined set of options that work very well right out of the box. 
However, we will adjust some to make sure our blog works the way we need it to work.

We will not go over all options in the file. There are many of them, and frankly, I am not sure what some of them even do.

This is what we do in this post:

1. Configure basic page info
2. Configure blog url and permalinks
3. Set up post writing options
4. Set up home page options
5. Adjust date and time formats

### Configure basic page info

Here we are setting the basic info about the blog. 
Note that I am not setting the timezone, as Hexo uses my system's time zone by default.

```
# Site
title: Angry Chaired Blog
subtitle: 'Writing about my web development learning...'
description: 'Inexperienced and curious pokes into the sprawling world of web development '
keywords: ["javascript", "web", "development", "learning"]
author: kaem
language: en
timezone: ''
```

### Configure blog url and permalinks

In this section, we will adjust only **url**, **root** and **permalink** fields, and leave the rest with their default values.

```
# URL
url: https://ikaem.github.io/angry-chaired-blog
root: /angry-chaired-blog
permalink: :title/

# ...
```

If our blog did not use a subdomain, the **root** field would be **"/"**. We are using a subdomain here, however, so the **root** is **"/angry-chaired-blog"**. 
The **root** field is important, as it tells Hexo what path it needs to work with when evaluating location of files and folders in the project and on the website.

**Permalink** filed is a useful one. It allows us to specify what are our posts' full URLs going to look like. 
The default value for the **permalink** field is **"permalink: :year/:month/:day/:title/"**, making the full URL of a post look like this: 

```
http://localhost:4000/angry-chaired-blog/2020/08/13/This-is-new-draft/
```

This shape reflects the folder structure of each post after a static website is generated:

```
public\2020\08\13\This-is-new-draft\index.html
```

I changed the permalink to include only the title, making making permalinks look like:

```
http://localhost:4000/angry-chaired-blog/This-is-new-draft/
```

Of course, this changes our folder structure in the generated static website. Posts now live in the root of the website, and have paths that look like this:

```
public\This-is-new-draft\index.html
```

This configuration can be overriden in the front matter of each individual post. 
We add the **permalink** field, and assign a string to it to specify the post path relative to the root of the project. 
Note that the path has to include the **.html** file at the end.

```
---
title: This is new draft
date: 2020-08-13 15:27:18
tags:
categories:
permalink: overriden-permalink/one-more-folder/index.html
---
```

This post is now available at **"http://localhost:4000/angry-chaired-blog/overriden-permalink/one-more-folder/index.html"**.

Let's delete that front matter permalink field, though, and keep the **_config.yml** settings only.

### Set up post writing options

Writing settings configure many things.
For instance, by default, **new_post_name** defines that new posts will be named after the title provided to the new post, and the **default_layout** file defines that when we type **hexo new "New post"**, Hexo knows we want to create a post. This explains that third way of creating a post we mentioned in the earlier... post?

Here is my setup, showing only changed values.

```
# Writing
# ...
filename_case: 1
post_asset_folder: true
# ...
```

With **"filename_case: 1"** we are defining that filenames should all be in lower case. Now we can write capitalized post titles when we create posts with **new** commands, and their filenames will stay in lowercase.

Important one is the **post_asset_folder**. 
With this field set to true, creating a new post will also create an additional folder in the **source/_posts** folder. 
The folder, now sibling to the new post, will bear the same name as the post filename, and we can use it as a container for its post's data. 
Great thing about this is that we can reference data in these folders by using a relative path in their post files, as if the referenced data was in the same folder as the post itself. 
This probably sounds a bit confusing, so we will return to it later. You can also check the official explanation in [Hexo docs](https://hexo.io/docs/asset-folders).

### Set up home page options

Here I am only changing the number of posts per page on the home page. New value is **5** posts.

```
index_generator:
  path: ''
  per_page: 5
  order_by: -date
```

### Adjust date and time formats

This one is simple too. We are only changing the **date_format** field to adjust how dates are shown on the page:

```
# Date / Time format
date_format: YYYY-MM-DD
time_format: HH:mm:ss
updated_option: 'mtime'
```

That is it for now. **_config.yml** is the most important file in a Hexo project (I think), and we will be coming back to it to make more blog adjustment, configure new plugins, and change themes.

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
3. **Configuring the blog**
4. Customizing posts
5. Customize default theme
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
