import { UI } from "../../model";
import { Ability, playAbility, TargetType } from "../../../engine/battle/ability";
import { GameState } from "../../../engine/game";
import { Unit } from "../../../engine/battle/unit";

export function activateAbility(gs : GameState, ui : UI, unit : Unit, ability : Ability) {
    if (
        ui.abilityPending && 
        ui.abilityPending.unit.id === unit.id &&
        ui.abilityPending.ability.name === ability.name
        ) {
        ui.abilityPending = null;
        return;
    }
    ui.abilityPending = {
        unit,
        ability,
    }
    ui.targetSelectionMode = ability.target;    
    if (!ui.targetSelectionMode || ui.targetSelectionMode.type === TargetType.Self) {
        playAbility(gs, unit, ability, null);
        clearAbilityUiState(ui);
    }
}

export function clearAbilityUiState(ui : UI) {
    ui.selectedTargets = [];
    ui.targetSelectionMode = null;
    ui.abilityPending = null;
}