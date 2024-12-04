/*
    Copyright (c) 2024 李乐平 (LI Leping)

    This code is proprietary software and may not be used, modified, or distributed
    without the express written permission of 李乐平 (LI Leping).
*/

const cellSize = 50;
let gridWidth = 50;
let allowMove = true;
let currentQuestion = 0;

function initBoard(board, gridSizeX = 7, gridSizeY = 7, forDemo = false){
    gridWidth = Math.min(Math.min((board.clientHeight) / gridSizeX, (board.clientWidth) / gridSizeY), cellSize);
    document.documentElement.style.setProperty('--stone-radius',   `${gridWidth - 4}px`);

    for (let i = 0; i < gridSizeX - 1; i++) {
        const horizontal = document.createElement("div");
        horizontal.className = "line horizontal";
        horizontal.style.width = `${(gridSizeY - 1) * gridWidth}px`;
        horizontal.style.top = `${i * gridWidth}px`;
        board.appendChild(horizontal);
    }
    for (let i = 0; i < gridSizeY - 1; i++) {
        const vertical = document.createElement("div");
        vertical.className = "line vertical";
        vertical.style.height = `${(gridSizeX - 1) * gridWidth}px`;
        vertical.style.left = `${i * gridWidth}px`;
        board.appendChild(vertical);
    }
    if(forDemo){
        for (let row = 0; row < gridSizeX - 1; row++) {
            for (let col = 0; col < gridSizeY - 1; col++) {
                const point = document.createElement("div");
                point.className = "point";
                point.style.top = `${row * gridWidth}px`;
                point.style.left = `${col * gridWidth}px`;
                
                point.addEventListener("click", () => {
                    const stone = document.createElement("div");
                    stone.className = "stone black";
                    stone.style.top = `${row * gridWidth}px`;
                    stone.style.left = `${col * gridWidth}px`;
                    board.appendChild(stone);
                });
                
                board.appendChild(point);
            }
        }
    }
}

let grid = [];
let gridListeners = [];
let lastCapturedCount = 0;
let lastCapturedPoints = [];
let capturedPoints = [];

