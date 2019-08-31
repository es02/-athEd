/*def getCharObj(theChar):
    if(theChar in charObjs):
        return charObjs[theChar]
    else:
        theCharObj=bif.value_obj()
        charObjs[theChar]=theCharObj
        return theCharObj
*/

var value_obj = require('./bifurcate.js').value_obj;

/**
 * [Checks for a matching key in given charObjs otherwise makes a new key with a empty value_obj attched]
 * @param  {[type]} theChar [A object or element that is a char]
 * @param  {[type]} charObjs [A collection of charObjs that already is in use]
 * @return {[type]}        [returns a charObj that was found or the original charObj passed through]
 */
function getCharObj(theChar, charObjs){
    if (charObjs.includes(theChar)){
        return  charObjs[theChar];
    }else{
        theCharObj = new value_obj();
        charObjs[theChar] = theCharObj;
        return theCharObj;
    }
}

module.exports = {
  getCharObj: getCharObj,
}
