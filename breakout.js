/* This program creates a breakout game. Your mission is to adjust the paddle to cover the ball 
* from falling down (You can do this by move your mouse left and right) and reflect the ball to hit * the bricks. You will win when all the bricks are disappeared. You have 10 lives, good luck!
*
* Author: Kray Nguyen
* Date: 4/25/2018
*/

/* Constants for bricks */
var NUM_ROWS = 8;
var BRICK_TOP_OFFSET = 10;
var BRICK_SPACING = 2;
var NUM_BRICKS_PER_ROW = 5;
var BRICK_HEIGHT = 10;
var SPACE_FOR_BRICKS = getWidth() - (NUM_BRICKS_PER_ROW + 1) * BRICK_SPACING;
var BRICK_WIDTH = SPACE_FOR_BRICKS / NUM_BRICKS_PER_ROW;
var BRICK_X = BRICK_SPACING;
var BRICK_Y = BRICK_TOP_OFFSET;
var COLOR_NUMBER = 0.5;


/* Constants for ball and paddle */
var PADDLE_WIDTH = 80;
var PADDLE_HEIGHT = 15;
var PADDLE_OFFSET = 10;
var BALL_RADIUS = 15;
var dx = Randomizer.nextInt(-4, 1) && Randomizer.nextInt(1, 4);
var dy = 9;
var PADDLE_X = getWidth() / 2 - 4*PADDLE_OFFSET;
var PADDLE_Y = getHeight() - 3*PADDLE_OFFSET;


// Constants for ingame
var NUM_SCORE = 0; 
var NUM_LIVES = 10;
var WORD_OFFSET = 30;
var SCORE_TO_WIN = NUM_ROWS * NUM_BRICKS_PER_ROW;
var TEXT_OFFSET = 80;

//Global variables
var brick;
var ball;
var paddle;
var elem;
var showScore;
var showLives;

function start(){
    drawRow();
    drawBall();
    lives();
    score();
    setTimer(moveBall, 5);
    makePaddle();
    mouseMoveMethod(movePaddle);
}

/* This function draws numbers of bricks in a row.
* Precondition: None
* Postcondition: a row of defined color bricks are created
*/

function drawBrick(color){
    // by using a for loop, the program still works even if the constant is 
    // changed
    for(var i = 0; i < NUM_BRICKS_PER_ROW; i++){
        // create a brick with constants given 
        brick = new Rectangle(BRICK_WIDTH, BRICK_HEIGHT);
        
        // Position the first brick by using the constant that I created
        brick.setPosition(BRICK_X, BRICK_Y);
        
        // Set the color as the first row is programming
        brick.setColor(color);
        
        // For the first row, this helps the program to space the first brick
        // and the second brick, etc...
        BRICK_X = BRICK_X + BRICK_SPACING + BRICK_WIDTH;
        
        // Initiate the bricks to be drawn
        add(brick);
    }
    
    // After this program of the first row is finished, it moves on to set the 
    // position of the brick in the second row. The x vertical stays the same, 
    // but the y horizontal position has to be moved down with the variable
    // brick Y to equally distributed the rows.
    BRICK_X = BRICK_SPACING;
    BRICK_Y = BRICK_Y + BRICK_SPACING + BRICK_HEIGHT;
}

/* This function creates the bricks distributed through the number of NUM_ROWS
* Precondition: The first row is created
* Postcondition: The rows of bricks with a specific color requirement are 
* created
*/

function drawRow(){
    // Using a for loop to draw the number of rows given in the constant
    for(var i = 0; i < NUM_ROWS; i++){
        
        // setting the color before the drawBrick function runs, this is a first
        // step to define the color
        var color = brickColor();
        drawBrick(color);
        
        // Each time a row is finished, the COLOR_NUMBER variables, which is 1 
        // initially, add 0.5 each time a row is finished
        COLOR_NUMBER += 0.5;
    }
}

