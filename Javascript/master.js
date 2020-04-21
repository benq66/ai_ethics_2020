/**
 * Represents a kid.
 * @param hnd {boolean} handicap - If the child has a disability.
 * @param cs {boolean} child services - If the child is involved with the child services.
 * @param sib {array}  kindergarten of siblings - An array containing the names of the kindergartens where this child has siblings.
 * @param sibCount {number} siblings - Numbers of siblings.
 * @param emp {boolean} child of employed - If the child is the child of an employed in the kindergarten.
 * @param vi {boolean} visually impaired - If the child is the child of a visually impaired parent.
 * @param sp {boolean} single parent - If the child is the child of a single parent.
 * @param im {boolean} immigrant parents - If the child is the child of immigrants (both parents, non english speaking countries).
 * @param district {string} district - The district where the child lives.
 * @param age {number} age - The age of the child.
 * @param priority {array} prioritized list - A list of the kindergartens the child applies to, ordered by priority.
 * @param kindergartenList {array} list of kindergartens - The list of all kindergartens.
 * @param id_tall {number} id - A number which becomes the unique id of the child in this system.
 * @constructor
 */
function Kid(hnd, cs, sib, sibCount, emp, vi, sp, im, district, age, priority, kindergartenList, id_tall) {
    this.values ={};
    if (hnd === true){
        this.values.handicaped = 1;
    }
    if (cs === true){
        this.values.childServices = 1;
    }
    if (emp === true){
        this.values.childOfEmployed = 1;
    }
    if (vi === true){
        this.values.childOfVisuallyImpared = 1;
    }
    if (sp === true){
        this.values.singleParent = 1;
    }
    if (im === true){
        this.values.childOfImmigrants = 1;
    }
    this.siblingsKG = sib;
    this.siblingsCount = sibCount;
    this.district = district;
    this.age = age;
    this.priority_text = priority;
    this.priority = undefined;
    this.fullPriorityList = [];
    this.getPriority = function () {getPriorityObjects(this, kindergartenList)};
    this.calculateScore = function () {this.score = kidScore(this); return this.score};
    this.id = "kid_" + id_tall;
    this.report = function () {return report(this)}
    this.spot = "";
    this.kindergarten = undefined;
}

/**
 * Represents a report for a child, summarizing all its key information.
 * @param x {Kid} kid object - Object representing a child.
 * @returns {string} report - String representing a report for the child.
 */
function report(x) {
    let report = "Report (" + x.id + "):\n";
    if (x.values.handicaped){
        report += "• Has a disability.\n"
    }
    if (x.values.childServices){
        report += "• Is involved with child services.\n"
    }
    if (x.siblingsCount){
        report += "• Has " + x.siblingsCount + " siblings.\n"
    }
    if (x.values.childOfEmployed){
        report += "• Is a child of an employee.\n"
    }
    if (x.values.childOfVisuallyImpared){
        report += "• Is a child of a visually impaired parent.\n"
    }
    if (x.values.singleParent){
        report += "• Is a child of a single parent.\n"
    }
    if (x.values.childOfImmigrants){
        report += "• Is a child of immigrants.\n"
    }
    return report
}

/**
 * Finds kindergarten objects by their name, adds these to the priority property of the kid object.
 * @param x {Kid} kid object - Object representing a child.
 * @param kgList {Array} kindergarten list - A list of all the kindergartens.
 */
function getPriorityObjects(x, kgList) {
    let priorityObjects = [];
    for (let y in x.priority_text){
        for (let z in kgList){
            if (x.priority_text[y] === kgList[z].name){
                priorityObjects.push(kgList[z])
            }
        }
    }
    x.priority = priorityObjects
}

/**
 * Calculates the score for each kid, that is used by the kindergartens to prioritize which children they want.
 * @param x {Kid} kid object - Object representing a child.
 * @returns {[]} score list - Returns a list of all the scores.
 */
