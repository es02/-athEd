/*funCodes={}
funCodes['HELLO']="""
print "Hello World.";"
THIS.DIE(THIS);"""
funCodes["ADD"]="""
import bluh BLAH;
BIFURCATE ARGS[A,B];
BIFURCATE [BLAH,A]ATEMP;
### temp
BIFURCATE [BLAH,B]BTEMP;
BIFURCATE ATEMP[JUNK,ATEMP];
BIFURCATE BTEMP[JUNK,BTEMP];
###temp2
BIFURCATE [BLAH,NULL]C;
BIFURCATE C[JUNK,C];
~ATH(ATEMP){
### temp3
BIFURCATE ATEMP[JUNK,ATEMP];
BIFURCATE [BLAH,C]C;
}
~ATH(BTEMP){
### temp4
BIFURCATE BTEMP[JUNK,BTEMP];
BIFURCATE [BLAH,C]C;
}

BIFURCATE [BLAH,C]CTEMP;
BIFURCATE CTEMP[JUNK,CTEMP];
### temp 5
~ATH(CTEMP){
BIFURCATE CTEMP[JUNK,CTEMP];
print some text;
}
print DONE!;

THIS.DIE(C);
"""#NOTE:use a better addition algorithm.*/

export function createFunCodes(){
    var funCodes = {};
    // add code 'HELLO' key to codes
    funCodes['HELLO'] = "\nprint \"Hello World.\";\"\nTHIS.DIE(THIS);";
    // add code 'ADD' key to codes
    funCode['ADD'] = "import bluh BLAH;\nBIFURCATE ARGS[A,B];\nBIFURCATE ARGS[A,B];\n";
    var temp = "BIFURCATE [BLAH,A]ATEMP;\nBIFURCATE [BLAH,B]BTEMP;\nBIFURCATE ATEMP[JUNK,ATEMP];\nBIFURCATE BTEMP[JUNK,BTEMP];\n";
    funCodes['ADD'] = funCodes['ADD'].concat(temp);
    temp = "BIFURCATE [BLAH,NULL]C;\nBIFURCATE C[JUNK,C];\n~ATH(ATEMP){\n";
    funCodes['ADD'] = funCodes['ADD'].concat(temp);
    temp = "BIFURCATE ATEMP[JUNK,ATEMP];\nBIFURCATE [BLAH,C]C;\n}\n~ATH(BTEMP){\n";
    funCodes['ADD'] = funCodes['ADD'].concat(temp);
    temp = "BIFURCATE BTEMP[JUNK,BTEMP];\nBIFURCATE [BLAH,C]C;\n}\nBIFURCATE [BLAH,C]CTEMP;\nBIFURCATE CTEMP[JUNK,CTEMP];\n";
    funCodes['ADD'] = funCodes['ADD'].concat(temp);
    temp = "~ATH(CTEMP){\nBIFURCATE CTEMP[JUNK,CTEMP];\nprint some text;\n}\nprint DONE!;\n\nTHIS.DIE(C);";
    funCodes['ADD'] = funCodes['ADD'].concat(temp);

}