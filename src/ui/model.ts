import { GameState } from "../engine/game";
import { Target, Ability } from "../engine/battle/ability";
import { Unit } from "../engine/battle/unit";
import { Card } from "../engine/battle/card";

export enum Screen {
    Battle = "BATTLE",
}

export interface UI {
    openScreen: Screen;
    screenParameters: any;
    abilityPending: { unit: Unit, ability: Ability },
    selectedTargets: Unit[],
    targetSelectionMode: Target,
    selectedUnit: Unit,
    selectedHandCard: { card: Card, index: number },
}

export interface FullState {
    game: GameState;
    ui: UI;
}
