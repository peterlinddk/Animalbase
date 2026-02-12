import { showUpdateDialog, toggleProperty } from "./update.js";
import { showDeleteDialog } from "./delete.js";

function displayList(animals) {
  document.querySelector("#list tbody").innerHTML = "";
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set default values
  clone.querySelectorAll("[data-field]").forEach(field => {
    const fieldName = field.dataset.field;
    const value = animal[fieldName];
    field.textContent = value;
  });

  // star custom icon
  if (animal.star === true) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=star]").textContent = "☆";
  }
  
  // winner custom icon
  if (animal.winner === true) {
    clone.querySelector("[data-field=winner]").textContent = "🏆";
  } else {
    clone.querySelector("[data-field=winner]").textContent = "";
  }

  clone.querySelector("tr").addEventListener("click", (event) => {
    const action = event.target.dataset.action ?? "update";
    switch (action) {
      case "update": showUpdateDialog(animal); break;
      case "toggle": toggleProperty(animal, event.target.dataset.field); break;
      case "delete": showDeleteDialog(animal); break;
    }
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

export { displayList };
