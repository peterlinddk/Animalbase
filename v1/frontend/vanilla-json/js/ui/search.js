import { displayUpdatedList } from "../main.js";

let searchTerm = "";
let searchType = "all";

function selectSearch(event) {
  const enteredTerm = document.querySelector("#searchField").value.toLowerCase().trim();
  const selectedType = document.querySelector("#searchType").value;

  // The selectSearch gets a lot of events, so only continue if actually changed
  if (enteredTerm !== searchTerm || selectedType !== searchType) {
    setSearch(enteredTerm, selectedType);
    displayUpdatedList();
  }
}

function setSearch(term, type) {
  searchTerm = term;
  searchType = type;
}

function searchList(animals) {
  if (searchTerm.length === 0) {
    return animals;
  } else if (searchType === "all") {
    return animals.filter(animal => Object.values(animal).some(value => value.toString().toLowerCase().includes(searchTerm)));
  } else {
    return animals.filter(animal => animal[searchType].toString().toLowerCase().includes(searchTerm));
  }
}

export { selectSearch, searchList };
