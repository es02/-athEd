/*
def evalScript(script,inObj):
    while(THIS.living):

        (...)

        elif(re.match(r'([0-9a-zA-Z]+)\.DIE\(([0-9a-zA-Z]*)\);',script[charNum:])!=None):#script[charNum:script[charNum:].find(';')].endswith('.DIE()')):
            matches=re.match(r'([0-9a-zA-Z]+)\.DIE\(([0-9a-zA-Z]*)\);',script[charNum:])#.group(1)
            varname=matches.group(1)
            argvarname=matches.group(2)
            if argvarname:
                #print("argvarname is " +argvarname)
                return_obj=ATHVars[argvarname]
            #print "found .DIE(); statement! Variable name is "+varname
            ATHVars[varname].DIE()
            charNum=script.find(';',charNum)
            #print varname+"killed"
        elif(script.startswith('//',charNum)):
            nextNewlinePos=script.find('\n',charNum)
            if '\r' in script[charNum:nextNewlinePos]:
                nextNewlinePos=script.find('\r',charNum)
            charNum=nextNewlinePos
        elif(script.startswith('/*',charNum)):
            charNum=script.find('*/ /*',charNum) // Added an extra /* to keep the comment block closed
        elif(script.startswith('PYDEBUG',charNum)):
            pdb.set_trace()
            charNum+=5
        elif(re.match(r'([A-Z0-9_]+) \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);',script[charNum:])!=None):
            try:
                matches=re.match(r'([A-Z0-9_]+) \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);',script[charNum:])
                funName=matches.group(1)
                #print "the function called '"+funName + "' was called."
                #print "yeah it works."
                if funName in funCodes:
                    theFuncCode=funCodes[funName]
                    sentInObject=bifurcate(ATHVars[matches.group(2)],ATHVars[matches.group(3)])
                    ATHVars[matches.group(4)]=evalScript(theFuncCode,sentInObject)
                else:
                    print "error: function called '"+funName+"' not recognized"
                charNum+=len(funName)
            except:
                print "function not recognized/ a bug in the interpreter"
                print matches#re.match(r'([A-Z0-9_]+) \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);',script[charNum:])
                print "..."
                charNum+=1
            #charNum+=1
        elif(re.match(r'([A-Z0-9_]+) ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];',script[charNum:])!=None):
            try:
                matches=re.match(r'([A-Z0-9_]+) ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];',script[charNum:])
                funName=matches.group(1)
                //#print "the function called '"+funName + "' was called."
                //#print "yeah it works."
                if funName in funCodes:
                    theFuncCode=funCodes[funName]
                    sentInObject=ATHVars[matches.group(2)]#bifurcate(ATHVars[matches.group(2)],ATHVars[matches.group(3)])
                    ATHVars[matches.group(3)],ATHVars[matches.group(4)]=bifurcate(evalScript(theFuncCode,sentInObject))
                else:
                    print "error: function called '"+funName+"' not recognized"
                charNum+=len(funName)
            except:
                print "function not recognized/ a bug in the interpreter"
                print matches#re.match(r'([A-Z0-9_]+) \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);',script[charNum:])
                print "..."
                charNum+=1
        else:
             charNum+=1
             if(charNum > len(script)):
                 THIS.DIE()
        //#print script[charNum]
    return return_obj
 */

import value_obj from 'bif';
import matchParens from 'matchParens';
import getObjStr from 'getObjStr';
import getStrObj from 'getStrObj';
import textToNextSemiColon from 'textToNextSemiColon';

export evalScript(script, inObj) {
    var ATHVars = {};
    var universe = new value_obj();
    ATHVars['universe'] = universe;
    ATHVars['NULL'] = NULL_obj;
    ATHVars['ARGS'] = inObj;
    var return_obj = NULL_obj;

    var charNum = 0;
    var execStack = [];
    var semicolonOffset = 0;
    var matches = [];

    while (universe.living) {
        const importTest = '/importf ([^; ]+) as ([^; ]+);/';
        const print2Test = '/PRINT2 ([^\[\];]*);/';
        const bif1Test = '/BIFURCATE ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];/';
        const bif2Test = '/BIFURCATE \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);/';

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
            console.log(getObjStr(ATHVars[matches.group(1)]))
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
        }
    }

    return return_obj
}
