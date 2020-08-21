---
title: 'Hexo Blog: Create Hexo Projext'
date: 2020-08-17 08:31:18
tags:
- hexo
- blog
categories: hexo blog
cover: nancy-hann-cnktbiZJICw-unsplash.jpg

creditArtist: Nancy Hann
creditSource: https://unsplash.com/@travelingwithpurpose?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 1 of 8 in Hexo Blog

I wanted to try Hexo to move away from Wordpress. It is that simple. 
Wordpress is big, there are tons of options, and they require lots of clicking. 
I just need a simple blog, and Wordpress seems to be aimed for much more than that.

I did try Hexo before, and I just didn't find it interesting. Right now, though, I had a reson to dig deeper. Hexo generates static files, so that is cool. It uses Markdown, and it supports themes and plugins. So I decided to give it another shot. 

That's pretty much it. I don't have any big idea here, but I have instead decided to follow its [documentation](https://hexo.io/docs/), and add features that I find interesting. 

<!--more-->

#### See [Project Information](#Project-Information)

## Step 1: Create a Hexo project

It is very easy to setup and use Hexo. It only requires Node and Git to get started, and then we can use its CLI to create projects and content.

I will not go into [installing Node and Git](https://hexo.io/docs/), but will focus exclusively on things specific to Hexo. 

In this part we will:

1. Create a new Hexo project
2. Initialize Git and create a Github repository
3. Folders and files of a Hexo project
4. Start Hexo server

### Creat a new Hexo project

To start working with Hexo, we first need to install Hexo Cli

```bash
    npm i hexo-cli
```

This now makes Hexo commands available to us. 

Let's immediately start creating our blog.
Navigate to a folder in which you wish to create your blog, and run Hexo command:

```bash
hexo init .
```

This will create a Hexo project in your current folder. Hexo will install default theme, and it will clone a hexo starter from Github to use in your project. It will also use npm (or yarn, if you use it) to install required dependencies.

Not all dependencies included in **package.json** are installed now, however. We should do that too, to make sure we have access to **hexo-server**. We will talk more about this later in the post. 

```bash
npm install
```

Make sure you call this command in the root folder of the project, to prevent creating a **node_modules** folder elsewhere on your system and not having dependencies available in the project.

### Initialize Git and create a Github repository

We will also make sure that our project is backed up on Github.

Create or login to your Github account, and then create a new Github repository.
Give it a name and click on **Create repository**, without modifying other default settings. 
I named my repository **"angry-chaired-blog"**
You will be rederected to to a **Quick setup** page, from which you can copy everything from the commandes block under **"…or create a new repository on the command line"**.

```bash
echo "# angry-chaired-blog" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/ikaem/angry-chaired-blog.git
git push -u origin master
```

This will create a **README.md** file in your project, initialize a git repository on your system, and save (commit) the current state of your project to the local repository.
It will also connect your local repository to the Github repository we have created, and then copy the current local commit to the remote one. 
By having the remote repository in addition to the local one, we can collaborate with other people, and just generally have a remote backup too.

Finally, we will create an additional branch of our local repository and call it **"testing"**. When we first initialize a git repository, we start in the default **master** branch. I don't want to do the initial work there, however. I want to work in an isolated place, and if everything is ok and I am happy with the end product, I will merge the **testing** branch with the **master** one.

We will create and switch to the master branch with one command. This will use the current state of the **master** branch to create a new one, and then we can continue working from where we left off in the **master**

```bash
git checkout -b testing
```

Great. Now we are ready to work on the blog.

### Folders and files of a Hexo project

When initialized, a Hexo project has the following folder structure (cut for brevity): 

```
|   .gitignore
|   package-lock.json
|   package.json
|   _config.yml

+---.deploy_git

+---node_modules 

+---scaffolds
|       draft.md
|       page.md
|       post.md

+---source
|   \---_posts
        | new-post.md

\---themes
    \---landscape
        |   _config.yml
        |   ...   
```

Let's go over some of the folders and files.

- **_config.yml** is used to modify the site, configure plugins, adjust deployment settigs, and more. We will go over it in more details in one of the following posts.
- **scaffolds** folder holds templates for content types of our blog. Default layouts are page, draft and post, and we use these to actually create new pages, posts and drafts. We will go into these.
- **source** folder is the most used folder, in my experience. We put our posts, categories, images, css and such in this folder.
- **themes** folder is used to store themes. Each theme is stored in its own folder, and usually has its own **_config.yml** file to configure the theme. 

### Start Hexo server

Since our project already has a post in it, let's see how our website and the post look like.

We have two options:

1. We can generate static files from our project, and then start a local server that will serve those static files
2. We can start a local server that will serve in-memory files

#### Serving static files

By using this option, we get to see the folder structure of the generated static website.

To serve static files, first we have to generate them.
We do so with 

```
hexo generate
```

This command creates **public** folder in our project's root, and puts generates static HTML, CSS and JS files out of our project files.

```
|   index.html
|   
+---2020
|   \---08
|       \---13
|           \---my-new-post
|                   index.html
|                   
+---archives
|               
+---css
|           
+---fancybox  
|       
\---js
        

```

Then, we need to serve those files:

```bash 
hexo server -s
```

This will start a local server on port 4000, making our blog available on **"http://localhost:4000/"**. 
The **"-s"** flag is used to instruct the Hexo Server to serve only static files from the **public** folder

Cool. Go and visit your website now. The blog and the default post are there, but to be honest, the default **landscape** theme is not creating a great first impression. We hope to improve this later. 

Now, lets stop the server with CTRL+C. We should also delete the public folder and clear the cache with so it doesn't interfere with our future work on the app.

```bash
hexo clean
```

The **hexo generate** command can also accept options. We add **-w** flag to it to instruct Hexo to generate static files and then watch for changes and update static files accordingly. This way would not have to stop the server and regenerate static files every time we want to see how are changes look like in the blog

```bash
hexo generate -w
```

Now we can serve static files as before, but we have to do it from another terminal window because the original one is used to watch for changes.

#### Serving in-memory files

Seving in-memory website is a more convenient way, but the folder structure is obscured from us. 

```bash
hexo server
```

That is it. We stop the server and clean the cache in the same ways we did in the previous case

We reached the end of this post. We learned how to create a Hexo project, what gets created, and how to create an actual website from it. That's a lot of creation, not to mention creation of git repositories too. Huh.

In the next post we will create some content. We will start with creating posts, and then learn how to create pages and drafts. Its not complicated. We are creators, we will work it out. 

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

1. **Create a Hexo project**
2. Create content
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

