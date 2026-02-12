import { displayUpdatedList } from "../main.js";

let sortingBy = "name";
let sortingDirection = "asc";

function selectSort(event) {
  const heading = event.target;

  const sortBy = heading.dataset.sortBy;
  const sortDir = heading.dataset.sortDirection;

  // Show status in UI
  // find "old" selected element, and remove .selected
  const oldHeading = document.querySelector("[data-action=sort].selected");
  oldHeading?.classList.remove("selected");

  // indicate active sort
  heading.classList.add("selected");

  // Toggle direction in ui
  if (sortDir === "asc") {
    heading.dataset.sortDirection = "desc";
  } else {
    heading.dataset.sortDirection = "asc";
  }

  setSort(sortBy, sortDir);

  displayUpdatedList();
}

function setSort(sortBy, sortDir) {
  sortingBy = sortBy;
  sortingDirection = sortDir;
}

function sortList(animals) {
  const order = sortingDirection === "asc" ? 1 : -1;
  return animals.sort((a, b) => (a[sortingBy] == b[sortingBy] ? 0 : a[sortingBy] > b[sortingBy] ? order : -order));
}

export { selectSort, sortList };
