import { UI } from "../../model";
import { GameState } from "../../../engine/game";
import { Tower } from "../../../engine/battle/tower";
import { attackTower } from "../../../engine/battle/combat";

export function clickTower(gs : GameState, ui : UI, tower : Tower) {    
    if (ui.selectedUnit && ui.selectedUnit.owned && !tower.isPlayer) {
        attackTower(gs, ui.selectedUnit, tower);
        ui.selectedUnit = null;
    }
}