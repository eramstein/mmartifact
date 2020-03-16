import { BoardPosition } from "../../../engine/battle/board";
import { GameState } from "../../../engine/game";
import { UI } from "../../model";
import { moveUnit } from "../../../engine/battle/unit";
import { playCard } from "../../../engine/battle/card";

export function clickCell(gs : GameState, ui : UI, pos : BoardPosition) {    
    console.log("Clicked pos", pos);
    if (ui.selectedUnit && !ui.selectedUnit.exhausted) {
        moveUnit(gs, ui.selectedUnit, pos);
        ui.selectedUnit = null;
    }
    if (ui.selectedHandCard) {
        playCard(gs, ui.selectedHandCard.index, pos);
        ui.selectedHandCard = null;
    }
}