import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/jobs/").then((res) => setJobs(res.data));
  }, []);

  return (
    <div>
      <h2>Your recommended jobs</h2>
      {jobs.map(j => (
        <div key={j.id} className="p-2 border">
          <h3>{j.title}</h3>
          <p>{j.company}</p>
        </div>
      ))}
    </div>
  );
}
