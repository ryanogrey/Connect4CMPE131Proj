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
var difficultySet = false;

var turn = 0;

var avoid = null;



//Initial startup (calls on refresh to page)
window.onload = function(){
    setBoard();
}

function refreshBoard(){
    window.location.reload();
}

function setDifficultyEasy(){
    if (difficultySet == true){
        console.log("already set");
    }
    else{
        console.log("setting difficulty to Easy");
        difficulty = "Easy";
        difficultySet = true;
        document.getElementById("dbutton1").removeEventListener("click", setDifficultyEasy);
        document.getElementById("dbutton2").style.opacity = 0;
        document.getElementById("dbutton3").style.opacity = 0;
    }
}

function setDifficultyMedium(){
    if (difficultySet == true){
        console.log("already set");
    }
    else{
        console.log("setting difficulty to Medium");
        difficulty = "Medium";
        difficultySet = true;
        document.getElementById("dbutton2").removeEventListener("click", setDifficultyMedium);
        document.getElementById("dbutton1").style.opacity = 0;
        document.getElementById("dbutton3").style.opacity = 0;
    }
}

function setDifficultyHard(){
    if (difficultySet == true){
        console.log("already set");
    }
    else{
        console.log("setting difficulty to Hard");
        difficulty = "Hard";
        difficultySet = true;
        document.getElementById("dbutton3").removeEventListener("click", setDifficultyHard);
        document.getElementById("dbutton1").style.opacity = 0;
        document.getElementById("dbutton2").style.opacity = 0;
    }
}

