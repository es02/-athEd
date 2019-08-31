/*
"""
python drocta ~ATH interpreter
It interprets things written in drocta ~ATH
and is written in python.
Really, I thought the name was fairly self explanatory.
Build number:10
(note:build number might not be accurate, sometimes I forget to increment it.
But I dont decrement it so its still maybe somewhat useful.
or you could just check the github versions. w/e.)
"""

import bif
import re
import pdb
import matchParens

def bifurcate(valueA,valueB=False):
    if(valueB):
        return bif.unbifurcate(valueA, valueB)
    else:
        return bif.bifurcate(valueA)

/*
charObjs={}
def getCharObj(theChar):
    if(theChar in charObjs):
        return charObjs[theChar]
    else:
        theCharObj=bif.value_obj()
        charObjs[theChar]=theCharObj
        return theCharObj

funCodes={}
funCodes['HELLO']="""
print "Hello World.";"
THIS.DIE(THIS);"""
funCodes["ADD"]="""
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
/*
BIFURCATE [BLAH,C]CTEMP;
BIFURCATE CTEMP[JUNK,CTEMP];
~ATH(CTEMP){
BIFURCATE CTEMP[JUNK,CTEMP];
print some text;
}
print DONE!;

THIS.DIE(C);
"""#NOTE:use a better addition algorithm.


filename=raw_input()
filelink=open(filename,'r')
script=filelink.read(-1)
result_obj=evalScript(script,NULL_obj)
raw_input("press enter to close")
 */
