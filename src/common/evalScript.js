/*
def evalScript(script,inObj):
    while(THIS.living):

        (...)

        elif(re.match(r'BIFURCATE ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];',script[charNum:])!=None):
            #print("binurcate the thing!")
            matches=re.match(r'BIFURCATE ([^\[\];]*)\[([^\[\];]*),([^\[\];]*)\];',script[charNum:])
            (ATHVars[matches.group(2)],ATHVars[matches.group(3)])=bifurcate(ATHVars[matches.group(1)])
            charNum=script.find(';',charNum)
        elif(re.match(r'BIFURCATE \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);',script[charNum:])!=None):
            matches=re.match(r'BIFURCATE \[([^\[\];]*),([^\[\];]*)\]([^\[\];]*);',script[charNum:])
            ATHVars[matches.group(3)]=bifurcate(ATHVars[matches.group(1)],ATHVars[matches.group(2)])
            charNum=script.find(';',charNum)
        elif(script.startswith('BIFFURCATE ',charNum)):
            charNum+=10
            semicolonOffset=script[charNum:].index(';')
            openSquareOffset=script[charNum:].index('[')
            closeSquareOffset=script[charNum:].index(']')
            commaOffset=script[charNum:].index(',')
            syntacticallyCorrect=True
            for offset in [openSquareOffset,closeSquareOffset,commaOffset]:
                if((offset==-1) or (offset>semicolonOffset)):
                    print("Bifurcate command malformed, char:"+str(charNum))
                    syntacticallyCorrect=False
                    break
            if(syntacticallyCorrect):
                if(openSquareOffset==0):
                    leftHalf=script[charNum+openSquareOffset+1:charNum+commaOffset]
                    rightHalf=script[charNum+commaOffset+1:charNum+closeSquareOffset]
                    combinedName=script[charNum+closeSquareOffset+1:charNum+semicolonOffset]
                    ATHVars[combinedName]=bifurcate(ATHVars[leftHalf],ATHVars[rightHalf])
                else:
                    toSplitName=script[charNum:charNum+openSquareOffset]
                    leftHalf=script[charNum+openSquareOffset+1:charNum+commaOffset]
                    rightHalf=script[charNum+commaOffset+1:charNum+closeSquareOffset]
                    (ATHVars[leftHalf],ATHVars[rightHalf])=bifurcate(ATHVars[toSplitName])
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

export evalScript(script,inObj) {
    var ATHVars = {};
    var universe = bif.value_obj();
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

        if (script.startsWith('import ', charNum)) {
            semicolonOffset = script.substring(charNum).indexOf(';');
            var importStatementStr = script.substring(charNum, charNum+semicolonOffset);
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
            ATHVars[varname] = getStrObj(raw_input(':'));
            charNum+=semicolonOffset
        }
    }

    return return_obj
}
