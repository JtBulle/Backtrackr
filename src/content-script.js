const getTitle = () => {
  const h1 = document.querySelector("h1");
  return document.title || (h1 && h1.innerText.trim() ? h1.innerText.trim() : "(no title)");
};

const sendPageInfo = () => {
  const domain = new URL(location.href).hostname;
  const title = `${getTitle()} - ${domain}`;
  if (chrome.runtime?.id) {
    chrome.runtime.sendMessage({
      type: "NEW_LINK",
      url: location.href,
      title: `${title} - ${location.hostname}`,
    });
  }
};

let lastUrl = location.href;
let timer;

sendPageInfo();

const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    clearTimeout(timer);
    timer = setTimeout(sendPageInfo, 1000);
  }
});

observer.observe(document, { childList: true, subtree: true });
