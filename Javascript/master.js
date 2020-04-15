function Kid(hnd, cs, sib, sibCount, emp, vi, sp, im, district, age, priority) {
    this.values ={};
    if (hnd == true){
        this.values.handicaped = 1;
    }
    if (cs == true){
        this.values.childServices = 1;
    }
    if (emp == true){
        this.values.childOfEmployed = 1;
    }
    if (vi == true){
        this.values.childOfVisuallyImpared = 1;
    }
    if (sp == true){
        this.values.singleParent = 1;
    }
    if (im == true){
        this.values.childOfImmigrants = 1;
    }
    this.siblingsKG = sib;
    this.siblingsCount = sibCount;
    this.district = district;
    this.age = age;
    this.priority_text = priority;
    this.priority = undefined;
    this.getPriority = function () {getPriorityObjects(this, kindergartens)};
    this.calculateScore = function () {this.score = kidScore(this); return this.score};
    this.id = "kid_" + Math.random();
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
        report += "• Is a child of a immigrant.\n"
    }
    return report
}

function getPriorityObjects(x, kgList) {
    let priorityObjects = [];
    for (y in x.priority_text){
        for (z in kgList){
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
        let ageScore = x.age; //find a better way to give agePoints
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
    this.caluculatePriority = function () {};
    this.applicants = [];
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

function kidGenerator(limit) {
    let sample = [];
    let bool = [true, false];
    let districts = getUniquesFromList(kindergartens, "district");

    for (let i = 0; i < limit ; i++) {
        let priorities = getUniquesFromList(kindergartens, "name");
        let length = priorities.length
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
                randomInt(6),[]
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

let kindergartens = dummyKindergartens();
//let k1 = new Kid(true, true, ["a","b","c"], 3, false, false, false, false, "Fana", 4, ["a", "b", "d", "h"]);
//k1.getPriority();
//k1.calculateScore();

let kids = kidGenerator(250);
console.log(kids);

getApplicants(kindergartens, kids);
console.log(kindergartens);
calculatePriorityAllKindergartens(kindergartens);
//print(kindergartens[0]);
//console.log(kindergartens[0].applicants[0]);






