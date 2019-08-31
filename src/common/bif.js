/*
    Ported from python drocta ~ATH interpreter
    It interprets things written in drocta ~ATH
    Really, I thought the name was fairly self explanatory.
    This file handles Bifurcation, reverse Bifurcation, and .DIE()
    It creates the function for modifying values. (not the variables, the values)
 */

var allValueObjs=[];

var value_obj = class {
    constructor(parts=[]){
        this.parts = parts;
        this.formsLeftOf = [];
        this.formsRightOf = [];
        this.whichHalve = [0,0]; //left half is (1,0), right half is (0,1)
        this.living = true;
    }
    bifurcate() {
        if (!this.hasOwnProperty('parts') || this.parts.length === 0) {
            let leftHalf = new value_obj(this);
            leftHalf.formsLeftOf.push(this);
            leftHalf.whichHalve = [1,0];
            rightHalf = new value_obj(this);
            rightHalf.formsRightOf.push(this);
            rightHalf.whichHalve = [0,1];
            this.parts = (leftHalf,rightHalf);
        }

        return this.parts;
    }
    die() {
        this.living=false;
    }
}

/**
 * [bifurcate description]
 * @param  {value_obj} value [description]
 * @return {value_obj}       [description]
 */
export function bifurcate(value) {
    if (!value.hasOwnProperty('parts') || value.parts.length === 0) {
        let leftHalf = new value_obj(value);
        leftHalf.formsLeftOf.push(value);
        leftHalf.whichHalve = [1,0];
        rightHalf = new value_obj(value);
        rightHalf.formsRightOf.push(value);
        rightHalf.whichHalve = [0,1];
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
    var value = valueA.formsLeftOf.forEach(function(value) {
      if (valueB.formsRight.includes(value)) {
          return value;
      }
    })
    var combined = new value_obj(valueA, valueB);
    valueA.formsLeftOf.push(combined);
    valueB.formsRightOf.push(combined);

    if (value) {
        return value;
    } else {
        return combined;
    }
}
