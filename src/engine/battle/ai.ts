import { GameState } from "../game";
import { shuffle, pickFrom } from "../../utils/random";
import { Ability, playAbility, getEligibleTargets, TriggerType } from "./ability";
import { Unit } from "./unit";
import { nextRound } from "./turn";

export function playAiAbility(gs : GameState, unit : Unit, ability : Ability) {    
    let targets : Unit[] = [];

    if (!ability.target) {
        targets = null;
    } else {
        const eligibleTargets = getEligibleTargets(gs, unit, ability);        
        targets = pickFrom(eligibleTargets, ability.target.count);
    }

    if (!ability.target || ability.target.count <= targets.length) {
        playAbility(gs, unit, ability, targets);
    } else {
        nextRound(gs, false);
    }    
}

export function playAiRound(gs : GameState) {
    console.log('playAiRound');    
    if (isActionLeftForAI(gs) === false) {        
        gs.battle.foePassed = true;
        nextRound(gs, true);
    }
    // TODO
    //playAiAbility(gs, unit, ability);
}

function isActionLeftForAI(gs : GameState) : boolean {
    // TODO
    return false;
}