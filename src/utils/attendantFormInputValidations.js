const validateNameInput = (value) => {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\\-]{2,50}$/;

  return !!value.match(nameRegex);
};

const validateLastNameInput = (value) => {
  const lastNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\\-]{2,50}$/;

  return !!value.match(lastNameRegex);
};

const validateJobTitleSelection = (value) => {
  return value !== "";
};

const validateAgeInput = (value) => {
  const ageRegex = /^(1[5-9]|[2-9][0-9]|1[01][0-9]|120)$/;

  return !!value.match(ageRegex);
}

const validateInputs = ({name, value}) => {
  switch (name) {
    case "name":
      return validateNameInput(value)
    case "lastName":
      return validateLastNameInput(value);
    case "jobTitle":
      return validateJobTitleSelection(value);
    case "age":
      return validateAgeInput(value);
    default:
      throw new Error("Invalid input name");
  }
} 

export { validateInputs };
