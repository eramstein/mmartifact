import { GameState } from "../game";
import { damageUnit, healUnit, Unit } from "./unit";
import { playAiRound, OpenAction, ActionType, OpenActionType } from "./ai/ai";
import { getTemplate, Card } from "./card";
import { getEmptyPosCountInRegion } from "./board";

export const CARDS_DRAW_PER_TURN = 3;

export function nextTurn(gs : GameState) {
    console.log("nextTurn");    
    
    gs.battle.turn++;
    gs.battle.round = 1;
    gs.battle.playersRound = true;
    gs.battle.playerPassed = false;
    gs.battle.foePassed = false;

    applyTurnEffects(gs);
    resetTurnEffects(gs);
    drawCards(gs);

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
        if (isActionLeft(gs, true).length === 0) {
            pass(gs, true);
        }        
    } else {
        playAiRound(gs);
    }
}


export function isActionLeft(gs : GameState, isPlayer : boolean) : OpenAction[] {
    const openActions = [];
    const player = isPlayer ? gs.battle.player : gs.battle.foe;
    let maxGold = -1;
    player.towers.forEach(t => {
        if (t.gold > maxGold && (isPlayer || getEmptyPosCountInRegion(gs, t.pos, false) > 0)) {
            maxGold = t.gold;
        }
    });
    player.board.forEach(u => {        
        if (u.exhausted === false) {
            openActions.push({ type: OpenActionType.Unit, entity: u });
        }
    });
    player.hand.forEach((c, i) => {
        const template = getTemplate(c);
        if (template.cost <= maxGold) {
            openActions.push({ type: OpenActionType.PlayCard, entity: i });
        }
    });    
    return openActions;
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

function drawCards(gs : GameState) {
    if (gs.battle.player.deck.length <= gs.battle.player.hand.length) {
        gs.battle.player.hand = gs.battle.player.hand.concat(gs.battle.player.deck);
        gs.battle.player.deck = [];        
    } else {
        gs.battle.player.hand = gs.battle.player.hand.concat(gs.battle.player.deck.slice(0, CARDS_DRAW_PER_TURN));
        gs.battle.player.deck = gs.battle.player.deck.slice(CARDS_DRAW_PER_TURN);
    }
    if (gs.battle.foe.deck.length <= gs.battle.foe.hand.length) {
        gs.battle.foe.hand = gs.battle.foe.hand.concat(gs.battle.foe.deck);
        gs.battle.foe.deck = [];        
    } else {
        gs.battle.foe.hand = gs.battle.foe.hand.concat(gs.battle.foe.deck.slice(0, CARDS_DRAW_PER_TURN));
        gs.battle.foe.deck = gs.battle.foe.deck.slice(CARDS_DRAW_PER_TURN);
    }
}