import { GameState } from "../game";
import { Unit } from "./unit";
import { nextRound } from "./turn";
import { BoardPosition } from "./board";

export interface Ability {    
    name: string,
    text: string,
    effect(gs : GameState, unit : Unit, targets : Unit[], params? : {}): void,
    trigger: Trigger,
    target?: Target,
    cost?: number,
    fast?: boolean,
    exhausts?: boolean,
}

export interface Trigger {    
    type: TriggerType,
    condition?(gs : GameState, unit : Unit, ...any): boolean,
}

export interface Target {    
    type: TargetType,
    pos?: BoardPosition,
    count?: number,
    eligible?(gs : GameState, unit : Unit, ability : Ability): Unit[],
}

export enum TriggerType {
    Activated = "ACTIVATED",
    BeforeDamage = "BEFORE_DAMAGE",
    AfterCombat = "AFTER_COMBAT",
    BeforeMove = "BEFORE_MOVE",
    AfterDeath = "AFTER_DEATH",
}

export enum TargetType {
    Foe = "FOE",
    Ally = "ALLY",
    Any = "ANY",
    Self = "SELF",
}

export function newAbility(template : Ability) : Ability {
    return {
        ...template,
    }
}

export function playAbility(gs : GameState, unit : Unit, ability : Ability, targets : Unit[]) {
    console.log(unit.name + " uses " + ability.name + " on " + (targets && targets.map(t => t.name).join(", ")));
    
    // CHECKS + COSTS
    // ----------------------------------------------------------------------
    if (ccPreventsAbility(gs, unit)) {
        if (!gs.battle.playersRound) { nextRound(gs); }
        return;
    }

    if (payAbilityCost(unit.pos.region, ability) === false) {
        return;
    }

    if (allTargetsEligible(gs, unit, ability, targets) === false) {
        if (!gs.battle.playersRound) { nextRound(gs); }
        return;
    }
    
    if (ability.target && ability.target.type === TargetType.Self) {
        targets = [unit];
    }

    // EFFECT
    // ----------------------------------------------------------------------
    ability.effect(gs, unit, targets, {});    

    // NEXT ROUND
    // ----------------------------------------------------------------------
    if (gs.battle.playersRound) {
        gs.battle.playerPassed = false;
    } else {
        gs.battle.foePassed = false;
    }

    if (!ability.fast) {
        nextRound(gs);
    }
    
}

function ccPreventsAbility(gs : GameState, unit : Unit) : boolean {
    if (unit && (unit.cc.mezz > 0 || unit.cc.stun > 0 || unit.cc.dazed)) {
        console.log("Mezzed or Stunned or Dazed - skip ability");
        unit.cc.dazed = false;        
        return true;
    }
    return false;
}

function payAbilityCost(region : number, ability : Ability) : boolean {
    // TODO
    // const payed = true;
    // if (payed === false) {
    //     console.log("NOT ENOUGH MANA");
    //     return false;
    // }
    return true;
}

function allTargetsEligible(gs : GameState, unit : Unit, ability : Ability, targets : Unit[]) : boolean {
    if (ability.target && ability.target.type !== TargetType.Self) {    
        const eligibleTargets = getEligibleTargets(gs, unit, ability);    
        const targetsValid = checkEligibility(targets, eligibleTargets);    
        if (targetsValid === false) {
            console.log("INVALID TARGET", ability, targets);
            return false;
        }
        return true;
    }
    return true;
}

export function getEligibleTargets(gs : GameState, unit : Unit, ability : Ability) : Unit[] {    
    if (!ability.target) {
        return null;
    }
    if (ability.target && ability.target.type === TargetType.Self) {
        return [unit];
    }
    if (!ability.target.eligible) {
        // TODO
    }    
    return ability.target.eligible(gs, unit, ability);
}

export function checkEligibility(targets : Unit[], eligible : Unit[]) : boolean {
    if (eligible === null) {
        return true;
    }
    for (let index = 0; index < targets.length; index++) {
        const t = targets[index];
        let found = false;        
        eligible.forEach(e => {
            if (e.id === t.id) {
                found = true;
            }            
        });
        return found;
    }
    return true;
}