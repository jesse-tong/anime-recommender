import lodash from 'lodash';

export function colorGenerator(numberOfColors){
    let step = Math.floor(360/numberOfColors);
    var res = new Array();
    for (let i = 0; i < numberOfColors; i++){
        res.push('hsl(' + (i*step) + ', 80%, 50%)');
    }
    return res;
}

export function countValue(array){
    var countMap = new Map();
    //If we got an initerable object but can still be parsed to array or map, use this dirty trick
    array.map((v, index)=> {
        let value = v.studios;

        value.forEach((val)=> {
            let key = lodash.cloneDeep(val);
            countMap.set(key, countMap.has(key) ? countMap.get(key) + 1 : 1)
        });
 
    });

    return countMap;
}