/* This function defines what color a row of bricks will be.
* Precondition: a brick is created and the color will be identified afterwards
* Postcondition: A brick is colored with a defined color
*/

function brickColor(){
    // We have 4 colors, so we must use COLOR_NUMBER % 4 to define the 
    // correct colors. The dividing number % the divided number is equal the 
    // to the dividing number, which is the remainder. This is a rule in algebra
    // of mathematics 
    
    // With the specific requirement of 8 rows and 4 colors, the COLOR_NUMBER 
    // will be add 0.5 each row. We have to use the COLOR_NUMBER and the 
    // remainder to determine the color of that row. 
    if(COLOR_NUMBER % 4 == 0.5 || COLOR_NUMBER % 4 == 1){
        return Color.red;
    } 
    
    if(COLOR_NUMBER % 4 == 1.5 || COLOR_NUMBER % 4 == 2){
        return Color.orange;
    }
    
    if(COLOR_NUMBER % 4 == 2.5 || COLOR_NUMBER % 4 == 3){
        return Color.green;
    }
    
    if(COLOR_NUMBER % 4 == 3.5 || COLOR_NUMBER % 4 == 0){
        return Color.blue;
    }
    
}

/* This function draws the ball in the middle of the screen
* Precondition: The colored bricks are created
* Postcondition: The ball is created in the middle of the screen
*/

function drawBall(){
    // creating a ball with a radius given in the constant
    ball = new Circle(BALL_RADIUS);
    
    // set the ball in the middle of the screen
    ball.setPosition(getWidth() / 2, getHeight()/2);
    add(ball);
}

/* This function has the ball moves on the screen
* Precondition: The ball is created in the middle of the screen
* Postcondition: The ball bounces in the opposite direction if it hits the wall
*/

function moveBall(){
    checkWalls();
    ball.move(dx,dy);
    checkPaddle();
    removeBrick();
    
}

/* This function has the ball checks the wall before the ball is determined to 
*bounce back in which direction
* Precondition: The ball touches the wall
* Postcondition: The ball bounces back in the opposite direction
*/

function checkWalls(){
    // if the variable of the center of the ball plus the variable of the 
    // ball's radius are greater than the right wall, the ball bounces in a 
    // opposite direction
    if(ball.getX() + ball.getRadius() > getWidth()){
        dx = -dx;
    }
    
    // if the variable of the center of the ball minus the variable of the 
    //ball's radius are less than the left wall, the ball bounces in a opposite
    // direction
    if(ball.getX() - ball.getRadius() < 0){
        dx = -dx;
    }
    
    // if the variable of the center of the ball plus the variable of the ball's
    //radius are greater than the bottom wall, the ball stops 
    if(ball.getY() + ball.getRadius() > getHeight()){
       
       // the ball will appears in the middle of the screen, with the text 
       // saying that the user loses above
       ball.setPosition(getWidth() / 2, getHeight() /2);
       NUM_LIVES--;
       showLives.setText("Lives: " + NUM_LIVES);
       checkLose();
    }
    
    // if the variable of the center of the ball plus the variable of the ball's
    //radius are greater than the top wall, the ball bounces in a opposite 
    // direction
    if(ball.getY() - ball.getRadius() < 0){
        dy = -dy
    }  
}

/* This function makes a paddle centered at the bottom of the screen
* Precondition: none
* Postcondition: The paddle is created
*/

function makePaddle(){
    // create paddle by using constants given
    paddle = new Rectangle(PADDLE_WIDTH,PADDLE_HEIGHT)
    
    // Set the position of the paddle 
    paddle.setPosition(PADDLE_X, PADDLE_Y);
    add(paddle);
}

/* This function has the paddle move. The paddle centered under the mouse, and
* does not go offscreen when the user moves the mouse 
* Precondition: Paddle is created
* Postcondition: The paddle moves vertically when the user moves the mouse on 
* The screen
*/