function isValidMove(board, row, col, gridSizeX, gridSizeY, player){
    // console.log("Validating move for " + player + " at " + row + ", " + col);
    if(grid[row][col].classList.contains("stone")){
        return false;
    }
    if(row < 0 || row >= gridSizeX - 1 || col < 0 || col >= gridSizeY - 1){
        return false;
    }
    let tempGrid = [];
    for (let i = 0; i < gridSizeX - 1; i++) {
        tempGrid[i] = [];
        for (let j = 0; j < gridSizeY - 1; j++) {
            if(!grid[i][j].classList.contains("stone")){
                tempGrid[i][j] = 0;
            }else if(grid[i][j].classList.contains("black")){
                tempGrid[i][j] = 1;
            }else{
                tempGrid[i][j] = -1;
            }
        }
    }
    tempGrid[row][col] = player == "black" ? 1 : -1;
    let BBelong = {};        // "row,col" -> Group Number
    let WBelong = {};        // "row,col" -> Group Number
    let nextGroup = 0;      
    let groupCounts = [];    // Group Number -> Counts
    let groupLiberties = {}; // 气
    let blackGroups = [];    // Group Numbers
    let whiteGroups = [];    // Group Numbers

    let dx = [-1, 0, 1, 0];
    let dy = [0, 1, 0, -1];

    for (let i = 0; i < gridSizeX - 1; i++) {
        for (let j = 0; j < gridSizeY - 1; j++) {
            if(tempGrid[i][j] === 1 && !BBelong[i + "," + j]){
                nextGroup++;
                BBelong[i + "," + j] = nextGroup;
                blackGroups.push(nextGroup);
                groupCounts.push(0);
                groupLiberties[nextGroup] = new Set();
                let currentQueue = [i + "," + j];
                while(currentQueue.length > 0){
                    let current = currentQueue.shift();
                    let currentRow = parseInt(current.split(",")[0]);
                    let currentCol = parseInt(current.split(",")[1]);
                    // console.log("Current: " + current);
                    groupCounts[nextGroup]++;

                    for (let k = 0; k < 4; k++) {
                        let nextRow = currentRow + dx[k];
                        let nextCol = currentCol + dy[k];
                        if(nextRow >= 0 && nextRow < gridSizeX - 1 && nextCol >= 0 && nextCol < gridSizeY - 1){
                            if(tempGrid[nextRow][nextCol] === 1 && !BBelong[nextRow + "," + nextCol]){
                                currentQueue.push(nextRow + "," + nextCol);
                                BBelong[nextRow + "," + nextCol] = nextGroup;
                            }else if(tempGrid[nextRow][nextCol] === 0){
                                groupLiberties[nextGroup].add(nextRow + "," + nextCol);
                            }
                        }
                    }
                }
            }
            if(tempGrid[i][j] === -1 && !WBelong[i + "," + j]){
                nextGroup++;
                WBelong[i + "," + j] = nextGroup;
                // groupBorders[nextGroup] = new Set();
                whiteGroups.push(nextGroup);
                groupCounts.push(0);
                groupLiberties[nextGroup] = new Set();
                let currentQueue = [i + "," + j];
                while(currentQueue.length > 0){
                    let current = currentQueue.shift();
                    let currentRow = parseInt(current.split(",")[0]);
                    let currentCol = parseInt(current.split(",")[1]);

                    groupCounts[nextGroup]++;

                    for (let k = 0; k < 4; k++) {
                        let nextRow = currentRow + dx[k];
                        let nextCol = currentCol + dy[k];
                        if(nextRow >= 0 && nextRow < gridSizeX - 1 && nextCol >= 0 && nextCol < gridSizeY - 1){
                            if(tempGrid[nextRow][nextCol] === -1 && !WBelong[nextRow + "," + nextCol]){
                                currentQueue.push(nextRow + "," + nextCol);
                                WBelong[nextRow + "," + nextCol] = nextGroup;
                            }else if(tempGrid[nextRow][nextCol] === 0){
                                groupLiberties[nextGroup].add(nextRow + "," + nextCol);
                            }
                        }
                    }
                }
            }
        }
    }
    let isValid = true, captureFlag = false;
    capturedPoints = [];
    if(player === "black"){
        for (let i = 0; i < whiteGroups.length; i++) {
            if(groupLiberties[whiteGroups[i]].size === 0){
                if(
                    groupCounts[whiteGroups[i]] > 1 || 
                    lastCapturedCount !== 1 ||
                    !lastCapturedPoints.includes(row + "," + col)
                ){
                    captureFlag = true;
                }
            }
        }
        if(!captureFlag){
            lastCapturedCount = 0;
            lastCapturedPoints = [];
            for (let i = 0; i < blackGroups.length; i++) {
                if(groupLiberties[blackGroups[i]].size === 0){
                    isValid = false;
                    return false;
                }
            }
        }else{
            lastCapturedCount = 0;
            for (let k in WBelong) {
                if(groupLiberties[WBelong[k]].size === 0){
                    capturedPoints.push(k);
                    lastCapturedCount++;
                    let trow = parseInt(k.split(",")[0]);
                    let tcol = parseInt(k.split(",")[1]);
                    tempGrid[trow][tcol] = 0;
                }
            }
            lastCapturedPoints = capturedPoints.slice();
        }
    }
    if(player === "white"){
        for (let i = 0; i < blackGroups.length; i++) {
            if(groupLiberties[blackGroups[i]].size === 0){
                if(
                    groupCounts[blackGroups[i]] > 1 || 
                    lastCapturedCount !== 1 ||
                    !lastCapturedPoints.includes(row + "," + col)
                ){
                    captureFlag = true;
                }
            }
        }
        if(!captureFlag){
            lastCapturedCount = 0;
            lastCapturedPoints = [];
            for (let i = 0; i < whiteGroups.length; i++) {
                if(groupLiberties[whiteGroups[i]].size === 0){
                    isValid = false;
                    return false;
                }
            }
        }else{
            lastCapturedCount = 0;
            for (let k in BBelong) {
                if(groupLiberties[BBelong[k]].size === 0){
                    capturedPoints.push(k);
                    lastCapturedCount++;
                    let trow = parseInt(k.split(",")[0]);
                    let tcol = parseInt(k.split(",")[1]);
                    tempGrid[trow][tcol] = 0;
                }
            }
            lastCapturedPoints = capturedPoints.slice();
        }
    }

    return tempGrid;
}

