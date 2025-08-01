document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("crumb-list");
  const clearBtn = document.getElementById("clear");

  chrome.storage.local.get({ trail: [] }, (data) => {
    data.trail.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = item.title;
      a.href = item.url;
      a.target = "_blank";
      li.appendChild(a);
      list.appendChild(li);
    });
  });

  clearBtn.onclick = () => {
    chrome.storage.local.set({ trail: [] }, () => {
      list.innerHTML = "";
    });
  };
});
