import { UI } from "../../model";
import { playAbility, TargetType } from "../../../engine/battle/ability";
import { GameState } from "../../../engine/game";
import { Unit } from "../../../engine/battle/unit";
import { clearAbilityUiState } from "./ability";

export function clickBoardUnit(gs : GameState, ui : UI, unit : Unit) {    
    if (ui.targetSelectionMode) {
        selectUnit(gs, ui, unit);
    }
}

export function clickHandUnit(gs : GameState, ui : UI, unit : Unit) {    
    console.log("Clicked unit", unit);
    
}

function selectUnit(gs : GameState, ui : UI, unit : Unit) {    
    if ([TargetType.Ally, TargetType.Any].indexOf(ui.targetSelectionMode.type)>=0 && unit.owned ||
        [TargetType.Foe, TargetType.Any].indexOf(ui.targetSelectionMode.type)>=0 && !unit.owned) {
        ui.selectedTargets.push(unit);
        if (ui.selectedTargets.length >= ui.targetSelectionMode.count) {
            playAbility(gs, ui.abilityPending.unit, ui.abilityPending.ability, ui.selectedTargets);
            clearAbilityUiState(ui);                
        }
    }
}