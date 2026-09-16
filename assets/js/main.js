(function () {
  const form = document.getElementById("dialForm");
  const phoneInput = document.getElementById("phoneNumber");
  const hint = document.getElementById("dialHint");
  const pasteButton = document.getElementById("pasteButton");

  const defaultHint = hint.textContent;

  const setHint = (message, isError) => {
    hint.textContent = message;
    hint.classList.toggle("is-error", Boolean(isError));
    phoneInput.classList.toggle("is-error", Boolean(isError));
  };

  const clearError = () => {
    if (hint.classList.contains("is-error")) {
      setHint(defaultHint, false);
    }
  };

  phoneInput.addEventListener("input", clearError);

  // Strip everything except digits (removes +, spaces, hyphens, parentheses).
  const cleanNumber = value => value.replace(/\D/g, "");

  const sendMessage = cleanedNumber => {
    window.location.href = "https://api.whatsapp.com/send?phone=" + cleanedNumber;
  };

  // Reads the clipboard and hands the text back, or reports why it couldn't.
  const readClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      setHint("Clipboard access isn't available in this browser. Please paste manually.", true);
      phoneInput.focus();
      return Promise.reject();
    }

    return navigator.clipboard.readText().catch(() => {
      setHint("Couldn't read the clipboard. Please paste manually.", true);
      phoneInput.focus();
      return Promise.reject();
    });
  };

  // Submit -> clean the number and hand it to the WhatsApp Web API. An empty
  // field falls back to the clipboard, as the hint under the button promises.
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const typedNumber = cleanNumber(phoneInput.value);

    if (typedNumber) {
      sendMessage(typedNumber);
      return;
    }

    readClipboard().then(text => {
      const cleaned = cleanNumber(text);

      if (!cleaned) {
        setHint("Enter a number with its country code, or copy one first.", true);
        phoneInput.focus();
        return;
      }

      clearError();
      sendMessage(cleaned);
    }, () => {});
  });

  // Paste button -> load the number from the clipboard.
  pasteButton.addEventListener("click", function () {
    readClipboard().then(text => {
      phoneInput.value = text.trim();
      phoneInput.focus();
      clearError();
    }, () => {});
  });
})();
