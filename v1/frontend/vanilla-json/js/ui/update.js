import { displayUpdatedList } from "../main.js";
import * as database from "../data/database.js";

async function showUpdateDialog(animal) {
  const dialog = document.querySelector("dialog#update-dialog");
  const form = document.querySelector("#update-form");

  // Get animal from database - preserve id
  const id = animal.id;
  animal = await database.getAnimal(id);
  animal.id = id;

  form.name.value = animal.name;
  form.type.value = animal.type;
  form.desc.value = animal.desc;
  form.age.value = animal.age;
  form.star.checked = animal.star;
  form.winner.checked = animal.winner;

  // can't use addeventlistener here, because we want to replace existing event listeners
  form.onsubmit = event => submitUpdateForm(event, animal);
  dialog.showModal();
}

async function submitUpdateForm(event, animal) {
  const form = event.target;

  animal.name = form.name.value != "" ? form.name.value : animal.name;
  animal.type = form.type.value != "" ? form.type.value : animal.type;
  animal.desc = form.desc.value != "" ? form.desc.value : animal.desc;
  // use Number.isNaN because an empty field should be NaN, not 0
  animal.age = !Number.isNaN(form.age.valueAsNumber) ? form.age.valueAsNumber : animal.age;

  animal.star = form.star.checked;
  animal.winner = form.winner.checked;

  await database.updateAnimal(animal.id, animal);

  displayUpdatedList();
}

async function toggleProperty(animal, property) {
  animal[property] = !animal[property];

  await database.patchAnimal(animal.id, property, animal[property]);
  displayUpdatedList();
}

export { showUpdateDialog, toggleProperty };
