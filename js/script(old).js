/*-------------------------
Structures
-------------------------*/
const BUTTON = {
    start: "start",
    one: "option1",
    two: "option2",
    restart: "restart"
};

const OPTIONS = {
    one: "option1",
    two: "option2",
    error: "Error"
};

const DISPLAY = {
    hide: "hide",
    show: "show"
}

const BLOCK = {
    start: 1,
    option: 2,
    result: 3
}

const FILTER = {
    skip: "skip",
    continue: "continue"
}


/*-------------------------
Variable Declaration
-------------------------*/
//Elements of the HTML
//Blocks
let startBlock = document.getElementById("startBlock");
let optionsBlock = document.getElementById("optionsBlock");
let resultsBlock = document.getElementById("resultsBlock");
let listItem = document.getElementById("listBlock");
//Input File
let fileObject = document.getElementById("jsonFile");
//Tittles
let tittle1 = document.getElementById("tittle1");
let tittle2 = document.getElementById("tittle2");
//Buttons
let startBtn = document.getElementById("startBtn");
let deleteBtn = document.getElementById("deleteBtn");
let button1 = document.getElementById("btn1");
let button2 = document.getElementById("btn2");
let restartBtn = document.getElementById("restartBtn");

//Code Variables
let showArray;
let algorithmArray = [];
let madePairs = [];
let tempPair;


/*-------------------------
Used Functions
-------------------------*/
//Show and hide blocks
function displayOptions(block, display) {
    switch (block) {
        case BLOCK.start:
            switch (display) {
                case DISPLAY.show:
                    startBlock.style.display = "flex";
                    break;
                case DISPLAY.hide:
                    startBlock.style.display = "none";
                    break;
            }
            break;
        case BLOCK.option:
            switch (display) {
                case DISPLAY.show:
                    optionsBlock.style.display = "flex";
                    break;
                case DISPLAY.hide:
                    optionsBlock.style.display = "none";
                    break;
            }
            break;
        case BLOCK.result:
            switch (display) {
                case DISPLAY.show:
                    resultsBlock.style.display = "flex";
                    break;
                case DISPLAY.hide:
                    resultsBlock.style.display = "none";
                    break;
            }
            break;
        default: alert("Something went wrong in displayOptions()");
    }
}

//Reload the page and clear the data for another ranker
function reloadPage() {
    if (window.confirm("Are you sure?")) {
        localStorage.clear();
        location.reload();
    }
}

//Convert the JSON into our own useful array of objects, and functions to read and write it
function convert2Array(data){
    var array = [];
    var i;

    for(i = 0; i < data.length; i++){
        array.push({title: data[i].title, wins: 0});
    }
    return array;
}
function saveShowsToStorage(value){
    localStorage.shows = JSON.stringify(value);
}
function loadShowsFromStorage(){
    return JSON.parse(localStorage.shows);
}

//Create an array filled with all combinations
function createArray(lenght){
    var x;
    var y;
    var array = [];
    for(x=0; x<lenght; x++){
        for(y=0; y<lenght; y++){
            array.push([x,y]);
        }
    }

    return array;
}

//Get random interger for array
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

//Filter function that check madePairs and eliminates comparing same shows
function skipPair(valuex, valuey){
    
    //Skip if x and y are the same (no reason in comparin equal shows)
    if(valuex == valuey){
        return FILTER.skip;
    }
    
    //Cycle throught the x-y combinations
    //First compute the x-y combination
    var pair = (valuex * valuey) + (valuex + valuey);
    var x;
    for(x=0; x < madePairs.length; x++){
        //If any of the combinations is the same as the input
        if(madePairs[x] == pair){
            //Send signal to skip
            return FILTER.skip;
        }
    }

    //If none of the above, send signal to use the pairs
    return FILTER.continue;
}


/*-------------------------
Main Functions
-------------------------*/
//Initailize the HTML when the page is reloaded
function initialize() {
    //Hide other blocks
    displayOptions(BLOCK.start, DISPLAY.show);
    displayOptions(BLOCK.option, DISPLAY.hide);
    displayOptions(BLOCK.result, DISPLAY.hide);

    if(localStorage.activeSesion){
        startBtn.innerHTML = "Resume"
        deleteBtn.style.display = "block";
    }else{
        deleteBtn.style.display = "none";
    }
}

//Code for starting the program
function startScript() {
    if(!localStorage.activeSesion){
        //Save session and make it active (until user restarts)
        localStorage.activeSesion = true;
    
        //Save the input document into a temporary variable
        const reader = new FileReader();
        reader.readAsText(fileObject.files[0]);
        reader.onload = function () {
            //Convert the string into an object, then convert it into a useful array
            showArray = convert2Array(JSON.parse(reader.result));

            //Save this array to storage
            saveShowsToStorage(showArray);
            
            //Create algorithm array
            algorithmArray = createArray(showArray.length);
            localStorage.algorithmArray = JSON.stringify(algorithmArray);

            rankerProgram();
        };
        return;
    }

    showArray = loadShowsFromStorage();
    algorithmArray = JSON.parse(localStorage.algorithmArray);
    madePairs = JSON.parse(localStorage.madePairs);
    rankerProgram();  
}

