var playerOne = "Red";
var playerTwo = "Yellow";
//first player = red (playerOne)
var activePlayer = playerOne;
var gameOver = false;

var board;
var rows = 6;
var cols = 7;

var coords;
var colCoord;
var rowCoord;

var tempRow;
var arrWinning;

var difficulty;



//Initial startup (calls on refresh to page)
window.onload = function(){
    setBoard();
    setDifficulty(80);
}

function setDifficulty(difficulty){
    this.difficulty = difficulty;
}

//Sets the initial gamestate of the board (blank board with 42 white circles)
//appends each white space to the board (overlapping)
function setBoard() {

    //sets hover pieces
    for(let i = 0; i < cols; i++){ 
        let bspace = document.getElementById(i);
        bspace.classList.add("emptySpaceH");
        document.getElementById("boardAnimation").append(bspace);
    }

    //curCol = [maxRowIndex, maxRowIndex, ..., ..., ..., ..., ...];

    //Temporary array indicating empty spots left in each column.
    tempRow = [];
    for(let i = 0; i < cols; i++){
        tempRow[i] = 5;
    }

    board = [];

    for(let i = 0; i < rows; i++){
        let row = [];
        for (let j = 0; j < cols; j++){
            row[j] = ' ';

            //points to one of the space divs 
            let bspace = document.getElementById(i + "" + j);
            //adds the empty space style from gameStyles.css as a sub-class to bspace
            bspace.classList.add("emptySpace");
            //adds the empty space to the board
            document.getElementById("board").append(bspace);

            //adds functionality of clicking a space -> calling placeCircle function
            bspace.addEventListener("click",placeCircle);
            //adding functionality to graphical hovering methods
            bspace.addEventListener("mouseover",pieceHover);
            bspace.addEventListener("mouseout", pieceUnHover);
        }
        board[i] = row;
    }
}

function updateBoard(){
    if (activePlayer == playerTwo){
        for(let i = 0; i< rows; i++){
            for(let j = 0; j< cols; j++){
                let space = document.getElementById(i + "" + j);
                space.removeEventListener("click",placeCircle);
            }
        }
        setTimeout(placeCircle, 500);
    }
    else {
        for(let i = 0; i< rows; i++){
            for(let j = 0; j< cols; j++){
                let space = document.getElementById(i + "" + j);
                space.addEventListener("click",placeCircle);
            }
        }
    }
}

function placeCircle(){
    if (gameOver == true){
        return;
    }

    if (activePlayer == playerTwo) {
        colCoord = determinePlay();
        rowCoord = tempRow[colCoord];
        if (rowCoord < 0){
            return;
        }
        board[rowCoord][colCoord] = activePlayer;
        document.getElementById(rowCoord + "" + colCoord).classList.replace("emptySpace" , "yellowCircle");
    }
    else if (activePlayer == playerOne){
        coords = parseInt(this.id);
        colCoord = coords % 10;
        rowCoord = tempRow[colCoord];
        if (rowCoord < 0){
            return;
        }
        board[rowCoord][colCoord] = activePlayer;
        document.getElementById(rowCoord + "" + colCoord).classList.replace("emptySpace" , "redCircle");
        //changes pre-mouseover hover to new player color
        document.getElementById(colCoord).classList.replace("hoverRed" , "emptySpaceH");
    }

    //Once a piece is placed, there is one less available spot 
    rowCoord -= 1;
    tempRow[colCoord] = rowCoord;

    if (activePlayer == playerOne){
        activePlayer = playerTwo;
    }
    else {
        activePlayer = playerOne;
    }

    checkWinner();
    updateBoard();
}

//dont change//
//           //
//           //
//dont change//
function boardFull() {
    for(let i = 0; i< rows; i++){
        for(let j = 0; j< cols; j++){
            if(board[i][j] == ' ') {
                return false;
            }
        }
    }
    return true;
}

//dont change//
//           //
//           //
//dont change//
function checkWinner(){
    //undefined adjacent board values (out of bounds of 6x7 grid)

    //checking diagonal (lower left to top right)
    for(let i = 3; i< rows; i++){
        for(let j = 0; j< cols; j++){
            if(board[i][j] != ' '){
                if(board[i][j] == board[i-1][j+1] && board[i-1][j+1] == board[i-2][j+2] && board[i-2][j+2] == board[i-3][j+3]){
                    arrWinning = [(i + "" + j), ((i-1) + "" + (j+1)), ((i-2) + "" + (j+2)), ((i-3) + "" + (j+3))];
                    setWinner(i,j,arrWinning);
                    return;
                }
            }
        }
    }

    //checking diagonal (upper left to bottom right)
    for(let i = 0; i< rows -3; i++){
        for(let j = 0; j< cols -3; j++){
            if(board[i][j] != ' '){
                if(board[i][j] == board[i+1][j+1] && board[i+1][j+1] == board[i+2][j+2] && board[i+2][j+2] == board[i+3][j+3]){
                    arrWinning = [(i + "" + j), ((i+1) + "" + (j+1)), ((i+2) + "" + (j+2)), ((i+3) + "" + (j+3))];
                    setWinner(i,j,arrWinning);
                    return;
                }
            }
        }
    }

    //checking horizontal
    //undefined value avoidance: -3 max cols otherwise j + 3 will surpass 6, causing an undefined value
    for(let i = 0; i< rows; i++){
        for (let j = 0; j< cols-3; j++){
            if(board[i][j] != ' '){
                if(board[i][j] == board[i][j+1] && board[i][j+1] == board[i][j+2] && board[i][j+2] == board[i][j+3]){
                    arrWinning = [(i + "" + j), (i + "" + (j+1)), (i + "" + (j+2)), (i + "" + (j+3))];
                    setWinner(i,j,arrWinning);
                    return;
                }
            }
        }
    }

    //checking vertical
    //undefined value avoidance: -2 max rows otherwise i + 3 will surpass 5, causing an undefined value
    for(let i = 0; i< rows -3; i++){
        for(let j = 0; j< cols; j++){
            if(board[i][j] != ' '){
                if(board[i][j] == board[i+1][j] && board[i+1][j] == board[i+2][j] && board[i+2][j] == board[i+3][j]){
                    arrWinning = [(i + "" + j), ((i+1) + "" + j), ((i+2) + "" + j), ((i+3) + "" + j)];
                    setWinner(i,j,arrWinning);
                    return;
                }
            }
        }
    }

    //checking for draw
    if(boardFull() == true){
        arrWinning = [null];
        setWinner(-100,-100, arrWinning);
    }
    
}

