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
}

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

function kidScore(x) {
    let scoreList = [];
    for (let u in x.priority){
        let valueScore = 0;
        let districtScore = 0;
        let ageScore = x.age; //TODO: Find a way to calculate age points based on birth date.
        let siblingScore = 0;
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

function Kindergarten(name, id, district, spots) {
    this.name = name;
    this.id = id;
    this.district = district;
    this.spots = spots;
    this.priority = [];
    this.priority_text = [];
    this.applicants = [];
    this.spotCollection = {};
    this.spotCollection_text = []
}

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

function waitingList(rest) {
return new Kindergarten("waiting_list", "0000", "", rest)
}

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getUniquesFromList(list, arg) {
    let di = [];
    for (let y in list){
        di.push(list[y][arg])
    }
    return Array.from(new Set(di))
}

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

function calculateApplicantsKindergarten(kindergarten, kids){
    for (let kid in kids){
        for (let p in kids[kid].priority){
            if (kindergarten === kids[kid].priority[p]){
                kindergarten.applicants.push(kids[kid])
            }
        }
    }
}

function getApplicants(kindergartenList, kidList){
    for (let garden in kindergartenList){
        calculateApplicantsKindergarten(kindergartenList[garden], kidList)
    }
}

function calculatePriority(kindergarten){

    for (let kids in kindergarten.applicants){
        for (let i = 0; i < kindergarten.applicants[kids].priority_text.length ; i++) {
                if (kindergarten.applicants[kids].priority_text[i] === kindergarten.name){
                    kindergarten.applicants[kids].tempScore = kindergarten.applicants[kids].score[i]
                }
            }
        }
    kindergarten.applicants.sort(function (a,b) {return a.tempScore - b.tempScore});

    /*
    for (let j = kindergarten.applicants.length - 1; j >= kindergarten.applicants.length - kindergarten.spots ; j--) {
        kindergarten.priority.push(kindergarten.applicants[j])
    }*/

    for (let j = kindergarten.applicants.length - 1; j >= 0 ; j--) {
        kindergarten.priority.push(kindergarten.applicants[j])
        kindergarten.priority_text.push(kindergarten.applicants[j].id)
    }
}

function print(arg) {
    for (let tall in arg.applicants){
        console.log(arg.applicants[tall].tempScore)
    }
}

function calculatePriorityAllKindergartens(listOfKindergartens){
    for (let kindergarten in listOfKindergartens){
        calculatePriority(listOfKindergartens[kindergarten])
    }
}
function calculateWaitingListSize(kindergartenList, kidList) {
    let sum = 0
    for (let garden in kindergartenList){
        sum += kindergartenList[garden].spots
    }
    return kidList.length - sum
}

function createSpots(kindergarten) {
    for (let i = 0; i < kindergarten.spots ; i++) {
        kindergarten.spotCollection[kindergarten["id"] + "spot_" + i] = kindergarten.priority
        kindergarten.spotCollection_text.push(kindergarten["id"] + "spot_" + i)
    }
}

function createSpotsAll(kindergartenList) {
    for (let k in kindergartenList){
        createSpots(kindergartenList[k])
    }
}

function prepWaitingList(kindergartens, kids) {
    let waiting = waitingList(calculateWaitingListSize(kindergartens, kids))
    waiting.applicants = kids;
    waiting.priority = kids;
    createSpots(waiting)
    return waiting
}

function createFullPriorityListKids(kid, waitingList) {
    let list = []
    for (let i in kid.priority){
        list = list.concat(kid.priority[i].spotCollection_text)
    }
    list = list.concat(waitingList.spotCollection_text)
    kid.fullPriorityList = list;
}

function createFullPriorityListKidsALL(kidList, waitingList) {
    for (let kids in kidList) {
        createFullPriorityListKids(kidList[kids], waitingList)
    }
}

function program(){
    let kindergartens = dummyKindergartens();
    createSpotsAll(kindergartens)
    let kids = kidGenerator(250, kindergartens);
    let waiting = prepWaitingList(kindergartens, kids)
    getApplicants(kindergartens, kids);
    calculatePriorityAllKindergartens(kindergartens);
    createFullPriorityListKidsALL(kids, waiting)
    return [kids, kindergartens]
}
let collection = program();
const kids = collection[0];
let kindergartens = collection[1];

/*-------------------------------------------------MATCHING ALGORITHM-------------------------------------------------*/

let freeKids = kids;
let tentativeMatch = [];
let removed = [];

function stableMatching(freeKidsList, kindergartenList) {
    while (freeKidsList.length > 0) {
        for (let k in freeKidsList) {
            beginMatch(freeKidsList[k], kindergartenList)
        }
        print(tentativeMatch)
    }
}

function beginMatch(kid, kindergartenList) {
    let tempRemoved = []
    console.log("dealing with " + kid.id)
    for (let p = 0; p < kid.fullPriorityList.length; p++) {
        let exists = checkList(tentativeMatch, kid.fullPriorityList[p])
        if (exists === false){
            //removed.push(freeKids.splice(freeKids.indexOf(kid),1)[0])

            let index = freeKids.indexOf(kid)
            let y = freeKids.splice(index,1);
            removed.push(y[0])

            tentativeMatch.push([kid.id, kid.fullPriorityList[p]])
            console.log(kid.id + " now has a temporary kindergarten spot: " + kid.fullPriorityList[p] + ".")
            break
        }
        if (exists){
            console.log(kid.fullPriorityList[p] + " is taken.")
            let currentKid = findKindergarten(exists[0], kindergartenList)
            let thisKid = findKindergarten(kid.id, kindergartenList)

            if (currentKid > thisKid){
                let ix = freeKids.indexOf(kid)
                let z = freeKids.splice(ix,1);
                removed.push(z[0])

                //let remove_id = getIdOFKidTakingSpot(kid.fullPriorityList[p], tentativeMatch)
                //let abc = getIndexOfKidTakingSpot(remove_id, tentativeMatch)
                //let iii = tentativeMatch.indexOf(abc)
                //tentativeMatch.splice(iii,1);

                let qwe = tentativeMatch.indexOf(exists)
                tentativeMatch.splice(qwe, 1)

                tentativeMatch.push([kid.id, kid.fullPriorityList[p]])



                //let addBack = checkBothLists(remove_id, freeKids, removed)
                //replaceKidTakingSpot(kid.fullPriorityList[p],tentativeMatch,kid.id)
                let addBack = findKidById(exists[0], removed)
                let inRemovedList = removed.indexOf(addBack)
                removed.splice(inRemovedList, 1)
                freeKids.push(addBack)
                break
            }
        }
    }

}

function findKindergarten(id, kindergartenList) {
    for (let garden in kindergartenList) {
        for (let kid in kindergartenList[garden].priority_text){
            if (id === kindergartenList[garden].priority_text[kid]){
                return kindergartenList[garden].priority_text.indexOf(kindergartenList[garden].priority_text[kid])
            }
        }
    }
}

function getIdOFKidTakingSpot(spot, list) {
    for (let y in list){
        if (spot == list[y][1]){
            return list[y][0]
        }
    }
}

function getIndexOfKidTakingSpot(id, list) {
    for (let y in list){
        if (id == list[y][0]){
            return list[y]
        }
    }
}

function replaceKidTakingSpot(spot, list, newId) {
    for (let y in list){
        if (spot == list[y][1]){
            list[y][0] = newId
        }
    }
}

function findKidById(id,kidList) {
    for (let kid in kidList){
        if (id === kidList[kid].id){
            return kidList[kid]
        }
    }
}

function checkList(list, priority) {
    for (let i in list){
        if (list[i][1] == priority){
            return list[i]
        }
    }
    return false
}

//stableMatching(freeKids, kindergartens)

function logAllIds(list) {
    for (let u in list) {
        console.log(list[u].id)
    }
}

function checkBothLists(id, list1, list2) {
    let a = findKidById(id, list1)
    let b = findKidById(id, list2)
    console.log(a,b)
    return a || b
}