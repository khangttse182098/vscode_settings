// Function to update the VIM mode based on the ariaLabel
function updateVimMode(vim_lable_cmd) {
  try {
    if (!vim_lable_cmd || !vim_lable_cmd.firstChild) return;

    const target = vim_lable_cmd.firstChild;
    const ariaLabel = target.ariaLabel || "";

    let newText = target.textContent; // default: leave unchanged
    let newClass = "action-mode";

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
    }

    // Update only if changed
    if (target.textContent !== newText) {
      target.textContent = newText;
    }
    if (target.className !== newClass) {
      target.className = newClass;
    }
  } catch (err) {
    console.error("Error in updateVimMode:", err);
  }
}

function runMyScript() {
  try {
    const targetDiv = document.querySelector(".monaco-workbench");
    if (!targetDiv) return;

    document.getElementById("command-blur")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "command-blur";

    // click to dismiss with animation
    overlay.addEventListener("click", () => handleEscape());

    targetDiv.appendChild(overlay);

    // trigger transition after append
    requestAnimationFrame(() => {
      overlay.classList.add("visible");
    });

    toggleWidgets(false);
  } catch (err) {
    console.error("Error in runMyScript:", err);
  }
}

function handleEscape() {
  try {
    const overlay = document.getElementById("command-blur");
    if (overlay) {
      overlay.classList.remove("visible");
      // remove after transition ends
      overlay.addEventListener("transitionend", () => overlay.remove(), {
        once: true,
      });
    }
    toggleWidgets(true);
  } catch (err) {
    console.error("Error in handleEscape:", err);
  }
}

function toggleWidgets(show) {
  try {
    const stickyWidgets = document.querySelectorAll(".sticky-widget");
    stickyWidgets.forEach((w) => (w.style.zIndex = show ? 4 : 0));

    const treeWidget = document.querySelector(".monaco-tree-sticky-container");
    if (treeWidget) treeWidget.style.zIndex = show ? 4 : 0;
  } catch (err) {
    console.error("Error in toggleWidgets:", err);
  }
}

function waitForElement(selector, callback) {
  const el = document.querySelector(selector);
  if (el) return callback(el);

  const observer = new MutationObserver(() => {
    try {
      const el = document.querySelector(selector);
      if (el) {
        callback(el);
        observer.disconnect();
      }
    } catch (err) {
      console.error("Error in waitForElement:", err);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", () => {
  // Blur effect for command palette
  waitForElement(".quick-input-widget", (commandDialog) => {
    try {
      if (commandDialog.style.display !== "none") runMyScript();

      const observer = new MutationObserver(() => {
        try {
          if (commandDialog.style.display === "none") {
            handleEscape();
          } else {
            runMyScript();
          }
        } catch (err) {
          console.error("Error in commandDialog observer:", err);
        }
      });

      observer.observe(commandDialog, {
        attributes: true,
        attributeFilter: ["style"],
      });
    } catch (err) {
      console.error("Error setting up commandDialog observer:", err);
    }
  });

  // Key bindings
  document.addEventListener(
    "keydown",
    (event) => {
      try {
        if ((event.metaKey || event.ctrlKey) && event.key === "p") {
          runMyScript();
        } else if (event.key === "Escape" || event.key === "Esc") {
          handleEscape();
        }
      } catch (err) {
        console.error("Error in keydown handler:", err);
      }
    },
    true
  );

  // Sidebar title observer
  const observerTitle = new MutationObserver(() => {
    try {
      const fe_title_container = document.querySelector(
        "#workbench\\.parts\\.sidebar > div.composite.title"
      );
      if (fe_title_container) {
        observerTitle.disconnect();
      }
    } catch (err) {
      console.error("Error in observerTitle:", err);
    }
  });
  observerTitle.observe(document.body, { childList: true, subtree: true });

  // VIM mode observer
  const observer = new MutationObserver(() => {
    try {
      const vim_lable_cmd = document.getElementById("vscodevim.vim.primary");
      if (vim_lable_cmd) {
        updateVimMode(vim_lable_cmd);

        const observer_vim = new MutationObserver(() => {
          try {
            updateVimMode(vim_lable_cmd);
          } catch (err) {
            console.error("Error in observer_vim:", err);
          }
        });

        observer_vim.observe(vim_lable_cmd.firstChild, {
          attributes: true,
          attributeFilter: ["aria-label"],
        });

        observer.disconnect();
      }
    } catch (err) {
      console.error("Error in vim observer:", err);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
