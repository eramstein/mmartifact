import { UI } from "../../model";
import { playAbility, TargetType } from "../../../engine/battle/ability";
import { GameState } from "../../../engine/game";
import { Unit } from "../../../engine/battle/unit";
import { combat } from "../../../engine/battle/combat";
import { clearAbilityUiState } from "./ability";

export function clickBoardUnit(gs : GameState, ui : UI, unit : Unit) {    
    if (ui.targetSelectionMode) {
        targetUnit(gs, ui, unit);
    }
    if (ui.selectedUnit && ui.selectedUnit.owned && !unit.owned) {
        combat(gs, ui.selectedUnit, unit);
        ui.selectedUnit = null;
    } else {
        selectUnit(gs, ui, unit);
    }    
}

export function clickHandUnit(gs : GameState, ui : UI, unit : Unit) {    
    console.log("Clicked unit", unit);    
}

function selectUnit(gs : GameState, ui : UI, unit : Unit) {
    if (ui.selectedUnit && ui.selectedUnit.id === unit.id) {
        ui.selectedUnit = null;
    } else {
        ui.selectedUnit = unit;
    }    
}

function targetUnit(gs : GameState, ui : UI, unit : Unit) {
    if ([TargetType.Ally, TargetType.Any].indexOf(ui.targetSelectionMode.type)>=0 && unit.owned ||
        [TargetType.Foe, TargetType.Any].indexOf(ui.targetSelectionMode.type)>=0 && !unit.owned) {
        ui.selectedTargets.push(unit);
        if (ui.selectedTargets.length >= ui.targetSelectionMode.count) {
            playAbility(gs, ui.abilityPending.unit, ui.abilityPending.ability, ui.selectedTargets);
            clearAbilityUiState(ui);                
        }
    }
}