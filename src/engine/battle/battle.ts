import { initTowers } from "./tower";
import { initPlayerDeck, initFoeDeck } from "./init";
import { BattleState, WinState } from "./model";

const INIT_HAND_SIZE = 4;

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
        aiLog: [],
    }
}