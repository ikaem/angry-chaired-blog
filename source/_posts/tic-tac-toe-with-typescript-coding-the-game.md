---
title: "Tic Tac Toe with TypeScript: Coding the Game"
date: 2020-09-07 14:36:52
tags:
  - typescript
  - games
categories: ts tic tac toe
cover: caleb-dow-XclEjQqLFLU-unsplash.jpg
creditArtist: Caleb Dow
creditSource: https://unsplash.com/@calebscamera?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 2 of 3 in Tic Tac Toe with TypeScript

Thus starts the hard (and long) part. To get the game running, we will use the class we have already created. There is not much more to say. Let's do this.

<!--more-->

#### See [Project Information](#Project-Information)

We will go build the code this imaginging that we are playing the game. We place our mark, we wait for the code to check if we won, and then we see what the code tells us about the game.
When checking the game status in the corresponding method, we will approach it in a way that will have use leave the method as soon as possible. If there is not enough moves to determine the winner, leave the method. If there is a winner, announce them and leave the method, and if there is another move to make, make it possible and leave the method.

## Step 2: Code the game

This post is divided into:

1. Inserting player icon into game grid
2. Checking game status
3. Displaying game status
4. Updating game score
5. Starting new game
6. Resetting game score
7. Defining helper methods

### Inserting player icon into game grid

We will start with defining how the game will mark a grid cell when a player clicks on it.

To do so, first we have to set an an event listener on each cell that the player can click on.
Since we already have a selector for all grid cells, we will loop over them, place a click event listener on each one.

```ts app.ts - Placing click event listener on each grid cell
const exoxGame = new Exox(playerXScore, playerOScore, gameStatusScreen);
// ...

const playGridCells = document.querySelectorAll("[data-game-cell]");
// ...

playGridCells.forEach((cell) => {
  cell.addEventListener("click", (event) => {
    exoxGame.insertIcon(event.currentTarget as HTMLDivElement);
  });
});
```

Note that we are calling the **insertIcon** method from the event listener, and passing it the current target of the event. The **currentTarget** property on the event refers to the element on which the event listener was actually placed.
This means that even if there was an elemenet inside the cell, the event listener would always pass the grid cell to the **insertIcon** method.

Speaking of the element inside the grid cell, we only want to be able to click on the grid cell if there is nothing in it. We do so in order to insert an icon in it. If there already is an icon in the cell, we don't want to allow the method to insert anything inside.

To get this behavior, we will move to the **inserIcon** method in the class, and have it return if there is some kind of content on the target that was passed to it.

The **hasChildNodes()** method will do just fine for this purpose.
We will that if the target that was passed to this method has any child nodes, we will return from the method.
Since we are here, we will say that if the game control variable is not true, we will also return.

```ts app.ts Not allowing placemenet of icons on the grid
class Exox {
  // ...
  insertIcon = (target: HTMLDivElement) => {
    if (!this.isGameOn) return;
    if (target.hasChildNodes()) return;
  };
  //   ...
}
```

Nice.
Now, what happens if we pass both checks? Then we need to place the current's player icon in the grid cell.
Since our class has a property that tells us which player is on the move, we could just enter that property into the cell via **textContent** property on the event target.

For styling and organization purposes, however, I decided to create a **span** element which will render the said property.
This **span** element is a string returned by a method in the game class, as follows:

```ts app.ts Function that returns stringified span element rendering current player on the move
// helper function
createPlayerIcon = () =>
  `<span data-player-icon class="player-icon">${this.playerOnMove}</span>`;
```

Now, we can use the **innerHTML** method on the event target, and pass it the string returned by the helper function. This will effectively place the current player's icon onto the grid.

```ts App.ts - inserting player's icon into a grid cell
target.innerHTML = this.createPlayerIcon();
```

Lovely.
Finally, we want to let the game know that the current player made their move.
We do so by pushing the value of the **playerOnMove** property into the **gameMoves** array.

Here is the complete **insertIcon** method, together with the said push:

```ts App.ts - Complete "insertIcon" method
insertIcon = (target: HTMLDivElement) => {
  if (!this.isGameOn) return;
  if (target.hasChildNodes()) return;

  target.innerHTML = this.playerIcon;
  this.gameMoves.push(this.playerOnMove);
};
```

Very cool. Now go ahead and try clicking on that grid. You should be placing those "X" icons like a boss.

### Checking game status

But, we don't want to be working only with the Xs, do we? Let's fix that in the **checkGameStatus** method.

