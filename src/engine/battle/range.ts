import { GameState } from "../game";
import { Unit } from "./unit";
import { BoardPosition } from "./board";

export enum RangeType {
    All = "ALL",
    Region = "REGION",
};

export function unitsInRange(gs : GameState, target : BoardPosition, range : RangeType) : Unit[] {

    let unitsInRange = [];

    return unitsInRange;
}