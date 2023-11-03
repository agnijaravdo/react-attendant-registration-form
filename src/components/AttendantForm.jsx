import React, { useState, useEffect } from "react";
import { getJobTitles, addAttendant, getAttendants } from "../api";
import AttendantDisplay from "./AttendantDisplay";

export default function AttendantForm() {
  const [attendants, setAttendants] = useState([]);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [age, setAge] = useState("");
  const [allJobTitles, setAllJobTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function submitHandler(e) {
    e.preventDefault();
    const submittedData = {
      name,
      lastName,
      jobTitle,
      age,
    };

    try {
      setIsLoading(true);
      const { status } = await addAttendant(submittedData);
      if (status === 200) {
        const { status: attendancesStatus, data } = await getAttendants();
        if (attendancesStatus === 200) {
          setAttendants([...data].sort((a, b) => a.age - b.age));
        }
      }
    } catch (e) {
      console.error("failed to add attendant", e);
    } finally {
      clearForm();
      setIsLoading(false);
    }
  }

  function clearForm() {
    [setName, setLastName, setJobTitle, setAge].forEach((setter) => setter(""));
  }

  useEffect(() => {
    setIsLoading(true);

    Promise.all([getJobTitles(), getAttendants()])
      .then(([jobTitles, initialAttendants]) => {
        if (jobTitles.status === 200) {
          setAllJobTitles([...jobTitles.data].sort());
        }
        if (initialAttendants.status === 200) {
          setAttendants(
            [...initialAttendants.data].sort((a, b) => a.age - b.age)
          );
        }
      })
      .catch((e) => {
        console.error("failed to get api response", e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <hr />
      <h1>Attendant Registration Form</h1>
      <br />
      <form
        className="attendant-form"
        onSubmit={submitHandler}
      >
        <div>
          <label htmlFor="name">Enter name:</label>
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
            onChange={(e) => {
              setName(e.target.value);
            }}
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter a valid name")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </div>
        <br />
        <div className="input">
          <label htmlFor="lastName">Enter last name:</label>
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
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter a valid last name")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </div>
        <br />
        <div className="input">
          <label htmlFor="jobTitle">Select job title:</label>
          <select
            name="jobTitle"
            data-testid="job-title"
            required
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onInput={(e) => e.target.setCustomValidity("")}
            onInvalid={(e) =>
              e.target.setCustomValidity("Please select a job title")
            }
          >
            <option
              value=""
              style={{ textAlign: "center" }}
            >
              {isLoading
                ? "Loading job titles... 🔄"
                : "Please select a job title ⬇️"}
            </option>
            {allJobTitles.map((jobTitle) => (
              <option
                key={jobTitle}
                value={jobTitle}
              >
                {jobTitle}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div className="input">
          <label htmlFor="age">Enter age:</label>
          <input
            type="number"
            min="15"
            max="120"
            name="age"
            placeholder="Age"
            data-testid="age"
            value={age}
            required
            onChange={(e) => {
              setAge(e.target.value);
            }}
            onInvalid={(e) =>
              e.target.setCustomValidity("Age range must be 15-120")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </div>
        <br />
        <div className="button">
          <button
            type="submit"
            data-testid="submit"
            disabled={isLoading}
          >
            Submit
          </button>
          {isLoading && <div>Loading...</div>}
        </div>
      </form>
      {attendants.map((e) => (
        <AttendantDisplay
          key={`${e.name}${e.lastName}${e.jobTitle}${e.age}`}
          attendant={e}
        />
      ))}
    </div>
  );
}
