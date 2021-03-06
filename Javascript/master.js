//TODO: Improve algorithm efficiency.
//TODO: Look into splitting up the code into different files.
//TODO: Change priority functionality so the children only need to prioritize three kindergartens. (OPTIONAL)
/**
 * Represents a kid.
 * @param hnd {boolean} handicap - If the child has a disability.
 * @param cs {boolean} child services - If the child is involved with the child services.
 * @param sib {array}  kindergarten of siblings - An array containing the names of the kindergartens where this child has siblings.
 * @param sibCount {number} siblings - Numbers of siblings.
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
function Kid(hnd, cs, sib, sibCount, vi, sp, im, district, age, priority, kindergartenList, id_tall, childOfEmployedBool) {
    this.values ={};
    if (hnd === true){
        this.values.handicaped = 25;
    }
    if (cs === true){
        this.values.childServices = 25;
    }
    if (vi === true){
        this.values.childOfVisuallyImpared = 25;
    }
    if (sp === true){
        this.values.singleParent = 25;
    }
    if (im === true){
        this.values.childOfImmigrants = 25;
    }
    this.siblingsKG = sib;
    this.siblingsCount = sibCount;
    this.childOfEmployedKG = undefined;
    this.childOfEmployedBool = childOfEmployedBool;
    this.district = district;
    this.age = age;
    this.priority_text = priority;
    this.priority = undefined;
    this.fullPriorityList = [];
    this.spot = "";
    this.kindergarten = undefined;
    this.timesReassigned = 0;
    this.gottenPriority = undefined;
    this.id = "kid_" + id_tall;
    this.log = ["Log for " + this.id + ":"];
    this.getPriority = function () {getPriorityObjects(this, kindergartenList)};
    this.calculateScore = function () {this.score = kidScore(this); return this.score};
    this.report = function () {return report(this)}
}

/**
 * Represents a report for a child, summarizing all its key information.
 * @param x {Kid} kid object - Object representing a child.
 * @returns {Array} report - String representing a report for the child.
 */
