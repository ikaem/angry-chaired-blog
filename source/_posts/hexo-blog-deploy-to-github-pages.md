---
title: 'Hexo Blog: Deploy to Github Pages'
date: 2020-08-17 09:50:09
tags: 
- hexo
- blog
- deploy
- github pages
categories: hexo blog
cover: dino-aganovic-oZInUnTLERU-unsplash.jpg

creditArtist: Dino Aganović
creditSource: https://unsplash.com/@bur4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part Part 8 of 8 in Hexo Blog

Finally, we reached the deployment part. We will deploy to Github Pages, and we will use the [One-command deployment option](https://hexo.io/docs/github-pages#One-command-deployment).

<!--more-->

#### See [Project Information](#Project-Information)

## Step 8: Hexo Blog: Deploy blog to Github Pages

There is not much to it. 
First we need to install **hexo-deployer-git**:

```bash
npm i hexo-deployer-git
```

Then we have to configure it in the root **_config.yml** file. 
We add the following snipper specifying type of deployment, repository of our project on Github, and branch to which we are deploying. In this case, we are deploying to the **gh-pages** branch

```yml
# Deployment
deploy:
  type: git
  repo: https://github.com/ikaem/angry-chaired-blog.git
  # repo: https://github.com/<username>/<project>
  # example, https://github.com/hexojs/hexojs.github.io
  branch: gh-pages
```

Finally, deploy the website with:

```bash
hexo clean && hexo deploy
```

Once the deployment is done, go to your repository, and navigate to the **settings** tab. 
Scroll down to **Github Pages** section, and make sure that the **Source** is **gh-branch**. 

Then click on the link to your website, and voila!

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
7. Add comments to the blog
8. **Deploy blog to Github Pages**

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