//dont change//
//           //
//           //
//dont change//
function setWinner(i,j,arr){
    let winner = document.getElementById("winner");

    //if draw
    if(i == -100) {
        winner.innerText = "There was a Draw!";
        setRemainingPieces(arr);
    }
    //if red wins
    else if(board[i][j] == playerOne) {
        winner.innerText = "Red is the Winner!";
        winner.style.color = "red";
        setRemainingPieces(arr);
    } 
    //if yellow wins
    else {
        winner.innerText = "Yellow is the Winner!";
        winner.style.color = "yellow";
        setRemainingPieces(arr);
    }
    gameOver = true;
}

//dont change//
//           //
//           //
//dont change//
function setRemainingPieces(arr){
    //if draw, set entire board to non-winning
    if (arr[0] == null) {
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                let occupiedSpace = document.getElementById(i + "" + j);
                occupiedSpace.classList.replace("redCircle","nonWinningRed");
                occupiedSpace.classList.replace("yellowCircle","nonWinningYellow");       
            }
        }
        return;
    }

    //if non-draw, set winning and non-winning pieces to appropriate colors and opacities
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let location = i + "" + j;
            let occupiedSpace = document.getElementById(location);
            //Reduces opacity of non-winning pieces
            if ((location != arr[0]) && (location != arr[1]) && (location != arr[2]) && (location != arr[3])){
                occupiedSpace.classList.replace("redCircle","nonWinningRed");
                occupiedSpace.classList.replace("yellowCircle","nonWinningYellow");     
            }
            //Adds glow, increases opacity to the 4 winning pieces.
            else{
                occupiedSpace.classList.replace("redCircle","winningRed");
                occupiedSpace.classList.replace("yellowCircle","winningYellow"); 
            }
        }
    }
    return;
}

function pieceHover() {
    if (gameOver != true && activePlayer == playerOne){
        let coords = parseInt(this.id);
        let colCoord = coords % 10;

        if (activePlayer == "Red"){
            document.getElementById(colCoord).classList.replace("emptySpaceH" , "hoverRed");
        }
    }
}
function pieceUnHover(){
    if (activePlayer == playerOne) {
        let coords = parseInt(this.id);
        let colCoord = coords % 10;
        document.getElementById(colCoord).classList.replace("hoverRed" , "emptySpaceH");
        document.getElementById(colCoord).classList.replace("hoverYellow" , "emptySpaceH");
    }
}

function randomPlay(){
    let colCoord = Math.floor(Math.random() * 7);
    while(tempRow[colCoord] < 0){
        colCoord = Math.floor(Math.random() * 7);
    }
    return colCoord;
}

function intelligentPlay(){
    //Vertical
    for(let i = rows-1; i >= 3; i--){
        for(let j = 0; j < cols; j++){
            if((board[i][j] == playerOne) && (board[i-1][j] == playerOne) && (board[i-2][j] == playerOne) && (board[i-3][j] == ' ')){
                //returns empty spot to complete
                return j;
            }
        }
    }

    //Horizontal
    for(let i = rows-1; i >= 0; i--){
        for(let j = 0; j < cols-3; j++){
            if((board[i][j] == playerOne) && (board[i][j+1] == playerOne) && (board[i][j+2] == playerOne)){
                if(board[i][j+3] == ' '){
                    return j+3;
                }
                //edge case of if the empty spot is to the left
                else if(((j-1) != -1) && board[i-1][j+3] == ' '){
                    return j-1;
                }
                //returns empty spot to complete
            }
        }
    }

    //Diagonal 1
    /*for(let i = rows-1; i >= 3; i--){
        for(let j = 0; j < cols-3; j++){
            //console.log(i + "" + i+1 + "" + i+2);
            if((board[i][j] == playerOne) && (board[i-1][j+1] == playerOne) && (board[i-2][j+2] == playerOne)){
                if(board[i-3][j+3] == ' '){
                    return j+3;
                }
                //edge case of if the empty spot is to the left
                else if(((i+1) != -1) && ((j-1) != -1) && board[i+1][j-1] == ' '){
                    return j-1;
                }
                //returns empty spot to complete
            }
        }
    }*/

    
    return -1;

}


function determinePlay(){
    //if(difficulty < 50){

    //}
    let test = intelligentPlay();
    console.log("intel");
    if(test == -1){
        colCoord = randomPlay();
        while(document.getElementById(tempRow[colCoord] + "" + colCoord).classList.value != "emptySpace"){
            colCoord = randomPlay();
        }
        return colCoord;
    }
    else{
        return test;
    }  
}