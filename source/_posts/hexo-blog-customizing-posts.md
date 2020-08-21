---
title: 'Hexo Blog: Customizing Posts'
date: 2020-08-17 09:01:29
tags: 
- hexo
- blog
categories: hexo blog
cover: vladimir-vujeva-P896nPJ-BOQ-unsplash.jpg

creditArtist: Vladimir Vujeva
creditSource: https://unsplash.com/@vladimir92?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 4 of 8 in Hexo Blog

Hexo makes it very simple to adjust the post content. We will add image and code files to our posts, and will see how we can show post excerpts on the home page, so users know what to expect from a post. While most of these things are possible with the usual Markdown syntax, Hexo offers few tools to make post customization more effective.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 4: Customizing posts

Before we continue, lets delete all of our existing posts from the **source/_posts** folder, and create a new post to introduce ourself to the public. 

```bash
hexo new post "Welcome to Angry Chaired"
```

Check the **source/_posts** folder. You see a new post was created, and its filename is all in lowercase letters. We set that in the previous post. 
We also set that our new posts will now be using their own assets folders. If you look in the **_posts** folder, you can see that there is a folder there, and that it has the same name as the post we just created. 

Ok, now clean the project cache, restart the in-memory server, and lets move on. 
Here is what we will do:

1. Adjust frontmatter to define post categories, tags and excerpt
2. Define post excerpt in the body of the document
3. Add images to posts
4. Use code blocks to render code inside Markdown
5. Add code files to our project and render them in our posts
6. Add links to our posts
7. Escaping characters

### Adjust frontmatter 

Our post frontmatter already comes with **title** and **date** keys holding values. This is done by default. 
The **tags** and **categories** fields, however, have no values. So let's give them some, and let's also add the **excerpt** field to the frontmatter.

#### Let's start with the **categories** field.

I want this post to have one main category: **angry chaired**. 
I also want it to have two subcategories that belong to the **angry chaired** category: **random rant** and **feature introduction**

Let's add all categories to the **categories** field in the frontmatter

```
---
title: Welcome to Angry Chaired Blog
date: 2020-08-13 22:16:35
tags:
categories:
- angry chaired
- random rant
- feature introduction
---
## What is Angry Chaired Blog?

Angry Chaired Blog is a chronicle of my learning...
```

Ok. Now clean your cache, restart the server, and open the website home page. 
You can see the **Welcome** post there, and above it you can see the post date and a list of three categories.
Hover over the first category, **angry chaired**, and pay attention to the url in the lower bottom corner. After a few seconds of hovering, the URL should resolve to **"http://localhost:4000/angry-chaired-blog/categories/angry-chaired/"**.

Now try hovering over the next category, **random rant**. The URL resolves to **"http://localhost:4000/angry-chaired-blog/categories/angry-chaired/random-rant/"**. 
Notice how **random-rant** is placed in the **angry-chaired** folder. You can even access that URL, and you will get a list of all posts in that category.

Now hover over the third category, **feature introduction**. The URL for this one is **"http://localhost:4000/angry-chaired-blog/categories/angry-chaired/random-rant/feature-introduction/"**. 
This category is placed in the **random-rant** folder.

What we got is a category hierarchy where **angry chaired** is at the top, **random rant** is in the middle, and **feature introduction** is at the bottom of the hierarchy. 

This is not what we wanted, however. We wanted **random rant** and **feature introduction** to be on the same level in the category hierarchy. 
For this we need multiple category hierarchies, and we can do this with a list of category names.

Here, each list creates a new category hieararchy, so we need two lists.

```
---
title: Welcome to Angry Chaired Blog
date: 2020-08-13 22:16:35
tags:
categories:
- [angry chaired, random rant]
- [angry chaired, feature introduction]
---
## What is Angry Chaired Blog?

Angry Chaired Blog is a chronicle...
```

Check your blog now. We still have the same look of the categories above the post, but the URLs for the **random rant** and **feature introduction** are now on the same hierarchy level:

```
http://localhost:4000/angry-chaired-blog/categories/angry-chaired/random-rant/
http://localhost:4000/angry-chaired-blog/categories/angry-chaired/feature-introduction/
```

We will digress from the front matter for a bit, and realize the category URLs show that our categories live in the folder called **categories**. 
This is defined in the **_config.yml** file from the previous post.

```yml
# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:
```

In fact, **categories** folder is actualy created when we generate our website. Its contents are folders holding names of all categories that we have created.
While we can create a page called categories that will be available at the **"/categories** path, the theme that we are currently using does not support rendering all our categories on that page.
We will try to fix this in one of the later posts.

#### Tags

We specify post tags in the same way as categories. Tags, however, are all defined on the same hierarchy level.

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
---

## What is Angry Chaired Blog?

