/*
def matchParens(text,start,openStr,closeStr):
    count=0
    charNum=start
    firstChar=True
    while(count>0 or firstChar):
        if(charNum>=len(text)):
            #print "err:could not find match!"
            return -1
        elif(text[charNum]==closeStr):
            count=count-1
            #print "close at "+str(charNum)
        elif(text[charNum]==openStr):
            count=count+1
            #print "open at "+str(charNum)
            if(firstChar):
                firstChar=False
        charNum=charNum+1
    return charNum-1
*/

/**
 * [matchParens description]
 * @param {} text [description]
 * @param {} start [description]
 * @param {} openStr [description]
 * @param {} closeStr [description]
 * @return {} [description]
 */
function matchParens (text, start, openStr, closeStr) {
  var count = 0;
  var charNum = start;
  var firstChar = true;
  while (count > 0 || firstChar) {
    if (charNum >= text.length) {
      console.log('err:could not find match!');
      return -1;
    } else if (text.charAt(charNum) === closeStr) {
      count -= 1;
      console.log('close at ' + String(charNum));
    } else if (text.charAt(charNum) === openStr) {
      count += 1;
      console.log('open at ' + String(charNum));
      if (firstChar) {
        firstChar = false;
      }
    }
    charNum += 1;
  }
  return charNum - 1;
}

module.exports = {
  matchParens: matchParens,
}