First thing we need to do is to actually call this method. We will call it from the event listener on that same grid cell we already worked with.
We do so after the **insertIcon** method returns, to make sure we can work with fresh **gameMoves** data.

```ts app.ts - Calling "checkGameStatus" method from the event listener of grid cells
// ...
playGridCells.forEach((cell) => {
  cell.addEventListener("click", (event) => {
    exoxGame.insertIcon(event.currentTarget as HTMLDivElement);
    exoxGame.checkGameStatus();
  });
});
```

Ok now. Before we enter the method, we want to make sure that the game is on.
Then, we want to check if the current game state qualifies for a win check.
Since the primary criteria for winning a game is that player has made three moves, we will test for that.

We will go over the **gameMoves** array, and see if there are three elements in it that correspond to the current player that is on the move.
Remember, the **playerOnMove** property still hasn't changed.

I checked the **gameMoves** array with the **filter** method on the **gameMoves** array. This generates a new array that holds values equal to the current **playerOnMove** value.
Then, if the filtered array has less than three elements, we will change the player, and return from the method.
This continues the game, and the other player can place their icon.

```ts app.ts - "checkGameStatus" method checks if enough moves for win
checkGameStatus = () => {
  if (!this.isGameOn) return;

  const currentPlayerMoves = this.gameMoves.filter(
    (move) => move === this.playerOnMove
  );

  if (currentPlayerMoves.length !== 3) {
    this.playerOnMove = this.playerOnMove === "X" ? "O" : "X";
  }

  return;
};
```

Very cool.
What if, however, the player has already made three moves?
Well, this is where the show starts. We can already start checking for a win.

First, we want to check the current cell's column. Then, we want to check if there are any other icons in the same column. If there are, we want to check if their content is the same as the current **playerOnMove** value.

If there is no win after this check, we do the same thing for rows.
If there is no win after this check either, we check for diagonal wins.

There is a caveat with the diagonal wins, though. Not every cell is on a valid diagonal, so we have to check if the current cell is on a diagonal first.

Right.
Before we go into checking, we do have to make two small adjustments to the existing code.

First one is that we have to pass the current cell's data attributes to the **checkGameStatus** method. This way the method will have data to work with.
The data attribute values are stored in the **dataset** object on HTML elements, so we will pass that one as an argument to the **checkGameStatus**.

```ts app.ts - Passing "dataset" argument to the "checkGameStatus" method
// ...
cell.addEventListener("click", (event) => {
  // ...
  exoxGame.checkGameStatus(event.currentTarget.dataset);
});
```

And we have to support this argument in the method's definition, too:

```ts app.ts - Accepting a "dataset" argument in the "checkGameStatus" method
checkGameStatus = (dataset: CellLocation) => {
  /* ... */
};
```

Notice the **CellLocation** type for the **dataset** argument.
I wanted to have typed those data attributes for columns, rows and diagonals that exist in the **dataset** object on each of the grid cells.
Because of this I defined an interface that extends the **DOMStringMap**, which is the type of **dataset** object.

```ts Interface used to type "dataset" object
interface CellLocation extends DOMStringMap {
  cellCol: string;
  cellRow: string;
  cellDg1: string;
  cellDg2: string;
}
```

Then, I also cast the argument passed to the **checkGameStatus** as an object of **CellLocation** shape:

```ts app.ts - The "dataset" object cast as object with shape of "CellLocation" interface
// ...
cell.addEventListener("click", (event) => {
  // ...
  exoxGame.checkGameStatus(
    (event.currentTarget as HTMLDivElement).dataset as CellLocation
  );
});
```

Right.

Let's go back to checking if our player won.
We have an object with information about the current cell's location, so let's see if there are any other cells with the same location.

We start with columns.
First, we will select all DOM elements that have same column data attribute as the current cell.

```ts app.ts - Searching for cells in the same column as the curren cell
checkGameStatus = (dataset: CellLocation) => {
  /* ... */
  const columnElements = document.querySelectorAll(
    `[data-cell-col='${dataset.cellCol}']`
  );
};
```

Nice. The **columnElements** property is a list that now holds all elements with the same **data-cell-col** data attribute. Which means that any element in this list is in the same column as our current cell.

However, the **columnElements** property is of the **NodeList** type. While this item is iterable, we cannot use methods like **filter** and **map** on it.
Since I very much want to use **filter** here, I will convert the **columnElements** to an array, and then will filter all items inside it to find those that have same content as the current **playerOnMove** value.
Again, remember that at this point we still haven't changed the **playerOnMove** value.

