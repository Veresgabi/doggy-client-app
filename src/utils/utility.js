
function createPopupContent(text, responseObj) {
  let popupContent = {
    text: text,
    responseObj: responseObj
  }
  return popupContent;
}

function getErrorMessage(error) {
  let errorMessage = "";
  if (error.message != null) errorMessage = error.message;
  else if (error.code != null) errorMessage = error.code;
  else errorMessage = "ismeretlen hiba";

  return errorMessage;
}

let breedGroups = ["Herding", "Hound", "Mixed", "Non-Sporting", "Sporting", "Terrier", "Toy", "Working"];

function getBreedGroups() {
  return breedGroups;
}

export default {
  createPopupContent,
  getErrorMessage,
  getBreedGroups
};