Angry Chaired Blog is a chronicle o
```

Let's restart the server and go to our only post. Below the content, there is a section with **categories**, and under it you can see the **tags** section, with our tags. All of them live on the same hierarchy level, and have same URL format: 

```
http://localhost:4000/angry-chaired-blog/tags/about/
```

The landscape theme that we are using has the same page issue for **tags** as it had with the **categories** page. 

#### Frontmatter excerpt

We can also specify excerpt in the front matter, and this text will show on the home page, together with the post title.

Let's do it:

```
...
categories:
- [angry chaired, random rant]
- [angry chaired, feature introduction]
excerpt: Angry Chaired Blog is a chronicle of my learning of web development. It is a collection of posts, usually belonging to a bigger project. While each project does have an idea and a set of overarching goals, posts are usually concerned with solving a specific problem.
---
```

Restart the server, and visit the home page. While the excerpt is there, ithat's a a pretty ugly block of text sitting there.
We will find a way around it in the next section.

### Define post excerpt in the body of the document

I prefer setting the excerpt in the body of the document. /image
Way to do it is to find a piece of text that we want to use as the excerpt, and then add the **"\<!--more-->\"** delimiter below it. 

We also have to remove the frontmatter excerpt, as that one takes precedence. 

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
---

## What is Angry Chaired Blog?

Angry Chaired Blog is a chronicle of my learning of web development. It is a collection of posts, usually belonging to a bigger project. While each project does have an idea and a set of overarching goals, posts are usually concerned with solving a specific problem.

<!--more-->
```

If you go to the home page now, you will see that the excerpt is more styled, and that it includes the heading too. 
This might not be what you want, as the heading might look a bit off too. 

### Add images to posts

Images are nice. We are nice. Nice things go to together. So we gotta do something about not having images in our post.

Let's say we want to have an image at the top of our post, so it gets included in the excerpt as well. 

There are many ways to include an image in a post, but we will see 2:

1. Refer to an image that lives in the global assets folder
2. Refer to an image that lives in the post's assets folder

#### Refer to an image that lives in the global assets folder

This approach is good if we don't use images a lot in our blog, or if we keep referring to the same image a lot. 
It is also a convenient way to refer to an image in a page. This is what we will to with the About page later in the series.

