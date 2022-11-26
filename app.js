var playerOne = "Red";
var playerTwo = "Yellow";
//first player = red (playerOne)
var activePlayer = playerOne;
var gameOver = false;

var board;
var rows = 6;
var cols = 7;

var tempRow;
var arrWinning;

//Initial startup (calls on refresh to page)
window.onload = function(){
    setBoard();
}

//Sets the initial gamestate of the board (blank board with 42 white circles)
//appends each white space to the board (overlapping)
function setBoard() {
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

            let bspace = document.getElementById(i + "" + j);
            bspace.classList.add("bspace");
            document.getElementById("board").append(bspace);

            //adds functionality of clicking a space -> calling placeCircle function
            bspace.addEventListener("click",placeCircle)
        }
        board[i] = row;
    }
}

function placeCircle(){
    if (gameOver == true){
        return;
    }

    let coords = parseInt(this.id);
    
    let rowCoord = parseInt(coords / 10);
    let colCoord = coords % 10;

    //In order to simulate gravity of pieces dropping, row coordinates are determined by the lowest open row spot (stored by tempColumn);
    rowCoord = tempRow[colCoord];

    //if full (0 more spaces left in tempRow for that column)
    if (rowCoord < 0){
        return;
    }

    //sets the board place to either red or yellow (playerOne or playerTwo)
    board[rowCoord][colCoord] = activePlayer;

    if (activePlayer == "Red"){
        document.getElementById(rowCoord + "" + colCoord).classList.add("redCircle");
        activePlayer = playerTwo;
    }
    else {
        document.getElementById(rowCoord + "" + colCoord).classList.add("yellowCircle")
        activePlayer = playerOne;
    }

    //Once a piece is placed, there is one less available spot 
    rowCoord -= 1;
    tempRow[colCoord] = rowCoord;

    checkWinner();
}

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

    if(boardFull() == true){
        gameOver = true;
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                let location = i + "" + j;
                let occupiedSpace = document.getElementById(location);
                occupiedSpace.classList.replace("redCircle","nonWinningRed");
                occupiedSpace.classList.replace("yellowCircle","nonWinningYellow");     
                
            }
        }
        winner.innerText = "There was a Draw!";
    }
    
}

function setWinner(i,j,arr){
    let winner = document.getElementById("winner");
    if(board[i][j] == playerOne) {
        winner.innerText = "Red is the Winner!";
        setRemainingOpacity(arr);
    } else {
        winner.innerText = "Yellow is the Winner!";
        setRemainingOpacity(arr);
    }
    gameOver = true;
}

function setRemainingOpacity(arr){
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
