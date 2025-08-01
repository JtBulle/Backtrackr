const heading = (() => {
  for (let level = 1; level <= 6; level++) {
    const el = document.querySelector(`h${level}`);
    if (el && el.innerText.trim()) return el.innerText.trim();
  }
  return "(no heading)";
})();

const domain = new URL(location.href).hostname;

const title = `${heading} - ${domain}`;

chrome.runtime.sendMessage({
  type: "NEW_BREADCRUMB",
  url: location.href,
  title: title,
});
