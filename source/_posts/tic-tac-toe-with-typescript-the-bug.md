---
title: "Tic Tac Toe with TypeScript: The Bug"
date: 2020-09-08 09:12:57
tags:
  - typescript
  - games
categories: ts tic tac toe
cover: radek-3MLMpwt5Pj4-unsplash.jpg
creditArtist: Radek
creditSource: https://unsplash.com/@radkovsky?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 3 of 3 in Tic Tac Toe with TypeScript

We have a bug in the game. Exciting times. Start the game and click on the same field twice. Now click on another field. What?! The same icon appears, you say? How can that be possible? Let's find out.

<!--more-->

#### See [Project Information](#Project-Information)

The described behavior happens because the current code calls and executes code in the **checkGameStatus** method on every click. Since there is no check to prevent entering the method in case we already clicked on a field, the code checks if the current user has already made three moves. Assuming this is the second click on the same field after starting the game, code switches the player back to **"X"**, and adds a second move to the **gameMoves** array. We, however, cannot see any changes on the screen because the **insertIcon** method does not execute if there already is an icon in the cell.

So how do we fix this?

## Step 3: Insert game cells from the game class

This post is divided into:

1. Possible solutions
2. Modifying the class constructor
3. Generating cell in the class
4. Append cells to the DOM
5. Modify new and reset game functionality

### Possible solution

While you can probably figure out the solution by reading the post subtitle, let's go over some of the options.

The issue here is that the event listener on each grid cell continues to live after we click on it first time.
The **insertIcon** method successfully deals with this by checking the cell contents before it exectues its logic. However, **checkGameStatus** cannot use this trick. Its logic actually depends on the contents of the cell.

So what to do?
Here are few options

#### Remove event listener after the click.

JS does provide a method to remove an event listener from an element.
The method, **removeEventListener**, needs the event argument (**"click"** in our case), and the actual reference to a function that was used when the event listener was added.
To use this method, we should extract our function to a variable, and use it both when adding and removing the listener.

Here is an example:

```ts Removing event listener from an element
const listener = () => {
  console.log("this is listener");
};
element.addEventListener("click", listener);
element.removeEventListener("click", listener);
```

To solve our problem, we could use the listener function itself to remove event listener from an element.
We would need to define the listener inside the **forEach** loop, and then add use it with the event listener.
The listener function would call all needed methods in the class, and at the end it would call **removeEventListene**, and add itself as an argument

Here is the code

```ts Removing event listener from grid cells
// ...
playGridCells.forEach((cell) => {
  // defining listener function
  const listener = (event) => {
    // calling class methods
    exox.insertIcon(event.currentTarget as HTMLDivElement);
    exox.checkGameStatus(
      (event.currentTarget as HTMLDivElement).dataset as CellLocation
    );
    exox.displayGameStatus();

    // removing event listener from the current cell
    cell.removeEventListener("click", listener);
  };

  // adding event listener
  cell.addEventListener("click", listener);
});
```

That is it. This would fix the problem with clicking multiple times on the same cell. Since event listener is removed from each cell that was clicked on, we cannot click on it anymore. Done.

But, but, but. What about the case when we start a new game? We cannot click on those same cells while playing a new game.
We could pass the entire cells array to the **startNewGame** and **resetGame** methods, and then iterate over them to and attach new event listeners.
But, what about the cells were not clicked on, and that have their old event listeners still active? Those would make old and new event listeners register a click, and we would have the **checkGameStatus** execute twice. Argh!!
Can we remove old event listeners? We could if we had access to the original listener function, but that one was declared in the **forEach** loop, and is not available to the class.
Could we declare it in the global scope? Sure, but then we would have to pass it to the class. Which is not a big deal, I guess. Still, I wan't to have the code as compact as possible. We won't do it.

#### Use "{ once: true }" argument to the event listener

The **addEventListener** accepts the third argument, too. There are several possibilities to what the third argument can be, and one of those is an object holding a **once** boolean.
If used, it will automatically remove the event listener from the element after it is used first time.

```ts Using "{ once: true }" to use event listener only once
element.addEventListener(
  "click",
  () => {
    console.log("This event listener is used only once");
  },
  { once: true }
);
```

This is similar to what we did in the first solution, and it results in the same problem.
We could pass the entire cells array.... We're not doing it.

#### Create grid cells in the class and insert them into DOM for each new game

What we could do is create cell elements inside the class and append them to the DOM every time the new and reset buttons are clicked. Before this is done, we would remove all previous cells, thus removing all active event listeners.
We would need to create the cell HTML element inside the game class, and give it CSS classes. We would need to iterate over nine of them to assign correct data attributes on each individual cell, and finally, to append them to the grid container in the DOM.

It is a longer, complicated and fun approach that uses the bug as an excuse to do something new. We're doing it.

### Modifying the class constructor

Ok, here is the plan:

