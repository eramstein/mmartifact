import { GameState } from "../game";
import { Unit } from "./unit";
import { Ability } from "./ability";
import { getFoesInRegion, getUnitAtPosition, REGION_LINES } from "./board";

export const TargetEligibilityTemplates : { [key:string]: (...any) => (gs : GameState, unit : Unit, ability : Ability) => Unit[] } = {
    melee: () => {
        return (gs : GameState, unit : Unit, ability : Ability) => {
            // if there is a unit in front, it's it, else it's the one behind if there is one
            const inFront = getUnitAtPosition(gs, {
                region: unit.pos.region,
                column: unit.pos.column,
                line: unit.owned ? REGION_LINES/2 : REGION_LINES/2 + 1,
            });
            if (inFront) {
                return [inFront];
            }
            const inBack = getUnitAtPosition(gs, {
                region: unit.pos.region,
                column: unit.pos.column,
                line: unit.owned ? 1 : REGION_LINES,
            });
            if (inBack) {
                return [inBack];
            }
            return [];
        };
    },
}