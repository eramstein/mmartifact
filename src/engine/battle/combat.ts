import { GameState } from "../game";
import { Unit, damageUnit } from "./unit";
import { onCombatResolution } from "./listeners";

export function combat(gs : GameState, attacker : Unit, defender : Unit) {    
    damageUnit(gs, defender, attacker.atk, true);
    onCombatResolution(gs, attacker, defender);
}
