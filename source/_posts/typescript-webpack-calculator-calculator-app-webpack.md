---
title: "TypeScript & Webpack Calculator: Calculator App & Webpack"
date: 2020-09-04 20:18:23
tags:
  - typescript
  - webpack
categories: ts webpack calculator
cover: laura-dewilde-h1aRw9D35dg-unsplash.jpg
creditArtist: Laura Dewilde
creditSource: https://unsplash.com/@lauradewilde97?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 3 of 3 in TypeScript & Webpack Calculator

In this post, we will use Webpack with our app. Webpack is a tool than bundles modules. The way I see it, it creates one big (but small) JS file out of existing JS modules. With our app having only two (questionable) modules, using such a bundler is a definite overkill. That's why we're doing it.

<!--more-->

#### See [Project Information](#Project-Information)

According to the documentation and online stuff, Webpack can do much more than bundling. It provides a neat little development server with support for hot reloading, and can convert TS files to JS with help of plugins. Outside of these three things, it is all Greek to me, so we will juggle these three things for now.

## Step 3: Webpack setup

Here is what we will do:

1. Install Webpack, plugins and other necessary tools
2. Configure Webpack, web-dev-server, and TypeScript to build and serve bundles

### Install Webpack, plugins and other necessary tools

First things first, we need to install things.
We need:

- webpack, the actual tool that bundles our files
- webpack-cli, a tool to run webpack commands in the terminal
- webpack-dev-server, a tool that sets up a webpack dev server, watches and reacts to changes in our code, and serves our website
- typescript compiler to be used locally just for this specific project
- ts-loader, a tool to help webpack convert TS files to JS

These are all development dependencies, so we will add -D flag when installing them from NPM.

```bash
npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader
```

### Configure Webpack and TypeScript to build development and production bundles

Let's configure things now.

We will return to the **tsconfig.json** file first.

To make this works, make sure that:

- **target** is set to **"es6"**
- **module** is set to **"ES2015"**
- **outDir** stays uncommented, and pointing to output folder. In this case, this is **"/public"**
- **rootDir** is commented out. We don't need it for this part, as Webpack will determine where our source files are.
- **"sourceMap"** stays uncommented, and **true**

Next, we will create files that Webpack will use to build our bundle.

We will create:

1. Configuration file for development
2. Configuration file for production

#### Configuration file for development

The file we are creating is a JS file, and needs to be called **webpack.config.js**. We will place it in the project root.

The file exports an object whose properties are used to configure Webpack.
It uses Node.js features, so we need to export the object with Node export syntax.
Inside, we will also require the **path** module, as we will need it to resolve absolute paths to couple of folders in the project.

```js webpack.configure.js
const path = require("path");

module.exports = {};
```

The **webpack.config.js** we are working on will be used to generate a bundle for development. Later, we will create another configuration file for production.

Here are the properties that we add to the exported object:

- **mode** - we will set this to **development** for now, to tell Webpack that we work in development mode. Webpack will use this to make less optimizations when bundling modules
- **entry** - this is a string holding a relative path to the file which starts the application. For us, this is **"./src/app.ts"**
- **output** - this is an object holding information about the output location. We add to properties here: **filename** and **path**, holding the name of our bundle (**"bundle.js"**) and the absolute path to the **public** folder, respectively.

Here is what we have so far:

```js webpack.config.js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
};
```

Next , we add **devServer** property, which is an object that configures **webpack-dev-server**. Inside, we will specify only one property, but the object can hold more than that.

- **contentBase** - holds abolute path to the **public** folder. This tells dev-server where it should look to find static files it needs to serve. Since our **index.html** is inside the **public** folder, this is what we need.

```js webpack.config.js
const path = require("path");

module.exports = {
  // ...
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
  },
};
```

Note that **webpack-dev-server** servers bundles from memory, so with this setup it will use only **index.html** from the **public** folder. The **bundle.js** file that **index.html** uses will come from the **dev-server**'s memory.

