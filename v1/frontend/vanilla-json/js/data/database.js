const jsonfile = "data/animals.json";

let allAnimals = new Map();
let nextAvailableId = 0;

async function getAllAnimals() {
  // if array is empty, load from json-file
  if (allAnimals.size === 0) {
    await refetchAllAnimals();
  }

  return Array.from(allAnimals.values());
}

function _checkIfAnimalsLoaded() {
  if (allAnimals.size === 0) {
    refetchAllAnimals();
  }
}

async function getAnimal(id) {
  _checkIfAnimalsLoaded();

  return allAnimals.get(id);
}

async function createAnimal(animal) {
  // ensure that next available id is still available - just to be certain
  while (allAnimals.has(nextAvailableId)) nextAvailableId++;

  animal.id = nextAvailableId;
  allAnimals.set(animal.id, animal);

  nextAvailableId++;

  return animal;
}

// replaces the existing object identified by 'id' with the new 'animal' object
async function updateAnimal(id, animal) {
  _checkIfAnimalsLoaded();

  animal.id = id;
  allAnimals.set(id, animal);

  return allAnimals.get(id);
}

// modifies the existing object identified by 'id' in the database directly
// only sets property 'property' to 'value' - no other changes
async function patchAnimal(id, property, value) {
  const dataObject = allAnimals.get(id);
  dataObject[property] = value;

  return dataObject;
}

async function deleteAnimal(id) {
  const animal = allAnimals.get(id);
  allAnimals.delete(id);

  return animal;
}

async function refetchAllAnimals() {
  nextAvailableId = 0;
  const response = await fetch(jsonfile);
  const data = await response.json();
  for (const animal of data) {
    allAnimals.set(animal.id, animal);
    if (animal.id > nextAvailableId) {
      nextAvailableId = animal.id + 1;
    }
  }
}

export { createAnimal, getAllAnimals, getAnimal, updateAnimal, patchAnimal, deleteAnimal };
