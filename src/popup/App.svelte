<script>
  import { onMount } from "svelte";

  let trail = $state([]);
  let linkCount = $derived(trail.length);
  let clearButtonText = $state("Clear");
  let copyButtonText = $state("Copy");
  let saveButtonText = $state("Save");

  let clearButtonTimeout;
  let copyButtonTimeout;
  let saveButtonTimeout;

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
    if (trail.length === 0) return;
    if (clearButtonTimeout) clearTimeout(clearButtonTimeout);
    chrome.storage.local.set(
      {
        trail: [],
      },
      () => {
        trail = [];
      },
    );
    clearButtonText = "Done!";
    clearButtonTimeout = setTimeout(() => {
      clearButtonText = "Clear";
    }, 2000);
  };

  const openLink = (url) => {
    chrome.tabs.create({ url });
  };

  const copyToClipboard = async () => {
    if (trail.length === 0) return;
    if (copyButtonTimeout) clearTimeout(copyButtonTimeout);
    const urls = trail
      .map((item) => `${formatDate(item.timestamp)} - ${item.title} - ${item.url}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(urls);
      copyButtonText = "Done!";
    } catch (e) {
      copyButtonText = "Error!";
    }
    copyButtonTimeout = setTimeout(() => {
      copyButtonText = "Copy";
    }, 2000);
  };

  const saveFile = async () => {
    if (trail.length === 0) return;
    if (saveButtonTimeout) clearTimeout(saveButtonTimeout);

    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "backtrackr_trail",
        types: [
          {
            description: "Text File",
            accept: { "text/plain": [".txt"] },
          },
          {
            description: "CSV File",
            accept: { "text/csv": [".csv"] },
          },
        ],
      });

      const fileName = fileHandle.name || "";
      const isCSV = fileName.toLowerCase().endsWith(".csv");

      let content;
      let type;

      if (isCSV) {
        content = [
          "Date, Title, URL",
          ...trail.map((item) => {
            const modifiedTitle = item.title.replace(/"/g, '""');
            return `"${formatDate(item.timestamp)}","${modifiedTitle}","${item.url}"`;
          }),
        ].join("\n");
        type = "text/csv";
      } else {
        content = trail
          .map((item) => `${formatDate(item.timestamp)} - ${item.title} - ${item.url}`)
          .join("\n");
        type = "text/plain";
      }

      const writable = await fileHandle.createWritable();
      await writable.write(new Blob([content], { type: type }));
      await writable.close();

      saveButtonText = "Done!";
    } catch (e) {
      if (e.name === "AbortError") {
        return;
      }
      saveButtonText = "Error!";
    }

    saveButtonTimeout = setTimeout(() => {
      saveButtonText = "Save";
    }, 2000);
  };

  onMount(() => {
    loadTrail();
  });
</script>

<main class="bg-bg-dark p-4 font-mono">
  <div class="mb-3 flex flex-row items-center justify-between pr-4">
    <h2 class="text-xl font-bold text-text">Backtrackr</h2>
    <h2 class="text-base text-text">{linkCount}/50</h2>
  </div>

  {#if trail.length === 0}
    <p class="text-base text-text-muted italic">
      No links yet. Visit some pages to start tracking!
    </p>
  {:else}
    <ol
      class="max-h-96 list-inside list-decimal overflow-y-auto pr-3 text-text [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-text [&::-webkit-scrollbar-track]:border-2 [&::-webkit-scrollbar-track]:border-text [&::-webkit-scrollbar-track]:bg-bg-dark"
    >
      {#each trail as item}
        <li class="my-2">
          <a
            class="cursor-pointer text-base break-words text-text underline hover:text-text-muted"
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

  <div class="flex flex-row justify-start gap-4">
    <button class="button-style" onclick={clearTrail}>{clearButtonText}</button>
    <button class="button-style" onclick={copyToClipboard}>{copyButtonText}</button>
    <button class="button-style" onclick={saveFile}>{saveButtonText}</button>
  </div>
</main>