1. We modify the constructor to accept the grid cells container
2. We create the cell HTML element inside the game class, and equip it with required CSS classes and an event listener.
3. We create methods that remove existing grid cells and append new grid cells to the DOM
4. We call these methods from **startNewGame** and **resetGame** methods, and do a final cleanup

Let's cross the first list item, and do the class constructor now.

We need to select the grid cells container and store it in a variable:

```ts app.ts - Selecting the grid cells container
const gameGrid = document.getElementById("game-grid") as HTMLDivElement;
```

Then, we have the class constructor accept the new argument, and the game class passing it when the class instantiates

```ts app ts - The grid cells container argument
class Exox {
  constructor(
    public xScore: HTMLSpanElement,
    public oScore: HTMLSpanElement,
    public gameStatusBox: HTMLDivElement,
    public gameCellsContainer: HTMLDivElement
  ) {
    this.resetGame();
  }
  // ...
}

// game instance
const exoxGame = new Exox(
  playerXScore,
  playerOScore,
  gameStatusScreen,
  gameGrid
);
```

### Generating cell in the class

To generate the HTML element that will serve as a cell, we will create a helper function.
This function will return the element equiped with neccessary classes and a click event listener that calls methods of the class.

To create an element, we call **createElement** method available on the **document** object. We pass it a **"div"** string to indicate that we want a **div** element.

```ts Creating a div element
createGridCell = (): HTMLDivElement => {
  const gridCell = document.createElement("div");
};
```

Next is adding needed classes to the element. We will use the **classList** object available on the newly created element, and then call its **add** method to add multiple classes.
Note that these are **Tailwind** utility classes.

```ts Adding classes to the cell element
createGridCell = (): HTMLDivElement => {
  // ..
  gridCell.classList.add("game-cell", "hover:bg-teal-400");
};
```

Finally, we add the event listener and return the newly created element from the method.
The methods that we call from the listener are all the same as the methods we called from the event listener on the selector variable.
However, note that we are using **this** keyword to specify that we are calling methods in the instance of the game class. To make sure that **this** refers to the class method, we also make the listener an arrow function.

```ts Adding classes to the cell element
createGridCell = (): HTMLDivElement => {
  // ...
  gridCell.addEventListener(
    "click",
    (event) => {
      this.insertIcon(event.currentTarget as HTMLDivElement);
      this.checkGameStatus(
        (event.currentTarget as HTMLDivElement).dataset as CellLocation
      );
      this.displayGameStatus();
    },
    { once: true }
  );

  return gridCell;
};
```

That's it. We added the **{ once: true }** argument to the **addEventListener** method, to make sure each cell can be clicked only once.

### Append cells to the DOM

Now we can append the newly created cell element to the DOM.

Before we do that, let's create a method that will remove all existing cells from the DOM. We will call this method whenever new or reset buttons are clicked, to make sure the grid cell container is empty before we insert new cells.

To create this functionality, we will use the **firstChild** and **removeChild** properties available on DOM elements.

The **firstChild** property returns the first node inside an element. We will use it on the grid cells container.
The **removeChild** method removes a specified child on in a HTML element.
The idea here is to use a while loop to call **removeChild** as long as there is a **firstChild** node present on the grid cells container.

Here is the code:

```ts Removing cells from the grid cells container
removeGridCells = () => {
  while (this.gameCellsContainer.firstChild) {
    this.gameCellsContainer.removeChild(this.gameCellsContainer.firstChild);
  }
};
```

Nice. Now, we can create a method to append nine cell elements to the grid cells container.

There are few things we need to take care of before we actually do the appending.

1. We need to have an array with nine elements. We will loop over it and append a cell to the grid on every iteration
2. We need to attach correct data attributes to each inidvidual cell. We will create local column, row, and diagonal variables to do so. Then, we will modify these variables while iterating over the array to assign proper values to each cell.
3. We need to use **appendChild** method on the grid container to insert a node at the end of the current child nodes stack

#### The array

We create the array with the **Array** constructor, to which we pass an argument of **9**. This creates an array with the length of 9, but with no elements inside. This makes it unusable for any looping.
To make looping possible, we will assign an empty string to each position in the array by calling **fill** method on it, and passing it an empty string.

```ts Creating an array
const cells = new Array(9).fill("");
```

#### The data attributes variables

What a title, right?

Anyway, each cell has four data attributes:

- **data-cell-col**
- **data-cell-row**
- **data-cell-dg1**
- **data-cell-dg2**

We will create four variables to match the data attributes, and give them initial values:

- **col**, with initial value of 1, because first cell will be in the first column
- **row**, with initial value of 1, because even though the first cell is in the first row, this makes my math easier
- **dg1** and **dg2** both start as an empty string

```ts The data attributes variables
let col = 1;
let row = 0;
let dg1 = "";
let dg2 = "";
```

#### The loop

Now, we loop. Inside the loop, we assign correct data attribute to each cell, and we append the cell to the grid cell container.

