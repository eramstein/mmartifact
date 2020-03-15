<script>
    import { State } from '../../../stores';
    import { REGION_COLUMNS, REGION_LINES } from '../../../engine/battle/board';
    
    export let tower;
    export let cellWidth;
    export let cellHeight;
    export let regionPadding;
    export let linePadding;

</script>

<style>
    .tower-container {
        position: absolute;
        display: flex;
        justify-content: center;
    }
    .tower {
        border-radius: 100px;
        width: 50px;
        height: 45px;
        background-color: #f3f3f3;
        text-align: center;
        font-size: 26px;
        cursor: pointer;
        padding-top: 5px;
    }
    .tower-gold {
        color: white;
        margin-right: 10px;
    }
    .tower-gold-top {
        border-bottom: 1px solid white;
        padding-bottom: 3px;
    }
</style>

<div class="tower-container"
    on:click={() => State.clickTower(tower)}
    style="
        top: 0px;
        width: {REGION_COLUMNS * cellWidth}px;
        top: {tower.isPlayer ? cellHeight * REGION_LINES + linePadding + 12 : 0}px;
        left: {REGION_COLUMNS * cellWidth * tower.pos + tower.pos * regionPadding}px;
    ">
    <div class="tower-gold">
        <div class="tower-gold-top">{tower.gold}</div>
        <div>{tower.goldMax}</div>
    </div>
    <div class="tower">
        {tower.hp}
    </div>
</div>
