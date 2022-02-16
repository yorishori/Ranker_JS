/*-------------------------
Structures
-------------------------*/
const BUTTON = {
    start: "start",
    one: "option1",
    two: "option2",
    restart: "restart"
};

const DISPLAY = {
    hide: "hide",
    show: "show"
}

const BLOCK = {
    start: 1,
    option: 2,
    result: 3,
    loading: 4
}

const OPTION = {
    btn1: "one",
    btn2: "two",
    titleREQ: "title"
}

/*-------------------------
Variable Declaration
-------------------------*/
//Elements of the HTML
//Blocks
let startBlock = document.getElementById("startBlock");
let optionsBlock = document.getElementById("optionsBlock");
let resultsBlock = document.getElementById("resultsBlock");
let loadingBlock = document.getElementById("loadingBlock");
//Input File
let fileObject = document.getElementById("jsonFile");
//Tittles
let tittle1 = document.getElementById("tittle1");
let tittle2 = document.getElementById("tittle2");
let listItem = document.getElementById("listBlock");
//Buttons
let startBtn = document.getElementById("startBtn");
let deleteBtn = document.getElementById("deleteBtn");
let button1 = document.getElementById("btn1");
let button2 = document.getElementById("btn2");
let restartBtn = document.getElementById("restartBtn");
//Loading bars
let loadingBar = document.getElementById("loadingBar");
let progressBar = document.getElementById("progressBar");

//Global Variables
let showArray;
let madePairs = [];

//Algorithm Variables
let fighter;
let opponent;


/*-------------------------
Functions
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
                    optionsBlock.style.display = "grid";
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
        case BLOCK.loading:
            switch (display) {
                case DISPLAY.show:
                    loadingBlock.style.display = "flex";
                    break;
                case DISPLAY.hide:
                    loadingBlock.style.display = "none";
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
function convert2Array(data) {
    var array = [];
    var i;

    for (i = 0; i < data.length; i++) {
        array.push({ title: data[i].title, used: false, position: i });
    }
    return array;
}

function displayTitles(x, y) {
    var link1 = "https://www.google.com/search?q=" + showArray[x].title + " " + localStorage.typeTag + "&newwindow=1&sxsrf=ALeKk02fSD10kNWQ3zRGB107L983JxMeFw:1585518474957&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjy7-_L1MDoAhWDDewKHYrKC7cQ_AUoAXoECB8QAw&biw=1280&bih=721";
    var link2 = "https://www.google.com/search?q=" + showArray[y].title + " " + localStorage.typeTag + "&newwindow=1&sxsrf=ALeKk02fSD10kNWQ3zRGB107L983JxMeFw:1585518474957&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjy7-_L1MDoAhWDDewKHYrKC7cQ_AUoAXoECB8QAw&biw=1280&bih=721";

    tittle1.innerHTML = '<a href="' + link1 + '" target="_blank" >' + showArray[x].title + "</a>";
    tittle2.innerHTML = '<a href="' + link2 + '" target="_blank" >' + showArray[y].title + "</a>";
}

//Create an array filled with all combinations
function createArray(lenght) {
    var x;
    var y;
    var array = [];
    for (x = 0; x < lenght; x++) {
        for (y = 0; y < lenght; y++) {
            array.push([x, y, 0]);
        }
    }

    return array;
}

//Display a the loading screen
function loadingScreen(runCode) {
    //Turn off all screens
    displayOptions(BLOCK.start, DISPLAY.hide);
    displayOptions(BLOCK.option, DISPLAY.hide);
    displayOptions(BLOCK.result, DISPLAY.hide);

    //Initialize bar
    localStorage.progress = 0;
    loadingBar.style.width = localStorage.progress + "%";
    loadingBar.innerHTML = localStorage.progress + "%";

    displayOptions(BLOCK.loading, DISPLAY.show);

    //Code for simulating loading bar
    if (localStorage.progress == 0) {
        var id = setInterval(frame, 5);
        function frame() {
            if (localStorage.progress >= 100) {
                clearInterval(id);
                displayOptions(BLOCK.loading, DISPLAY.hide);
                console.log("Exit");
                runCode();
            } else {
                var temp1 = getRandomInt(10);
                if (temp1 == 0) {
                    localStorage.progress++;
                }
            }
            loadingBar.style.width = localStorage.progress + "%";
            loadingBar.innerHTML = localStorage.progress + "%";
        }
    }
}

//Display a black frame
function blankScreen() {
    displayOptions(BLOCK.start, DISPLAY.hide);
    displayOptions(BLOCK.option, DISPLAY.hide);
    displayOptions(BLOCK.result, DISPLAY.hide);
    displayOptions(BLOCK.loading, DISPLAY.hide);
}

//Get random interger within range
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//Update Progress Bar
function updateProgress() {
    var x;
    var size = 0;
    for (x = 0; x < showArray.length; x++) {
        if (showArray[x].used) {
            size++;
        }
    }
    if (size == 0) {
        size = 1;
    }
    var temp2 = (size / showArray.length) * 100;
    
    progressBar.style.width = temp2 + "%";
}


/*-------------------------
Main Functions
-------------------------*/
//Initailize the HTML when the page is reloded
function initialize() {
    //Hide other blocks
    displayOptions(BLOCK.start, DISPLAY.show);
    displayOptions(BLOCK.option, DISPLAY.hide);
    displayOptions(BLOCK.result, DISPLAY.hide);
    displayOptions(BLOCK.loading, DISPLAY.hide);

    if (localStorage.activeSesion) {
        startBtn.innerHTML = "Resume"
        deleteBtn.style.display = "block";

        //Load values
        showArray = JSON.parse(localStorage.showArray);
        fighter = localStorage.fighter;
        opponent = localStorage.opponent;
    } else {
        deleteBtn.style.display = "none";
        fighter = 0;
        opponent = 1;
        localStorage.buttonPresses = 0;
    }
}

