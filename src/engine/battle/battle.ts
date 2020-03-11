import { Unit, newUnit } from "./unit";
import { DataUnits } from "../../data/units";
import { REGION_COLUMNS, REGION_LINES } from "./board";

export interface BattleState {
    turn: number,
    round: number,
    playersRound: boolean,
    playerPassed: boolean,
    foePassed: boolean,
    player: {
        board: Unit[],
        hand: Unit[],
    },
    foe: {
        board: Unit[],
        hand: Unit[],
    },
}

export function initBattleState() : BattleState {
    const playerBoardUnits = [DataUnits.Bob].map(newUnit);
    const foeBoardUnits = [DataUnits.Bob].map(newUnit);
    let playerBoard = [];
    let foeBoard = [];

    playerBoardUnits.forEach((u, i) => {
        u.pos = {
            region: i % 3 + 1,
            line: i % (REGION_COLUMNS * REGION_LINES/2) + REGION_LINES/2,
            column: i % REGION_COLUMNS,
        };
        u.owned = true;
        playerBoard.push(u);
    });
    foeBoardUnits.forEach((u, i) => {
        u.pos = {
            region: i % 3 + 1,
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
        },
        foe: {
            board : foeBoard,
            hand : [],
        },
    }
}