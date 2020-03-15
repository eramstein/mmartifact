import { Unit, newUnit } from "./unit";
import { DataUnits } from "../../data/units";
import { REGION_COLUMNS, REGION_LINES } from "./board";
import { Tower, TOWER_HP, TOWER_GOLD_INIT, initTowers } from "./tower";

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
    hand: Unit[],
    towers: Tower[],
}

export enum WinState {
    Playing = "PLAYING",
    Won = "WON",
    Lost = "LOST",
}

export function initBattleState() : BattleState {
    const playerBoardUnits = [DataUnits.Bob].map(newUnit);
    const foeBoardUnits = [DataUnits.Bob].map(newUnit);
    let playerBoard = [];
    let foeBoard = [];

    playerBoardUnits.forEach((u, i) => {
        u.pos = {
            region: i % 3,
            line: i % (REGION_COLUMNS * REGION_LINES/2) + REGION_LINES/2,
            column: i % REGION_COLUMNS,
        };
        u.owned = true;
        playerBoard.push(u);
    });
    foeBoardUnits.forEach((u, i) => {
        u.pos = {
            region: i % 3,
            line: i % (REGION_COLUMNS * REGION_LINES/2),
            column: i % REGION_COLUMNS,
        };
        foeBoard.push(u);
    });    

    return {
        turn: 0,
        round: 0,
        playersRound: true,
        playerPassed: false,
        foePassed: false,
        player: {
            board : playerBoard,
            hand : [],
            towers: initTowers(true),
        },
        foe: {
            board : foeBoard,
            hand : [],
            towers: initTowers(false),
        },
        winState: WinState.Playing,
    }
}