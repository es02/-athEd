/*
python drocta ~ATH interpreter
It interprets things written in drocta ~ATH
and is written in python.
Really, I thought the name was fairly self explanatory.
Build number:10
(note:build number might not be accurate, sometimes I forget to increment it.
But I dont decrement it so its still maybe somewhat useful.
or you could just check the github versions. w/e.)
*/

// var evalScript = require('./evalScript.js').evalScript;
const value_obj = require('./bif.js').value_obj;
var bifurcate = require('./bif.js').bifurcate;
var unbifurcate = require('./bif.js').unbifurcate;
var NULL_obj = new value_obj();
NULL_obj.die();

const args = process.argv.slice(2)

function bif(valueA, valueB = false) {
    if (valueB) {
        return unbifurcate(valueA, valueB);
    } else {
        return bifurcate(valueA);
    }
}

function getStrObj(theStr) {
    if (theStr.length === 0) {
        return null;
    } else {
        return bifurcate(
            getCharObj(theStr.charAt(0)),
            getStrObj(theStr.substring(1))
        );
    }
}

var charObjs = [];

function getCharObj(theChar){
    if (charObjs.includes(theChar)){
        return  charObjs[theChar];
    }else{
        theCharObj = new value_obj();
        charObjs[theChar] = theCharObj;
        return theCharObj;
    }
}

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

