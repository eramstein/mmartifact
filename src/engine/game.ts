import { BattleState, initBattleState } from "./battle/battle";
import { nextTurn } from "./battle/turn";

export interface GameState {
    battle: BattleState,
}

export function initGameState(): GameState {

    const gameState: GameState = {
        battle: initBattleState(),
    };

    nextTurn(gameState);
    
    return gameState;
}
