---
title: "Tic Tac Toe with TypeScript: Project Setup"
date: 2020-09-07 12:23:17
tags:
  - typescript
  - games
categories: ts tic tac toe
cover: dimitry-anikin-6xvZthfOXbo-unsplash.jpg
creditArtist: Dimitry Anikin
creditSource: https://unsplash.com/@anikinearthwalker?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 1 of 3 in Tic Tac Toe with TypeScript

I figured I should do another small app, but code it completely on my own this time. I saw someone mention Tic Tac Toe online, so it's Tic Tac Toe.
Same as before, I do this one with TypeScript, Tailwind and Webpack.

<!--more-->

#### See [Project Information](#Project-Information)

I won't focus on Tailwind nor Webpack at all. Instead, I will try to present the logic and the flow in more depth here.

The main idea is to create a Tic Tac Toe game for 2 persons, where each player takes turns on the same computer to place their icons.

We begin with setting up the project

## Step 1: Set up the project

I have dividided this part in:

1. The game features
2. The logic
3. HTML
4. DOM selectors
5. The game class outline

### The game fetures

As already mentioned, the game is Tic Tac Toe for two players.

If has following features:

- Start the game, including interrupting the current game
- Counting players' scores
- Restart game scores, which deletes current score
- Stop the game when no winner after both players make three turns
- Display current player on the move
- Display winner of the game

### The game logic

I am not sure if the title of this section is even correct, but I will try to present the flow of the logic, as I see it.

1. As the game class is instantiated, a control variable is set to true to allow game methods to exectute.
2. A player clicks on a game cell, which triggers a class method that inserts the player's icon in the cell. The method checks if the cell is empty before doing so. This method also inserts the move into a moves array, to be used later for controlling game status.
3. The click on the game cell also triggers another class method, which checks the current game status. This method inspects the moves array to see if the current player has already made three moves. If not, the method changes the current player and returns. If the player has made three moves, it goes on to check if the player won. If the player has not won, the method checks if there are less than six moves present in the moves array. If there are, the method changes the player and returns. If there are six moves in the moves array, the game is over without a winner. The method sets the control variable to false and returns.
4. Finally, the click on the game cell triggers a method to display cureent game status, too. This method checks if the control variable is true, and if so, it renders the current player on the move. If the control variable is false, and there is a winner of the game, the method renders the winner. If there is no winner of the game, the method renders game over.

This is it for the main logic.

There are few other things that we want from the game:

- Clicking on the new game button sets the player to move to be **"X"**, and it sets the control variable to **true**. It also deletes all previous moves. It deletes the game winner, as well as all of the inserted icons from the previous game. Finally, it renders the current player on the move.
- Clicking on the reset game button does all of the above, plus deleting the previous game scores and rendering the current score, which is 0 for both sides.

Last thing is an idea on how to determine if there is a winner of a game.
Tic Tac Toe requires three of the same icons to be lined up in order to make a winner. This means that if there are same three icons in a row, column, or on a diagonal, those icons make the winner.

To determine if there are indeed three icons on the same line, I figured to give each grid cell data attributes that would represent which row, column or a diagonal they belong to. Then, when testing for a winner, we would check if there are indeed three icons of the same type with same data attributes as the current icon we are working on. If there are, we have a winner.

### HTML

The HTML is pretty simple and short (even though the Tailwind classes might make it seem convulted).

One note here is that for now we will have the grid cells hardoced into the HTML. The cells are regulard **div** elements, on which we will also hardcode information about columns, rows and diagonals they belong to.

Anyway, here is is the score box. We will use this one to output current players' scores.

```html The score box
<div
  id="game-score"
  class="flex justify-between items-center text-center pb-6 border-b border-gray-500 mb-6"
>
  <span id="x-icon" class="player-icon block">X</span>
  <span id="x-score" class="text-white text-4xl text-shadow">0</span>
  <span class="text-white text-xl">:</span>
  <span id="o-score" class="text-white text-4xl text-shadow">0</span>
  <span id="o-icon" class="player-icon h-20 block w-20">O</span>
</div>
```

Next up is the actual game grid. At this point, the grid contains nine **div** elements which represent game cells. When a player clicks on a game cell, the player's icon ("O" or "X") is inserted into it.

Note the data attributes containing information about cells' columns, rows and diagonals.
The **"data-game-cell** will be used later to select these cells.

For the sake of brevity, this snippet includes only two cells.

```html The game grid
<div
  id="game-grid"
  class="grid h-full w-full grid-cols-3 grid-rows-3 justify-center gap-1"
>
  <div
    data-game-cell
    class="game-cell hover:bg-teal-400"
    data-cell-col="1"
    data-cell-row="1"
    data-cell-dg1="true"
    data-cell-dg2=""
  ></div>
  <div
    data-game-cell
    class="game-cell hover:bg-teal-400"
    data-cell-col="2"
    data-cell-row="1"
    data-cell-dg1=""
    data-cell-dg2=""
  >
    <!-- ... -->
  </div>
</div>
```

