This is just copy
No hover, no animation, no responsivness, no mobile, just desktop

Separate into 

1. framework 
2. design 
3. html 
4. css


The idea

I wanted to start a little ongoing project to copy website design. Ideally, I would like to find a nice website, and then copy it to make it simpler in terms of HTML and CSS. Because that is what I am about, simple :).

I would also like to change tech when copying. For instance, this first project was styled using Bootstrap, and I copied it by using pure CSS. I hope to do a next one by converting pure CSS to a CSS framework, then use Sass, a different framework, and so on.

Why did I do it? Well, I feel I am struggling with page design. I did some courses, and read some books, but the shapes, and placements, and colors, and layout, it all escapes me. That's why. 

This first project was me copying the [Landbot](https://landbot.io/)'s home page. Landbot provides a way to implement a chatbot into a website. So much for that. 

Few things to mention:

1. I only copied one size of the website, the desktop one. 
2. I did not do any animations, any hovers, nor any interactivity.
3. The website changed a bit during the period I worked on the copy (4 days).
4. I tried to make the thing as simple as possible, in all phases. 
5. I am not sure if it is legal in any country to copy a website and then put that copy online. I am counting on Landbot team to understand that this is for learning purposes. 


The project is split in four parts:

1. Do framework
2. Do design
3. Do HTML
4. DO CSS

## Do framework

I wanted to do framework to see how the elements on the page are actually laid out. It took some time to place all major elements where they belong, but it worked out well.
Note that the framework does not represent the actual HTML elements. It is merely showing the most prominient elements on the page. 

Here is the full framework:
// image here

Generally, the page is centered in the middle, with a lot of white space. 
Two patterns dominate the main content area: 

- Section with two side-by-side boxes
- Section with stacked boxes

More specifically, the page is split into four sections:

1. Header
2. Main content
3. Some sort of fake footer area
4. Footer

### Header
   
Header is pretty simple. As far as the framework is concerned, it is just a container holding two side by side boxes. 
The right box holds the navigation, while the much smaller one on the left is the logo.

### Main content

Main content in nicely aligned in the middle. 

The first, hero section, has that general side-by-side pattern. It also has some boxes scattered all over the right one. I wasn't really sure how to approach that. 

Othe content in this section is pretty simple. Lot of it actually repeats, by either switching sides of images and text in the side-by-side pattern, or by replacing a row of images with a text box in the stacked pattern.

3. Fake footer area

Fake footer area is a stripe that spans entire length of the page, and then has an additional boxes under it. 
I actually messed up this part when writing HTML. I wrapped both second and third section into the **&lt;main\>** element, and then centered the **&lt;main\>** and set its width smaller than the page. Luckily, I learned a trick from HTML in the orignal page, and got away with it. We will see it later. 

4. Footer

It is just a regular footer, with bunch of links. 
The only thing remotely interesting is that the links box on the far end does not extend all the way to the end of the content container.