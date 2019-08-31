import value_obj from 'bif';
import matchParens from 'matchParens';
import getObjStr from 'getObjStr';
import getStrObj from 'getStrObj';
import textToNextSemiColon from 'textToNextSemiColon';
import bifurcate from 'bifurcate';

export evalScript(script, inObj) {
    var ATHVars = {};
    var universe = new value_obj();
    var NULL_obj = new value_obj();
    NULL_obj.DIE();

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
        const importTest = '/importf ([^; ]+) as ([^; ]+);/';
        const print2Test = '/PRINT2 ([^\[\];]*);/';
        const bif1Test = '/BIFURCATE ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];/';
        const bif2Test = '/BIFURCATE \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);/';
        const dieTest = '/([0-9a-zA-Z]+)\.DIE\(([0-9a-zA-Z]*)\);/'
        const catch1 = '/([A-Z0-9_]+) \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);/';
        const catch2 = '/([A-Z0-9_]+) ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];/';

        if (script.startsWith('import ', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';');
            var importStatementStr = script.substring(charNum, charNum + semicolonOffset);
            var importStatementList = importStatementStr.split(' ');
            if(!ATHVars.includes(importStatementList[importStatementList.length - 1])){
                ATHVars[importStatementList[importStatementList.length - 1]] = new value_obj();
            }
            charNum += semicolonOffset;
        } elseif (script.substring(charNum).test(importTest)) {
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
            charNum = script.substring(charNum).indexOf(';');
        } elseif (script.startsWith('~ATH(', charNum)){
            closeparenOffset = script.substring(charNum).indexOf(')');
            var loopVar = script.substring(charNum + 5, charNum + closeparenOffset);
            loopVar = loopVar.strip(' \t\n\r');
            if (ATHVars.includes(loopVar)) {
                if (ATHVars[loopVar].living) {
                    execStack.push({charNum: '{'});
                    charNum += closeparenOffset;
                } else{
                    charNum = matchParens(script,charNum,'{','}') + 2;
                }
            } else {
                console.log('warning/error is undefined: ' + loopVar);
            }
        } elseif (script.startsWith('}', charNum)){
            var openingTuple = execStack.pop();
            if(openingTuple[1] == '{') {
                charNum = openingTuple[0];
            } else {
                console.log('Syntax error');
            }
        } elseif (script.startsWith('print ', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';')
            console.log(script.substring(charNum + 6, charNum + semicolonOffset));
            charNum += semicolonOffset // +6
        } elseif (script.substring(charNum).test(print2Test)) {
            matches = script.substring(charNum).match(print2Test)
            console.log(getObjStr(ATHVars[matches[1]]))
            charNum = script.substring(charNum).indexOf(';');
        } elseif (script.startsWith('INPUT', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';')
            var varname = script.substring(charNum + 6, charNum + semicolonOffset);
            ATHVars[varname] = getStrObj(input(':'));
            charNum += semicolonOffset
        } elseif (script.substring(charNum).test(bif1Test)) {
            matches = script.substring(charNum).match(bif1Test);
            var foo = bifurcate(ATHVars[matches[1]]);
            ATHVars[matches[2]] = foo.parts.leftObj;
            ATHVars[matches[3]] = foo.parts.rightObj;
            charNum = script.substring(charNum).indexOf(';');
        } elseif (script.substring(charNum).test(bif2Test)) {
            matches = script.substring(charNum).match(bif2Test);
            ATHVars[matches[3]] = bifurcate(
                ATHVars[matches[1]],
                ATHVars[matches[2]]
            )
            charNum = script.substring(charNum).indexOf(';');
        } elseif (script.startsWith('BIFURCATE ', charNum)) {
            charNum += 10;
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
                    var foo = bifurcate(ATHVars[toSplitName]);
                    ATHVars[leftHalf] = foo.parts.leftObj;
                    ATHVars[rightHalf] = foo.parts.rightObj;
                }
            }
        } elseif (script.substring(charNum).test(dieTest)) {
            matches = script.substring(charNum).match(dieTest);
            var varname = matches[1]
            var argvarname = matches[2]
            if argvarname {
                return_obj = ATHVars[argvarname]
            }
            ATHVars[varname].DIE()
            charNum = script.substring(charNum).indexOf(';');
        } elseif (script.startsWith('//',charNum)) {
            nextNewlinePos = script.substring(charNum).indexOf('\n')
            if (script.substring(charNum, nextNewlinePos).includes('\r')) {
                nextNewlinePos = script.substring(charNum).indexOf('\r')
            }
            charNum = nextNewlinePos;
        } elseif (script.startsWith('/*',charNum)) {
            charNum = script.substring(charNum).indexOf('*/');
        } elseif (script.substring(charNum).test(catch1)) {
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
                charNum += funName.length;
            } catch(e) {
                console.log("function not recognized");
                console.log(matches);
                console.log("...");
                charNum++;
            }
        } elseif (script.substring(charNum).test(catch2)) {
            try {
                matches = script.substring(charNum).match(catch2);
                var funName = matches[1];
                if (funCodes.includes(funName)) {
                    var theFuncCode = funCodes[funName];
                    var sentInObject = ATHVars[matches[2]];
                    var foo = bifurcate(evalScript(theFuncCode, sentInObject));
                    ATHVars[matches[3]] = foo.parts.leftObj;
                    ATHVars[matches[4]] = foo.parts.rightObj;
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
                 universe.DIE();
             }
        }
    }
    return return_obj;
}
