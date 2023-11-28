import React, { useState } from "react";
import { validateInputs } from "../utils/attendantFormInputValidations";
import ErrorMessages from "../constants/errorMessages";

const AttendantForm = ({
  isAttendantsLoading,
  isJobTitlesLoading,
  submitAttendant,
  jobTitles,
  jobTitlesApiError,
}) => {
  
  const [formInputs, setFormInputs] = useState({ name: "", lastName: "", jobTitle: "", age: "" });
  const { name, lastName, jobTitle, age } = formInputs;
  const [formErrors, setFormErrors] = useState({ nameError: "", lastNameError: "", jobTitleError: "", ageError: "" });
  const { nameError, lastNameError, jobTitleError, ageError } = formErrors;

  async function handleSubmit(e) {
    e.preventDefault();
    await submitAttendant({ ...formInputs });
    clearForm();
  }

  const clearForm = () => {
    setFormInputs({ name: "", lastName: "", jobTitle: "", age: "" });
  }

  const renderJobTitles = () =>
    jobTitles.map((jobTitle, i) => (
      <option
        key={`${jobTitle}${i}`}
        value={jobTitle}
      >
        {jobTitle}
      </option>
    ));

  const handleValidationError = (name) => {
    switch (name) {
      case "name":
        setFormErrors({ ...formErrors, nameError: ErrorMessages.INVALID_NAME });
        break;
      case "lastName":
        setFormErrors({ ...formErrors, lastNameError: ErrorMessages.INVALID_LAST_NAME });
        break;
      case "jobTitle":
        setFormErrors({ ...formErrors, jobTitleError: ErrorMessages.INVALID_JOB_TITLE });
        break;
      case "age":
        setFormErrors({ ...formErrors, ageError: ErrorMessages.INVALID_AGE });
        break;
      default:
        return;
    }
  }

  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, name: value });
    if (!validateInputs({name: "name", value})) {
      handleValidationError("name");
    } else {
      setFormErrors({ ...formErrors, nameError: "" });
    }
  }

  const handleLastNameChange = (e) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, lastName: value });
    if (!validateInputs({name: "lastName", value})) {
      handleValidationError("lastName");
    } else {
      setFormErrors({ ...formErrors, lastNameError: "" });
    }
  }

  const handleJobTitleChange = (e) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, jobTitle: value });
    if (!validateInputs({name: "jobTitle", value})) {
      handleValidationError("jobTitle");
    } else {
      setFormErrors({ ...formErrors, jobTitleError: "" });
    }
  }

  const handleAgeChange = (e) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, age: value });
    if (!validateInputs({name: "age", value})) {
      handleValidationError("age");
    } else {
      setFormErrors({ ...formErrors, ageError: "" });
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!validateInputs({name, value})) {
      handleValidationError(name);
    }
  };

  const isSubmitButtonDisabled =
    isAttendantsLoading ||
    isJobTitlesLoading ||
    !!nameError ||
    !!lastNameError ||
    !!jobTitleError ||
    !!ageError ||
    !name ||
    !lastName ||
    !jobTitle ||
    !age;

  return (
    <div>
      <h2>Attendant Registration Form</h2>
      <form
        className="form-container"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="name"
            className="form-label"
          >
            Name
          </label>
          <input
            className="input-box"
            type="text"
            name="name"
            placeholder="Name"
            aria-required="true"
            aria-describedby="nameError"
            data-testid="name"
            value={name}
            onChange={handleNameChange}
            onBlur={handleBlur}
          />
        </div>
        {nameError && (
          <div
            className="error-label"
            id="nameError"
          >
            {nameError}
          </div>
        )}
        <br />
        <div>
          <label
            htmlFor="lastName"
            className="form-label"
          >
            Last name
          </label>
          <input
            className="input-box"
            type="text"
            name="lastName"
            placeholder="Last Name"
            aria-required="true"
            aria-describedby="lastNameError"
            data-testid="last-name"
            value={lastName}
            onChange={handleLastNameChange}
            onBlur={handleBlur}
          />
        </div>
        {lastNameError && (
          <div
            className="error-label"
            id="lastNameError"
          >
            {lastNameError}
          </div>
        )}
        <br />
        <div>
          <label
            htmlFor="jobTitle"
            className="form-label"
          >
            Job title
          </label>
          {jobTitlesApiError ? (
            <div aria-live="assertive">{jobTitlesApiError}</div>
          ) : isJobTitlesLoading ? (
            <div
              className="loading-label"
              aria-live="polite"
              data-testid="job-titles-loader"
            >
              Loading job titles... 🔄
            </div>
          ) : (
            <select
              className="input-box"
              name="jobTitle"
              aria-required="true"
              aria-describedby="jobTitleError"
              data-testid="job-title"
              value={jobTitle}
              onChange={handleJobTitleChange}
              onBlur={handleBlur}
            >
              (
              <option
                value=""
                disabled
              >
                Please select a job title ⬇️
              </option>
              ){renderJobTitles()}
            </select>
          )}
        </div>
        {jobTitleError && (
          <div
            className="error-label"
            id="jobTitleError"
          >
            {jobTitleError}
          </div>
        )}
        <br />
        <div className="input">
          <label
            htmlFor="age"
            className="form-label"
          >
            Age
          </label>
          <input
            className="input-box"
            type="number"
            name="age"
            placeholder="Age"
            aria-required="true"
            aria-describedby="ageError"
            data-testid="age"
            value={age}
            onChange={handleAgeChange}
            onBlur={handleBlur}
          />
        </div>
        {ageError && (
          <div
            className="error-label"
            id="ageError"
          >
            {ageError}
          </div>
        )}
        <br />
        <div>
          <button
            className="submit-button"
            type="submit"
            data-testid="submit"
            disabled={isSubmitButtonDisabled}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendantForm;
