const getTitle = () => {
  const h1 = document.querySelector("h1");
  return document.title || (h1 && h1.innerText.trim() ? h1.innerText.trim() : "(no title)");
};

const sendPageInfo = () => {
  const domain = new URL(location.href).hostname;
  const title = `${getTitle()} - ${domain}`;

  chrome.runtime.sendMessage({
    type: "NEW_LINK",
    url: location.href,
    title: title,
  });
};

let lastUrl = location.href;

sendPageInfo();

const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(sendPageInfo, 2000);
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