Let's include an image to our post. 
Find one on [unsplash](https://unsplash.com), and add it to **source/images** folder. Create the **images** folder if you don't have it. 

Let's open our only post, and add our new image inside.
We can do it in 2 ways:

1. With classic Markdown syntax:

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
---

![Image](/angry-chaired-blog/images/angrychair-umit_okan.jpg)

Angry Chaired Blog is a chronicle...
```

Note that we are using the path to the **root** of our blog, as our blog starts at **/angly-chaired-blog**.
If we specified path to be "./images/image.jpg" or "images/image.jpg", the image will be visible from the home page, but not from the post, because the generated post's folder does not have an image folder. 

We can also specify alt and title tags for the image:

```
![This is title text](/angry-chaired-blog/images/angrychair-umit_okan.jpg "This is alt text")
```

2. With Hexo's tag plugins

Tag plugins are specific to Hexo, and can be used even if we do not use Markdown to write content. 
They allow us to specify image dimensions, but also to add classes to images. 

We will use the image tag plugin in our post to reference that same image in the global assets folder. 

Replace the previous image insertion code with the following one:

```
{% img excerpt-image another-class /images/angrychair-umit_okan.jpg 250 250 '"alt text" "title text"' %}
```

There are few interesting things here:

- We have to use the **img** keyword.
- We can add as many classes as we want, separated by space.
- Path to the image has to start with **slash**, and it relative to the root folder of the **source** folder (or the root of the generated static website, same thing).
- Image dimensions are specified without units, but are processed as pixels. When specifed, the image is centered by default.
- If we do not specify image dimensions, its height is set to **auto**, and its width is **100%** of its container
- Alt and title values are placed together in single quotes, but are then specified individualy in their own double quotes. Note that the official documentation incorrectly shows these two in reversed order.

#### Refer to an image that lives in the post's assets folder

For this part, let's change our permalinks to include the post's year of creation. This way we will get a more complex permalink URL, which will be useful to illustrate benefits of Hexo's own syntax for including images in posts.

We do this in the root **_config.yml** file:

```
# URL
...
permalink: :year/:title/
```

Ok, now lets copy our image to the posts' assets folder at **source/_posts**.
Now we have a new image (but old) sitting at **"source\_posts\welcome-to-angry-chaired-blog\angrychair-umit_okan.jpg"**

Now we have three options:

1. Use classic Markdown syntax again
2. Use tag plugin for relative paths

#### Use classic Markdown syntax again

We can use classic Markdown syntax to insert an image from the post assets folder.

```
![Photo by Umit Okan on unsplash.com](./angrychair-umit_okan.jpg "Angry Chaired image - Photo by Umit Okan on unsplash.com")
```

This sytanx will insert the image from the posts' assets folder into the post itself. 
Note, however, that we are using a path that is relative to the post's assets folder. Because of this, the image will not be shown when in the post excerpt on the home page, because there is no such image relative to the home page. 

Of course, we could use the path relative to the root of the website to show the image both in the post and in the excerpt. 
However, typing it could get easily complicated as we have to think where exactly the image will be once the project is generated into a static website.

Here is the example where post and its image have an additional **2020** folder between the root of the project and their immediate container folder:

```
![Photo by Umit Okan on unsplash.com](/angry-chaired-blog/2020/welcome-to-angry-chaired-blog/angrychair-umit_okan.jpg "Angry Chaired image - Photo by Umit Okan on unsplash.com")
```

Imagine if we set the **permalink** to include the post's month and day, as it was in the default setup. There would have to be some heavy folder juggling just to make sure our images are visible everywhere on the blog.

#### Tag plugin for relative paths

Hexo provides a tag plugin to add an asset image to a post via relative path. This solves the issue of showing the image on both home page and in the post itself.

```
{% asset_img excerpt-image another-class angrychair-umit_okan.jpg 150 150 '"alt text" "title text"' %}
```

The tag plugin itself is similar to the **img** tag plugin we already used, in that it allows specifying of image classes and dimensions.

The differences are:

- keyword is **asset_img**, signifying that we use the plugin for referencing posts' images from their assets folder.
- relative path to the image is actually just a slug starting from the post's assets folder.

Even if we do not need the image to be shown in a post's excerpt, the classes, dimensions and slug referencing make it a very convenient way of including images in posts.

### Use code blocks to render code inside Markdown

As my blog's content is primarily focused on code, I need to be able to show code in some way.
Hexo provides their own tag plugins for code blocks in the dollowing format:

```
{% codeblock [title] [lang:language] [url] [link text] [additional options] %}
code snippet
{% endcodeblock %}
```

Alternative is to use the **backtick code blocks** format:

```
``` [language] [title] [url] [link text] 
code snippet 
``` 
```

This is the one I prefer because it looks like classic Markdown code block syntax.

So here is some code:

```
    ```js Gatsby's Configuration JS file https://google.com Google it yourself
        module.exports = {
        /* Your site config here */
        siteMetadata: {
            title: "Angry Chaired",
            description: "Portfolio of my Web Development learning",
            author: "kaem",
        },
    ``` 
```

And here is the output:

```js Gatsby's Configuration JS file https://google.com Google it yourself
    module.exports = {
    /* Your site config here */
    siteMetadata: {
        title: "Angry Chaired",
        description: "Portfolio of my Web Development learning",
        author: "kaem",
    },
```

### Add code files to our project and render them in our posts

Speaking of code, we can use tag plugins to insert code from files. 
Files should live in the **source/downloads/code** folder, as specified in the root **_config.yml** file:

```yml
# Directory
code_dir: downloads/code
```

So let's put a file called test.ts in that folder, and fill it with this code:

```ts
const test = "this is test only";

// here is more code

for (const [index, character] of test.split("").entries()) {
  console.log("this is character", character);
  if (character === "t") {
    console.log(character, "is shown", index + 1, "time(s)");
  }
}
```

The plugin's syntax looks like this:
```
{% include_code [title] [lang:language] [from:line] [to:line] path/to/file %}
```

Once we have files in the **code** folder, we can refer to them just by specifying their slugs as paths in the plugin.

Here are some examples:

Using the plugin to render full file:

```
{% include_code Downloaded code file lang: typescript test.ts %}
```

Here is the result:

{% include_code Downloaded code file lang: typescript test.ts %}

Using the plugin to render only lines from 5 to 8, without specified tite

```
{% include_code lang:typescript from:5 to:8 test.ts %}
```

Here is the result:

{% include_code lang:typescript from:5 to:8 test.ts %}

### Add links inside posts

Markdown does provide a way to create links
Hexo, however, offers several options to do so.

**Usual link can be made with a tag plugin for link:**

```
{% link text url [external] [title] %}
```

Here is a {% link link to Google https://www.google.com true title attribute %}:

```
Here is a {% link link to Google https://www.google.com true title attribute %}
```

If we had **false** instead of **true** in the **external** value, the new URL would open in the same tab.

**We can also link to other posts**

Syntaxt is as follows:

```
{% post_link filename [title] [escape] %}
```

And here is a link:

```
{% post_link just-a-test-post 'This is a link to the "Just a test post" <b>post</b>' true %}
```

With this approach, we can link to posts simply by specifying their filenames, no matter where they are.
Also, in our example, the **escape** value has **true** for its value, so the **\<b>** tag will be escaped. If we had **false** for the escape value, the tag would not be escaped, and the **"post"** substring would be bold.

### Escaping characters

Sometimes, we need to escape characters. 
Generally, we can do it by putting a backslash character **"\"** in front of a character that we want to escape:

```
\*text*
```

For instance, the example above would actually render two asterisks, instead of an emphasized text, like this: *text*.

Alrigth, that is for this post. We got some idea on how to customize our posts: we can insert images, code blocks and links. We also got familiar with the front matter, which is very useful for describing our posts, but it will also prove helpful when we start customizing our current theme.

This is exactly what we will do in the next post. We will add a favicon to our blog, remove few things from the theme so it doesn't look so 2000s. See you there

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
4. **Customizing posts**
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

