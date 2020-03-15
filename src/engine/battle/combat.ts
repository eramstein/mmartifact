import { GameState } from "../game";
import { Unit, damageUnit } from "./unit";
import { onCombatResolution, onAttackTowerResolution } from "./listeners";
import { Tower, damageTower } from "./tower";
import { isBlocked } from "./board";
import { nextRound } from "./turn";

export function combat(gs : GameState, attacker : Unit, defender : Unit) {

    if (attacker.exhausted) {
        console.log("Can't attack, exhausted");        
        return;
    }

    const damage = attacker.atk - (defender.armor || 0);
    damageUnit(gs, defender, damage, true);

    if (defender.retaliate && defender.retaliate > 0) {
        damageUnit(gs, attacker, defender.retaliate, true);
    }

    attacker.exhausted = true;
    
    onCombatResolution(gs, attacker, defender);

    nextRound(gs, false);
}

export function attackTower(gs : GameState, attacker : Unit, tower : Tower) {
    if (attacker.exhausted) {
        console.log("Can't attack, exhausted");        
        return;
    }
    if (tower.pos !== attacker.pos.region) {
        console.log("Can't attack, wrong region");        
        return;
    }
    if (isBlocked(gs, attacker)) {
        console.log("Can't attack, blocked");        
        return;
    }
    damageTower(gs, tower, attacker.atk);
    attacker.exhausted = true;
    onAttackTowerResolution(gs, attacker, tower);

    nextRound(gs, false);
}