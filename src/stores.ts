import { get, writable } from "svelte/store";
import { GameState, initGameState } from "./engine/game";
import { handleKeyPress } from "./keybinds";
import { Screen, FullState } from "./ui/model";
import { activateAbility } from "./ui/game/battle/ability";
import { clickBoardUnit } from "./ui/game/battle/unit";
import { clickCell } from "./ui/game/battle/board";
import { pass } from "./engine/battle/turn";
import { clickTower } from "./ui/game/battle/tower";
import { clickHandCard } from "./ui/game/battle/hand";

export const State = createFullState();

function createFullState() {
    const initialState = loadState();

    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        update,
        set,
        initialize: () => set(getNewState()),
        load: data => set(data),
        tempTest: () => update(s => { return s; }),

        passRound: () => update(s => { s.ui.selectedUnit = null; s.ui.selectedHandCard = null; pass(s.game, true); return s; }),
        activateAbility: (unit, ability) => update(s => { activateAbility(s.game, s.ui, unit, ability); return s; }),
        clickBoardUnit: (unit) => update(s => { clickBoardUnit(s.game, s.ui, unit); return s; }),
        clickHandCard: (card, index, isPlayer) => update(s => { clickHandCard(s.game, s.ui, card, index, isPlayer); return s; }),
        clickCell: (pos) => update(s => { clickCell(s.game, s.ui, pos); return s; }),
        clickTower: (tower) => update(s => { clickTower(s.game, s.ui, tower); return s; }),
    };
}

function getNewState(): FullState {
    return {
        game: initGameState(),
        ui: {
            openScreen: Screen.Battle,
            screenParameters: null,
            selectedTargets: [],
            abilityPending: null,
            targetSelectionMode: null,
            selectedUnit: null,
            selectedHandCard: null,
        },
    };
}

export function loadState(): FullState {
    const savedData = localStorage.getItem("mmartifact") || "nope"
    if (!savedData || savedData === "undefined" || savedData === "nope") {
      return getNewState()
    } else {
      const parsedData = JSON.parse(savedData)
      return parsedData
    }
}
  
export function saveState() {
    const savedData = get(State);
    localStorage.setItem("mmartifact", JSON.stringify(savedData))
}

export function printState() {
    console.log(get(State));
}

export function resetState() {
    State.initialize();
    saveState();
}

export function tempTest() {
    State.tempTest();
}

export function passRound() {
    State.passRound();
}

window.onbeforeunload = () => {
    //saveState();
};

window.onkeypress = handleKeyPress;
