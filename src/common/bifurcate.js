import {bifurcate, unbifurcate} from 'bif';

export function bifurcate(valueA, valueB = false) {
    if (valueB) {
        return unbifurcate(valueA, valueB);
    } else {
        return bifurcate(valueA);
    }
}