function movePaddle(e){
    // The user moves the paddle by dragging the mouse on the screen
    paddle.setPosition(e.getX() - PADDLE_WIDTH / 2, PADDLE_Y);
    
    // Block the paddle if it goes offscreen
    if(e.getX() - PADDLE_WIDTH / 2 < 0){
        paddle.setPosition(0, PADDLE_Y);
    }
    
    // block the paddle if it goes offscreen
    if(e.getX() + PADDLE_WIDTH / 2 > getWidth()){
        paddle.setPosition(getWidth() - PADDLE_WIDTH, PADDLE_Y);
    }
}

/* This function has the ball bounces back if it hits the paddle
* Precondition: The ball hasnt touched the ball
* Postcondition: The ball bounces back at an opposite direction
*/

function checkPaddle(){
    // if the bottom of the ball hits the paddle, the ball changes its direction
    elem = getElementAt(ball.getX(), ball.getY() + ball.getRadius());
    if(elem == paddle && elem != showScore && elem != showLives){
        dy = -dy;
    } 
}

/* This function removes a brick each time the ball hits one
* Precondition: the ball is moving towards a brick
* Postcondition: that brick is removed
*/

function removeBrick(){
    // I created each elem function to check 4 corner's of the ball. Then if the
    // corner of the ball touches something that is not the paddle, that thing 
    // disappears. We have the bricks in this case.
    
    // check the top of the ball
    elem = getElementAt(ball.getX(), ball.getY() - ball.getRadius());
    if(elem != null && elem != paddle && elem != showScore && elem != showLives){
        remove(elem);
        NUM_SCORE++;
        showScore.setText("Score: " + NUM_SCORE);
        checkWin();
        dy = -dy;
    }
     
    // check the bottom of the ball
    elem = getElementAt(ball.getX(), ball.getY() + ball.getRadius());
    if(elem != null && elem != paddle && elem != showScore && elem != showLives){
        remove(elem);
        NUM_SCORE++;
        showScore.setText("Score: " + NUM_SCORE);
        checkWin();
        dy = -dy;
    }
    // check the right of the ball
    elem = getElementAt(ball.getX() - ball.getRadius(), ball.getY());
    if(elem != null && elem != paddle && elem != showScore && elem != showLives){
        remove(elem);
        NUM_SCORE++;
        showScore.setText("Score: " + NUM_SCORE);
        checkWin();
        dx = -dx;
    }
    // check the left of the ball
    elem = getElementAt(ball.getX() - ball.getRadius(), ball.getY());
    if(elem != null && elem != paddle && elem != showScore && elem != showLives){
        remove(elem);
        NUM_SCORE++;
        showScore.setText("Score: " + NUM_SCORE);
        checkWin();
        dx = -dx;
    }
}

function checkLose(){
    if(NUM_LIVES == 0){
        stopTimer(moveBall);
       
       // the ball will appears in the middle of the screen, with the text 
       // saying that the user loses above
       ball.setPosition(getWidth() / 2, getHeight() /2);
       var text = new Text("You lose!", "30pt Arial");
       text.setPosition(getWidth() / 2 - TEXT_OFFSET, getHeight() / 2 - 
                                                            TEXT_OFFSET);
       add(text);
    }
}

function lives(){
    showLives = new Text("Lives: " + NUM_LIVES);
    showLives.setPosition(0, getHeight() / 2);
    add(showLives);
}

function score(){
    showScore = new Text("Score: " + NUM_SCORE);
    showScore.setPosition(0, getHeight() / 2 + WORD_OFFSET);
    add(showScore);
}

function checkWin(){
    if(NUM_SCORE == SCORE_TO_WIN){
        stopTimer(moveBall);
        ball.setPosition(getWidth() / 2, getHeight() / 2);
        var text = new Text("You Win!", "30pt Arial")
        text.setPosition(getWidth() / 2 - TEXT_OFFSET, getHeight() / 2 - 
                                                            TEXT_OFFSET);
        add(text);
    }
}

