import { Unit, newUnit } from "./unit";
import { DataUnits } from "../../data/units";
import { REGION_COLUMNS, REGION_LINES } from "./board";
import { Tower, TOWER_HP, TOWER_GOLD_INIT, initTowers } from "./tower";
import { Card, CardType } from "./card";
import { initPlayerDeck, initFoeDeck } from "./init";

const INIT_HAND_SIZE = 4;

export interface BattleState {
    turn: number,
    round: number,
    playersRound: boolean,
    playerPassed: boolean,
    foePassed: boolean,
    player: PlayerState,
    foe: PlayerState,
    winState: WinState,
}

export interface PlayerState {
    board: Unit[],
    hand: Card[],
    deck: Card[],
    graveyard: Card[],
    towers: Tower[],
}

export enum WinState {
    Playing = "PLAYING",
    Won = "WON",
    Lost = "LOST",
}

export function initBattleState() : BattleState {
    const playerDeck = initPlayerDeck.slice(INIT_HAND_SIZE);
    const foeDeck = initFoeDeck.slice(INIT_HAND_SIZE);
    const playerHand = initPlayerDeck.slice(0, INIT_HAND_SIZE);
    const foeHand = initFoeDeck.slice(0, INIT_HAND_SIZE);

    return {
        turn: 0,
        round: 0,
        playersRound: true,
        playerPassed: false,
        foePassed: false,
        player: {
            board : [],
            hand : playerHand,
            deck : playerDeck,
            graveyard : [],
            towers: initTowers(true),
        },
        foe: {
            board : [],
            hand : foeHand,
            deck : foeDeck,
            graveyard : [],
            towers: initTowers(false),
        },
        winState: WinState.Playing,
    }
}