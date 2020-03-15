<script>
    import { fly } from 'svelte/transition';

    import { State } from '../../../stores';
    import { DELAYS } from './config';
    import { REGION_COUNT, REGION_LINES, REGION_COLUMNS } from '../../../engine/battle/board';
    import Unit from './Unit.svelte';
    import HandUnit from './HandUnit.svelte';
    import Tower from './Tower.svelte';
    
    $: battle = $State.game.battle;
    $: abilityPending = $State.ui.abilityPending;
    $: playerHasInit = battle.playersRound;
    $: units = battle.foe.board.concat(battle.player.board);
    $: passed = battle.foePassed ? 'passed' : '';

    let CELL_WIDTH = 125;
    let CELL_HEIGHT = 180;
    let REGION_PADDING = 30;
    let LINE_PADDING = 20;  

    let cells = [];
    for (let r = 0; r < REGION_COUNT; r++) {        
        for (let l = 0; l < REGION_LINES; l++) {        
            for (let c = 0; c < REGION_COLUMNS; c++) {        
                cells.push({
                    pos: { region: r, column: c, line: l },
                    x: r * REGION_COLUMNS * CELL_WIDTH + r * REGION_PADDING + c * CELL_WIDTH,
                    y: l * CELL_HEIGHT + (l >= REGION_LINES/2 ? LINE_PADDING : 0),
                });
            }
        }
    }   

</script>

<style>
    .battle {
        display: flex;
        width: 100%;
        background-color: dimgray;
    }
    .board {
        position: relative;
        padding-left: 100px;
    }
    .cell {
        position: absolute;
        background-color: #f3f3f3;
        border: 1px solid #ccc;
    }
    .unit-container {
        position: absolute;
    }
    .hand-row {
        display: flex;
        padding: 20px 0px;
    }
    .tower-row {
        position: relative;
        height: 60px;
    }
    .initiative-coin {
        position: absolute;
        left: -75px;
        border-radius: 100px;
        width: 50px;
        height: 45px;
        background-color: #f3f3f3;
        text-align: center;
        font-size: 26px;
        cursor: pointer;
        padding-top: 5px;
    }
    .initiative-coin:hover {
        background-color: #c46e27;
    }
    .passed {
        position: absolute;
        left: -75px;
        color: white;
    }
</style>

<div class="battle">    
    <div class="board">
        <div>Turn {battle.turn} Round {battle.round} {battle.playersRound ? 'Players Round' : ''}</div>
        <div class="hand-row">
            {#each battle.foe.hand as unit (unit.id) }
            <HandUnit unit={unit}>
            </HandUnit>
            {/each}
        </div>
        <div class="tower-row">
            {#each battle.foe.towers as tower,i }
            <Tower tower={tower} i={i} isPlayer={false} cellWidth={CELL_WIDTH} cellHeight={CELL_HEIGHT} regionPadding={REGION_PADDING} linePadding={LINE_PADDING}>
            </Tower>
            {/each}
        </div>
        <div class="board">
            <div class="initiative-coin"
                 on:click={() => State.passRound()}
                style="top:{playerHasInit ? 3 * CELL_HEIGHT - 5 : CELL_HEIGHT}px;">
            </div>
            <div class="passed"
                style="top:{CELL_HEIGHT - 10}px;">
                { passed }
            </div>
            {#each cells as cell }
                <div class="cell"
                     on:click={() => State.clickCell(cell.pos)}
                    style="width: {CELL_WIDTH}px;height: {CELL_HEIGHT}px;top: {cell.y}px;left: {cell.x}px;">
                </div>
            {/each}
            {#each units as unit (unit.id) }
            <div class="unit-container"
                out:fly="{{ duration: 400, delay: DELAYS.UNIT_IN, y: -100 }}" in:fly="{{ duration: 400, delay: DELAYS.UNIT_IN, y: - 100 }}"
                style="
                    transition: 750ms ease-in-out;
                    width: {CELL_WIDTH}px;
                    height: {CELL_HEIGHT}px;
                    top: {unit.pos.line * CELL_HEIGHT + (unit.pos.line >= REGION_LINES/2 ? LINE_PADDING : 0)}px;
                    left: {unit.pos.region * REGION_COLUMNS * CELL_WIDTH + unit.pos.region * REGION_PADDING + unit.pos.column * CELL_WIDTH}px;"
                >
                <Unit unit={unit} abilityPending={abilityPending}>
                </Unit>
            </div>
            {/each}
        </div>
        <div class="tower-row">
            {#each battle.player.towers as tower,i }
            <Tower tower={tower} i={i} isPlayer={true} cellWidth={CELL_WIDTH} cellHeight={CELL_HEIGHT} regionPadding={REGION_PADDING} linePadding={LINE_PADDING}>
            </Tower>
            {/each}
        </div>
        <div class="hand-row">
            {#each battle.player.hand as unit (unit.id) }
            <HandUnit unit={unit}>
            </HandUnit>
            {/each}
        </div>
    </div>
</div>

