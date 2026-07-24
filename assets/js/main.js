(function () {
  const form = document.getElementById("dialForm");
  const phoneInput = document.getElementById("phoneNumber");
  const hint = document.getElementById("dialHint");
  const pasteButton = document.getElementById("pasteButton");

  const defaultHint = hint.textContent;

  const setHint = (message, isError) => {
    hint.textContent = message;
    hint.classList.toggle("is-error", Boolean(isError));
  };

  const clearError = () => {
    if (hint.classList.contains("is-error")) {
      setHint(defaultHint, false);
    }
  };

  phoneInput.addEventListener("input", clearError);

  // Strip everything except digits (removes +, spaces, hyphens, parentheses).
  const cleanNumber = value => value.replace(/\D/g, "");

  // Submit -> clean the number and hand it to the WhatsApp Web API.
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const cleaned = cleanNumber(phoneInput.value);

    if (!cleaned) {
      setHint("Please enter a valid WhatsApp number, including the country code.", true);
      phoneInput.focus();
      return;
    }

    window.location.href = "https://api.whatsapp.com/send?phone=" + cleaned;
  });

  // Paste button -> load the number from the clipboard.
  pasteButton.addEventListener("click", function () {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      setHint("Clipboard access isn't available in this browser. Please paste manually.", true);
      phoneInput.focus();
      return;
    }

    navigator.clipboard
      .readText()
      .then(text => {
        phoneInput.value = text.trim();
        phoneInput.focus();
        clearError();
      })
      .catch(() => {
        setHint("Couldn't read the clipboard. Please paste manually.", true);
        phoneInput.focus();
      });
  });
})();
