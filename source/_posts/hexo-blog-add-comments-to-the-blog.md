---
title: 'Hexo Blog: Add Comments to the Blog'
date: 2020-08-17 09:42:13
tags: 
- hexo
- blog
- hyvor
categories: hexo blog
cover: dzenis-hasanica-pbdOwv031rc-unsplash.jpg

creditArtist: Dženis Hasanica
creditSource: https://unsplash.com/@dddzenis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 7 of 8 in Hexo Blog

Most Hexo themes, including the default one, come with a support for [Disqus](https://dustinpfister.github.io/2018/06/14/hexo-disqus/) comments. 
However, we will use another option, [Hyvor](https://groups.hyvor.com/HyvorTalk/463/adding-comments-to-your-hexo-blog), to add comments to our blog.
It is a pretty straightforward setup, and the comment containers looks nice too

<!--more-->

#### See [Project Information](#Project-Information)

## Step 7: Hexo Blog: Add comments to the blog

Here is what we do:

1. Create an account with Hyvor
2. Add Hyvor comments to our project and configure it
3. Customize the looks for the comment containers

### Create an account with Hyvor

You create an account [here](https://talk.hyvor.com/).
Once you create the account, you will be asked for a website name and domain.
Choose a name for the website, and for now enter **localhost** as a website domain. 
Then navigate to **moderate > general** option, and take note of the **Website ID** there.

Next, insert the following snippet into the **article-full.ejs** file at **source/themes/clean-blog/layout/_partial/**.
Make sure to insert the snippet right aftet the EJS code for the theme's default comments. 


```html
            <!-- Comments -->
            <% if (item.comment != false) { %>
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <%- partial("_partial/comments.ejs") %>
                </div>
            <% } %>

            <!-- Hyvor comments -->
            <% if (item.comments){ %>
                <div id="hyvor-talk-view"></div>
                <script type="text/javascript">
                    var HYVOR_TALK_WEBSITE = WEBSITE_ID // YOUR Website ID here
                    var HYVOR_TALK_CONFIG = {
                        url: '<%= item.permalink %>' || false,
                        id: '<%= item.path %>' || false
                    }
                </script>
                <script type="text/javascript" src="//talk.hyvor.com/web-api/embed"></script>
            <% } %>
            <!-- End of Hyvor comments -->
            
        </div>
    </div>
</article>
```

Replace the **WEBSITE_ID** with the **Website ID** from your Hyvor account, and check a post on your blog. You should see comments section at the end of the post. That's it, you have commenting available on the page.

We can adjust few more things before we customize the looks of the comments containers.

First thing is to disable or enable comments in a post by switching the **comments** field in the frontmatter. 
The field's value is **true** by default, even if we don't include it in the frontmatter. Obviously, **false** will disable commenting.

```yml
...
subtitle: Angry Chaired Blog is a chronicle of my learning of web development. It is a collection of posts, usually belonging to a bigger project. While each project does have an idea and a set of overarching goals, posts are usually concerned with solving a specific problem.

comments: false
---
```

We can also enable lazy mode when loading comments. This way comments will load when we either scroll to the bottom of the screen, or when we click on the button to load comments.

We do this in the same html snipper we added to the **article-full.js** file:

```html
<% if (!index && post.comments){ %>
  <div id="hyvor-talk-view"></div>
  <script type="text/javascript">
      var HYVOR_TALK_WEBSITE = 1583; // DO NOT CHANGE THIS
      var HYVOR_TALK_CONFIG = {
          url: '<%= item.permalink %>' || false,
          id: '<%= item.path %>' || false,
          loadMode: "scroll" // "click" is also available
      }
...
```

Note that the Hyvor team warns that lazy loading might harm your blog's SEO, so there is that.

Last thing is the value of the **id** property in the **HYVOR_TALK_CONFIG** object inside the comments snippet.
Its value should be permanent, so that Hyvor can always associate comments with their post. At the monent, this value is path of the page, as per the guide on Hyvor's blog. However, a post's path might change if we change the name of the post file. 
Something to think about.

### Customize the looks for the comment containers

We can change appereance of the comment containers when we log into our account on Hyvor's website. 
Style can be adjusted in two tabs: **Appereance** and **Community**. It is all pretty simple, but I just wanted to point to the **Reactions** option in the **Community** tab. This lets you disable those reaction icons above the commenting field. 

And that is it. Pretty simple, really.
To be honest, the Website ID should probably be stored in an environment variable, but I it seems a bit longer thing, so will leave it for later.

In the next post we will finally deploy our website to Github Pages.

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
6. Install new theme
7. **Add comments to the blog**
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


