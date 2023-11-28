const Attendant = ({ attendant: { name, lastName, jobTitle, age } }) => (
  <div data-testid="attendant">
    <br />
    Name: <span className="attendants-info">{name} </span>
    Last Name: <span className="attendants-info">{lastName} </span>
    Job Title: <span className="attendants-info">{jobTitle} </span>
    Age: <span className="attendants-info">{age} </span>
    <br />
  </div>
);

export default Attendant;