We convert the **columnElements** to an array with the **Array.from()** method, and immedaitely use **filter** method on it.

```ts app.ts - Converting to an array and filtering "NodeList" list
checkGameStatus = (dataset: CellLocation) => {
  /* ... */
  const columnElements = document.querySelectorAll(
    `[data-cell-col='${dataset.cellCol}']`
  );

  const currentPlayerColumnCells = Array.from(columnCells).filter(
    (cell) => cell.textContent?.trim() === this.playerOnMove
  );
};
```

Very cool. Ideally, the **currentPlayerColumnCells** holds all cells that are in the same column and have same text content as the current **playerToMove**.

Let's check that. If indeed there are three items in there, we have a winner.

```ts app.ts - Check if three items in the "currentPlayerColumnCells" array
checkGameStatus = (dataset: CellLocation) => {
  /* ... */

  const currentPlayerColumnCells = Array.from(columnCells).filter(
    (cell) => cell.textContent?.trim() === this.playerOnMove
  );

  if (currentPlayerColumnCells.length === 3) {
    console.log("we have a winner");
  }
};
```

We should probably do a bit more to celebrate the winner, than just logging a string.

We will create a new class property to hold the current winner. We give give this property a value of the current **playerOnMove**, and we push it into another new array we create in the class: the **totalScore** array.
Later, we will use **totalScore** to get both players' scores.

Then, we turn the game off by setting the **isGameOn** property to false.
We also call the **displayGameScore** method to actually render players's scores. We will define this method a bit later.

Finally, we **return** to make sure no more code is executed in the **checkGameStatus** method.

Here is the whole thing:

```ts app.ts - Proclaiming a game winner
class Exox {
  roundWinner = "";
  totalScore: string[] = [];
  //   ...
  checkGameStatus = (dataset: CellLocation) => {
    /* ... */

    if (currentPlayerColumnCells.length === 3) {
      this.roundWinner = this.playerOnMove;
      this.totalScore.push(this.roundWinner);
      this.isGameOn = false;
      this.displayGameScore();
      return;
    }
  };
}
```

What if we don't find the winner? Well, we [keep moving](https://www.youtube.com/watch?v=AWvRcWDr5y8&feature=youtu.be&t=87). We check rows, and if no win, and we check the diagonals.

For the sake of brevity, I include only the code for for the first diagonal, the top-left to bottom-right one. Logic is the same. The only difference that we make an if-check to check for a win only if the cell is on a diagonal.

```ts app.ts - Checking for a win when a cell is on a diagonal
checkGameStatus = (dataset: CellLocation) => {
  /* ... */

  if (Boolean(dataset.cellDg1)) {
    const currentPlayerDiagonal1Cells = Array.from(
      document.querySelectorAll("[data-cell-dg1='true']")
    ).filter((cell) => cell.textContent?.trim() === this.playerOnMove);

    if (currentPlayerDiagonal1Cells.length === 3) {
      this.roundWinner = this.playerOnMove;
      this.totalScore.push(this.roundWinner);
      this.isGameOn = false;
      this.displayGameScore();
      return;
    }
  }
};
```

Hopefully, by now we have a win. But, what if we dont? Well, since at this point we know that the current player has no more moves left, there are two options:

1. Other player might have a move left
2. Other player might not have a move left, in which case we have a tie.

Let's get the first option out of the way. If the other player still has a move left, then the **gameMoves** array should have only five elements inside.
In this case, we will change the **playerToMove** to the other player, and return. The game goes on.

```ts app.ts - Check if there is one more move left in the game
checkGameStatus = (dataset: CellLocation) => {
  /* ... */

  if (this.gameMoves.length < 6)
    return (this.playerOnMove = this.playerOnMove === "X" ? "O" : "X");
};
```

Finally, if this doesn't work, there is only one option left. We have a tie.
We don't need to make any checks. We will just finish the game, and return

```ts app.ts - The game is a tie
checkGameStatus = (dataset: CellLocation) => {
  /* ... */

  this.isGameOn = false;
  return;
};
```

That's it. This should work.

### Displaying game status

The way we imagined the game, it should provide visual information on its status on every move. Let's set this up.

We will accomplish this functionality with the **displayGameStatus** that we outlined in the first post.
Since we want visual information on every move, we will have this function called from the same event listener that called the previous two functions:

```ts app.ts - Calling "displaGameStatus" method from even listener on grid cells
// ...
cell.addEventListener("click", (event) => {
  // ...
  exoxGame.displayGameStatus();
});
```