let moves = {};

function move(board, row, col, gridSizeX, gridSizeY, player, moves = null){
    if(!allowMove){
        return false;
    }
    let nextGrid = isValidMove(board, row, col, gridSizeX, gridSizeY, player);
    if(!nextGrid){
        return false;
    }

    for (let i = 0; i < gridSizeX - 1; i++) {
        for (let j = 0; j < gridSizeY - 1; j++) {
            if(grid[i][j].classList.contains("stone") && !nextGrid[i][j]){
                grid[i][j].classList.remove("stone");
                grid[i][j].classList.remove("black");
                grid[i][j].classList.remove("white");
            }else if(nextGrid[i][j] === 1){
                grid[i][j].classList.remove("white");
                grid[i][j].classList.add("stone", "black");
            }else if(nextGrid[i][j] === -1){
                grid[i][j].classList.remove("black");
                grid[i][j].classList.add("stone", "white");
            }
        }
    }

    if(moves){
        if(moves[row + "," + col]){
            if(moves[row + "," + col][0]){
                move(
                    board, moves[row + "," + col][0][0], moves[row + "," + col][0][1], 
                    gridSizeX, gridSizeY, player === "black" ? "white" : "black"
                );
            }
            if(moves[row + "," + col][2]){
                let gameComment = document.getElementById("game-comment");
                gameComment.innerHTML = moves[row + "," + col][2];
                allowMove = false;
            }
            if(moves[row + "," + col][1]){
                moves = moves[row + "," + col][1];
            }
        }else{
            let gameComment = document.getElementById("game-comment");
            gameComment.innerHTML = "错误。Wrong move.";
            allowMove = false;
        }
    }

    for(let i = 0; i < gridSizeX - 1; i++){
        for(let j = 0; j < gridSizeY - 1; j++){
            if(gridListeners[i][j]){
                grid[i][j].removeEventListener("click", gridListeners[i][j]);
                gridListeners[i][j] = null;
            }
            if(!grid[i][j].classList.contains("stone")){
                const listener = () => {
                    move(board, i, j, gridSizeX, gridSizeY, player, moves);
                }
                grid[i][j].addEventListener("click", listener);
                gridListeners[i][j] = listener;
            }
        }
    }

    return true;
}

function loadQuestion(board, question){
    allowMove = true;
    grid = [];
    gridListeners = [];
    board.innerHTML = "";
    let player = question.firstToPlay;
    moves = question.moves;
    initBoard(board, question.gridSizeX, question.gridSizeY);
    let gameComment = document.getElementById("game-comment");
    gameComment.innerHTML = "";

    for (let row = 0; row < question.gridSizeX - 1; row++) {
        grid[row] = [];
        gridListeners[row] = [];
        for (let col = 0; col < question.gridSizeY - 1; col++) {
            const point = document.createElement("div");
            point.className = "point";
            point.style.top = `${row * gridWidth}px`;
            point.style.left = `${col * gridWidth}px`;
            grid[row][col] = point;
            gridListeners[row][col] = null;
            board.appendChild(point);
        }
    }
    for (let i = 0; i < question.initB.length; i++){
        grid[question.initB[i][0]][question.initB[i][1]].classList.add("stone", "black");
    }
    for (let i = 0; i < question.initW.length; i++){
        grid[question.initW[i][0]][question.initW[i][1]].classList.add("stone", "white");
    }
    for (let row = 0; row < question.gridSizeX - 1; row++) {
        for (let col = 0; col < question.gridSizeY - 1; col++) {
            if(!grid[row][col].classList.contains("stone")){
                const listener = () => {
                    move(board, row, col, question.gridSizeX, question.gridSizeY, player, question.moves);
                };
                grid[row][col].addEventListener("click", listener);
                gridListeners[row][col] = listener;
            }
        }
    }
}

function loadRandomQuestion(board, excludeIndex = -1){
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questions.length);
    } while (randomIndex === excludeIndex);
    loadQuestion(board, questions[randomIndex]);
    return randomIndex;
}