//Code for starting the program
function startScript() {
    if (!localStorage.activeSesion) {
        //Save session and make it active (until user restarts)
        localStorage.activeSesion = true;

        //Save the input document into a temporary variable
        const reader = new FileReader();
        reader.readAsText(fileObject.files[0]);
        reader.onload = function () {
            //Convert the string into an object, then convert it into a useful array
            showArray = convert2Array(JSON.parse(reader.result));

            //Save this array to storage
            localStorage.showArray = JSON.stringify(showArray);

            loadingScreen(rankerProgram);
        };
        localStorage.typeTag = prompt("Enter the type of media");
        return;
    }

    loadingScreen(rankerProgram);
}


//Code that contains the algorithm that selects the show
function rankerProgram(option) {
    //Set display settings
    blankScreen();

    var temp3 = function () {
        displayOptions(BLOCK.start, DISPLAY.hide);
        displayOptions(BLOCK.option, DISPLAY.show);
        displayOptions(BLOCK.result, DISPLAY.hide);
        displayOptions(BLOCK.loading, DISPLAY.hide);
        choosingAlgorithm(OPTION.titleREQ);
        updateProgress();
    }
    setTimeout(temp3, 200);
}

//Algorithm for choosing the pair
function choosingAlgorithm(option) {

    if ((showArray == undefined) || (showArray.lenght < 1)) {
        alert("Algorithm failed: Input array is undefined or invalid");
        return;
    }

    var fighterWins;
    switch (option) {
        case OPTION.btn1:
            fighterWins = true;
            break;
        case OPTION.btn2:
            fighterWins = false;
            break;
        case OPTION.titleREQ:
            displayTitles(fighter, opponent);
            break;
        default:
            alert("Algorithm failed: no option selected");
    }


    //Only happens if one of the buttons is pressed
    if ((option == OPTION.btn1) || (option == OPTION.btn2)) {
        showArray[fighter].used = true;

        var winning;
        if (fighterWins) {
            //Claim opponent position
            var temp4 = showArray[opponent];
            showArray.splice(opponent, 1, showArray[fighter]);
            showArray[fighter] = temp4;

            fighter = opponent;
            winning = true;
        } else {
            //Select a new fighter
            var x
            for (x = 1; x < showArray.length; x++) {
                if (!showArray[x].used) {
                    fighter = x;
                    break;
                }
            }
            winning = false;
        }

        //Selecting new opponent
        if (fighter == 0) {
            var x
            for (x = 0; x < showArray.length; x++) {
                if (!showArray[x].used) {
                    fighter = x;
                    break;
                }
            }
        }
        opponent = fighter - 1;

        //Once the ranking is finished
        var finish;
        var x;
        for (x = 0; x < showArray.length; x++) {
            if (!showArray[x].used) {
                finish = true;
            } else {
                finish = false;
            }
        }
        if (finish || winning) {
            rankerProgram();
        } else {
            loadingScreen(listProgram);
        }


    }

    //Save to local storage
    localStorage.showArray = JSON.stringify(showArray);
    localStorage.fighter = fighter;
    localStorage.opponent = opponent;
}

//Code that creates the list of winners
function listProgram() {
    //Set display settings
    displayOptions(BLOCK.start, DISPLAY.hide);
    displayOptions(BLOCK.option, DISPLAY.hide);
    displayOptions(BLOCK.result, DISPLAY.show);
    displayOptions(BLOCK.loading, DISPLAY.hide);
    var x;
    for (x = 0; x < showArray.length; x++) {
        //Print out this item to the list
        var newListItem = document.createElement("li");
        newListItem.innerHTML = showArray[x].title;
        listItem.appendChild(newListItem);
    }
    var lengthA = showArray.length;

    var newItem = document.createElement("p");
    var itemString1 = "Finished with " + localStorage.buttonPresses + " questions. ";
    var itemString2 = "<br>Expected Minimum: " + lengthA;
    var itemString3 = ". Expected Maximum: " + ((lengthA * lengthA) + lengthA) / 2;

    newItem.innerHTML = itemString1 + itemString2 + itemString3;
    listItem.appendChild(newItem);

    localStorage.listCreated = true;
}

//Handdle the options for the button listeners
function buttonHanddler(option) {
    switch (option) {
        case BUTTON.start:
            //Check input file and previous session
            if (localStorage.activeSesion) {
                if (localStorage.listCreated) {
                    listProgram();
                } else {
                    startScript();
                }
            } else if (fileObject.files[0] == undefined) {
                alert("Remember to select a file.");
            } else if (!fileObject.files[0].name.toLowerCase().endsWith(".json")) {
                alert("Hint: it has to be a .json!");
            } else {
                startScript();
            }
            break;
        case BUTTON.one:
            choosingAlgorithm(OPTION.btn1);
            break;
        case BUTTON.two:
            choosingAlgorithm(OPTION.btn2);
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
    localStorage.buttonPresses++;
    buttonHanddler(BUTTON.one);
});
button2.addEventListener("click", function () {
    localStorage.buttonPresses++;
    buttonHanddler(BUTTON.two);
});
restartBtn.addEventListener("click", function () {
    buttonHanddler(BUTTON.restart);
});



/*

n= number of shows
q= number of question (time)

Best case scenario (list is ordered):
q = n;

Worst case scenrio (list is completly opposite):
q = (n^2 + n)/2

*/