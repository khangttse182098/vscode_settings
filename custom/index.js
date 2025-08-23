// Function to update the VIM mode based on the ariaLabel
function updateVimMode(vim_lable_cmd) {
  const target = vim_lable_cmd.firstChild;
  const ariaLabel = target.ariaLabel;

  let newText = "";
  let newClass = "";

  if (ariaLabel === "-- INSERT --") {
    newText = "INSERT";
    newClass = "insert-mode";
  } else if (ariaLabel === "-- NORMAL --") {
    newText = "NORMAL";
    newClass = "normal-mode";
  } else if (ariaLabel === "-- VISUAL --") {
    newText = "VISUAL";
    newClass = "visual-mode";
  } else if (ariaLabel === "-- VISUAL LINE --") {
    newText = "VISUAL LINE";
    newClass = "visual-mode";
  } else if (ariaLabel === "-- VISUAL BLOCK --") {
    newText = "VISUAL BLOCK";
    newClass = "visual-mode";
  } else {
    newText = target.textContent; // leave unchanged
    newClass = "action-mode";
  }

  // Only update if something actually changed (prevents infinite loops)
  if (target.textContent !== newText) {
    target.textContent = newText;
  }

  target.className = newClass;
}

document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const vim_lable_cmd = document.getElementById("vscodevim.vim.primary");

    if (vim_lable_cmd) {
      // Initial setup
      updateVimMode(vim_lable_cmd);

      // Watch only ariaLabel changes (no need for childList/subtree)
      const observer_vim = new MutationObserver(() => {
        updateVimMode(vim_lable_cmd);
      });

      observer_vim.observe(vim_lable_cmd.firstChild, {
        attributes: true,
        attributeFilter: ["aria-label"], // correct attribute to watch
      });

      // Stop global observer after found
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
