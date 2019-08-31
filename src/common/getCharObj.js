/*def getCharObj(theChar):
    if(theChar in charObjs):
        return charObjs[theChar]
    else:
        theCharObj=bif.value_obj()
        charObjs[theChar]=theCharObj
        return theCharObj
*/

import * as value_obj from '/bif';
/**
 * [Checks for a matching key in given charObjs otherwise makes a new key with a empty value_obj attched]
 * @param  {[type]} theChar [A object or element that is a char]
 * @param  {[type]} charObjs [A collection of charObjs that already is in use]
 * @return {[type]}        [returns a charObj that was found or the original charObj passed through]
 */
export function getCharObj(theChar,charObjs){
    if (theChar in charObjs){
        return  charObjs[theChar]
    }else{
        theCharObj =bif.value_obj()
        charObjs[theChar] = theCharObj
        return theCharObj
    }
}