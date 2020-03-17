import { GameState } from "../game";
import { BoardPosition } from "./board";
import { DataUnits } from "../../data/units";
import { DataImprovements } from "../../data/improvements";
import { DataSpells } from "../../data/spells";
import { summonUnit, Unit } from "./unit";
import { nextRound } from "./turn";

export enum CardType {
    Unit = "UNIT",
    Improvement = "IMPROVEMENT",
    Spell = "SPELL",
}

export interface Card {
    type: CardType,
    name: string,
}

export function playCard(gs : GameState, index : number, pos : BoardPosition) {
    const player = gs.battle.playersRound ? gs.battle.player : gs.battle.foe;
    const card = player.hand[index];
    const tower = player.towers[pos.region];
    const template = getTemplate(card);

    // pay cost
    if (tower.gold >= template.cost) {
        tower.gold -= template.cost;
    } else {
        console.log("Can't play, not enough gold");
        return;
    }

    // play card
    switch (card.type) {
        case CardType.Unit:
            summonUnit(gs, template, pos, gs.battle.playersRound);
            break;
    }

    // remove card from hand
    player.hand.splice(index, 1);

    // pass priority
    nextRound(gs, false);
    
}

export function getTemplate(card : Card) : Unit {
    let template; 
    switch (card.type) {
        case CardType.Unit:
            template = DataUnits[card.name];
            break;
        case CardType.Improvement:
            template = DataImprovements[card.name];
            break;
        case CardType.Spell:
            template = DataSpells[card.name];
            break;
    }
    return template;
}