---
title: 'Hexo Blog: Create Content'
date: 2020-08-17 08:50:23
tags: 
- hexo
- blog
categories: hexo blog
cover: natalya-letunova-FYr3roIu51g-unsplash.jpg

creditArtist: Natalya Letunova
creditSource: https://unsplash.com/@naletu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 2 of 8 in Hexo Blog

Hexo can use Markdown to create blog content. We will create few new posts, a page and a draft, and then see how Hexo scaffolds can help us to prepare an outline of our content and make its creation simpler. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 2: Create content

This is what we will do in this post:

1. Create posts
2. Learn about **scaffolds** folder and content templates
3. Create **About** page
4. Create and publish a draft

### Create new post

We can create posts in few different ways.

We can simply create a new **.md** file in the **source/_posts** folder.
Let's do that, and name the file **simple-new-post.md**.
Insert following content in the newly created file:

```
---
title: Simple new post
---

# This is a simple new post
```

Go ahead and start the in-memory server (from now on, we will refer to this one as "the server"), and open your website. 
Your new post should be there. 

Let's try another way. 
Stop your server and type new command in it:

```bash
hexo new post "My explicit new post"
```

Did you see what happened? 
A new file was created in the **source/_posts** folder, with a name "My-explicit-new-post".
The command we just executed is used to create new post from the terminal, by specifying that we are creating a **new post <"With some title">**. 
It creates a new post titled "My explicit new post". The command also assigns that name to the file, but with the spaces turned to dashes. 

Try opening the file now. 
You can see that there already is some content there:

```
---
title: My explicit new post
date: 2020-08-13 13:36:35
tags:
---
```

This content came from the post template in the **scaffolds** folder. We will get to this in a second. 

You can clean the cache now, and start the server again, to see your new post in action. It should be there, with the title and everything.

There is also a third way, similar to the previous one.

```bash
hexo new "My implicit new post"
```

What happened? Another post showed up in the **source/_posts** folder. The post is there, complete with its content and filename, and we did not even specifying that we are creating a **post**. Magic. 

### Learn about **scaffolds** folder and content templates

We will now focus on the last two ways of creating a post.

How does Hexo know what content to put in a new post. It uses content templates inside the **scaffolds** folder to pre-fill each new post. 

At the moment, we have three files in this folder:

- post.md
- page.md
- draft.md

If we say that we want a new **post**, it will use the **post.md** template to pre-fill it, and if we want a new **page**, it will use the **page.md** template to prefill the page. Same goes for new drafts, too.

If we open the **post.md** file, we see the following:

```
---
title: {{ title }}
date: {{ date }}
tags:
---
```

The space between the pair of tripple dashes is knows as the front matter. Front matter consists of key-value pairs, and these pairs are used in various ways in Hexo projects. They are also available as variables in .ejs templates, and we will use some of them later. 

Let's adjust this template a bit, and add a new field called **category** to the front matter:

```
---
title: {{ title }}
date: {{ date }}
tags:
categories: 
---
```

Ok, now lets create a new post

```bash
hexo new post "Post with modified template"
```

Here is what we have in the newly created post 

```
---
title: Post with modified template
date: 2020-08-13 14:29:37
tags:
categories:
---
```

Great, we have modified the post template to fit our needs. 
We will be doing this more throughout this series. 

We can also create new templates. 
Let's add a new file to the **scaffolds** folder and call it **code-gallery.md**.
Inside, we will add **title**, **date** and **tags** to the frontmatter.

```
---
title: {{ title }}
date: {{ date }}
tags:
---
```

Now, create new content with the following command:

```bash
hexo new code-gallery "New code gallery"
```

The command created a new post and prefilled it with content defined by the **code-gallery** template. 

```
---
title: New code gallery
date: 2020-08-13 14:48:00
tags:
---
```

Important thing is that new templates will create posts as well, but will shape them in their own image. 

### Create **About** page

You know how blogs often have an **About** page? We can have one too.
Let's create it with help ouf the **page** template, and call it **About**. 

```bash
hexo new page about
```

Go and check the **source** folder now. There is a new folder inside, called **about**, containing an **index.md** file.

```
---
title: about
date: 2020-08-13 15:00:31
---
```

Let's start the server again and go to **localhost:4000/about** to see the new page. 
Try changing the tile in the **About** page to **"About"**, and refresh the page to see the capitalized page title. 
We will make this be done automatically later in the series. 

So we have the About page, but we dont have a link to it nowehere in our blog. We should fix that.
Go to the **themes** folder, then to **placeholder** theme, and open the **_config.yml** file. 
This is the configuratio file for the **placeholder** theme that we are currently using. 

In the configuration file, modify the **#Header** section to hold an **About** field. This will add link to the **about** page on the home page.

```
# Header
menu:
  Home: /
  Archives: /archives
  About: /about
rss: /atom.xml
# ...
```

Refresh the blog page you are on, and see the header. A working link to the **about** page should be there.

### Create and publish a draft

The last template we will work with is **draft**. 
This template also creates posts, but these are not published (by default). Instead, they live in the **source/_drafts** folder, and can be published to move them to the **_posts** folder and render them on the home page. 

Let's try creating a draft:

```bash
hexo new draft "This is new draft"
```

This command created a new file (This-is-new-draft.md) in the **source/_drafts** folder. 
As we expect, if you visit the website, you won't see this post there. 

Let's make it visible, though. We have to publish it to move it to the **_posts** folder. Let's add some content to it so we know this is our draft too.

```
---
title: This is new draft
tags:
---

# This is our draft check
```

Now, lets publish:

```bash
hexo publish draft "This is new draft"
```

If you check the **_drafts** folder, you won't find anthing there anymore. Instead, our draft has moved to the **_posts** folder and is now happily rendered on the blog.

That is it. We learned how to create content, and how to use templates to make the content creation simpler. 
In the next post we will examine the root **_config.yml** file to customize our blog. We will give our blog a name and a description, and our post files will no longer include those jarring upper-case letters. 

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
2. **Create content**
3. Configuring the blog
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


