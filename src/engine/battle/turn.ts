import { GameState } from "../game";
import { damageUnit, healUnit, Unit } from "./unit";
import { playAiRound } from "./ai";

export function nextTurn(gs : GameState) {
    console.log("nextTurn");    
    
    gs.battle.turn++;
    gs.battle.round = 1;
    gs.battle.playersRound = true;
    gs.battle.playerPassed = false;
    gs.battle.foePassed = false;

    applyTurnEffects(gs);
    resetTurnEffects(gs);

}

export function nextRound(gs : GameState, passed : boolean) {

    if (passed === false) {
        if (gs.battle.playersRound) {
            gs.battle.playerPassed = false;
        } else {
            gs.battle.foePassed = false;
        }
    }

    resetRoundBonuses(gs);

    gs.battle.round++;
    gs.battle.playersRound = !gs.battle.playersRound;    
    
    if (gs.battle.playersRound) {
        if (isActionLeftForPlayer(gs) === false) {
            pass(gs, true);
        }        
    } else {
        playAiRound(gs);
    }
}


function isActionLeftForPlayer(gs : GameState) : boolean {
    let actionLeft = false;
    let maxGold = 0;
    gs.battle.player.towers.forEach(t => {
        if (t.gold > maxGold) {
            maxGold = t.gold;
        }
    });
    gs.battle.player.board.forEach(u => {
        if (u.exhausted === false) {
            actionLeft = true;
        }
    });
    gs.battle.player.hand.forEach(u => {
        if (u.cost <= maxGold) {
            actionLeft = true;
        }
    });
    
    return actionLeft;
}

export function pass(gs : GameState, isPlayer : boolean) {
    if (isPlayer) {
        gs.battle.playerPassed = true;
    } else {
        gs.battle.foePassed = true;
    }
    if (gs.battle.playerPassed && gs.battle.foePassed) {
        console.log("both done");
        nextTurn(gs);
        return; 
    }
    nextRound(gs, true);
}

function resetRoundBonuses(gs : GameState) {
    gs.battle.foe.board.forEach(u => { updateTempEffects(u, true) });
    gs.battle.player.board.forEach(u => { updateTempEffects(u, true) });
}

function applyTurnEffects(gs : GameState) {
    const units = gs.battle.player.board.concat(gs.battle.foe.board);
    units.forEach(u => {
        if (u.endOfTurn.dot) {
            damageUnit(gs, u, u.endOfTurn.dot, false);
        }
        if (u.endOfTurn.hot) {
            healUnit(gs, u, u.endOfTurn.hot);
        }
    });
    const towers = gs.battle.player.towers.concat(gs.battle.foe.towers);
    towers.forEach(t => {
        t.goldMax++;
        t.gold = t.goldMax;
    });
}

function resetTurnEffects(gs : GameState) {
    gs.battle.foe.board.forEach(u => { updateTempEffects(u, false) });
    gs.battle.player.board.forEach(u => { updateTempEffects(u, false) });

    gs.battle.foe.board.forEach(u => { updateCC(u) });
    gs.battle.player.board.forEach(u => { updateCC(u) });
}

function updateCC(unit : Unit) {
    unit.cc = {
        mezz: Math.max(unit.cc.mezz - 1, 0),
        stun: Math.max(unit.cc.stun - 1, 0),
        root: Math.max(unit.cc.root - 1, 0),
        dazed: false,
    };
}

function updateTempEffects(unit : Unit, endOfRound : boolean) {
    if (endOfRound) {
        if (unit.endOfRound.atk !== 0) {
            unit.atk -= unit.endOfRound.atk;
        }
        unit.endOfRound.atk = 0;
        unit.endOfRound.damageShield = 0;
    } else {
        if (unit.endOfTurn.atk !== 0) {
            unit.atk -= unit.endOfTurn.atk;
        }
        unit.endOfTurn.atk = 0;
        unit.endOfTurn.damageShield = 0;
        unit.exhausted = false;
    }    
}