Let's start with the data attribute for columns.
The **col** variable needs to increase by one on each loop iteration, and then return to 1 when it reaches 4. This will make each fourth cell get column attribute of 1.

Here is the code:

```ts attaching data attributes to cells in the loop
let col = 1;

cells.map((_, index) => {
  // creating the cell from the helper method
  const gridCell = this.createGridCell();

  if (col > 3) col = 1; // reverting to 1 when value reaches 4

  gridCell.dataset.cellCol = col.toString(); // assigning data attribute to the cell

  this.gameCellsContainer.appendChild(gridCell); // appending the cell to the cells container

  col++; // increase value by 1 on each iteration
});
```

Note that we are using the **dataset** object on the cell to insert data attributes.
Also, the data attributes are strings, so we are converting our **col** variable to string with the **toString** function.

Next up is the **row** variable.
Row value stays same for every three cells in a row, and then increases by 1 with every fourth cell.
This means that we should increase the value of **row** variable on every fourth iteration.
We accomplish this by checking if the current iteration index is divisible by 3. If yes, we increase value of the variable by 1.

Here is the code:

```ts attaching data attributes to cells in the loop
let row = 0;
// ...

cells.map((_, index) => {
  // ...

  if (index % 3 === 0) row++;

  gridCell.dataset.cellRow = row.toString();
  //   ...
});
```

Let's do the first diagonal now. It is the one going from top-left to bottom-right.
There are only three cells that are on this diagonal - 1st, 5th, and 9th.
In JS array counting, these are array elements at positions 0, 4, and 8.
Which makes it easy to see that if index of an element inside the array is divisible by 4, the cell attached to that element is on the first diagonal.

Here is the code:

```ts attaching data attributes to cells in the loop
let dg1 = "";
// ...

cells.map((_, index) => {
  // ...

  if (index % 4 === 0) dg1 = "true";

  gridCell.dataset.cellDg1 = dg1;
  //   ...

  dg1 = "";
});
```

It is a similar situation with the second diagonal, going from bottom left to top right.
Array positions of cells on this diagonal are 2, 4, and 6.
So if element index is divisible by 2, but it is not 0 or 8, its cell is on the second diagonal.

Here is the code:

```ts attaching data attributes to cells in the loop
let dg2 = "";
// ...

cells.map((_, index) => {
  // ...

  if (index % 2 === 0 && index && index !== 8) dg2 = "true";

  gridCell.dataset.cellDg1 = dg2;
  //   ...

  dg2 = "";
});
```

And that is it. Each of our cells will now have data attritues that correspond to their position in the grid.

Note that we did not assign the **data-grid-cell** data attribute to the cell.
We only used that one to select all cells in the DOM, and then attaching an event listener to them. Since we are now attaching event listener when we create the cell, there is no need for that data attribute.

### Modify new and reset game functionality

Finally, we can use the two newly created methods with our **startNewGame** and **resetGame** methods.

When either of those methods is called, we want to remove existing cells first, and then append new ones.

Here is the code for both methods:

```ts modified "startNewGame" and "resetGame" methods
startNewGame = () => {
  this.removeGridCells();
  this.appendGridCells();

  this.isGameOn = true;
  this.gameMoves = [];
  this.roundWinner = "";
  this.playerOnMove = `X`;

  this.displayGameStatus();
};

resetGame = () => {
  this.removeGridCells();
  this.appendGridCells();

  this.isGameOn = true;
  this.roundWinner = "";
  this.gameMoves = [];
  this.playerOnMove = `X`;
  this.totalScore = [];

  this.displayGameScore();
  this.displayGameStatus();
};
```

We could actually make this shorter and have **resetGame** call **newGame**, and only reset **totalScore** and call **displayGameScore** on its own.

In the end, we will just tidy up the code a bit.

- Since we are not using the hardoced HTML cells anymore, we can remove those
- We are also not passing any arguments to our **startNewGame** and **resetGame** methods, so we can remove those both in methods' defintions and calls
- We don't need the selector or adding of event listeners to grid cells outside of the game class, so that can go too.
- Finally, since our event listeners now last only for one click, the empty target check on the **insertIcon** method can be removed

That's it. Game over. We have successfully replaced hardcoded HTML with ... programmatic one? I don't know how that is called. 
But, it solved our problem by removing all grid cells and append new ones to the DOM every time we start a new game.

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at

- [Github repository](https://github.com/ikaem/exox)
- [Live website](http://kaem.freecluster.eu/apps/exox/)

### Goals

1. Create a simple Tic Tac Toe game for two persons

### Steps

1. Set up the project
2. Code the game
3. **Insert game cells from the game class**

### Tech and Tools

1. TypeScript
2. Tailwind
3. Webpack

### Experience with Tech & Tools

I guess I am ok with all of the tools used. Main reason I am doing this is to work on my logic skills. In the last project I couldn't fully figure out the logic of the calculator by mayself, so I wanted to do it now to make myself feel better :)

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
