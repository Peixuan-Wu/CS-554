//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
async function checkIsProperString(str,strName){
    if(typeof str !== 'string' || str === null || str=== undefined){
        throw `${strName || 'provided variable'} should be string`;
    }
    if(str.trim().length == 0|| str.length == 0){
        throw `${strName || 'provided string'} cannot be empty or all spaces`
    }
}

async function checkIsLetterOrNum(str,strName){
    for (var i=0;i<str.length;i++) {
        var asc = str.charCodeAt(i);
        if (!(asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122 || asc>=48 && asc<=57)) {
            throw `${strName || 'provided variable'} contains characters are not letters or number `;
        }
    }

}

async function checkIsOnlyLetter(str,strName){
    for (var i=0;i<str.length;i++) {
        var asc = str.charCodeAt(i);
        if (!(asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
            throw `${strName || 'provided String'} should only contain letters `;
        }
    }

}

async function checkIsProperName(str,strName){
    await checkIsProperString(str,strName);
    await checkIsOnlyLetter(str.replace(/ /g, ""),strName);
    //check is only one space
    let trimString = str.replace(/ /g, "");
    if(str.length-trimString.length!==1){
        throw `${strName || 'provided Name'} should only contain one space `;
    }
    let nameArr = [];
    nameArr= str.split(" ");
    if(nameArr.length!=2){
        throw `${strName || 'provided Name'} must be FirstName space LastName`;
    }
    for(var i = 0; i<nameArr.length;i++){
        var nameStr = nameArr[i];
        await checkIsProperString(nameStr,"first or last name");
        await checkIsOnlyLetter(nameStr,"first or last name");
        if(nameStr.length<3){
            throw `first or last name must at least be 3 characters long`;
        }
        if(!(nameStr.charCodeAt(0)>= 65 && nameStr.charCodeAt(0) <= 90)){
            throw `The initial letter of name should be uppercase`;
        }
    }

}

async function checkIsOnlyNum(numStr,name){
    for (var i=0;i<numStr.length;i++) {
        var asc = numStr.charCodeAt(i);
        if (!(asc>=48 && asc<=57)) {
            throw `${name || 'provided String'} is not only numbers`;
        }
    }
}

async function checkIsProperDate(date){
    await checkIsProperString(date,"date");
    dateArr = date.split("/");
    if(dateArr.length !== 3||dateArr[0].length!=2||dateArr[1].length!=2||dateArr[2].length!=4){
        throw `provided date format is not valid`;
    }
    let month = dateArr[0];
    let day = dateArr[1];
    let year = dateArr[2];
    await checkIsProperString(month,"month");
    await checkIsOnlyNum(month,"month");
    let intMonth = parseInt(month);
    if(intMonth<0 || intMonth>12){
        throw `provided month is not valid`;
    }
    
    await checkIsProperString(day,"day");
    await checkIsOnlyNum(day,"day");
    let intDay = parseInt(day);
    if(intMonth==2){
        if(intDay<1 || intDay>28){
            throw `provided day is not valid`;
        }
    }
    if(intMonth== 1|| intMonth == 3 || intMonth == 5 || intMonth == 7 || intMonth == 8 || intMonth == 10 || intMonth == 12){
        if(intDay<1 || intDay>31){
            throw `provided day is not valid`;
        }
    }
    if(intMonth == 4||intMonth == 6|| intMonth == 9 ||intMonth == 11){
        if(intDay<1||intDay>30){
            throw `provided day is not valid`;
        }
    }
    
    await checkIsProperString(year,"year");
    await checkIsOnlyNum(year,"year");
    let intYear = parseInt(year);
    var nowDate = new Date();
    if(intYear<1900||intYear>nowDate.getFullYear()+2){
        throw `provided year is not valid`;
    }
    
}

async function checkIsProperRuntime(runtime){
    await checkIsProperString(runtime,"runtime");
    runArr = runtime.split(" ");
    if(runArr.length != 2 ){
        throw `provided runtime is not valid`;
    }
    await checkIsProperString(runArr[0],"hour");
    await checkIsProperString(runArr[1],"minute");
    if(runArr[0].length<=1 || runArr[1].length<=3){
        throw `provided runtime is not valid`
    }
    if(runArr[0].slice(-1,)!="h"||runArr[1].slice(-3,)!="min"){
        throw `provided runtime is not valid format`;
    }
    let hourStr = runArr[0].slice(-(runArr[0].length),-1);
    let minuteStr = runArr[1].slice(-(runArr[1].length),-3);
    await checkIsProperString(hourStr,"hour");
    await checkIsProperString(minuteStr,"minute");
    await checkIsOnlyNum(hourStr,"hour");
    await checkIsOnlyNum(minuteStr,"minute");
    let hour = parseInt(hourStr);
    let minute = parseInt(minuteStr);
    if(hour<0){
        throw `provided hour is not valid`;
    }
    if(minute<0||minute>59){
        throw `provided minute is not valid`;
    }
    if(hour == 0){
        if(minute<=30){
            throw `most movies are longer than an 30 min`;
        }
    }
}

// only compare the specific content of two movies
async function checkisEqualMovie(movie1, movie2) {
    if (movie1.title !== movie2.title) {
        return false;
    }
    if (movie1.plot !== movie2.plot) {
        return false;
    }
    if (JSON.stringify(movie1.genres) !== JSON.stringify(movie2.genres)) {
        return false;
    }
    if (movie1.rating !== movie2.rating) {
        return false;
    }
    if (movie1.studio !== movie2.studio) {
        return false;
    }
    if (movie1.director !== movie2.director) {
        return false;
    }
    if (JSON.stringify(movie1.castMembers) !== JSON.stringify(movie2.castMembers)) {
        return false;
    }
    if (movie1.dateReleased !== movie2.dateReleased) {
        return false;
    }
    if (movie1.runtime !== movie2.runtime) {
        return false;
    }
    return true;
}

async function checkIsProperRating(rating, ratingName) {
    if (typeof rating !== "number" || rating == null || rating == NaN || rating == undefined) {
        throw `${ratingName || 'rating'} should be provided as a number`;
    }
    if (rating < 1 || rating > 5) {
        throw `${ratingName || 'rating'} out of range`;
    }
}
module.exports = {
    checkIsProperString,
    checkIsLetterOrNum,
    checkIsOnlyLetter,
    checkIsProperName,
    checkIsOnlyNum,
    checkIsProperRuntime,
    checkIsProperDate,
    checkisEqualMovie,
    checkIsProperRating
};