function kidScore(x) {
    let scoreList = [];
    for (let u in x.priority){
        let valueScore = 0;
        let districtScore = 0;
        let ageScore = x.age; //TODO: Find a way to calculate age points based on birth date.
        let siblingScore = 0;
        //TODO: remove "child of employed" from valueScore and calculate this for each kindergarten like the siblingsScore.
        for (let v in x.values){
            valueScore += x.values[v];
        }
        if (x.district === x.priority[u].district){
            districtScore += 1
        }
        for (let h in x.siblingsKG){
            if (x.siblingsKG[h] === x.priority[u].name){
                siblingScore += 1
            }
        }
        scoreList.push(valueScore + districtScore + ageScore + siblingScore)
    }
    return scoreList
}

/**
 * Represents a kindergarten.
 * @param name {string} name - Name of the kindergarten.
 * @param id {string} id - Id of the kindergarten, needs to be unique.
 * @param district {string} district - The district where the kindergarten is.
 * @param spots {number} kindergarten spots - The number of open spots in the kindergarten.
 * @constructor
 */
function Kindergarten(name, id, district, spots) {
    this.name = name;
    this.id = id;
    this.district = district;
    this.spots = spots;
    this.priority = [];
    this.priority_text = [];
    this.applicants = [];
    this.spotCollection = {};
    this.spotCollection_text = [];
    this.results = {};
}

/**
 * Generates a number of kindergartens and puts them in a list (array).
 * @returns {Kindergarten[]} list of kindergarten - Returns a list of the created kindergartens.
 */
function dummyKindergartens() {
    let a = new Kindergarten("a", "0101", "Åsane", 20);
    let b = new Kindergarten("b", "0102", "Arna", 40);
    let c = new Kindergarten("c", "0103", "Bergenhus", 30);
    let d = new Kindergarten("d", "0104", "Årstad", 10);
    let e = new Kindergarten("e", "0105", "Laksevåg", 30);
    let f = new Kindergarten("f", "0106", "Fyllingsdalen", 20);
    let g = new Kindergarten("g", "0107", "Ytrebygda", 20);
    let h = new Kindergarten("h", "0108", "Fana", 20);
    let i = new Kindergarten("i", "0109", "Fana", 10);
    return [a,b,c,d,e,f,g,h,i]
}

/**
 * Generates a waiting list, where excess children are put.
 * @param rest {number} remaining children - The number of excess children
 * @returns {Kindergarten} kindergarten - Returns a Kindergarten object that is the waiting list.
 */
function waitingList(rest) {
    return new Kindergarten("waiting_list", "0000", "", rest)
}

/**
 * Generates a number of Kid object with random values.
 * @param limit {number} number of kids - The number of kids that should be generated.
 * @param kindergartenList {Array} the list of kindergartens.
 * @returns {[]} list of all kids - Returns a list of all the kids that is generated.
 */
