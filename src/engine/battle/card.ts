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
    const card = gs.battle.player.hand[index];
    const tower = gs.battle.player.towers[pos.region];
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
    const hand = gs.battle.playersRound ? gs.battle.player.hand : gs.battle.foe.hand;
    hand.splice(index, 1);

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