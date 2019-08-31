/*
def getStrObj(theStr):
    if(len(theStr)==0):
        return NULL_obj
    else:
        return bifurcate(getCharObj(theStr[0]),getStrObj(theStr[1:]))
*/
var getCharObj = require('./getCharObj.js').getCharObj;
var bifurcate = require('./bifurcate.js').bifurcate;

/**
 * [getStrObj description]
 * @param {} theStr [description]
 * @return {} [description]
 */
function getStrObj(theStr) {
  if (theStr.length === 0) {
    return null;
  } else {
    return bifurcate(getCharObj(theStr.charAt(0)), getStrObj(theStr.substring(1)));
  }
}

module.exports = {
  getStrObj: getStrObj,
}
