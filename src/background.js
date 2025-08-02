chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type !== "NEW_LINK") return;

  chrome.storage.local.get({ trail: [] }, (data) => {
    const trail = data.trail;

    const exists = trail.some((item) => item.url === msg.url);
    if (!exists) {
      trail.push({
        url: msg.url,
        title: msg.title,
        timestamp: Date.now(),
      });
      chrome.storage.local.set({ trail: trail.slice(-50) });
    }
  });
});
