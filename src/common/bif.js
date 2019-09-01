/*
    Ported from python drocta ~ATH interpreter
    It interprets things written in drocta ~ATH
    Really, I thought the name was fairly self explanatory.
    This file handles Bifurcation, reverse Bifurcation, and .DIE()
    It creates the function for modifying values. (not the letiables, the values)
 */

let allValueObjs=[];

let value_obj = class {
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
            let rightHalf = new value_obj(this);
            rightHalf.formsRightOf.push(this);
            rightHalf.whichHalve = [0,1];
            this.parts = {'leftHalf': leftHalf, 'rightHalf': rightHalf};
        }

        return {
            'leftHalf': this.parts.leftHalf,
            'rightHalf': this.parts.rightHalf
        };
    }
    die() {
        this.living=false;
    }
};

/**
 * [bifurcate description]
 * @param  {value_obj} value [description]
 * @return {value_obj}       [description]
 */
function bifurcate(value) {
    // console.log("biffirc val: " + value);
    if (!value.hasOwnProperty('parts') || value.parts.length === 0) {
        let leftHalf = new value_obj(value);
        leftHalf.formsLeftOf.push(value);
        leftHalf.whichHalve = [1,0];
        let rightHalf = new value_obj(value);
        rightHalf.formsRightOf.push(value);
        rightHalf.whichHalve = [0,1];
        value.parts = {'leftHalf': leftHalf, 'rightHalf': rightHalf};
    }
    return {
        'leftHalf': value.parts.leftHalf,
        'rightHalf': value.parts.rightHalf
    };
};

/**
 * [unbifurcate description]
 * @param  {value_obj} valueA [description]
 * @param  {value_obj} valueB [description]
 * @return {[type]}        [description]
 */
function unbifurcate(valueA, valueB) {
    valueA.formsLeftOf.forEach(function(value) {
        // If this is a bifurcated pair just return the original pair
        if (
            typeof value !== 'undefined' &&
            typeof valueB.formsRightOf !== 'undefined' &&
            valueB.formsRightOf.includes(value)
        ) {
            return value;
        }
    });
    let parts = {'leftHalf': valueA, 'rightHalf': valueB};
    return new value_obj(parts);
}

module.exports = {
  bifurcate: bifurcate,
  unbifurcate: unbifurcate,
  value_obj: value_obj,
}
