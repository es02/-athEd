/*
def textToNextSemicolon(text,start=0):
    semicolonOffset=text.find(';',start)
    return text[start:semicolonOffset]
*/

/**
 * [textToNextSemicolon description]
 * @param {} text [description]
 * @param {} start [description]
 * @return {} [description]
 */
function textToNextSemicolon (text, start = 0) {
  var semicolonOffset = text.substring(0, start).indexOf(';');
  return text.substring(start, semicolonOffset);
}

module.exports = {
  textToNextSemicolon: textToNextSemicolon,
}
