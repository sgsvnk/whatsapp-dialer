(function() {
  document.getElementById("submitButton")
    .addEventListener("click", function(event) {
      event.preventDefault();
      const phoneNumber = document.getElementById("phoneNumber").value;
      const countryCode = document.getElementById("select-country").value;

      window.location.href = "https://api.whatsapp.com/send?phone=" + countryCode + phoneNumber;
    });

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