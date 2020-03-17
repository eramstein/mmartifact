import { GameState } from "../../../engine/game";
import { UI } from "../../model";
import { Card } from "../../../engine/battle/card";

export function clickHandCard(gs : GameState, ui : UI, card : Card, index: number, isPlayer : boolean) {
    console.log("Clicked card", card);
    if (ui.selectedHandCard && ui.selectedHandCard.index === index) {
        ui.selectedHandCard = null;
    } else {
        ui.selectedHandCard = { index, card };
        ui.selectedUnit = null;
    }    
}
