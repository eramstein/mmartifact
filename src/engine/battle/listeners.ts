import { GameState } from "../game";
import { Unit } from "./unit";
import { TriggerType, getEligibleTargets } from "./ability";
import { BoardPosition } from "./board";
import { Tower } from "./tower";

function triggerAbilities(gs : GameState, type : TriggerType, ...rest) {
    gs.battle.player.board.concat(gs.battle.foe.board).forEach(u => {
        u.abilities.forEach(a => {
            if (a.trigger.type === type) {                
                if (!a.trigger.condition || a.trigger.condition(gs, u, ...rest)) {
                    // TODO: if a.target, ask player or AI for targets
                    // (store ability in a "pendingTriggeredAbilities" array ?)
                    console.log(u.name + " triggers " + a.name, a, ...rest);
                    let targets = null;
                    let params : any = {};                    
                    if (a.target) {
                        targets = getEligibleTargets(gs, u, a);
                    }                    
                    if (type === TriggerType.AfterCombat) {
                        params.attacker = rest[0];                        
                    }
                    if (type === TriggerType.BeforeMove) {
                        params.mover = rest[0];                        
                    }
                    a.effect(gs, u, targets, params);
                }
            }
        });
    });
}

export function onDamageUnit(gs : GameState, unit : Unit, damage : number, isCombatDamage : boolean) {
    triggerAbilities(gs, TriggerType.BeforeDamage, damage, isCombatDamage, unit);
}

export function onCombatResolution(gs : GameState, attacker : Unit, defender : Unit) {
    triggerAbilities(gs, TriggerType.AfterCombat, attacker, defender);
}

export function onAttackTowerResolution(gs : GameState, attacker : Unit, tower : Tower) {
    triggerAbilities(gs, TriggerType.AfterCombat, attacker, tower);
}

export function onMoveUnit(gs : GameState, unit : Unit, pos : BoardPosition) {
    triggerAbilities(gs, TriggerType.BeforeMove, unit, pos);
}

export function onUnitDeath(gs : GameState, unit : Unit) {
    triggerAbilities(gs, TriggerType.AfterDeath, unit);
}