//Sets the initial gamestate of the board (blank board with 42 white circles)
//appends each white space to the board (overlapping)
function setBoard() {

    let easyButton = document.getElementById("dbutton1");
    easyButton.addEventListener("click", setDifficultyEasy);

    let easyButton1 = document.getElementById("dbutton2");
    easyButton1.addEventListener("click", setDifficultyMedium);

    let easyButton2 = document.getElementById("dbutton3");
    easyButton2.addEventListener("click", setDifficultyHard);

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
        setTimeout(placeCircle, 1200);
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

    document.getElementById("dbutton1").removeEventListener("click", setDifficultyEasy);
    document.getElementById("dbutton2").removeEventListener("click", setDifficultyMedium);
    document.getElementById("dbutton3").removeEventListener("click", setDifficultyHard);

    if(difficulty == "Easy"){
        document.getElementById("dbutton2").style.opacity = 0;
        document.getElementById("dbutton3").style.opacity = 0;
    }
    else if(difficulty == "Medium"){
        document.getElementById("dbutton1").style.opacity = 0;
        document.getElementById("dbutton3").style.opacity = 0;
    }
    else if(difficulty == "Hard"){
        document.getElementById("dbutton1").style.opacity = 0;
        document.getElementById("dbutton2").style.opacity = 0;
    }
    else{
        document.getElementById("dbutton1").style.opacity = 0;
        document.getElementById("dbutton2").style.opacity = 0;
        document.getElementById("dbutton3").style.opacity = 0;
    }

    let showTurn = document.getElementById("showTurn");
    let stateTurn = document.getElementById("stateTurn");

    if (activePlayer == playerTwo) {
        turn++;
        colCoord = determinePlay();
        rowCoord = tempRow[colCoord];
        if (rowCoord < 0){
            return;
        }
        board[rowCoord][colCoord] = activePlayer;

        showTurn.style.backgroundColor = "Red";
        stateTurn.innerText = "Red's Turn";

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

        showTurn.style.backgroundColor = "Yellow";
        stateTurn.innerText = "Yellow's Turn";

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

    //Given a winner, Adds button to start new game (effectively refreshing page)
    let restartButton = document.createElement("button");
    restartButton.id = "button2";
    restartButton.addEventListener("click", refreshBoard);
    document.getElementById("left").append(restartButton);
    restartButton.innerText = "Click to Play Again!";

    let stateTurn = document.getElementById("stateTurn");
    stateTurn.innerText = "Game Over!";

    let showTurn = document.getElementById("showTurn");

    //if draw
    if(i == -100) {
        winner.innerText = "There was a Draw!";
        showTurn.style.backgroundColor = "gray";
        setRemainingPieces(arr);
    }
    //if red wins
    else if(board[i][j] == playerOne) {
        winner.innerText = "Red is the Winner!";
        showTurn.style.backgroundColor = "Red";
        winner.style.color = "red";
        setRemainingPieces(arr);
    } 
    //if yellow wins
    else {
        winner.innerText = "Yellow is the Winner!";
        showTurn.style.backgroundColor = "Yellow";
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

    let temp = -1;

    //checking lowest level horizontal
    //if on lowest level, an empty space guarentees there is nothing below it, so don't have to check the piece below
    for(let i = 0; i< rows; i++){
        for (let j = 0; j< cols-3; j++){
            let color1 = board[i][j];
            let color2 = board[i][j+1];
            let color3 = board[i][j+2];
            let color4 = board[i][j+3];

            if((color1 == color2) && (color2 == color3) && (color4 == ' ')){
                if (i == 5){
                    console.log("Horizontal lowest level noticed");
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        return j+3;
                    }
                    else{
                        temp = j+3;
                    }
                }
            }
            else if((color1 == color2) && (color2 == color4) && (color3 == ' ')){
                if (i == 5){
                    console.log("Horizontal lowest level noticed");
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        return j+2;
                    }
                    else{
                        temp = j+2;
                    }
                }
            }
            if((color1 == color3) && (color3 == color4) && (color2 == ' ')){
                if (i - 1 == 4){
                    console.log("Horizontal lowest level noticed");
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        return j+1;
                    }
                    else{
                        temp = j+1;
                    }
                }
            }
            else if((color2 == color3) && (color3 == color4) && (color1 == ' ')){
                if (i - 1 == 4){
                    console.log("Horizontal lowest level noticed");
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        return j;
                    }
                    else{
                        temp = j;
                    }
                }
            }
        }
    }

    //checking for any case horiztonal
    for(let i = 0; i< rows -1; i++){
        for (let j = 0; j< cols-3; j++){
            let color1 = board[i][j];
            let color2 = board[i][j+1];
            let color3 = board[i][j+2];
            let color4 = board[i][j+3];

            if ((color1 == color2) && (color2 == color3) && (color4 == ' ') && (board[i+1][j+3] != ' ')){
                if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                    return j+3;
                }
                else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                    temp = j+3;
                }
            }
            else if ((color1 == color2) && (color2 == color4) && (color3 == ' ') && (board[i+1][j+2] != ' ')){
                if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                    return j+2;
                }
                else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                    temp = j+2;
                }
            }
            else if ((color1 == color3) && (color3 == color4) && (color2 == ' ') && (board[i+1][j+1] != ' ')){
                if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                    return j+1;
                }
                else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                    temp = j+1;
                }
            }
            else if ((color2 == color3) && (color3 == color4) && (color1 == ' ') && (board[i+1][j] != ' ')){
                if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                    return j;
                }
                else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                    temp = j;
                }
            }
            
        }
    }

    //Avoid function horizontal
    for(let i = 0; i< rows -1; i++){
        for (let j = 0; j< cols-3; j++){
            let color1 = board[i][j];
            let color2 = board[i][j+1];
            let color3 = board[i][j+2];
            let color4 = board[i][j+3];
            if (i < 4){
                if ((color1 == color2) && (color2 == color3) && (color4 == ' ')  && (board[i+1][j+3] == ' ' && board[i+2][j+3] != ' ')){
                    if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        setAvoid(j+3);
                    }
                }
                else if ((color1 == color2) && (color2 == color4) && (color3 == ' ')  && (board[i+1][j+2] == ' ' && board[i+2][j+2] != ' ')){
                    if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        setAvoid(j+2);
                    }
                }
                else if ((color1 == color3) && (color3 == color4) && (color2 == ' ')  && (board[i+1][j+1] == ' '  && board[i+2][j+1] != ' ')){
                    if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        setAvoid(j+1);
                    }
                }
                else if ((color2 == color3) && (color3 == color4) && (color1 == ' ')  && (board[i+1][j] == ' '  && board[i+2][j] != ' ')){
                    if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        setAvoid(j);
                    }
                }
            }
            else if(i == 4){
                if ((color1 == color2) && (color2 == color3) && (color4 == ' ')  && (board[i+1][j+3] == ' ')){
                    if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        setAvoid(j+3);
                    }
                }
                else if ((color1 == color2) && (color2 == color4) && (color3 == ' ')  && (board[i+1][j+2] == ' ')){
                    if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        setAvoid(j+2);
                    }
                }
                else if ((color1 == color3) && (color3 == color4) && (color2 == ' ')  && (board[i+1][j+1] == ' ' )){
                    if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        setAvoid(j+1);
                    }
                }
                else if ((color2 == color3) && (color3 == color4) && (color1 == ' ')  && (board[i+1][j] == ' ' )){
                    if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        setAvoid(j);
                    }
                }
            }
            
            
        }
    }

    //Vertical
    for(let i = rows-1; i >= 3; i--){
        for(let j = 0; j < cols; j++){
            if(board[i][j] != ' '){
                let color = board[i][j];
                if((board[i][j] == color) && (board[i-1][j] == color) && (board[i-2][j] == color) && (board[i-3][j] == ' ')){
                    console.log("vertical noticed");
                    if (color == "Yellow"){
                        return j;
                    }
                    else{
                        temp = j;
                    }
                }
            }
        }
    }

    //checking diagonal (lower left to top right)
    //checking lowest level diagonal
    //if on lowest level, an empty space guarentees there is nothing below it, so don't have to check the piece to the left
    for(let i = rows - 1; i >= 3; i--){
        for (let j = 0; j< cols - 3; j++){
            let color1 = board[i][j];
            let color2 = board[i-1][j+1];
            let color3 = board[i-2][j+2];
            let color4 = board[i-3][j+3];

            if((color1 == color2) && (color2 == color3) && (color4 == ' ') && board[i-2][j+3] != ' '){
                if (i == 5){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal1 noticed");
                        return j+3;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal1 noticed");
                        temp = j+3;
                    }
                }
            }
            else if((color1 == color2) && (color2 == color4) && (color3 == ' ') && board[i-1][j+2] != ' '){
                if (i == 5){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal1 noticed");
                        return j+2;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal1 noticed");
                        temp = j+2;
                    }
                }
            }
            if((color1 == color3) && (color3 == color4) && (color2 == ' ') && board[i][j+1] != ' '){
                if (i == 5){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal1 noticed");
                        return j+1;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal1 noticed");
                        temp = j+1;
                    }
                }
            }
            else if((color2 == color3) && (color3 == color4) && (color1 == ' ')){
                if (i == 5){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal1 noticed");
                        return j;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal1 noticed");
                        temp = j;
                    }
                }
            }
        }
    }

    //checking diagonal (lower left to top right)
    //checking any level diagonal
    for(let i = rows - 2; i >= 3; i--){
        for (let j = 0; j< cols - 3; j++){
            let color1 = board[i][j];
            let color2 = board[i-1][j+1];
            let color3 = board[i-2][j+2];
            let color4 = board[i-3][j+3];

            if((color1 == color2) && (color2 == color3) && (color4 == ' ') && board[i-2][j+3] != ' '){
                if (i < 5){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal1 noticed");
                        return j+3;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal1 noticed");
                        temp = j+3;
                    }
                }
            }
            else if((color1 == color2) && (color2 == color4) && (color3 == ' ') && board[i-1][j+2] != ' '){
                if (i < 5){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal1 noticed");
                        return j+2;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal1 noticed");
                        temp = j+2;
                    }
                }
            }
            if((color1 == color3) && (color3 == color4) && (color2 == ' ') && board[i][j+1] != ' '){
                if (i < 5){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal1 noticed");
                        return j+1;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal1 noticed");
                        temp = j+1;
                    }
                }
            }
            else if((color2 == color3) && (color3 == color4) && (color1 == ' ') && board[i+1][j] != ' '){
                if (i < 5){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal1 noticed");
                        return j;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal1 noticed");
                        temp = j;
                    }
                }
            }
        }
    }

    //checking diagonal (upper left to lower right)
    //checking lowest level diagonal
    //if on lowest level, an empty space guarentees there is nothing below it, so don't have to check the piece to the left
    
    for(let i = 0; i < 3; i++){
        for (let j = 0; j < cols - 3; j++){
            let color1 = board[i][j];
            let color2 = board[i+1][j+1];
            let color3 = board[i+2][j+2];
            let color4 = board[i+3][j+3];

            if((color1 == color2) && (color2 == color3) && (color4 == ' ') && board[i+2][j+3] != ' '){
                if (i != -1){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal2 noticed");
                        return j+3;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal2 noticed");
                        temp = j+3;
                    }
                }
            }
            else if((color1 == color2) && (color2 == color4) && (color3 == ' ') && board[i+1][j+2] != ' '){
                if (i != -1){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal2 noticed");
                        return j+2;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal2 noticed");
                        temp = j+2;
                    }
                }
            }
            if((color1 == color3) && (color3 == color4) && (color2 == ' ') && board[i][j+1] != ' '){
                if (i != -1){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal2 noticed");
                        return j+1;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal2 noticed");
                        temp = j+1;
                    }
                }
            }
            else if((color2 == color3) && (color3 == color4) && (color1 == ' ')){
                if (i != -1){
                    if (color1 == "Yellow" || color2 == "Yellow" || color3 == "Yellow" || color4 == "Yellow"){
                        console.log("Diagonal2 noticed");
                        return j;
                    }
                    else if (color1 == "Red" || color2 == "Red" || color3 == "Red" || color4 == "Red"){
                        console.log("Diagonal2 noticed");
                        temp = j;
                    }
                }
            }
        }
    }

    return temp;
}

