<script>
  import { onMount } from 'svelte';
  
  let trail = $state([]);
  
  const loadTrail = () => {
    chrome.storage.local.get({ trail: [] }, (data) => {
      trail = data.trail;
    });
  }
  
  const clearTrail = () => {
    chrome.storage.local.set({ trail: [] }, () => {
      trail = [];
    });
  }
  
  const openLink = (url) => {
    chrome.tabs.create({ url });
  }

  onMount(() => {
    loadTrail();
  });
</script>

<main>
  <h2>Backtrackr</h2>
  
  {#if trail.length === 0}
    <p>No breadcrumbs yet. Visit some pages to start tracking!</p>
  {:else}
    <ol>
      {#each trail as item, index}
        <li>
          <button
            class="link-button" 
            onclick={() => openLink(item.url)}
            title={item.url}
          >
            {item.title}
          </button>
        </li>
      {/each}
    </ol>
  {/if}
  
  <button class="clear-button" onclick={clearTrail}>Clear</button>
</main>

<style>
  main {
    padding: 0;
  }
  
  h2 {
    margin: 0 0 15px 0;
    font-size: 18px;
  }
  
  ol {
    margin: 0 0 15px 0;
    padding-left: 20px;
    max-height: 400px;
    overflow-y: auto;
  }
  
  li {
    margin: 8px 0;
  }
  
  .link-button {
    background: none;
    border: none;
    color: #0066cc;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font: inherit;
    text-align: left;
    width: 100%;
    word-wrap: break-word;
  }
  
  .link-button:hover {
    color: #004499;
  }
  
  .clear-button {
    background: #ff4444;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .clear-button:hover {
    background: #cc3333;
  }
  
  p {
    color: #666;
    font-style: italic;
    margin: 20px 0;
  }
</style>
