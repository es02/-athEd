/*
def getObjStr(theObj):
    outStr=""
    theObj2=theObj
        (leftObj,rightObj)=bifurcate(theObj2)
        while(theObj2.living):
        for char in charObjs:
            if(charObjs[char]==leftObj):
                outStr+=char
                break
        theObj2=rightObj
    return outStr
*/

import bifurcate from 'bif.js';

/**
 * [getObjStr description]
 * @param {} theObj [description]
 * @param {} charObjs [description]
 * @return {} [description]
 */
export function getObjStr(theObj, charObjs) {
  var outStr = '';
  var newObj = bifurcate(theObj);
  while (theObj.living) {
    for (var i = 0; i < charObjs.length; i++) {
      var char = charObjs.charAt(i);
      if (char === newObj.parts.leftObj) {
        outStr += char;
        break;
      }
    }
    theObj = newObj.parts.rightObj;
  }
  return outStr;
}
