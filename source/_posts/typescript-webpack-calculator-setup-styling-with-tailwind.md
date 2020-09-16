---
title: "TypeScript & Webpack Calculator: Setup & Styling with Tailwind"
date: 2020-09-04 07:33:12
tags:
  - typescript
  - webpack
  - tailwind
categories: ts webpack calculator
cover: jose-gasparian-LCUu1J5q-qw-unsplash.jpg
creditArtist: José Gasparian
creditSource: https://unsplash.com/@jgasparian?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 1 of 3 in TypeScript & Webpack Calculator

I wanted to work on my Tailwind skills, and I figured to start with a small app. A calculator seemed as good an option as any, so I went with that. Since I was doing something "simple", I decided to throw Webpack in it too. Obviously, I was going to use TypeScript, and there you go, a project. Boom.

<!--more-->

#### See [Project Information](#Project-Information)

Using all these tools for such an app is obviously an overkill. On the other hand, it was easier for me to see how it all comes together when the app was doing only a simple thing.

Except, it turned out not so simple.
I based the entire thing on [Web Development Simplified](https://www.youtube.com/watch?v=j59qQ7YWLxw)'s Vanilla JS calculator. I copied their style with Tailwind, and figured I was going to take a brief look on their calculator logic, just to see how to start. I ended up battling with my own logic so hard, I eventually returned to copy their code, and ended up admiring simple solutions they used.
I will get into this more in the next post.

## Step 1: Setup and styling with Tailwind

Let's start with Tailwind.
[Tailwind](https://tailwindcss.com/) is a CSS framework that provides a bunch of premade [classes](https://tailwindcss.com/docs/margin) that do only one or few things. For instance, their class **mt-4** sets top margin on an element to be four of their units (which is **1rem**). The **flex** class sets an element to be a CSS flexbox container.
Basically, it is as if we made our own CSS rules made out of classes and few declarations, and then used those classes in HTML. Only, they made those rules for us. It's very practical.

Tailwind can be used in several ways. For instance, we can get Tailwind's CSS stylesheet via [CDN](<https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"), or we can install it with npm. We will use the latter approach because this is what courses tought me. Also, it allows us to configure Tailwind to fit our needs, which we can't do with the first approach.

Here is what we will do in this post:

1. Install and set up Tailwind
2. Style app with Tailwind's default classes
3. Customize Tailwind to style the app further

Note that I won't go in every detail, but will focus on few examples.

### Install and set up Tailwind

Assuming we have our project folder created, and **package.json** file initialized, we can install Tailwind:

```bash
npm i tailwindcss
```

Next, we should create two folders in the project root.

One folder, lets call it **src**, we use to hold the CSS source stylesheet. This stylesheet imports Tailwind's styles with the **@tailwind** directives.
Let's call this stylesheet **styles.css**, and put those directives in it:

```css src/styles.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Going back to the project root, we create another folder and call it **public**. This folder should contain the app files like **index.html** and JavaScript modules that will eventually be deployed to a server.
We don't create any CSS files in this folder for now, but we do make sure that the **index.html** file links to a stylesheet called **styles.css** inside the folder. We will have Tailwind create this particular stylesheet for us in a second.

```html index.html
<!DOCTYPE html>
<html lang="en" class="h-full">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OverkillKulator</title>
    <link rel="stylesheet" href="styles.css" />
    <!-- ... -->
  </head>
</html>
```

Finally, let's get Tailwind to generate a stylesheet for us.

Inside **package.json**, we add a new script. It will call Tailwind and have it take **styles.css** from **src** folder, build a new stylesheet out of it, and output it into the **public** folder.
We call this script **build-css**.

```js package.json
  "scripts": {
    "build-css": "tailwindcss build src/styles.css -o public/styles.css"
  },
```

Very nice.
Now, try running the script in terminal:

```bash
npm run build-css
```

After the script has finished, a **styles.css** file exists in the **public** folder. Looking at it, it is full of Tailwind classes that we can use to style our app. It also normalizes the style to remove browsers' default styles.

### Style app with Tailwind's default classes

Let's use some of those classes.
We will only focus on those that are required to make the calculator look like the WDS one, with just a few tweaks to adjust to smaller screens.

Here is the list of classes we use:

- Height and width
- Colors and background colors
- Margins and padding
- Grid
- Text
- Breakpoints and responsive classes

#### Height and width

To specify an element's height, we can give it **h-**.
For instance, **h-full** on **html** and **body** element sets their height to be 100% of what is available to them. **h-10**, on the other hand, specifies that height should be 2.5rems.

```html Tailwind height classes
<html lang="en" class="h-full">
  <!-- ... -->
  <body class="h-full">
    <!-- ... -->
    <div class="h-10">Prev Operand</div>
    <!-- ... -->
  </body>
</html>
```

Setting width is very similar. It is done with **w-** classes, like with the container that has **w-full** class which makes it take all available width.

```html Tailwind width classes
<div class="w-full sm:max-w-sm">
  <!-- ... -->
</div>
```

Note that the same container has a **max-w-sm** class. Ignoring the **sm:** prefix for now, this class allows for maximum width of the container to be 24rems, which is what **-sm** suffix stands for.

#### Colors and background colors

Tailwind allows for a very simple way to specify background colors. Here, we have a container whose background color is black, set with **bg-black**, and whose background opacity is 75%, set with **bg-opacity-75**.

```html Tailwind's background classes
<div
  class="col-span-4 text-right bg-black bg-opacity-75 text-gray-100 p-5 h-display "
></div>
```

We can have gradient backgrounds too. The **bg-gradient** specifies that we are using gradient background, and **bg-gradient-to-** classes specify the direction. In this case the direction is from left to right.
The we have the color from which we start, and color to which we go. In this case they are blue and green.

```html Tailwind's background gradients
<body class="bg-gradient-to-r from-blue-500 to-green-500"></body>
```

Note the **-500** suffix in the color classes. Those indicate shades of the color, and go from 100 to 900. They are available on all Tailwind [colors](https://tailwindcss.com/docs/customizing-colors#default-color-palette) except black and white, obviously

#### Margins and padding

Margins and paddings are set by using **m** and **p** classes, respectively.

For instance, the **main** element gets a padding of 12 units (3rems) on the **y** axis with **py-12** class:

```html Tailwind's margins and padding
<main class="py-12"></main>
```

The **div** has padding of 4 (1rem) in all directions and **auto** margin on **x** axis with **mx-auto**

```html Tailwind's margins and padding
<div class="p-4 mx-auto"></div>
```

#### Grid

CSS Grid is activated with the **grid** class. Then, we can further customize the grid by specifying number of its columns with **grid-cols-** classes. Here, we use the **-4** suffix to set a grid with four columns.

```html Tailwind's Grid
<div class="grid grid-cols-4"></div>
```

To specify how many columns a grid item should take, we can use **col-span-** classes. Here, a div spans all four classes with the **4** suffix.

```html Tailwind's Grid
<div class="col-span-4"></div>
```

#### Flex

Setting up the Flexbox is also very simple. We activate it with **flex** class, and then can justify its contents in the center with **justify-center**. The div here as its items centered with **items-center**, too.

```html Tailwind's Flexbox
<div class="flex justify-center items-center"></div>
```

If we wanted to set a different direction of the Flexbox, we could add the **flex-col**, **flex-col-reverse**, **flex-row**, and **flex-row-reverse** classes.

#### Text

Tailwind offers a variety of classes to work with text.
Here we see a div element whose text is justified to right with the **text-right** class, and colored white with the **text-white** class. Another div has its text sized to 1.5rem with **text-2xl** class, and set to **bold** weight with the **font-bold** class.

```html Tailwind's text
<div class="text-right text-white"></div>
<div class="text-2xl font-bold"></div>
```

#### Breakpoints and responsive classes

Tailwind comes with several classes with which we can specify how our styles behave at certain screen sizes.
Taking the already mentioned example with class **sm:max-w-sm**, we say that this style should be applied only when screen is of **sm** size and larger. In this case, ignore the **-sm** at the end, and focus on the prefix - **sm:**.

```html Tailwind breakpoints
<div class="w-full sm:max-w-sm">
  <!-- ... -->
</div>
```

For screen sizes, **sm** equals 640px, and rest of the breakpoints classes are available in Tailwind's [documentation](https://tailwindcss.com/docs/breakpoints).

### Customize Tailwind to style the app further

Using Tailwind's predefineds classes is convenient, but sometimes we want to stray from the defaults.

For instance, we might want our text to have a size or a color that Tailwind's classes do not provide.
Also, styling an element might result in a long list of Tailwind's classes, which makes our code unreadable. We can fix that.

Here is what we will do:

1. Create Tailwind configuration file
2. Add custom classes to Tailwind
3. Combine multiple classes into a single class

#### Create Tailwind configuration file

Tailwind's full configuration file is a JS file containing all values that Tailwind uses to define its classes.
We generate it with following command:

```bash
npx tailwindcss init --full
```

The config file is created in the root of the project, and looks like this:

```js Tailwind configuration file - snippet
module.exports = {
  purge: [],
  target: 'relaxed',
  prefix: '',
  important: false,
  separator: ':',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      black: '#000',
      white: '#fff',

      gray: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#a0aec0',
        600: '#718096',
        700: '#4a5568',
        800: '#2d3748',
        900: '#1a202c',
      },
```

Here we can see that the config file exports an object which has a property **theme**. This property is an object containing various other objects which represent various Tailwind classes.
For instance, we see that **lg** property under **screens** has a value of 1024px, resulting in a breakpoint class of **lg** which will get applied when screen size is 1024px.

We could modify Tailwind by modifying this file, but let's not. Instead, we will rename it to **tailwind-default.config.js**, and use it as a reference.

Then, we will create a new config file, and use that one to customize (extend) Tailwind styles.
Also, we will generate an empty one, to have an easier job working with it:

```bash
npx tailwindcss init
```

Here is the generated empty config file:

```js Tailwing's empty config file
module.exports = {
  purge: [],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
```

Note that Tailwind still uses its own default values, even though we have an empty config file. If we add anything to this file, it will get added to Tailwind's default styles.

#### Add custom classes to Tailwind

WDS uses a background gradient with colors that are a bit different to the **blue-500** and **green-500** colors we use. They are **#00ABE1** for blue, and **#00CE91** for green, and they don't match (I didn't check this for a fact, though) any of the Tailwind's colors.

So let's add them to Tailwind's styles.

To do so, we will add a **colors** property in the **tailwind.config.js** file, inside the **extend** object.
**colors** is an object, and we will create another object to hold these colors. I called this object **gradient-part**, and properties in it are **blue** and **green** with their matching hex colors provided as strings.

```js Adding custom colors to Tailwind's configuration file
module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        "gradient-part": {
          blue: "#00ABE1",
          green: "#00CE91"
        },
// ...
```

Now, we need to rebuild the **styles.css** stylesheet in the **public** folder, to make sure new classes are added to the it.

```bash
npm run build-css
```

Great. Here is a snippet of our newly generated **styles.css**, holding new color classes. Shown here are colors as part of background class, but they are added to all other classes that work with colors.

```css styles.css containing custom color classes - snippet
/* ... */
.bg-gradient-part-blue {
  --bg-opacity: 1;
  background-color: #00abe1;
  background-color: rgba(0, 171, 225, var(--bg-opacity));
}

.bg-gradient-part-green {
  --bg-opacity: 1;
  background-color: #00ce91;
  background-color: rgba(0, 206, 145, var(--bg-opacity));
}
/* ... */
```

Finally, to use these colors in the background gradients, we add their classes to the **body** element of our html.
Note that the name of the object containing colors, **gradient-part** is part of the class name, together with the name of the actual color, **blue**.

```html Using custom color classes to set background gradients
<body
  class="bg-gradient-to-r from-gradient-part-blue to-gradient-part-green"
></body>
```

Tailwind also allows to add our own fonts to the theme.
To do so, I imported a Google Font called Lato into the Tailwind's source **styles.css** stylesheet, in the **src** folder.

```css src/styles.css
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap");
```

Then, we add an object called **fontFamily** to the **extend** object of the **tailwind.config.js** file.
Inside the **fontFamily** object we create an array with whatever name we want (I used **lato**), and add a string to it which holds name of the font we imported. In this case, the array element is **"Lato"**.

```js Adding custom fonts to Tailwind
module.exports = {
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        lato: [
          "Lato"
        ]
      },
```

We rebuild the stylesheet again, and then we can use the class in our HTML.

The class will be **font-**, plus name of the array we created in the **fontFamily** object:

```html Using Tailwind's custom font classes
<body class="font-lato"></body>
```

Let's make another extension of Tailwind's default styles.
The calculator grid that WDS uses has six rows, of which the first one is a bit taller than the rest. It is the one that holds the actual screen where data is printed.

Unfortunately, Tailwind's default classes only allow grid rows of equal sizes. Fortunately, we can add our own grid row styles.

Let's add another object in the **extend** object of the **tailwind.config.js**, and call it **gridTempalteRows**.
This object will hold a single property (but it could hold more) called **calc**, and its value will be a string specifying **grid-template-rows**.

```js Adding Grid template rows styles to Tailwind
module.exports = {
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        lato: [
          "Lato"
        ]
      },
      colors: {
        "gradient-part": {
          blue: "#00ABE1",
          green: "#00CE91"
        },
        "prev-operand": "rgba(255,255,255,0.75)"
      },
      gridTemplateRows: {
        'calc': 'minmax(120px, auto) repeat(5, 96px)',
      },
// ...
```

Rebuild the stylesheet again, and let's add the new class to our html.

```html Adding custom grid template rows class to an element
<div class="grid grid-cols-4 grid-rows-calc"></div>
```

And boom. That's it. We have a calculator screen with lots of space.

### Combine multiple classes into a single class

As we keep styling our app, HTML elements get added more and more classes.
Here is an example of the div element that serves a number button:

```html Tailwind classes on a button div
<div
  class="bg-white bg-opacity-75 flex justify-center items-center border border-white cursor-pointer"
  data-number
>
  1
</div>
```

Obviously, this list of classes is coming close to being unreadable. 
Luckily, Tailwind provides a way for us to combine multiple classes into one, and then use that one as a reference for all other ones.

We do this in the source **styles.css**, by defininng a regular CSS class and adding an **@apply** directive to it. 
Then, we pass all classes from our button to the directive.

Here it is:

```css Creating a custom utility class with "@apply" directive
/* ... */
.button {
    @apply bg-white bg-opacity-75 flex justify-center items-center border border-white cursor-pointer;
}
```

Then, we rebuild our stylesheet, and replace previous button classes on our button div with the custom **button** class we have just created:

<div
  class="button hover:bg-opacity-100"
  data-number
>
  1
</div>
```

We also added a **hover:** class to the button. Hover styles are activated with the **hover:** keyword followed by any regular Tailwind class immediately after. 

Note that CSS pseudo classes such as **:hover** cannot be used with Tailwind's **@apply** directive. This means that we cannot do this:

```css We cannot pass pseudo classes to @apply directives
/* ... */
.button {
    @apply hover:bg-opacity-100 bg-white bg-opacity-75 flex justify-center items-center border border-white cursor-pointer;
}
```

Instead, we add them directly to an html element, like we did with **hover:**, or we use a pseudo class on a regular CSS class in the source **styles**, and use **@apply** directive inside

```css Using @apply directive with regular pseudo class selector
.button:active {
    @apply text-white bg-white bg-opacity-50 border-0;
}
```

And we are done.
We have seen how to install Tailwind, use its default classes, and how to customize it to add our own styles. We also tidied up things a bit by storing classes into a single one with the **@apply** directive.
With all of that, our calculator looks almost the same as the WDS one. Happy times.

In the next post we will move on to integrate TypeScript into our project, and actually code the calculator functionality. See you there.

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

1. **Setup and styling with Tailwind**
2. TypeScript setup and coding the calculator
3. Webpack setup

### Tech and Tools

1. Tailwind
2. TypeScript
3. Webpack

### Experience with Tech & Tools

I haven't done anything with Tailwind before, except for few crash courses. I did a course on Webpack setup, too, and used that as a guide for this project. As for TypeScript, I think that by now I settled into using it comfortably on a limited level.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