function evalScript(script, inObj) {
    var ATHVars = {};
    var universe = new value_obj();
    // var NULL_obj = new value_obj();
    // NULL_obj.die();

    ATHVars['universe'] = universe;
    ATHVars['NULL'] = NULL_obj;
    ATHVars['ARGS'] = inObj;
    var return_obj = NULL_obj;

    var charNum = 0;
    var execStack = [];
    var semicolonOffset = 0;
    var matches = [];

    var funCodes = {};

    funCodes['HELLO'] = `
        print "Hello World.";
        THIS.DIE(THIS);
    `;

    funCodes['ADD'] = `
        import bluh BLAH;

        BIFURCATE ARGS[A,B];
        BIFURCATE [BLAH,A]ATEMP;
        BIFURCATE [BLAH,B]BTEMP;
        BIFURCATE ATEMP[JUNK,ATEMP];
        BIFURCATE BTEMP[JUNK,BTEMP];
        BIFURCATE [BLAH,NULL]C;
        BIFURCATE C[JUNK,C];

        ~ATH(ATEMP){
            BIFURCATE ATEMP[JUNK,ATEMP];
            BIFURCATE [BLAH,C]C;
        }

        ~ATH(BTEMP){
            BIFURCATE BTEMP[JUNK,BTEMP];
            BIFURCATE [BLAH,C]C;
        }

        THIS.DIE(C);
    `;

    while (universe.living) {
        console.log(charNum)
        console.log(script.substring(charNum, charNum + 6))

        const importTest = RegExp('importf ([^; ]+) as ([^; ]+);');
        const print2Test = RegExp('PRINT2 ([^\[\];]*);');
        const bif1Test = /BIFURCATE ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];/;
        const bif2Test = /BIFURCATE \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);/;
        const dieTest = RegExp('([0-9a-zA-Z]+)\.DIE\(([0-9a-zA-Z]*)\);');
        const catch1 = /([A-Z0-9_]+) \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);/;
        const catch2 = /([A-Z0-9_]+) ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];/;

        if (script.startsWith('import ', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';');
            var importStatementStr = script.substring(charNum, charNum + semicolonOffset);
            var importStatementList = importStatementStr.split(' ');
            if(!ATHVars.hasOwnProperty(importStatementList[importStatementList.length - 1])){
                ATHVars[importStatementList[importStatementList.length - 1]] = new value_obj();
            }
            charNum += semicolonOffset + 2;
        } else if (importTest.test(script.substring(charNum))) {
            matches = script.substring(charNum).match(importTest);
            var importfFilename = matches[1];

            try {
                var fs = require('fs');
                var newFunc = fs.readFileSync(importfFilename).toString();
                funCodes[matches[2]] = newFunc;
            }
            catch (e) {
                console.log("Error: could not read file " + importfFilename)
            }
            charNum = script.substring(charNum).indexOf(';') + 2;
        } else if (script.startsWith('~ATH(', charNum)){
            closeparenOffset = script.substring(charNum).indexOf(')');
            var loopVar = script.substring(charNum + 5, charNum + closeparenOffset);
            loopVar = loopVar.replace(/(^[ '\^\$\*#&]+)|([ '\^\$\*#&]+$)/g, '');
            if (ATHVars.hasOwnProperty(loopVar)) {
                if (ATHVars[loopVar].living) {
                    execStack.push({charNum: '{'});
                    charNum += closeparenOffset;
                } else{
                    charNum = matchParens(script,charNum,'{','}') + 2;
                }
            } else {
                console.log('warning/error is undefined: ' + loopVar);
            }
        } else if (script.startsWith('}', charNum)){
            var openingTuple = execStack.pop();
            if(openingTuple[1] == '{') {
                charNum = openingTuple[0];
            } else {
                console.log('Syntax error');
            }
        } else if (script.startsWith('print ', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';')
            console.log(script.substring(charNum + 6, charNum + semicolonOffset));
            charNum += semicolonOffset + 2; // +6
        } else if (print2Test.test(script.substring(charNum))) {
            matches = script.substring(charNum).match(print2Test);
            console.log(getObjStr(ATHVars[matches[1]]))
            charNum = script.substring(charNum).indexOf(';') + 2;
        } else if (script.startsWith('INPUT', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';')
            var varname = script.substring(charNum + 6, charNum + semicolonOffset);
            var readline = require('readline-sync');
            var name = readline.question(":");
            ATHVars[varname] = getStrObj(name);
            charNum += semicolonOffset + 2;
        } else if (bif1Test.test(script.substring(charNum))) {
            matches = script.substring(charNum).match(bif1Test);
            console.log("biffirc1 val:" + matches[1])
            console.log("biffirc1 athval:" + ATHVars[matches[1]])
            var foo = bifurcate(ATHVars[matches[1]]);
            console.log("foo:" + foo[0])
            ATHVars[matches[2]] = foo[0];
            ATHVars[matches[3]] = foo[1];
            charNum += script.substring(charNum).indexOf(';') + 2;
        } else if (bif2Test.test(script.substring(charNum))) {
            matches = script.substring(charNum).match(bif2Test);
            console.log("bif2 matches 1-3: ")
            console.log(matches[1])
            console.log(matches[2])
            console.log(matches[3])
            ATHVars[matches[3]] = bifurcate(
                ATHVars[matches[1]],
                ATHVars[matches[2]]
            )
            charNum += script.substring(charNum).indexOf(';') + 2;
        } else if (script.startsWith('BIFURCATE ', charNum)) {
            charNum += 12;
            var semicolonOffset = script.substring(charNum).indexOf(';');
            var openSquareOffset = script.substring(charNum).indexOf('[');
            var closeSquareOffset = script.substring(charNum).indexOf(']');
            var commaOffset = script.substring(charNum).indexOf(',');
            var syntacticallyCorrect = true;

            const offsets = [openSquareOffset, closeSquareOffset, commaOffset]
            for (var offset in offsets) {
                if (( offset == -1) || (offset > semicolonOffset)) {
                    console.log("Bifurcate command malformed, char: " + charNum);
                    syntacticallyCorrect = false;
                    break;
                }
            }
            if (syntacticallyCorrect) {
                if (openSquareOffset == 0) {
                    var leftHalf = script.substring(
                        charNum + openSquareOffset + 1,
                        charNum + commaOffset
                    );
                    var rightHalf = script.substring(
                        charNum + commaOffset + 1,
                        charNum + closeSquareOffset
                    );
                    var combinedName = script.substring(
                        charNum + closeSquareOffset + 1,
                        charNum + semicolonOffset
                    );
                    console.log("comb: " + combinedName)
                    console.log(leftHalf)
                    console.log(rightHalf)
                    ATHVars[combinedName] = bifurcate(
                        ATHVars[leftHalf],
                        ATHVars[rightHalf]
                    );
                } else {
                    var toSplitName = script.substring(
                        charNum,
                        charNum + openSquareOffset
                    );
                    var leftHalf = script.substring(
                        charNum + openSquareOffset + 1,
                        charNum + commaOffset
                    );
                    var rightHalf = script.substring(
                        charNum + commaOffset + 1,
                        charNum + closeSquareOffset
                    );
                    console.log("split: " + toSplitName)
                    console.log(leftHalf)
                    console.log(rightHalf)
                    var foo = bifurcate(ATHVars[toSplitName]);
                    ATHVars[leftHalf] = foo[0];
                    ATHVars[rightHalf] = foo[1];
                }
            }
        } else if (dieTest.test(script.substring(charNum))) {
            matches = script.substring(charNum).match(dieTest);
            var varname = matches[1]
            var argvarname = matches[2]
            if (argvarname) {
                return_obj = ATHVars[argvarname]
            }
            ATHVars[varname].die()
            charNum = script.substring(charNum).indexOf(';') + 2;
        } else if (script.startsWith('//',charNum)) {
            nextNewlinePos = script.substring(charNum).indexOf('\n')
            if (script.substring(charNum, nextNewlinePos).includes('\r')) {
                nextNewlinePos = script.substring(charNum).indexOf('\r')
            }
            charNum = nextNewlinePos;
        } else if (script.startsWith('/*',charNum)) {
            charNum = script.substring(charNum).indexOf('*/') + 2;
        } else if (script.substring(charNum).test(catch1)) {
            try {
                matches = script.substring(charNum).match(catch1);
                funName = matches[1];
                if (funCodes.includes(funName)) {
                    var theFuncCode = funCodes[funName];
                    var sentInObject = bifurcate(
                        ATHVars[matches[2]],
                        ATHVars[matches[3]]
                    );
                    ATHVars[matches[4]] = evalScript(theFuncCode, sentInObject);
                } else {
                    console.log("error: function called '" + funName + "' not recognized");
                }
                charNum += funName.length + 2;
            } catch(e) {
                console.log("function not recognized");
                console.log(matches);
                console.log("...");
                charNum++;
            }
        } else if (catch2.test(script.substring(charNum))) {
            try {
                matches = script.substring(charNum).match(catch2);
                var funName = matches[1];
                if (funCodes.includes(funName)) {
                    var theFuncCode = funCodes[funName];
                    var sentInObject = ATHVars[matches[2]];
                    var foo = bifurcate(evalScript(theFuncCode, sentInObject));
                    ATHVars[matches[3]] = foo[0];
                    ATHVars[matches[4]] = foo[1];
                } else {
                    console.log(
                        "error: function called '" +
                        funName +
                        "' not recognized"
                    );
                }
                charNum += funName.length;
            } catch(e) {
                console.log("function not recognized");
                console.log(matches);
                console.log("...");
                charNum++;
            }
        } else {
             charNum++;
             if (charNum > script.length) {
                 universe.die();
             }
        }
    }
    return return_obj;
}

var filename = args[0];
var fs = require('fs');
var script = fs.readFileSync(filename).toString();
result_obj = evalScript(script, NULL_obj);
