const heading = (() => {
  const h1 = document.querySelector("h1");
  if (h1 && h1.innerText.trim()) return h1.innerText.trim();
  return document.title || "(no heading)";
})();

const domain = new URL(location.href).hostname;

const title = `${heading} - ${domain}`;

chrome.runtime.sendMessage({
  type: "NEW_BREADCRUMB",
  url: location.href,
  title: title,
});
