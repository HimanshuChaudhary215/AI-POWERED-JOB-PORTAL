import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Home() {
  const bgUrl = "https://images.unsplash.com/photo-1526378725098-7f2b3b7b6e53?auto=format&fit=crop&w=1600&q=60";
  const [recs, setRecs] = useState(null);

  useEffect(() => {
    let mounted = true;
    API.get("/ai/recommend/")
      .then((res) => { if (mounted) setRecs(res.data); })
      .catch(() => { if (mounted) setRecs([]); });
    return () => { mounted = false; };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section
        className="relative h-screen flex items-center justify-center text-center text-white"
        style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">Welcome to Job Portal AI</h1>
          <p className="mt-6 text-lg md:text-xl text-gray-100/90 max-w-2xl mx-auto">Find your next opportunity with AI-powered recommendations tailored to your skills and preferences.</p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link to="/register" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium shadow-lg">
              Get Started
            </Link>
            <Link to="/dashboard" className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-md text-white border border-white/30 font-medium">
              View Recommendations
            </Link>
          </div>
        </div>
      </section>

      {/* Features / recommendations preview */}
      <section className="py-16 px-6 bg-white -mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800">Recommended for you</h2>
            <p className="mt-2 text-gray-600">AI-powered suggestions based on your profile and activity.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recs === null && (
                <div className="col-span-3 text-gray-500">Loading recommendations...</div>
              )}

              {recs && recs.length === 0 && (
                <div className="col-span-3 text-gray-500">No recommendations available yet.</div>
              )}

              {recs && recs.map((job) => (
                <article key={job.id} className="p-4 border rounded-lg hover:shadow-lg transition">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{job.company} • {job.location || 'Remote'}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <Link to={`/jobs/${job.id}`} className="text-blue-600 font-medium">View</Link>
                    <span className="text-gray-500">{job.posted_at || 'recent'}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