The method itself deals with three possible options:

- It renders current move in case the game is on
- It renders "Game Over" string in case the game is off, but there is no winner
- It renders a win message if there is a winner (and the game is off)

Here is the method checking all the possible cases.
When a case matches, the method inserts a corresponding stringified HTML content into DOM. To do this, it uses **innerHTML** method, the same one we previously used in the **insertIcon** method.
Depending on the case, a corresponding string is inserted into the stringified HTML.

```ts
displayGameStatus = () => {
  // regular move
  if (this.isGameOn)
    return `
        <span id="winner-icon" class="player-icon ${
          this.roundWinner && "win-icon"
        } hidden">${this.playerOnMove}</span>
        <span
          id="game-message"
          class="text-white text-4xl text-shadow font-black"
          >${"to move"}</span
        >`;

  // game is not on and no winner
  if (!this.roundWinner)
    return `
        <span id="winner-icon" class="player-icon ${
          this.roundWinner && "win-icon"
        } hidden">${this.playerOnMove}</span>
        <span
          id="game-message"
          class="text-white text-4xl text-shadow font-black"
          >${"Game Over"}</span
        >`;

  // game is not on and we have a winner
  return `
    <span id="winner-icon" class="player-icon ${
      this.roundWinner && "win-icon"
    } hidden">${this.playerOnMove}</span>
    <span
        id="game-message"
        class="text-white text-4xl text-shadow font-black"
        >${"wins!"}</span
    >`;
};
```

With this setup, every time players make a move, this method will be called. Then, it will check the current status of the game (set by the previously defined method, **checkGameStatus**), and it will output a corresponding message.

Don't mind the conditional class assignment in the first stringified **span** element. We will not be dealing with styling in this series.

### Displaying game score

We have previously called the **displayGameScore** method, in order to provide visual information on the current score.

Let's define it now.
This method relies on the **totalScore** array to get players' scores.
The **totalScore** array is added a new element, **"X"** or **"O"**, every time a game round ends in a win.

We want the method to calculate how many times each of these two values repeats in the array.
Then, it should use **textContent** property on each player's score container to ouput these two numbers to the screen.

We use **reduce** method to get the two scores from the array:

```ts app.ts Rending current game score
displayGameScore = () => {
  const xWins = this.totalScore.reduce((acc, val) => {
    if (val === "X") return acc + 1;
    return acc;
  }, 0);

  const oWins = this.totalScore.reduce((acc, val) => {
    if (val === "O") return acc + 1;
    return acc;
  }, 0);

  this.xScore.textContent = xWins.toString();
  this.oScore.textContent = oWins.toString();
};
```

### Starting new game

Very good. What about starting a new game?
The idea was to use this option to interrupt the current game and start a new one, as well as to start a new game after the previous one is finished.

To start a new game, few things are required:

- The game control variable has to be **true**
- **gameMoves** array has to be empty, so we can store new moves inside
- We have to clean the grid, removing all existing icons from it
- We have to reset the **playerOnMove** to **"X"**
- We have to reset the **roundWinner** to an empty string
- We also want to call the **displayGameStatus** method, to render current player on the move

Let's start with clearing out the grid.
We can do this in multiple ways. Here are two:

1. We could select the entire grid container, empty it of its cells, and then insert new cells.
2. We could loop over existing cells and remove icons from each one.

The second one seems simpler, so we do that. Later, we will see that this actually contributes to a bug in our game, but for now this works.

To clear icons from each grid cell, we need to pass the cells to the **startNewGame** via the event listener set on the **newGameBtn** selector variable.
The cells, of course, is our good old friend, the **playGridCells** selector variable, which holds a **NodeList** type of a list.

```ts app.ts - Passing grid cells to the "startNewGame" method
// event listeners
newGameBtn.addEventListener("click", () => {
  exoxGame.startNewGame(playGridCells);
});
```

Right on.
In the **startNewGame** method, we accept this argument, and then iterate over the cell list, removing html content from each cell:

```ts app.ts - Start a new game
startNewGame = (gameCells: NodeListOf<Element>) => {
  gameCells.forEach((cell) => {
    cell.innerHTML = "";
  });
  this.isGameOn = true;
  this.gameMoves = [];
  this.playerOnMove = `X`;
  this.roundWinner = "";
  this.displayGameStatus();
};
```

In addition to emptying content from each grid cell, we have also fulfilled other criteria needed to start a new game.
The game is now on, there are no moves in the **gameMoves** array, and there is no winner of the current round.
We also set the current player on the move to be **"X"**, which is then used by the **displayGameStatus** method to provide players with visual information.