function setAvoid(avoid) {
    count = 0;
    for(let i = 0; i< rows; i++){
        for(let j = 0; j< cols; j++){
            if(board[i][j] != ' ') {
                count++;
            }
        }
    }
    if(count < 40){
        this.avoid = avoid;
    }
    console.log("avoid set");
}


function determinePlay(){
    //prevents initial trap
    if (turn == 1 && board[5][3] == ' '){
        colCoord = 3;
        return colCoord;
    }
    else if (turn == 1 && board[5][3] != ' '){
        colCoord = randomPlay();
        while (colCoord == 3){
            colCoord = randomPlay();
        }
        return colCoord;
    }

    if(difficulty == "Easy"){
        let chance = Math.floor(Math.random() * 100);
        if (chance < 70){
            let test = intelligentPlay();
            if(test == -1){
                //random play
                colCoord = randomPlay();
                while(document.getElementById(tempRow[colCoord] + "" + colCoord).classList.value != "emptySpace" || (avoid == colCoord)){
                    colCoord = randomPlay();
                }
                return colCoord;
            }
            else{
                return test;
            }
        }
        else{
           //random play
           colCoord = randomPlay();
           while(document.getElementById(tempRow[colCoord] + "" + colCoord).classList.value != "emptySpace" || (avoid == colCoord)){
               colCoord = randomPlay();
           }
           return colCoord; 
        }
    }
    else if(difficulty = "Medium"){
        let chance = Math.floor(Math.random() * 100);
        if (chance < 90){
            let test = intelligentPlay();
            if(test == -1){
                //random play
                colCoord = randomPlay();
                while(document.getElementById(tempRow[colCoord] + "" + colCoord).classList.value != "emptySpace" || (avoid == colCoord)){
                    colCoord = randomPlay();
                }
                return colCoord;
            }
            else{
                return test;
            }
        }
        else{
           //random play
           colCoord = randomPlay();
           while(document.getElementById(tempRow[colCoord] + "" + colCoord).classList.value != "emptySpace" || (avoid == colCoord)){
               colCoord = randomPlay();
           }
           return colCoord; 
        }
    }
    //hard or no choice selected
    else{
        let test = intelligentPlay();
        if(test == -1){
            //random play
            colCoord = randomPlay();
            while(document.getElementById(tempRow[colCoord] + "" + colCoord).classList.value != "emptySpace" || (avoid == colCoord)){
                colCoord = randomPlay();
            }
            return colCoord;
        }
        else{
            return test;
        }
    } 
}