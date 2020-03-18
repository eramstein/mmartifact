import { Unit } from "./unit";
import { Tower } from "./tower";
import { Card } from "./card";
import { AiLog } from "./ai/ai";

export interface BattleState {
    turn: number;
    round: number;
    playersRound: boolean;
    playerPassed: boolean;
    foePassed: boolean;
    player: PlayerState;
    foe: PlayerState;
    winState: WinState;
    aiLog: AiLog[];
}

export interface PlayerState {
    board: Unit[];
    hand: Card[];
    deck: Card[];
    graveyard: Card[];
    towers: Tower[];
}

export enum WinState {
    Playing = "PLAYING",
    Won = "WON",
    Lost = "LOST"
}
