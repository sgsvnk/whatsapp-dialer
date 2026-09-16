/* Theme switch — Auto follows the system, Light/Dark override it and persist.
   Loaded synchronously in <head> so a stored choice lands on <html> before the
   first paint; the switch itself is wired once the DOM is ready. */
(function () {
  const STORAGE_KEY = "wa-dialer-theme";
  const GROUND = { light: "#f3f2f2", dark: "#171615" };
  const root = document.documentElement;

  // Anything other than an explicit choice means "follow the system".
  const storedChoice = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : "auto";
    } catch (error) {
      return "auto";
    }
  };

  const store = choice => {
    try {
      if (choice === "auto") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, choice);
      }
    } catch (error) {
      /* Private mode — the choice still applies for this visit. */
    }
  };

  // This runs before <body> exists, so only the root attribute can be set here.
  // With it absent, the stylesheet's prefers-color-scheme query decides.
  const applyRoot = choice => {
    if (choice === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", choice);
    }
  };

  applyRoot(storedChoice());

  const whenReady = callback => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  };

  whenReady(function () {
    const switchEl = document.getElementById("themeSwitch");
    if (!switchEl) {
      return;
    }

    const options = Array.prototype.slice.call(switchEl.querySelectorAll(".theme-opt"));
    const metaLight = document.getElementById("themeColorLight");
    const metaDark = document.getElementById("themeColorDark");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = choice => {
      applyRoot(choice);

      // Both meta tags get the colour that is actually on screen, so whichever
      // one the system matches paints the browser chrome correctly.
      const resolved = choice === "auto" ? (systemDark.matches ? "dark" : "light") : choice;
      metaLight.content = GROUND[resolved];
      metaDark.content = GROUND[resolved];

      options.forEach(option => {
        const input = option.querySelector("input");
        input.checked = input.value === choice;
        option.classList.toggle("is-active", input.checked);
      });
    };

    switchEl.addEventListener("change", function (event) {
      store(event.target.value);
      apply(event.target.value);
    });

    // On Auto, follow the system if it flips while the page is open.
    const followSystem = () => {
      if (storedChoice() === "auto") {
        apply("auto");
      }
    };

    if (systemDark.addEventListener) {
      systemDark.addEventListener("change", followSystem);
    } else {
      systemDark.addListener(followSystem);
    }

    apply(storedChoice());
  });
})();
