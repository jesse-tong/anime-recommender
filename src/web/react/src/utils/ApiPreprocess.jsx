
//This function can cause issue with React as component having prop objects passed after through
//this function can be inaccessible (return undefined)
export function jsonMapStringToList(jsonObj, keyRef){
    var map = new Map(Object.entries(jsonObj));
    var res = Array();
    map.forEach((value, key) => {       
        value = new Map(Object.entries(value));
        var obj = new Map(value);
        obj.set(keyRef, key);
        res.push(obj);
    });
    return res;
}