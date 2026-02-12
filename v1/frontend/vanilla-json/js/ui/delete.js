import { displayUpdatedList } from "../main.js";
import * as database from "../data/database.js";

function showDeleteDialog(animal) {
  const dialog = document.querySelector("dialog#delete-dialog");
  dialog.querySelector("#delete-name").textContent = animal.name;
  dialog.querySelector("#delete-cancel").addEventListener("click", () => dialog.close());

  const form = document.querySelector("#delete-form");
  form.onsubmit = event => confirmDelete(animal);

  dialog.showModal();
}

async function confirmDelete(animal) {
  await database.deleteAnimal(animal.id);

  displayUpdatedList();
}

export { showDeleteDialog };
