<script>
    import { State } from '../../../stores';
    
    export let unit;

</script>

<style>
    .hand-unit {
        background-color: rgb(83, 83, 83);
        height: 100%;
        border: 1px solid #ccc;
        border-radius: 6px;
        color: white;
        padding: 2px 20px;
    }
</style>

<div class="hand-unit" on:click={() => State.clickHandUnit(unit)}>
    {unit.name}
</div>