function report(x) {
    let reportArray = [];
    if (x.values.handicaped){
        reportArray.push("Has a disability.")
    }
    if (x.values.childServices){
        reportArray.push("Involved with child services.");
    }
    if (x.values.childOfVisuallyImpared){
        reportArray.push("Child of visually impaired.");
    }
    if (x.values.singleParent){
        reportArray.push("Child of single parent.");
    }
    if (x.values.childOfImmigrants){
        reportArray.push("Child of immigrants.");
    }
    if (x.childOfEmployedKG){
        reportArray.push("Child of employed")
    }
    return reportArray
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
    x.priority = priorityObjects;
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
        let ageScore = x.age;
        let siblingScore = 0;
        let ofemployed = 0;
        for (let v in x.values){
            valueScore += x.values[v];
        }
        if (x.district === x.priority[u].district){
            districtScore += 6
        }

        if(x.childOfEmployedKG === x.priority[u].district){
            ofemployed += 12;
        }
        //for (let h in x.siblingsKG){
            if (x.siblingsKG === x.priority[u].name){
                siblingScore += 12
            }
        //}
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
    let a = new Kindergarten("Salhus barnehage", "0101", "Åsane", 18);
    let b = new Kindergarten("Bogane barnehage", "0102", "Arna", 50);
    let c = new Kindergarten("Marken barnehage", "0103", "Bergenhus", 30);
    let d = new Kindergarten("Sletten barnehage", "0104", "Årstad", 10);
    let e = new Kindergarten("Lyngfaret barnehage", "0105", "Laksevåg", 30);
    let f = new Kindergarten("Brinken barnehage", "0106", "Fyllingsdalen", 20);
    let g = new Kindergarten("Aurdalslia barnehage", "0107", "Ytrebygda", 20);
    let h = new Kindergarten("Apeltun barnehage", "0108", "Fana", 20);
    let i = new Kindergarten("Skjold barnehage", "0109", "Fana", 10);
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
    let bool = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    let districts = getUniquesFromList(kindergartenList, "district");

    for (let i = 0; i < limit ; i++) {
        let priorities = getUniquesFromList(kindergartenList, "name");
        let length = priorities.length;
        sample.push(
            new Kid(
                bool[randomInt(20)],
                bool[randomInt(20)],
                [],
                randomInt(3),
                bool[randomInt(20)],
                bool[randomInt(20)],
                bool[randomInt(20)],
                districts[randomInt(districts.length)],
                randomInt(6),
                [],
                kindergartenList,
                i,
                bool[randomInt(20)]
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

        if (sample[i].childOfEmployedBool === true){
            let random = randomInt(sample[i].priority_text.length);
            sample[i].childOfEmployedKG = sample[i].priority_text[random]
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
        kindergarten.priority.push(kindergarten.applicants[j]);
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
        kindergarten.spotCollection[kindergarten["id"] + "spot_" + i] = kindergarten.priority;
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
    let waiting = waitingList(calculateWaitingListSize(kindergartens, kids));
    waiting.applicants = kids;
    waiting.priority = kids;
    createSpots(waiting);
    return waiting
}

/**
 * Generates a prioritized list of all the spots for all of the kindergartens for a kid.
 * @param kid {Kid} Kid object - The Kid that has his/her priorities calculated from kindergarten to kindergarten spots.
 * @param waitingList {Object} waiting list Kindergarten.
 */
function createFullPriorityListKids(kid, waitingList) {
    let list = [];
    for (let i in kid.priority){
        list = list.concat(kid.priority[i].spotCollection_text)
    }
    list = list.concat(waitingList.spotCollection_text);
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
    createSpotsAll(kindergartens);
    let kids = kidGenerator(250, kindergartens);
    let waiting = prepWaitingList(kindergartens, kids);
    getApplicants(kindergartens, kids);
    calculatePriorityAllKindergartens(kindergartens);
    createFullPriorityListKidsALL(kids, waiting);
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
let matched = []; // List of all Kid objects after the program is finished.
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
    kindergartens.push(waiting);
    results = enrichResults(tentativeMatch);
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
        let exists = checkList(tentativeMatch, kid.fullPriorityList[p]);
        if (exists === false){
            let index = freeKids.indexOf(kid);
            let y = freeKids.splice(index,1);
            matched.push(y[0]);

            tentativeMatch.push([kid.id, kid.fullPriorityList[p]]);
            kid.log.push("Temporary spot: " + kid.fullPriorityList[p] + ".");
            break
        }
        if (exists){
            //console.log(kid.fullPriorityList[p] + " is taken.")
            let currentKid = findKindergarten(exists[0], kindergartenList);
            let thisKid = findKindergarten(kid.id, kindergartenList);

            if (currentKid > thisKid){
                let ix = freeKids.indexOf(kid);
                let z = freeKids.splice(ix,1);
                matched.push(z[0]);

                let qwe = tentativeMatch.indexOf(exists);
                tentativeMatch.splice(qwe, 1);

                tentativeMatch.push([kid.id, kid.fullPriorityList[p]]);
                kid.log.push("Temporary spot: " + kid.fullPriorityList[p] + ".");
                let addBack = findKidById(exists[0], matched);
                addBack.timesReassigned += 1;
                addBack.log.push("Spot lost." + " Priority by kindergarten: " + currentKid + "(this) vs. " + thisKid + "(other)")
                let inRemovedList = matched.indexOf(addBack);
                matched.splice(inRemovedList, 1);
                freeKids.push(addBack);
                break
            }
        }
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------HELP FUNCTIONS---------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

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
    let temp = [];
    for (let kid = 0; kid < resultList.length; kid++){

        let a = findKidById(resultList[kid][0], matched);
        let b = findKindergartenBySpot(resultList[kid][1], kindergartens);

        a.spot = resultList[kid][1];
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
        let name = document.createTextNode(kindergartenList[i].name + " ("+kindergartenList[i].district + ")");
        let ul = document.createElement("UL");

        for (let kid in kindergartenList[i].results){
            let personal = document.createElement("DIV");
                let age_li = document.createElement("li");
                let district_li = document.createElement("li");
                let siblings_li = document.createElement("li");
            let priority = document.createElement("DIV");
            let priority_head = document.createElement("li");
            let priorities = document.createTextNode("Priority (score): ");
            let specialInfo = document.createElement("DIV");
            let log = document.createElement("DIV")
                let log_details = document.createElement("DETAILS");
                let log_summary = document.createElement("SUMMARY");

            let x = kindergartenList[i].results[kid];

            let summary_text = document.createTextNode(x.spot + ": " + x.id);
            let age = document.createTextNode("Age: " + x.age);
            let district = document.createTextNode("District: " + x.district);
            let siblings = document.createTextNode("Siblings: " + x.siblingsCount);
            age_li.appendChild(age);
            district_li.appendChild(district);
            siblings_li.appendChild(siblings);
            personal.appendChild(age_li);
            personal.appendChild(district_li);
            personal.appendChild(siblings_li);

            let priorityList = document.createElement("OL");
            for (let priority in x.priority_text){
                let li = document.createElement("LI");
                let text_priority = document.createTextNode(x.priority_text[priority] + " (" + x.score[priority]+")");
                li.appendChild(text_priority);
                priorityList.appendChild(li);
            }
            priority_head.appendChild(priorities);
            priority.appendChild(priority_head);
            priority.appendChild(priorityList);

            let reportList = x.report();

            if (reportList.length > 0){
                for (let value in reportList){
                    let li = document.createElement("LI");
                    let text = document.createTextNode(reportList[value]);
                    li.appendChild(text);
                    specialInfo.appendChild(li);
                }
            }

            if (reportList.length === 0){
                let li = document.createElement("LI");
                let text = document.createTextNode("No special considerations.");
                li.appendChild(text);
                specialInfo.appendChild(li);
            }

            for (let i = 1; i < x.log.length; i++){
                let li = document.createElement("LI");
                let text = document.createTextNode(x.log[i]);
                li.appendChild(text);
                log_details.appendChild(li);
            }
            let log_summary_text = document.createTextNode(x.log[0]);
            log_summary.appendChild(log_summary_text);
            log_details.appendChild(log_summary);
            log.appendChild(log_details);


            let details = document.createElement("DETAILS");
            let summary = document.createElement("SUMMARY");

            personal.style.borderStyle = "solid";
            personal.style.padding = "5px";
            personal.style.margin = "5px";

            priority.style.borderStyle = "solid";
            priority.style.padding = "5px";
            //priority.style.borderColor = "crimson";
            priority.style.borderColor = "#fff600"
            priority.style.color = "#fff600";
            priority.style.margin = "5px";

            specialInfo.style.borderStyle = "solid";
            specialInfo.style.padding = "5px";
            specialInfo.style.margin = "5px";

            log.style.borderStyle = "solid";
            log.style.padding = "5px";
            log.style.margin = "5px";
            log.style.borderColor = "#04ff00"
            log.style.color = "#04ff00"

            details.appendChild(personal);
            details.appendChild(priority);
            details.appendChild(specialInfo);
            details.appendChild(log);

            summary.appendChild(summary_text);
            details.appendChild(summary);
            ul.appendChild(details)
        }
        h2.appendChild(name);
        div.appendChild(h2);
        div.appendChild(ul);
        placement.appendChild(div)
    }
}

/**
 * Hides a element from the HTML page based on an id of a HTML-element.
 * @param id {string} id of a HTML-element.
 * @param what {string} what you want to change the display to
 */
function changeDisplay(id, what) {
    let element = document.getElementById(id);
    element.style.display = what;
}

function checkPriority(kidList) {
    for (let kid in kidList) {
        for (let i = 0; i < kidList[kid].priority_text.length; i++){
            if (kidList[kid].priority_text[i] === kidList[kid].kindergarten.name){
                kidList[kid].gottenPriority = i
            }
        }
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------PROGRAM START----------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Starts the program.
 */
function start() {
    changeDisplay("onlyButton", "none");
    changeDisplay("image", "block");
    stableMatching(freeKids,kindergartens)
    metrics()
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------END---------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

//This section will be concerned with creating lists of the kids based on different factors.

/**
 * Heap function to call all functions related to calculation of metrics.
 */
function metrics() {
    checkPriority(matched)
    calculatePriorityMetric(matched)
}

/**
 * Function used to calculate how many children og their 1., 2., 3. and > 3. priority of kindergarten. Also how many got waiting list (so none of their priority).
 * @param kidList {Array} list of all kids after the matching is done (in the matched global variable)
 * @returns {number[]} returns a list the number of kids that got their 1st, 2nd, 3rd, >3rd (priority) and waiting list.
 */
function calculatePriorityMetric(kidList) {
    let first = 0;
    let second = 0;
    let third = 0;
    let rest = 0;
    let wait = 0
    for (let kid in kidList) {
        if (kidList[kid].gottenPriority === 0){
            first += 1
        }
        if (kidList[kid].gottenPriority === 1){
            second += 1
        }
        if (kidList[kid].gottenPriority === 2){
            third += 1
        }
        if (kidList[kid].gottenPriority > 2){
            rest += 1
        }
        if (kidList[kid].gottenPriority === undefined){
            wait += 1
        }
    }

    let reportNumbers = first + " got 1st priority.\n"
        + second + " got 2nd priority.\n"
        + third + " got 3rd priority.\n"
        + rest + " got > 3rd priority. \n"
        + wait + " got waiting list.";

    let reportPercentage = putInSpan(toPercentage(first, matched.length))+ " 1st priority.\n"
        + putInSpan(toPercentage(second,matched.length)) + " 2nd priority. "
        + putInSpan(toPercentage(third,matched.length)) + " 3rd priority. "
        + putInSpan(toPercentage(rest,matched.length)) + " >3rd priority. "
        + putInSpan(toPercentage(wait,matched.length)) + " waiting list. ";

    //console.log(reportNumbers); //logs a report in the console with the numbers.
    //console.log(reportPercentage) //logs a report in the console with the percentage.

    metricsToHTML("Results: " + reportPercentage); //prints results on the HTML-page.
    return [first,second,third,rest,wait]
}

function toPercentage(n,total) {
    return ((100/total) * n).toFixed(1)
}

function metricsToHTML(toPrint) {
    let placement = document.getElementById("results")
    placement.innerHTML = toPrint;
}

function putInSpan(text) {
    return "<span>" + text + "%" + "</span>"
}

function temp(){
    for(let x in matched){
        console.log(matched[x].childOfEmployedKG)
    }
}