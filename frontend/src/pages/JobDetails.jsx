import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const bg = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=60";

  useEffect(() => {
    API.get(`/jobs/${id}/`).then(res => setJob(res.data)).catch(() => setJob(null));
  }, [id]);

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center">Loading...</div>
  );

  return (
    <main className="min-h-screen" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.2)), url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="text-gray-600 mt-2">{job.company} • {job.location || 'Remote'}</p>

          <section className="mt-6 text-gray-800">
            <h2 className="font-semibold mb-2">Job description</h2>
            <div className="prose max-w-none">{job.description}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
