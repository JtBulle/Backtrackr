<script>
  import { onMount } from "svelte";

  let trail = $state([]);

  const loadTrail = () => {
    chrome.storage.local.get(
      {
        trail: [],
      },
      (data) => {
        trail = data.trail;
      },
    );
  };

  const clearTrail = () => {
    chrome.storage.local.set(
      {
        trail: [],
      },
      () => {
        trail = [];
      },
    );
  };

  const openLink = (url) => {
    chrome.tabs.create({ url });
  };

  onMount(() => {
    loadTrail();
  });
</script>

<main class="bg-bg-dark p-4 font-mono">
  <h2 class="mt-0 mb-3 text-lg font-bold text-text">Backtrackr</h2>

  {#if trail.length === 0}
    <p class="text-text-muted italic">No links yet. Visit some pages to start tracking!</p>
  {:else}
    <ol
      class="max-h-96 list-inside list-decimal overflow-y-auto pr-3 text-text [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-text [&::-webkit-scrollbar-track]:border-2 [&::-webkit-scrollbar-track]:border-text [&::-webkit-scrollbar-track]:bg-bg-dark"
    >
      {#each trail as item, index}
        <li class="my-2">
          <a
            class="cursor-pointer break-words text-text underline hover:text-text-muted"
            href={item.url}
            onclick={(e) => {
              e.preventDefault();
              openLink(item.url);
            }}
            title={item.url}
          >
            {item.title}
          </a>
        </li>
      {/each}
    </ol>
  {/if}

  <button
    class="mt-3 cursor-pointer rounded border-none bg-text px-4 py-2 text-sm text-bg-dark hover:bg-text-muted"
    onclick={clearTrail}>Clear link trail</button
  >
</main>
