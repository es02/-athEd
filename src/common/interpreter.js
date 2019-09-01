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

// let evalScript = require('./evalScript.js').evalScript;
const value_obj = require('./bif.js').value_obj;
let bifurcate = require('./bif.js').bifurcate;
let unbifurcate = require('./bif.js').unbifurcate;
let NULL_obj = new value_obj();
NULL_obj.die();

const args = process.argv.slice(2);

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
        return bif(
            getCharObj(theStr.charAt(0)),
            getStrObj(theStr.substring(1))
        );
    }
}

let charObjs = [];

function getCharObj(theChar){
    if (charObjs.includes(theChar)){
        return  charObjs[theChar];
    }else{
        let theCharObj = new value_obj();
        charObjs[theChar] = theCharObj;
        return theCharObj;
    }
}

function matchParens (text, start, openStr, closeStr) {
  let count = 0;
  let charNum = start;
  let firstChar = true;
  while (count > 0 || firstChar) {
    if (charNum >= text.length) {
      console.log('err:could not find match!');
      return -1;
    } else if (text.charAt(charNum) === closeStr) {
      count -= 1;
      // console.log('close at ' + String(charNum));
    } else if (text.charAt(charNum) === openStr) {
      count += 1;
      // console.log('open at ' + String(charNum));
      if (firstChar) {
        firstChar = false;
      }
    }
    charNum++;
  }
  return charNum - 1;
}