### Resetting game score

Resetting game score is just an expanded **startNewGame** method. It adds two actions to it:

- It clears the **totalScore** array in order to reset the score.
- It calls the **displayGameScore** method to output new score (0 - 0) to the screen

Here is the full method:

```ts app.ts - Reset the game score
resetGame = (gameCells: NodeListOf<Element>) => {
  gameCells.forEach((cell) => {
    cell.innerHTML = "";
  });
  this.isGameOn = true;
  this.gameMoves = [];
  this.playerOnMove = `X`;
  this.roundWinner = "";
  this.totalScore = [];

  this.displayGameStatus();
  this.displayGameScore();
};
```

Of course, this method is called by the event listener on the **resetScoreBtn** selector, and we already know how to do that.

A new thing is that we will call this method from the class constructor. Since **resetGame** resets everything about the game, we can use it to set a clean new game when the class instantiates.

```ts app.ts - Starting fresh game from the class constructor
class Exox {
  constructor(
    public xScore: HTMLSpanElement,
    public oScore: HTMLSpanElement,
    public gameStatusBox: HTMLDivElement
  ) {
    this.resetGame();
  }
}
```

Very good. This makes the game ready to work.

### Defining helper methods

While our game works now, I want to tidy up some code to make. To be specific, I want to create few helper functions that would hold repeating blocks of code we currently have.

We will do so with:

- Changing player
- Proclaim game winner
- Output game status

#### Changing player

At the moment we have use this code whenever we want to change player:

```ts app.ts - Changing player
this.playerOnMove = this.playerOnMove === "X" ? "O" : "X";
```

Lets put this into a helper function, and call it whenever we need to change player

```ts app.ts - Change player helper function
changePlayer = () =>
  (this.playerOnMove = this.playerOnMove === "X" ? "O" : "X");

// ...
checkGameStatus = (dataset: CellLocation) => {
  // ...

  if (currentPlayerMoves.length < 3) {
    this.changePlayer();
    return;
  }
  // ...
};
```

#### Proclaim game winner

We have four places where we execute same code in order to set a game win.
Let's put that code in a function, and call it when needed

```ts app.ts - Proclaim winner helper function
proclaimWinner = () => {
  this.roundWinner = this.playerOnMove;
  this.totalScore.push(this.roundWinner);
  this.isGameOn = false;
  this.displayGameScore();
};

// ...
checkGameStatus = (dataset: CellLocation) => {
  // ...

  if (currentPlayerRowCells.length === 3) {
    this.proclaimWinner();
    return;
  }
  // ...
};
```

#### Output game status

Finally, the **displayGameStatus** renders pretty much the same **span** element, no matter the condition.
Since the only difference is the message shown, lets create a function that takes that message as an argument, and returns the said string

```ts app.ts - Output message helper function
createMessageBox = (message: string) =>
  `
      <span id="winner-icon" class="player-icon ${
        this.roundWinner && "win-icon"
      } hidden">${this.playerOnMove}</span>
      <span
        id="game-message"
        class="text-white text-4xl text-shadow font-black"
        >${message}</span
      >`;

// ...
  displayGameStatus = () => {
    // regular move
    if (this.isGameOn)
      return (this.gameStatusBox.innerHTML = this.createMessageBox("to move"));

    // game is not on and no winner
    if (!this.roundWinner)
      return (this.gameStatusBox.innerHTML = this.createMessageBox(
        "Game Over"
      ));

    // game is not on and we have a winner
    return (this.gameStatusBox.innerHTML = this.createMessageBox("Wins!"));
  };
};
```

Alright. That's it. The game is ok. We have players able to put their marks on the game grid, and we have methods tracking their moves and calculating whether they won, if the game is over, or if it goes on.
We have also set game to visually inform players on their scores, as well as the game status. 

We do have a issue however. With the current setup, clicking on the same game cell will cause the game to go crazy. While no icons will be placed on the grid, the **checkGameStatus** will register new clicks, and will execute code inside.
We will fix that in the next post.

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
2. **Code the game**
3. Insert game cells from the game class

### Tech and Tools

1. TypeScript
2. Tailwind
3. Webpack

### Experience with Tech & Tools

I guess I am ok with all of the tools used. Main reason I am doing this is to work on my logic skills. In the last project I couldn't fully figure out the logic of the calculator by mayself, so I wanted to do it now to make myself feel better :)

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
