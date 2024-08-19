// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. play again


const prompt = require("prompt-sync")();
const COLS = 3
const ROWS = 3
const SYMBOLS_COUNT = {
    Apple : 2,
    Orange: 4,
    Banana: 6,
    Grape : 8,
};

const SYMBOLS_VALUES = {
    Apple : 5,
    Orange: 4,
    Banana: 3,
    Grape : 2,
};

function deposit() {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount  <= 0) {
            console.log("invalid deposit amount, try again");
        } else{
            return numberDepositAmount;
        }

    }
};

function getNumberOfLines(){
    while (true){ 
        const numberOfLines = parseFloat(prompt("Enter the amount of Lines to bet on (1-3): "));
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3 ){
            console.log("invalid number of lines, try again");
        } else{
            return numberOfLines;
        }
    }
    
};

function collectBetAmount(balance, lines){
    while (true){ 
        const BetAmount = parseFloat(prompt("Enter the bet per line: "));

        if (isNaN(BetAmount) || BetAmount <= 0 || BetAmount >= balance / lines ){
            console.log("invalid amount, try again");
        } else{
            return BetAmount;
        }
    }
};

function spinSlotMachine(){
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    const reels = []
    for (let i = 0; i < COLS; i++){
        reels.push([])
        const reelsymbols = [...symbols];
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor( Math.random() * reelsymbols.length);
            const selectedSymbol = reelsymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelsymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}
function transpose(reels){
    const transposedReels = [];
    for (let i = 0; i < ROWS; i++){
        transposedReels.push([]);
        for (let j = 0; j< COLS; j++){
            const reelValue = reels[j][i];
            transposedReels[i].push(reelValue);
        }
    }
    return transposedReels;

}

function checkWin(rows){
    let modifier = 1;
    for (let i = 0; i < ROWS; i++){
        const row = rows[i];
        const fruit = row[0];
        const checkfruit = x => x == fruit;
        if (row.every(checkfruit)) {
            console.log(SYMBOLS_VALUES[fruit])
            modifier = modifier * SYMBOLS_VALUES[fruit];
        }
    }
    return modifier;
}

function getWinnings(rows, bet, lines){
    let winnings = 0;
    for(let i = 0; i < lines; i++){
        const row = rows[i];
        const fruit = row[0];
        const checkfruit = x => x == fruit;
        if (row.every(checkfruit)) {
            console.log(SYMBOLS_VALUES[fruit]);
            winnings += bet * SYMBOLS_VALUES[fruit];
        }
    }
    return winnings

}
function printRows(rows){
    for(let i = 0; i < ROWS; i++){
        const row = rows[i];
        let rowString = "";
        for(let j = 0; j <COLS; j++){
            rowString += row[j];
            if(j+1 < COLS){
                rowString += " | "
            }
        
        }
        console.log(rowString);
    }



}
function playAgain(balance){
    if (balance > 0 ){
        while (true){ 
        let answer = prompt("Enter YES to play again or NO to quit: ");
        answer = answer.toUpperCase();
        if (answer == "YES" || answer == "NO"){
            if(answer == "YES" ){
                return true
            }
            console.log("Thank you for playing :)")
            break
        } else{
            console.log("invalid answer, try again");
        } 
        }
    }
    else{ 
        console.log("you have no more money");
    }
    return false
}

function playSlots(){
    let balance = deposit();
    let game = true;
    while(game){
        const lines = getNumberOfLines();
        const bet = collectBetAmount(balance, lines);
        balance -= bet;
        const reels = spinSlotMachine();
        const rows = transpose(reels);
        console.log(rows) ;
        printRows(rows)
        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        console.log("you won:", winnings);
        console.log("your new balance is:", balance);
        game = playAgain(balance);
    }

}

playSlots();