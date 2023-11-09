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
        break;
      case "lastName":
        setLastName(value);
        break;
      case "jobTitle":
        setJobTitle(value);
        break;
      case "age":
        setAge(value);
        break;
      default:
        break;
    }
  };

  const handleInvalid = (e, errorMessage, setError) => {
    setError(errorMessage);
    e.target.setCustomValidity(errorMessage);
  };

  const handleBlur = (e) => {
    e.target.reportValidity();
  };

  const isSubmitButtonDisabled =
    isAttendantsLoading ||
    isJobTitlesLoading ||
    !!nameError ||
    !!lastNameError ||
    !!jobTitleError ||
    !!ageError;

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
            minLength="2"
            maxLength="50"
            pattern="[A-Za-zÀ-ÖØ-öø-ÿ'\-]+"
            name="name"
            placeholder="Name"
            data-testid="name"
            value={name}
            required
            onChange={handleChange}
            onInvalid={(e) =>
              handleInvalid(e, ErrorMessages.INVALID_NAME, setNameError)
            }
            onInput={(e) => {
              e.target.setCustomValidity("");
              setNameError("");
              handleChange(e);
            }}
            onBlur={handleBlur}
          />
        </div>
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
            minLength="2"
            maxLength="50"
            pattern="[A-Za-zÀ-ÖØ-öø-ÿ'\-]+"
            name="lastName"
            placeholder="Last Name"
            data-testid="last-name"
            value={lastName}
            required
            onChange={handleChange}
            onInvalid={(e) =>
              handleInvalid(
                e,
                ErrorMessages.INVALID_LAST_NAME,
                setLastNameError
              )
            }
            onInput={(e) => {
              e.target.setCustomValidity("");
              setLastNameError("");
              handleChange(e);
            }}
            onBlur={handleBlur}
          />
        </div>
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
              required
              value={jobTitle}
              onChange={handleChange}
              onInvalid={(e) =>
                handleInvalid(
                  e,
                  ErrorMessages.INVALID_JOB_TITLE,
                  setJobTitleError
                )
              }
              onInput={(e) => {
                e.target.setCustomValidity("");
                setJobTitleError("");
                handleChange(e);
              }}
              onBlur={handleBlur}
            >
              (<option value="">Please select a job title ⬇️</option>)
              {renderJobTitles()}
            </select>
          )}
        </div>
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
            min="15"
            max="120"
            name="age"
            placeholder="Age"
            data-testid="age"
            value={age}
            required
            onChange={handleChange}
            onInvalid={(e) =>
              handleInvalid(e, ErrorMessages.INVALID_AGE, setAgeError)
            }
            onInput={(e) => {
              e.target.setCustomValidity("");
              setAgeError("");
              handleChange(e);
            }}
            onBlur={handleBlur}
          />
        </div>
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

//TODO:
//consider not using HTML custom validation, but instead creating validation methods for each input
//unit tests
