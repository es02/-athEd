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
*/

import evalScript from 'evalScript';

var NULL_obj = new value_obj();
NULL_obj.DIE();

var filename = input();
var fs = require('fs');
var script = fs.readFileSync(filename).toString();
result_obj = evalScript(script, NULL_obj);
input("press enter to close");