function evalScript(script, inObj) {
    let ATHlets = {};
    let universe = new value_obj();
    // let NULL_obj = new value_obj();
    // NULL_obj.die();

    ATHlets['THIS'] = universe;
    ATHlets['NULL'] = NULL_obj;
    ATHlets['ARGS'] = inObj;
    let return_obj = NULL_obj;

    let charNum = 0;
    let execStack = [];
    let semicolonOffset = 0;

    let funCodes = {};

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
        // console.log(charNum);
        // console.log(script.substring(charNum, charNum + 6))

        const importTest = RegExp('^importf ([^; ]+) as ([^; ]+);');
        const print2Test = RegExp('^PRINT2 ([^\[\];]*);');
        const bif1Test = /^BIFURCATE ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];/;
        const bif2Test = /^BIFURCATE \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);/;
        const dieTest = RegExp('^([0-9a-zA-Z]+)\.DIE\(([0-9a-zA-Z]*)\);');
        const catch1 = /^([A-Z0-9_]+) \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);/;
        const catch2 = /^([A-Z0-9_]+) ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];/;

        if (script.startsWith('import ', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';');
            let importStatementStr = script.substring(charNum, charNum + semicolonOffset);
            let importStatementList = importStatementStr.split(' ');
            if(!ATHlets.hasOwnProperty(importStatementList[importStatementList.length - 1])){
                ATHlets[importStatementList[importStatementList.length - 1]] = new value_obj();
            }
            charNum += semicolonOffset + 2;
        } else if (importTest.test(script.substring(charNum))) {
            let matches = script.substring(charNum).match(importTest);
            let importfFilename = matches[1];

            try {
                let fs = require('fs');
                funCodes[matches[2]] = fs.readFileSync(importfFilename).toString();
            }
            catch (e) {
                console.log("Error: could not read file " + importfFilename);
            }
            charNum = script.substring(charNum).indexOf(';') + 2;
        } else if (script.startsWith('~ATH(', charNum)){
            let closeparenOffset = script.substring(charNum).indexOf(')');
            let looplet = script.substring(charNum + 5, charNum + closeparenOffset);
            looplet = looplet.replace(/(^[ '\^\$\*#&]+)|([ '\^\$\*#&]+$)/g, '');
            // console.log(looplet)
            // console.log(ATHlets);
            if (ATHlets.hasOwnProperty(looplet)) {

                // console.log(ATHlets)
                //  console.log("loop: " + looplet)
                if (ATHlets[looplet].living) {
                    execStack.push([charNum, '{']);
                     // console.log("pushed to execstack")
                     // console.log(execStack)
                    charNum += closeparenOffset;
                } else{
                    charNum = matchParens(script,charNum,'{','}') + 2;
                }
            } else {
                console.log('warning/error is undefined: ' + looplet);
            }
        } else if (script.startsWith('}', charNum)){
            // console.log(execStack)
            let openingTuple = execStack.pop();
            // console.log("tuple: " + openingTuple)
            if (openingTuple[1] == '{') {
                charNum = openingTuple[0];
            } else {
                console.log('Syntax error');
            }
        } else if (script.startsWith('print ', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';');
            console.log(script.substring(charNum + 6, charNum + semicolonOffset));
            charNum += semicolonOffset + 2; // +6
        } else if (print2Test.test(script.substring(charNum))) {
            let matches = script.substring(charNum).match(print2Test);
            console.log(getObjStr(ATHlets[matches[1]]));
            charNum = script.substring(charNum).indexOf(';') + 2;
        } else if (script.startsWith('INPUT', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';');
            let letname = script.substring(charNum + 6, charNum + semicolonOffset);
            let readline = require('readline-sync');
            let name = readline.question(":");
            ATHlets[letname] = getStrObj(name);
            charNum += semicolonOffset + 2;
        } else if (bif1Test.test(script.substring(charNum))) {
            let matches = script.substring(charNum).match(bif1Test);
            // console.log("BIFURCATE TYPE1");
            // console.log(matches[1]);
            // console.log(ATHlets[matches[1]]);

            let foo = bif(ATHlets[matches[1]]);
            ATHlets[matches[2]] = foo.leftHalf;
            ATHlets[matches[3]] = foo.rightHalf;

            // console.log(ATHlets[matches[2]]);
            charNum += script.substring(charNum).indexOf(';') + 2;
        } else if (bif2Test.test(script.substring(charNum))) {
            let matches = script.substring(charNum).match(bif2Test);
            // console.log(ATHlets)
            // console.log(matches)
            ATHlets[matches[3]] = bif(
                ATHlets[matches[1]],
                ATHlets[matches[2]]
            );
            charNum += script.substring(charNum).indexOf(';') + 2;
        } else if (script.startsWith('BIFURCATE ', charNum)) {
            charNum += 12;
            let semicolonOffset = script.substring(charNum).indexOf(';');
            let openSquareOffset = script.substring(charNum).indexOf('[');
            let closeSquareOffset = script.substring(charNum).indexOf(']');
            let commaOffset = script.substring(charNum).indexOf(',');
            let syntacticallyCorrect = true;

            const offsets = [openSquareOffset, closeSquareOffset, commaOffset];
            for (let offset in offsets) {
                if (( offset == -1) || (offset > semicolonOffset)) {
                    console.log("Bifurcate command malformed, char: " + charNum);
                    syntacticallyCorrect = false;
                    break;
                }
            }
            if (syntacticallyCorrect) {
                if (openSquareOffset == 0) {
                    let leftHalf = script.substring(
                        charNum + openSquareOffset + 1,
                        charNum + commaOffset
                    );
                    let rightHalf = script.substring(
                        charNum + commaOffset + 1,
                        charNum + closeSquareOffset
                    );
                    let combinedName = script.substring(
                        charNum + closeSquareOffset + 1,
                        charNum + semicolonOffset
                    );
                    ATHlets[combinedName] = bif(
                        ATHlets[leftHalf],
                        ATHlets[rightHalf]
                    );
                } else {
                    let toSplitName = script.substring(
                        charNum,
                        charNum + openSquareOffset
                    );
                    let leftHalf = script.substring(
                        charNum + openSquareOffset + 1,
                        charNum + commaOffset
                    );
                    let rightHalf = script.substring(
                        charNum + commaOffset + 1,
                        charNum + closeSquareOffset
                    );
                    let foo = bif(ATHlets[toSplitName]);
                    ATHlets[leftHalf] = foo.leftHalf;
                    ATHlets[rightHalf] = foo.rightHalf;
                }
            }
        } else if (dieTest.test(script.substring(charNum))) {
            let matches = script.substring(charNum).match(dieTest);
            let letname = matches[1];
            let argletname = matches[2];
            if (argletname) {
                return_obj = ATHlets[argletname];
            }
            ATHlets[letname].die();
            charNum += script.substring(charNum).indexOf(';') + 2;
        } else if (script.startsWith('//', charNum)) {
            // console.log(script.substring(charNum));
            let nextNewlinePos = script.substring(charNum).indexOf("\n");
            if (script.substring(nextNewlinePos).includes("\r")) {
                nextNewlinePos = script.substring(charNum).indexOf("\r");
            }
            charNum += nextNewlinePos + 1;
        } else if (script.startsWith('/*',charNum)) {
            charNum += script.substring(charNum).indexOf('*/') + 1;
        } else if (catch1.test(script.substring(charNum))) {
            try {
                let matches = script.substring(charNum).match(catch1);
                let funName = matches[1];
                if (funCodes.includes(funName)) {
                    let theFuncCode = funCodes[funName];
                    let sentInObject = bif(
                        ATHlets[matches[2]],
                        ATHlets[matches[3]]
                    );
                    ATHlets[matches[4]] = evalScript(theFuncCode, sentInObject);
                } else {
                    console.log("error: function called '" + funName + "' not recognized");
                }
                charNum += funName.length + 2;
            } catch(e) {
                console.log("function not recognized");
                console.log(e);
                console.log("...");
                charNum++;
            }
        } else if (catch2.test(script.substring(charNum))) {
            try {
                let matches = script.substring(charNum).match(catch2);
                let funName = matches[1];
                if (funCodes.includes(funName)) {
                    let theFuncCode = funCodes[funName];
                    let sentInObject = ATHlets[matches[2]];
                    let foo = bif(evalScript(theFuncCode, sentInObject));
                    ATHlets[matches[3]] = foo.leftHalf;
                    ATHlets[matches[4]] = foo.rightHalf;
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
                console.log(e);
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

let filename = args[0];
let fs = require('fs');
let script = fs.readFileSync(filename).toString();
result_obj = evalScript(script, NULL_obj);