function kidGenerator(limit, kindergartenList) {
    let sample = [];
    let bool = [true, false];
    let districts = getUniquesFromList(kindergartenList, "district");

    for (let i = 0; i < limit ; i++) {
        let priorities = getUniquesFromList(kindergartenList, "name");
        let length = priorities.length;
        sample.push(
            new Kid(
                bool[randomInt(2)],
                bool[randomInt(2)],
                [],
                randomInt(3),
                bool[randomInt(2)],
                bool[randomInt(2)],
                bool[randomInt(2)],
                bool[randomInt(2)],
                districts[randomInt(districts.length)],
                randomInt(6),[], kindergartenList, i
            ));
        for (let j = 0; j < length; j++) {
            let random = randomInt(priorities.length);
            sample[i].priority_text.push(priorities[random]);
            priorities.splice(random,1)
        }

        for (let k = 0; k < sample[i].siblingsCount; k++) {
            let random = randomInt(sample[i].priority_text.length);
            sample[i].siblingsKG.push(sample[i].priority_text[random]);
        }
        sample[i].getPriority();
        sample[i].calculateScore();
    }
    return sample
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------HELP FUNCTIONS---------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Generates a random number, from 0 - max.
 * @param max {number} highest number - The highest to be generated.
 * @returns {number} random number - Returns a random number.
 */
function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Function that returns unique values from a list. Used in the generation of dummy kids.
 * @param list {Array} list - The list where the unique values are gathered form.
 * @param arg {string} property - The property name from the kid object, that the unique values will be gathered from.
 * @returns {*[]} Array - Returns a list of unique values.
 */
function getUniquesFromList(list, arg) {
    let di = [];
    for (let y in list){
        di.push(list[y][arg])
    }
    return Array.from(new Set(di))
}

/**
 * Simulating the application to a kindergarten.
 * @param kindergarten {Kindergarten} Kindergarten object.
 * @param kids {Array} Kid object - The kid that applies to kindergartens.
 */
function calculateApplicantsKindergarten(kindergarten, kids){
    for (let kid in kids){
        for (let p in kids[kid].priority){
            if (kindergarten === kids[kid].priority[p]){
                kindergarten.applicants.push(kids[kid])
            }
        }
    }
}

/**
 * Simulating the application to ALL kindergartens.
 * @param kindergartenList {Array} list of kindergartens.
 * @param kidList {Array} list of all kids.
 */
function getApplicants(kindergartenList, kidList){
    for (let garden in kindergartenList){
        calculateApplicantsKindergarten(kindergartenList[garden], kidList)
    }
}

/**
 * Calculates the prioritized list of children for a kindergarten.
 * @param kindergarten {Kindergarten} Kindergarten object - The kindergarten whose priorities are calculated.
 */
function calculatePriority(kindergarten){
    for (let kids in kindergarten.applicants){
        for (let i = 0; i < kindergarten.applicants[kids].priority_text.length ; i++) {
                if (kindergarten.applicants[kids].priority_text[i] === kindergarten.name){
                    kindergarten.applicants[kids].tempScore = kindergarten.applicants[kids].score[i]
                }
            }
        }
    kindergarten.applicants.sort(function (a,b) {return a.tempScore - b.tempScore});

    for (let j = kindergarten.applicants.length - 1; j >= 0 ; j--) {
        kindergarten.priority.push(kindergarten.applicants[j])
        kindergarten.priority_text.push(kindergarten.applicants[j].id)
    }
}

/**
 * Calculates the prioritized lists of children for ALL kindergartens.
 * @param listOfKindergartens
 */
function calculatePriorityAllKindergartens(listOfKindergartens){
    for (let kindergarten in listOfKindergartens){
        calculatePriority(listOfKindergartens[kindergarten])
    }
}

/**
 * Calculates the size of the waiting list Kindergarten.
 * @param kindergartenList {Array} list of Kindergarten objects.
 * @param kidList {Array} list of Kid objects.
 * @returns {number} waiting list size - Returns the number of kids the waiting list Kindergarten needs to contain.
 */
function calculateWaitingListSize(kindergartenList, kidList) {
    let sum = 0
    for (let garden in kindergartenList){
        sum += kindergartenList[garden].spots
    }
    return kidList.length - sum
}

/**
 * Generates kindergarten spots for a kindergarten. In two forms. One as a dictionary with properties as spots and one
 * as a list (array) of all the spots (this is to keep the order).
 * @param kindergarten {Kindergarten} Kindergarten object. The kindergarten where the spots are created.
 */
function createSpots(kindergarten) {
    for (let i = 0; i < kindergarten.spots ; i++) {
        kindergarten.spotCollection[kindergarten["id"] + "spot_" + i] = kindergarten.priority
        kindergarten.spotCollection_text.push(kindergarten["id"] + "spot_" + i)
    }
}

/**
 * Generates kindergarten spots for ALL kindergartens.
 * @param kindergartenList {Array} List of all kindergartens.
 */
function createSpotsAll(kindergartenList) {
    for (let k in kindergartenList){
        createSpots(kindergartenList[k])
    }
}

/**
 * Function for preparing the waiting list Kindergarten object.
 * @param kindergartens {Array} list of all kindergartens.
 * @param kids {Array} list of Kid objects.
 * @returns {Kindergarten} waiting list Kindergarten.
 */
function prepWaitingList(kindergartens, kids) {
    let waiting = waitingList(calculateWaitingListSize(kindergartens, kids))
    waiting.applicants = kids;
    waiting.priority = kids;
    createSpots(waiting)
    return waiting
}

/**
 * Generates a prioritized list of all the spots for all of the kindergartens for a kid.
 * @param kid {Kid} Kid object - The Kid that has his/her priorities calculated from kindergarten to kindergarten spots.
 * @param waitingList {Object} waiting list Kindergarten.
 */
function createFullPriorityListKids(kid, waitingList) {
    let list = []
    for (let i in kid.priority){
        list = list.concat(kid.priority[i].spotCollection_text)
    }
    list = list.concat(waitingList.spotCollection_text)
    kid.fullPriorityList = list;
}

/**
 * Generates a prioritized list of all the spots for all of the kindergartens for ALL kids.
 * @param kidList {Array} list of all Kid objects.
 * @param waitingList {Object} waiting list Kindergarten.
 */
function createFullPriorityListKidsALL(kidList, waitingList) {
    for (let kids in kidList) {
        createFullPriorityListKids(kidList[kids], waitingList)
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------PROGRAM PREPARATION-------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/
/**
 * Preparing all that is needed for the matching algorithm. Creating kindergartens, creating kids, creating the waiting list.
 * @returns {(*[]|Kindergarten[]|Kindergarten)[]} list - Returns a list containing a list of all kids, a list of all
 * kindergartens and the waiting list Kindergarten object.
 */
function program(){
    let kindergartens = dummyKindergartens();
    createSpotsAll(kindergartens)
    let kids = kidGenerator(250, kindergartens);
    let waiting = prepWaitingList(kindergartens, kids)
    getApplicants(kindergartens, kids);
    calculatePriorityAllKindergartens(kindergartens);
    createFullPriorityListKidsALL(kids, waiting)
    return [kids, kindergartens, waiting]
}

let collection = program();
const kids = collection[0]; // List containing all Kid objects.
let kindergartens = collection[1]; // List containing all Kindergarten objects.
let waiting = collection[2]; // The waiting list Kindergarten object.

/*--------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------MATCHING ALGORITHM-------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

let freeKids = kids; // Duplicate of list containing all Kid objects.
let tentativeMatch = []; // List of all the matches text (when program is finished).
let removed = []; // List of all Kid objects after the program is finished.
let results; // List of all the matches as objects.

/**
 * Matches ALL Kids with Kindergarten spots.
 * @param freeKidsList {Array} list of all Kid objects.
 * @param kindergartenList {Array} list of all Kindergarten objects.
 */
function stableMatching(freeKidsList, kindergartenList) {
    while (freeKidsList.length > 0) {
        for (let k in freeKidsList) {
            beginMatch(freeKidsList[k], kindergartenList)
        }
    }
    kindergartens.push(waiting)
    results = enrichResults(tentativeMatch)
    resultsToHTML(kindergartens)
}

/**
 * The stable match algorithm function. Matches a kid with a kindergarten spot.
 * @param kid {Kid} Kid object.
 * @param kindergartenList {Array} list of all kindergartens.
 */
function beginMatch(kid, kindergartenList) {
    //console.log("dealing with " + kid.id)
    for (let p = 0; p < kid.fullPriorityList.length; p++) {
        let exists = checkList(tentativeMatch, kid.fullPriorityList[p])
        if (exists === false){
            let index = freeKids.indexOf(kid)
            let y = freeKids.splice(index,1);
            removed.push(y[0])

            tentativeMatch.push([kid.id, kid.fullPriorityList[p]])
            console.log(kid.id + " now has a temporary kindergarten spot: " + kid.fullPriorityList[p] + ".")
            break
        }
        if (exists){
            //console.log(kid.fullPriorityList[p] + " is taken.")
            let currentKid = findKindergarten(exists[0], kindergartenList)
            let thisKid = findKindergarten(kid.id, kindergartenList)

            if (currentKid > thisKid){
                let ix = freeKids.indexOf(kid)
                let z = freeKids.splice(ix,1);
                removed.push(z[0])

                let qwe = tentativeMatch.indexOf(exists)
                tentativeMatch.splice(qwe, 1)

                tentativeMatch.push([kid.id, kid.fullPriorityList[p]])

                let addBack = findKidById(exists[0], removed)
                let inRemovedList = removed.indexOf(addBack)
                removed.splice(inRemovedList, 1)
                freeKids.push(addBack)
                break
            }
        }
    }
}

/**
 * Finds the index of i Kid from a Kindergartens prioritized list based on a Kid's id property.
 * @param id {string} id of a Kid object.
 * @param kindergartenList {Array} list of all kindergartens.
 * @returns {number}
 */
function findKindergarten(id, kindergartenList) {
    for (let garden in kindergartenList) {
        for (let kid in kindergartenList[garden].priority_text){
            if (id === kindergartenList[garden].priority_text[kid]){
                return kindergartenList[garden].priority_text.indexOf(kindergartenList[garden].priority_text[kid])
            }
        }
    }
}

/**
 * Finds a Kindergarten object based on a name of a kindergarten spot. (this name consists of a kindergartens id + "spot" + number)
 * @param spot {string} name of kindergarten spot.
 * @param kindergartenList {Array} list of all kindergartens.
 * @returns {Kindergarten} kindergarten object that has the kindergarten spot.
 */
function findKindergartenBySpot(spot, kindergartenList) {
    for (let name in kindergartenList) {
        for (let kid in kindergartenList[name].spotCollection_text){
            if (spot === kindergartenList[name].spotCollection_text[kid]){
                return kindergartenList[name]
            }
        }
    }
}

/**
 * Finds a Kid object based on the id property of the kid.
 * @param id {string} id of the Kid object.
 * @param kidList {Array} list of all Kid objects.
 * @returns {Kid} Kid object that matches the id.
 */
function findKidById(id,kidList) {
    for (let kid in kidList){
        if (id === kidList[kid].id){
            return kidList[kid]
        }
    }
}

/**
 * Checks if a match exits between a Kid object and a kindergarten spot.
 * @param list {Array} list of all the tentative matches.
 * @param priority {string} kindergarten priority for a kid
 * @returns {boolean|*} - Returns the match if it exists, if the match does not exist it returns false.
 */
function checkList(list, priority) {
    for (let i in list){
        if (list[i][1] === priority){
            return list[i]
        }
    }
    return false
}

/**
 * Enriches the results by converting the text matches and replacing it with the objects that they represent.
 * @param resultList {Array} list of all the results (matching) in text format.
 * @returns {[]} list of enriched results.
 */
function enrichResults(resultList) {
    let temp = []
    for (let kid = 0; kid < resultList.length; kid++){

        let a = findKidById(resultList[kid][0],removed);
        let b = findKindergartenBySpot(resultList[kid][1], kindergartens)

        a.spot = resultList[kid][1]
        a.kindergarten = b;
        b.results[resultList[kid][1]] = a;

        temp.push([a,b])
    }
    return temp
}

/**
 * Displays the results on the HTML page.
 * @param kindergartenList {Array} List of all Kindergarten objects.
 */
function resultsToHTML(kindergartenList) {
    let placement = document.getElementById("main");

    for (let i = 0; i < kindergartenList.length ; i++) {
        let div = document.createElement("DIV");
        let h2 = document.createElement("h2");
        let name = document.createTextNode(kindergartenList[i].name)
        let ul = document.createElement("UL");

        for (let kid in kindergartenList[i].results){
            let x = kindergartenList[i].results[kid]
            let span = document.createElement("SPAN")
            let li = document.createElement("LI");
            let text = document.createTextNode(
                ". Top 3 priority: "
                + x.priority_text[0] + ", "
                + x.priority_text[1] + ", "
                + x.priority_text[2]);
            let text2 = document.createTextNode("Id: ")
            let text3 = document.createTextNode(x.id)
            li.appendChild(text2)
            span.appendChild(text3)
            li.appendChild(span)
            li.appendChild(text)
            ul.appendChild(li)
        }
        h2.appendChild(name);
        div.appendChild(h2)
        div.appendChild(ul)
        placement.appendChild(div)
    }
}

/**
 * Hides a element from the HTML page based on an id of a HTML-element.
 * @param id {string} id of a HTML-element.
 */
function findAndHide(id) {
    let element = document.getElementById(id)
    console.log(element)
    element.style.display = "none";
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------PROGRAM START----------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Starts the program.
 */
function start() {
    findAndHide("onlyButton");
    stableMatching(freeKids,kindergartens)
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------END---------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/