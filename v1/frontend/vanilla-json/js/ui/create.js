import { displayUpdatedList } from "../main.js";
import * as database from "../data/database.js";

function showCreateDialog(event) {
  const dialog = document.querySelector("dialog#create-dialog");
  document.querySelector("#create-form").addEventListener("submit", submitCreateForm);
  dialog.showModal();
}

async function submitCreateForm(event) {
  console.log("Submit create form");

  const form = event.target;
  const inputs = form.elements;

  const animal = {
    name: inputs.name.value,
    desc: inputs.desc.value,
    type: inputs.type.value,
    age: Number(inputs.age.value),
    winner: inputs.winner.checked,
    star: inputs.star.checked,
  };

  await database.createAnimal(animal);

  displayUpdatedList();
}

export { showCreateDialog };
