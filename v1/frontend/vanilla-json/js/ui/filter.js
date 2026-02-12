import { displayUpdatedList } from "../main.js";

let currentFilter = "*";

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);

  setFilter(filter);
  displayUpdatedList();
}

function setFilter(filter) {
  currentFilter = filter;
}

function filterList(animals) {
  return animals.filter(animal => currentFilter === "*" || currentFilter.includes(":")?animal[currentFilter.split(":")[0]]==currentFilter.split(":")[1]:animal[currentFilter]); 
}

export { selectFilter, filterList }