Next up is the container where game status will be displayed. It is a simple **div** element into which the game will later insert additional **span** elements with game status information.

```html Game status container
<div
  id="game-status"
  class="h-32 flex justify-evenly p-6 my-6 items-center font-lato bg-gradient-to-b from-gray-700 to-gray-900 shadow-xl rounded"
></div>
```

Last two elements are two buttons: one for triggering a new game, and the other one to reset the current score:

```html Game buttons
<button
  id="new-game-button"
  class="bg-gradient-to-b from-white to-gray-400 rounded shadow-2xl text-2xl block w-full p-2 text-shadow font-black text-gray-900 mb-6"
>
  New Game
</button>
<button
  id="reset-score-button"
  class="bg-gradient-to-b from-gray-800 to-black rounded shadow-2xl text-2xl block w-full p-2 text-shadow font-black text-gray-100 mb-6"
>
  Reset Score
</button>
```

### DOM selectors

Right on. Things are building up nicely.
Let's use TS to select the elements we just created, so we can use them in our game.

```ts app.ts - DOM selectors
// Players' score boxes selectors
const playerXScore = document.getElementById("x-score") as HTMLSpanElement;
const playerOScore = document.getElementById("o-score") as HTMLSpanElement;

// Grid cells selectors
const playGridCells = document.querySelectorAll("[data-game-cell]");

// Game status selector
const gameStatusScreen = document.getElementById(
  "game-status"
) as HTMLDivElement;

// Game buttons selector
const newGameBtn = document.getElementById(
  "new-game-button"
) as HTMLButtonElement;
const resetScoreBtn = document.getElementById(
  "reset-score-button"
) as HTMLButtonElement;
```

### The game class outline

Finally, we get to the game class.
We won't go too deep into it right now. Instead, we will just define it, and create basic variables and methods that we need.
We will define those methods in detail in the next post, as well as create few other properties and helper methods.

Ok, so to start with, our class needs few things passed to its constructor.
It needs:

- Both score boxes to write scores into
- The game status container to write game status into

```ts The game class constructor
class Exox {
  constructor(
    public xScore: HTMLSpanElement,
    public oScore: HTMLSpanElement,
    public gameStatusBox: HTMLDivElement
  ) {}
}
```

Next, we need to define few essential properties that the game cannot do without:

- **isGameOn**, a control variable to indicate if the game is happening
- **playerOnMove**, which holds information about the player that is next to place their icon on the game grid. First player to do so is always "X".
- **gameMoves**, an array which will hold the moves made by both players

Essential methods that we need are as follows:

- **insertIcon**, to actually place an icon on the grid
- **checkGameStatus**, to check if we have a winner
- **displayGameStatus**, to provide visual information about the current game status
- **displayGameScore**, to render current game score
- **startNewGame**, to start a new game
- **resetGame**, to reset the game score

Plenty, right?
Here is how it all looks together:

```ts app.ts - The game class outline
class Exox {
  isGameOn = false;
  gameMoves: string[] = [];
  playerOnMove = `X`;

  constructor(
    public xScore: HTMLSpanElement,
    public oScore: HTMLSpanElement,
    public gameStatusBox: HTMLDivElement
  ) {}

  insertIcon = () => {};
  checkGameStatus = () => {};
  displayGameStatus = () => {};
  displayGameScore = () => {};
  startNewGame = () => {};
  resetGame = () => {};
}
```

In the end, we will instantiate the game.
As the class' constructor needs three arguments, we will provide those by passing DOM selectors we previously created:

```ts app.ts - Instantiating the game class
const exoxGame = new Exox(playerXScore, playerOScore, gameStatusScreen);
```

Ok, that's it. It looks good. 
We have figured out what we want from the project, and we have an idea how to do it. We have created HTML that will house the game, and we drafted the class that will execute the game.

In the next post we will put our logic into the code logic. We will connect the selectors with methods in the class, and make those methods react to player's actions and modify the DOM.
See you there.

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at

- [Github repository](https://github.com/ikaem/exox)
- [Live website](http://kaem.freecluster.eu/apps/exox/)

### Goals

1. Create a simple Tic Tac Toe game for two persons

### Steps

1. **Set up the project**
2. Code the game
3. Insert player fields from the game class

### Tech and Tools

1. TypeScript
2. Tailwind
3. Webpack

### Experience with Tech & Tools

I guess I am ok with all of the tools used. Main reason I am doing this is to work on my logic skills. In the last project I couldn't fully figure out the logic of the calculator by mayself, so I wanted to do it now to make myself feel better :)

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.