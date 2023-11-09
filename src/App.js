import React, { useState, useEffect } from "react";
import "./App.css";
import AttendantForm from "./components/AttendantForm";
import { getJobTitles, addAttendant, getAttendants } from "./api";
import ErrorMessages from "./constants/errorMessages";

function App() {
  const [attendants, setAttendants] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [isAttendantsLoading, setIsAttendantsLoading] = useState(false);
  const [isJobTitlesLoading, setIsJobTitlesLoading] = useState(false);
  const [attendantsApiError, setAttendantsApiError] = useState("");
  const [jobTitlesApiError, setJobTitlesApiError] = useState("");

  async function handleAddAttendant(newAttendant) {
    try {
      setIsAttendantsLoading(true);
      const { status } = await addAttendant(newAttendant);
      if (status !== 200) {
        return;
      }
    } catch (e) {
      setAttendantsApiError(ErrorMessages.FAILED_TO_SUBMIT_ATTENDANT);
    } finally {
      setIsAttendantsLoading(false);
    }
  }

  async function handleFetchJobTitles() {
    try {
      setIsJobTitlesLoading(true);
      const { status, data } = await getJobTitles();
      if (status !== 200) {
        return;
      }
      setJobTitles(data.sort());
    } catch (e) {
      setJobTitlesApiError(ErrorMessages.FAILED_TO_GET_JOB_TITLES);
    } finally {
      setIsJobTitlesLoading(false);
    }
  }

  async function handleFetchAttendants() {
    try {
      setIsAttendantsLoading(true);
      const { status, data } = await getAttendants();
      if (status !== 200) {
        return;
      }
      setAttendants(data.sort((a, b) => a.age - b.age));
    } catch (e) {
      setAttendantsApiError(ErrorMessages.FAILED_TO_GET_ATTENDANTS);
    } finally {
      setIsAttendantsLoading(false);
    }
  }

  async function submitAttendant({ name, lastName, jobTitle, age }) {
    const newAttendant = {
      name,
      lastName,
      jobTitle,
      age,
    };

    handleAddAttendant(newAttendant);
    handleFetchAttendants();
  }

  useEffect(() => {
    handleFetchJobTitles();
    handleFetchAttendants();
  }, []);

  return (
    <div className="center-text">
      <h1>2023 React Fundamentals Workshop</h1>
      <AttendantForm
        isAttendantsLoading={isAttendantsLoading}
        isJobTitlesLoading={isJobTitlesLoading}
        submitAttendant={submitAttendant}
        attendants={attendants}
        jobTitles={jobTitles}
        attendantsError={attendantsApiError}
        jobTitlesApiError={jobTitlesApiError}
      />
    </div>
  );
}

export default App;
