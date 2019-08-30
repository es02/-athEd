/*
"""
python drocta ~ATH interpreter
It interprets things written in drocta ~ATH
and is written in python.
Really, I thought the name was fairly self explanatory.
This file handles Bifurcation, reverse Bifurcation, and .DIE()
It creates the function for modifying values. (not the variables, the values)
"""

class value_obj:
    def __init__(self,parts=()):
        self.parts=parts
        self.formsLeftOf=[]
        self.formsRightOf=[]
        self.whichHalve=(0,0)#left half is (1,0), right half is (0,1)
        self.living=True
    def bifurcate(self):
        if(not self.parts):
            leftHalf=value_obj()
            leftHalf.formsLeftOf.append(self)
            leftHalf.whichHalve=(1,0)
            rightHalf=value_obj()
            rightHalf.formsRightOf.append(self)
            rightHalf.whichHalve=(0,1)
            self.parts=(leftHalf,rightHalf)
        return self.parts
    def DIE(self):
        self.living=False

 */

var allValueObjs=[];

var value_obj = class {
    

    bifurcate(self) {
        if (!self.hasOwnProperty('parts')) {
            let leftHalf = new value_obj(self);
            leftHalf.formsLeftOf.add(self);
            leftHalf.whichHalve = (1,0);
            rightHalf = new value_obj(self);
            rightHalf.formsRightOf.add(self);
            rightHalf.whichHalve = (0,1);
            self.parts = (leftHalf,rightHalf);
        }
        return self.parts;
    },
    die(self) {
        self.living=false;
        return self;
    }
}

/**
 * [bifurcate description]
 * @param  {value_obj} value [description]
 * @return {value_obj}       [description]
 */
export function bifurcate(value) {
    if (!value.hasOwnProperty('parts')) {
        let leftHalf = new value_obj(value);
        leftHalf.formsLeftOf.add(value);
        leftHalf.whichHalve = (1,0);
        rightHalf = new value_obj(value);
        rightHalf.formsRightOf.add(value);
        rightHalf.whichHalve = (0,1);
        value.parts = (leftHalf,rightHalf);
    }
    return self.parts;
}

/**
 * [unbifurcate description]
 * @param  {[type]} valueA [description]
 * @param  {[type]} valueB [description]
 * @return {[type]}        [description]
 */
export function unbifurcate(valueA, valueB) {
    valueA.formsLeftOf.forEach(function(value) {
      if (valueB.formsRight.includes(value)) {
          return value;
      }
    })
    var combined = new value_obj(valueA, valueB);
    valueA.formsLeftOf.add(combined);
    valueB.formsRightOf.add(combined);

    return combined;
}
