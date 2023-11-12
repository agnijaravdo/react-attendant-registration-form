import React, { useState } from "react";
import Attendant from "./Attendant";
import ErrorMessages from "../constants/errorMessages";

const AttendantForm = ({
  isAttendantsLoading,
  isJobTitlesLoading,
  submitAttendant,
  attendants,
  jobTitles,
  attendantsApiError,
  jobTitlesApiError,
}) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [age, setAge] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [jobTitleError, setJobTitleError] = useState("");
  const [ageError, setAgeError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await submitAttendant({ name, lastName, jobTitle, age });
    clearForm();
  }

  const clearForm = () => {
    [setName, setLastName, setJobTitle, setAge].forEach((setter) => setter(""));
  };

  const renderAttendants = () =>
    attendants.map((attendant, index) => (
      <Attendant
        key={`attendant-${index}`}
        attendant={attendant}
      />
    ));

  const renderJobTitles = () =>
    jobTitles.map((jobTitle, i) => (
      <option
        key={`${jobTitle}${i}`}
        value={jobTitle}
      >
        {jobTitle}
      </option>
    ));

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        validateNameInput(value);
        break;
      case "lastName":
        setLastName(value);
        validateLastNameInput(value);
        break;
      case "jobTitle":
        setJobTitle(value);
        validateJobTitleSelection(value);
        break;
      case "age":
        setAge(value);
        validateAgeInput(value);
        break;
      default:
        break;
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        validateNameInput(value);
        break;
      case "lastName":
        validateLastNameInput(value);
        break;
      case "jobTitle":
        validateJobTitleSelection(value);
        break;
      case "age":
        validateAgeInput(value);
        break;
      default:
        break;
    }
  };

  const validateNameInput = (value) => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\\-]{2,50}$/;

    if (!value.match(nameRegex)) {
      setNameError(ErrorMessages.INVALID_NAME);
    } else {
      setNameError("");
    }
  };

  const validateLastNameInput = (value) => {
    const lastNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\\-]{2,50}$/;

    if (!value.match(lastNameRegex)) {
      setLastNameError(ErrorMessages.INVALID_LAST_NAME);
    } else {
      setLastNameError("");
    }
  };

  const validateJobTitleSelection = (value) => {
    if (!value) {
      setJobTitleError(ErrorMessages.INVALID_JOB_TITLE);
    } else {
      setJobTitleError("");
    }
  };

  const validateAgeInput = (value) => {
    const ageRegex = /^(1[5-9]|[2-9]\d|1[01]\d|120)$/;

    if (!value.match(ageRegex)) {
      setAgeError(ErrorMessages.INVALID_AGE);
    } else {
      setAgeError("");
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
      <hr />
      <h1>Attendant Registration Form</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="form-label"
          >
            Enter name:
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            data-testid="name"
            value={name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {nameError && <div>{nameError}</div>}
        <br />
        <div className="input">
          <label
            htmlFor="lastName"
            className="form-label"
          >
            Enter last name:
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            data-testid="last-name"
            value={lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {lastNameError && <div>{lastNameError}</div>}
        <br />
        <div className="input">
          <label
            htmlFor="jobTitle"
            className="form-label"
          >
            Select job title:
          </label>
          {jobTitlesApiError ? (
            <div>{jobTitlesApiError}</div>
          ) : isJobTitlesLoading ? (
            <div>Loading job titles... 🔄</div>
          ) : (
            <select
              name="jobTitle"
              data-testid="job-title"
              value={jobTitle}
              onChange={handleChange}
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
        {jobTitleError && <div>{jobTitleError}</div>}
        <br />
        <div className="input">
          <label
            htmlFor="age"
            className="form-label"
          >
            Enter age:
          </label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            data-testid="age"
            value={age}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {ageError && <div>{ageError}</div>}
        <br />
        <div className="button">
          <button
            type="submit"
            data-testid="submit"
            disabled={isSubmitButtonDisabled}
          >
            Submit
          </button>
          {isAttendantsLoading && <div>Loading...</div>}
        </div>
      </form>
      {attendantsApiError && <div>{attendantsApiError}</div>}
      {!attendantsApiError && renderAttendants()}
    </div>
  );
};

export default AttendantForm;
