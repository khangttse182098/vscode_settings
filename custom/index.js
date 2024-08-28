//vim stuff

// Function to update the VIM mode based on the ariaLabel
function updateVimMode(vim_lable_cmd) {
  const ariaLabel = vim_lable_cmd.firstChild.ariaLabel;

  if (ariaLabel === "-- INSERT --") {
    vim_lable_cmd.firstChild.textContent = "INSERT";
    vim_lable_cmd.firstChild.classList.add("insert-mode");
    vim_lable_cmd.firstChild.classList.remove(
      "normal-mode",
      "action-mode",
      "visual-mode"
    );
  } else if (ariaLabel === "-- NORMAL --") {
    vim_lable_cmd.firstChild.textContent = "NORMAL";
    vim_lable_cmd.firstChild.classList.add("normal-mode");
    vim_lable_cmd.firstChild.classList.remove(
      "insert-mode",
      "action-mode",
      "visual-mode"
    );
  } else if (
    ariaLabel === "-- VISUAL --" ||
    ariaLabel === "-- VISUAL LINE --" ||
    ariaLabel === "-- VISUAL BLOCK --"
  ) {
    if (ariaLabel === "-- VISUAL --") {
      vim_lable_cmd.firstChild.textContent = "VISUAL";
    } else if (ariaLabel === "-- VISUAL LINE --") {
      vim_lable_cmd.firstChild.textContent = "VISUAL LINE";
    } else if (ariaLabel === "-- VISUAL BLOCK --") {
      vim_lable_cmd.firstChild.textContent = "VISUAL BLOCK";
    }

    vim_lable_cmd.firstChild.classList.add("visual-mode");
    vim_lable_cmd.firstChild.classList.remove(
      "insert-mode",
      "action-mode",
      "normal-mode"
    );
  } else {
    vim_lable_cmd.firstChild.classList.add("action-mode");
    vim_lable_cmd.firstChild.classList.remove(
      "insert-mode",
      "visual-mode",
      "normal-mode"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutationsList, observer) => {
    const vim_lable_cmd = document.getElementById("vscodevim.vim.primary");
    if (vim_lable_cmd) {
      // Initial setup based on the current state
      updateVimMode(vim_lable_cmd);

      // Observe changes in the element's attributes or children
      const observer_vim = new MutationObserver(() => {
        updateVimMode(vim_lable_cmd);
      });

      observer_vim.observe(vim_lable_cmd.firstChild, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
        attributeFilter: ["textContent"],
      });

      // Stop the observer once the element is found and processed
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
