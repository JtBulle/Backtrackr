const getTitle = () => {
  const h1 = document.querySelector("h1");
  return document.title || (h1 && h1.innerText.trim() ? h1.innerText.trim() : "(no title)");
};

const domain = new URL(location.href).hostname;

const title = `${getTitle()} - ${domain}`;

chrome.runtime.sendMessage({
  type: "NEW_LINK",
  url: location.href,
  title: title,
});
