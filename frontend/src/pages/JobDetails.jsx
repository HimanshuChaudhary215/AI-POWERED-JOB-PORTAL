import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    API.get(`/jobs/${id}/`).then(res => setJob(res.data));
  }, []);

  return job ? (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
    </div>
  ) : <p>Loading...</p>;
}
