import { get, writable } from "svelte/store";
import { GameState, initGameState } from "./engine/game";
import { handleKeyPress } from "./keybinds";
import { Screen, FullState } from "./ui/model";
import { activateAbility } from "./ui/game/battle/ability";
import { clickBoardUnit, clickHandUnit } from "./ui/game/battle/unit";
import { pass } from "./engine/battle/turn";

export const State = createFullState();

function createFullState() {
    const initialState = getNewState();

    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        update,
        set,
        initialize: () => set(getNewState()),
        load: data => set(data),
        tempTest: () => update(s => { return s; }),

        passRound: () => update(s => { pass(s.game, true); return s; }),
        activateAbility: (unit, ability) => update(s => { activateAbility(s.game, s.ui, unit, ability); return s; }),
        clickBoardUnit: (unit) => update(s => { clickBoardUnit(s.game, s.ui, unit); return s; }),
        clickHandUnit: (unit) => update(s => { clickHandUnit(s.game, s.ui, unit); return s; }),
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
        },
    };
}

let db;
const request = window.indexedDB.open("horde", 1);
request.onerror = function (event) {
    console.log('The database failed to open');
};
request.onsuccess = function (event) {    
    db = request.result;
    loadState(); 
};
request.onupgradeneeded = function(event) {
    db = request.result;
    db.createObjectStore('state', { keyPath: 'id' });
}

function loadState() {
    const transaction = db.transaction(['state']);
    const objectStore = transaction.objectStore('state');
    let request = objectStore.get(1);

    request.onerror = function(event) {
        console.log('Failure while loading data', event.target);
    };

    request.onsuccess = function(event) {
        if (request.result) {            
            State.load(request.result.state);   
        } else {
          console.log('No data record');
        }
    };
}

export function saveState() {
    const savedData = get(State);

    const request = db.transaction(['state'], 'readwrite')
        .objectStore('state')
        .put({ id: 1, state: savedData });
    request.onerror = function (event) {
        console.log('Failure while saving data', event.target);
    }
    request.onsuccess = function(event) {
        console.log("Data saved");
    };
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
