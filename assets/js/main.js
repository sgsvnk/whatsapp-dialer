(function() {
  const constHeightOfElements = 439;
  const adjustFluidHeight = constHeightOfElements => {
    const fluidHeightLeft = window.innerHeight - constHeightOfElements;
    document.getElementsByClassName("number-row")[0].style.margin = `calc(${fluidHeightLeft}px/3) auto`;
    document.getElementById("submitButton").style.margin = `0 auto calc(${fluidHeightLeft}px/3)`;
  };

  //styler
  adjustFluidHeight(constHeightOfElements);

  // click handler
  document.getElementById("submitButton")
    .addEventListener("click", function(event) {
      event.preventDefault();
      const phoneNumber = document.getElementById("phoneNumber").value;
      if (!phoneNumber) {
        alert("Please enter a valid phone number");
        return;
      }

      const countryCode = document.getElementById("select-country").value;

      window.location.href = "https://api.whatsapp.com/send?phone=" + countryCode + phoneNumber;
    });

  // fethcing countries
  fetch("./json/countries.json")
    .then(response => response.json())
    .then(countriesJson => {
      fetch("https://json.geoiplookup.io")
        .then(response => response.json())
        .then(thisCountryJson => {
          let thisCountryLetterCode = thisCountryJson["country_code"];

          const selectField = document.getElementById("select-country");
          while (selectField.firstChild) {
            selectField.removeChild(selectField.firstChild);
          }

          Object.keys(countriesJson)
            .forEach(countryLetterCode => {
              const country = countriesJson[countryLetterCode];
              const option = document.createElement("option");
              option.text = country.name + " (+" + country.code.replace(/\s/, "-") + ")" ;
              option.value = country.code.replace(/\s/, "");
              option.selected = (country.iso2 === thisCountryLetterCode);

              selectField.appendChild(option);
            });
        });
    });
})();