Following that, we will add a property called **devtool** to the **webpack.config.js** exported object. With this we make sure that we can use TS files source maps. The **"inline-source-map"** value will tell Webpack that we will already have source maps generated, and that Webpack should connect to these maps. That's the limit of my understanding of this property.

```js webpack.config.js
const path = require("path");

module.exports = {
  // ...
  devtool: "inline-source-map",
};
```

Next is adding support for TypeScript. We do with another object called **module**, to which we add a property called **rules**. This property is an array, and is used to define what Webpack should do with specific modules.
In this case, we want all TS modules to use **ts-loader**.
We also exclude the **node_modules** folder from this test.

```js webpack.config.js
const path = require("path");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.ts/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
```

Note that both **test** and **exclude** use **Regular Expression,** which I really can't be bothered to learn now.

Finally, we add the **resolve** property to the **webpack.config.js** export. It is an object that holds **extensions** array. Inside, we specify extensions of files that Webpack will add to imports it finds in modules.
By default, Webpack adds **.js** extensions to the imports, but we want it to add **\*.ts** as well.

```js webpack.config.js
const path = require("path");

module.exports = {
  // ...
  resolve: {
    extensions: [".ts", ".js"],
  },
};
```

With this, we can remove the **.js** extension from the **app.ts** module, as Webpack will be taking care of that now.

```ts app.ts
import Calculator from "./calculator";
// ...
```

We will also replace **app.js** script with **bundle.js** in **index.html**

```html index.html
<script src="bundle.js" type="module"></script>
```

With this, we have configured how Webpack will create development bundles.

We will now create a script in **package.json** to get the **webpack-dev-server** started.
When starting, it will use Webpack's development configuration to create bundles in memory. It will then search for static **public** folder, and it will serve **index.html** file that it finds there.

Here is the script:

```js package.json
"scripts": {
    // ...
    "start": "webpack-dev-server"
},
```

Assuming your **index.html** is present in **public** folder, lets enter command **npm run start**, and visit **localhost:8080** where **webpack-dev-server** serves the development app by default.

We should see our calculator there. Try changing something in either of the modules, and see how hot reloading works too.
Great.

#### Configuration file for production

In the end, we also need a production bundle.

We will make it simple and make a copy of the existing one and rename it to **webpack.config.prod.js**. This is not a predefined name, and we can call the file anyway we like.

We will just modify it a bit before we actually use it for generating production bundles.

- **mode** - change to **"production"**
- **devServer** object - is not needed and can be completely removed
- **devtool** - change to **"none"**, to indicate that we don't need any source maps

Here is the **webpack.config.prod.js** file:

```js webpack.config.prod.js
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./public"),
  },
  devtool: "none",
  module: {
    rules: [
      {
        test: /\.ts/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
};
```

Last thing is to add a script to **package.json** that will have Webpack build a production bundle using this configuration file.

```js package.json
"scripts": {
    // ...
    "build": "webpack --config webpack.config.prod.js",
},
```

That's it. 
Try running the command in terminal:

```bash
npm run build
```

You should see **bundle.js** file generated in **public** folder after the script finishes. 
**index.html** and **styles.css** are both there, too, so we can deply the app and start calculating.

Great. This is done too. We used Webpack to assemble our TS modules into a JS bundle, and have ti do whatever optimization it does. Good times.

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at

- [Github repository](https://github.com/ikaem/overkillkulator)
- [Live website](http://kaem.freecluster.eu/apps/overkillkulator/)

### Goals

1. Copy Web Development Simplified's JS calculator with TypeScript and Webpack
2. Use Tailwind to style the app

### Steps

1. Setup and styling with Tailwind
2. TypeScript setup and coding the calculator
3. **Webpack setup**

### Tech and Tools

1. Tailwind
2. TypeScript
3. Webpack

### Experience with Tech & Tools

I haven't done anything with Tailwind before, except for few crash courses. I did a course on Webpack setup, too, and used that as a guide for this project. As for TypeScript, I think that by now I settled into using it comfortably on a limited level.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