//Code that manages the selection of the button, and add the selection to the array
function addWinsToShow(option){
    switch(option){
        case OPTIONS.one:
            showArray[localStorage.x].wins ++;
            madePairs.push(tempPair);
            localStorage.madePairs = JSON.stringify(madePairs);
            console.log(tempPair);
            console.log(madePairs);
            break;
        case OPTIONS.two:
            showArray[localStorage.y].wins ++;
            madePairs.push(tempPair);
            localStorage.madePairs = JSON.stringify(madePairs);
            break;
        default: alert("Error in addWinsToShow()");
    }
}

//Code that contains the algorithm that selects the show
function rankerProgram(option){
    //Set display settings
    displayOptions(BLOCK.start, DISPLAY.hide);
    displayOptions(BLOCK.option, DISPLAY.show);
    displayOptions(BLOCK.result, DISPLAY.hide);

    var loop = true
    var loops = 0;
    while(loop){
        if(algorithmArray.length == 0 || loops > showArray.length + 100){
            loop = false;
            continue;
        }
        var rand = getRandomInt(algorithmArray.length)
        var x = algorithmArray[rand][0];
        var y = algorithmArray[rand][1];

        //filter the shows using the "skipPair()" funcion
        if(skipPair(x, y) == FILTER.skip){
            //If we skip, we delete
            algorithmArray.splice(rand,1);

            
            //Continue to the next "y" if this x-y combination has already been used
            continue;
        }
        //Store variable for final judgement
        tempPair = x * y + x + y;
        
        //Display the titles
        tittle1.innerHTML = showArray[x].title;
        tittle2.innerHTML = showArray[y].title;

        //Store the x-y combinations for when the button is pressed
        localStorage.x = x;
        localStorage.y = y;

        loops++;
        //Return to give the user some time to press the button
        return ;
    }

    //Once it's finished, go to the next step
    listProgram();
}

//Code that creates the list of winners
function listProgram(){
    //Set display settings
    displayOptions(BLOCK.start, DISPLAY.hide);
    displayOptions(BLOCK.option, DISPLAY.hide);
    displayOptions(BLOCK.result, DISPLAY.show);

    var loop = true;
    while(loop){
        //Security measure for infinite loop
        var loops;

        //First, select the highest show
        var x;
        var temp = 1;
        if(!(showArray.length <= 1)){
            for(x = 0; x < showArray.length; x++) {
                if((showArray[x].wins > showArray[temp].wins)){
                    temp = x;
                }
            }
        }else{
            temp = 0;
        }
        

        //Print out this item to the list
        let newListItem = document.createElement("li");
        newListItem.innerHTML = "[" + showArray[temp].wins + "] - " + showArray[temp].title;
        listItem.appendChild(newListItem);

        //Now remove the show
        showArray.splice(temp,1);

        //Cycle until the array is empty
        if((showArray.length == 0) || (loops > (showArray.lenght + 100))){
            loop = false;
        }
        loops++;
    }
}

//Handdle the options for the button listeners
function buttonHanddler(option) {
    switch (option) {
        case BUTTON.start:
            //Check input file and previous session
            if(localStorage.activeSesion){
                startScript();
            }else if(fileObject.files[0] == undefined){
                alert("Remember to select a file.");
            }else if(!fileObject.files[0].name.toLowerCase().endsWith(".json")){
                alert("Hint: it has to be a .json!");
            }else{
                startScript();
            }
            break;
        case BUTTON.one:
            addWinsToShow(OPTIONS.one);
            rankerProgram();
            saveShowsToStorage(showArray);
            break;
        case BUTTON.two:
            addWinsToShow(OPTIONS.two);
            rankerProgram();
            saveShowsToStorage(showArray);
            break;
        case BUTTON.restart:
            reloadPage();
            break;
        default:
            alert("Something went wrong: buttonHanddler() called and no case was triggered.");
    }
}


/*-------------------------
Code
-------------------------*/
//Inicialization
initialize();

//Button listeners
startBtn.addEventListener("click", function () {
    buttonHanddler(BUTTON.start);
});
deleteBtn.addEventListener("click", function () {
    buttonHanddler(BUTTON.restart);
});
button1.addEventListener("click", function () {
    buttonHanddler(BUTTON.one);
});
button2.addEventListener("click", function () {
    buttonHanddler(BUTTON.two);
});
restartBtn.addEventListener("click", function () {
    buttonHanddler(BUTTON.restart);
});





//OLD ALGORITHM

    // //Go through all posible combinations of that list
    // var x;
    // var y;
    // for(x = 0; x < showArray.length; x++) {
    //     for(y = 0; y < showArray.length; y++) {
    //         //filter the shows using the "skipPair()" funcion
    //         if(skipPair(x, y) == FILTER.skip){
    //             //Continue to the next "y" if this x-y combination has already been used
    //             continue
    //         }
            
    //         //If it passes the filter: add this x-y combination to the global variable
    //         var pair = x * y + x + y;
    //         madePairs.push(pair);
    //         localStorage.madePairs = JSON.stringify(madePairs);

    //         //Display the titles
    //         tittle1.innerHTML = showArray[x].title;
    //         tittle2.innerHTML = showArray[y].title;
    //         //Store the x-y combinations for when the button is pressed
    //         localStorage.x = x;
    //         localStorage.y = y;
    //         //Return to give the user some time to press the button
    //         return;
    //     }
    // }