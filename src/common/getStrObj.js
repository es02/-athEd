/*
def getStrObj(theStr):
    if(len(theStr)==0):
        return NULL_obj
    else:
        return bifurcate(getCharObj(theStr[0]),getStrObj(theStr[1:]))
*/
import getCharObj from 'getCharObj';
import bifurcate from 'interpreter';

/**
 * [getStrObj description]
 * @param {} theStr [description]
 * @return {} [description]
 */
export function getStrObj(theStr) {
  if (theStr.length === 0) {
    return null;
  } else {
    return bifurcate(getCharObj(theStr.charAt(0)), getStrObj(theStr.substring(1)));
  }
}
