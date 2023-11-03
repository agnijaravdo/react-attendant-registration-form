export default function AttendantDisplay({
  attendant: { name, lastName, jobTitle, age },
}) {
  return (
    <div className="attendantsDisplay">
      <br />
      Name: <span>{name} </span>
      Last Name: <span>{lastName} </span>
      Job Title: <span>{jobTitle} </span>
      Age: <span>{age} </span>
      <br />
    </div>
  );
}
