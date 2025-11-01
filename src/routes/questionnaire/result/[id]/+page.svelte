<script lang="ts">
  export let data: {
    name: string;
    result: CategoryScore[];
  };
</script>

<h1>{data.name}'s Assessment</h1>

<ul>
  {#each data.result as item}
    <li>{item.category}: {item.score}</li>
  {/each}
</ul>
