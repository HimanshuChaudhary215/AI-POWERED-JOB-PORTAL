import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ApplyButton({ jobId, applyToJob }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => await applyToJob(jobId, setLoading)}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-60 transition-transform transform hover:-translate-y-0.5"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
          Applying...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2.94 6.94a1.5 1.5 0 012.12 0L10 11.88l4.94-4.94a1.5 1.5 0 112.12 2.12l-6 6a1.5 1.5 0 01-2.12 0l-6-6a1.5 1.5 0 010-2.12z"/></svg>
          Apply
        </>
      )}
    </button>
  );
}

function SaveButton({ jobId, saved, toggleSaveJob }) {
  const [saving, setSaving] = useState(false);
  return (
    <button
      onClick={async () => await toggleSaveJob(jobId, saved, setSaving)}
      disabled={saving}
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm transition-colors ${saved ? 'bg-yellow-400 text-white' : 'border bg-white text-gray-700 hover:bg-gray-100'}`}
    >
      {saving ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
          Saving...
        </>
      ) : (
        <>
          {saved ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v12l7-3 7 3V5a2 2 0 00-2-2H5z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v12l7-3 7 3V5a2 2 0 00-2-2H5z"/></svg>
          )}
          {saved ? 'Saved' : 'Save'}
        </>
      )}
    </button>
  );
}

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [saved, setSaved] = useState({});
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSubTypes, setSelectedSubTypes] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [modalJob, setModalJob] = useState(null);
  const [confirmApplyJob, setConfirmApplyJob] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  
  const staticJobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Freelance', 'Temporary', 'Volunteer'];
  const [jobTypes, setJobTypes] = useState(staticJobTypes);
  const bg = "https://images.unsplash.com/photo-1504384308090-c5249f4df085?auto=format&fit=crop&w=1600&q=60";

  // Mock jobs for demo if API fails
  const mockJobs = [
    { id: 1, title: "Senior Frontend Developer", company: "Tech Corp", location: "Remote", job_type: "Full-time", experience_level: "Senior", salary: "$120k-150k", skills: ["React", "TypeScript", "Node.js"], description: "Looking for an experienced frontend developer" },
    { id: 2, title: "Junior Backend Developer", company: "StartUp Inc", location: "New York", job_type: "Full-time", experience_level: "Junior", salary: "$60k-80k", skills: ["Python", "Django", "PostgreSQL"], description: "Entry level backend position" },
    { id: 3, title: "UI/UX Designer Internship", company: "Design Studio", location: "Remote", job_type: "Internship", experience_level: "Intern", salary: "$20k/year", skills: ["Figma", "UI Design"], description: "Summer internship for design students" },
  ];

  useEffect(() => {
    API.get("/ai/recommend/")
      .then((res) => {
        setJobs(res.data && res.data.length > 0 ? res.data : mockJobs);
        if (res.data && res.data.length > 0) {
          const types = Array.from(new Set(res.data.map(j => j.job_type || 'Full-time')));
          setJobTypes(types);
        } else {
          setJobTypes(staticJobTypes);
        }
      })
      .catch(() => {
        setJobs(mockJobs);
        setJobTypes(staticJobTypes);
      });
  }, []);

  const applyToJob = async (jobId, setLoading) => {
    try {
      setLoading(true);
      await API.post(`/applications/`, { job: jobId });
      alert("Application submitted successfully.");
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Network error";
      alert("Failed to apply: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async (jobId, isSaved, setSaving) => {
    try {
      setSaving(true);
      let newSaved = !isSaved;
      if (!isSaved) {
        await API.post(`/jobs/${jobId}/save/`);
        newSaved = true;
      } else {
        await API.post(`/jobs/${jobId}/unsave/`);
        newSaved = false;
      }
      setSaved((prev) => ({ ...prev, [jobId]: newSaved }));
      return newSaved;
    } catch (err) {
      // fallback: toggle locally if endpoint missing
      const toggled = !isSaved;
      setSaved((prev) => ({ ...prev, [jobId]: toggled }));
      const msg = err.response?.data?.detail || err.message || "Network error";
      alert("Save action failed (local toggle applied): " + msg);
      return toggled;
    } finally {
      setSaving(false);
    }
  };

  // Extract sub types for each job type - safe calculation
  const jobSubTypes = jobTypes.reduce((acc, type) => {
    try {
      const subtypes = Array.from(new Set(
        jobs.filter(j => (j.job_type || 'Full-time') === type && j.sub_type).map(j => j.sub_type)
      ));
      acc[type] = subtypes;
    } catch (e) {
      acc[type] = [];
    }
    return acc;
  }, {});

  // Job count per type
  const jobTypeCounts = jobTypes.reduce((acc, type) => {
    acc[type] = jobs.filter(j => (j.job_type || 'Full-time') === type).length;
    return acc;
  }, {});

  // Multi-select job type filter
  const typeFilterActive = selectedTypes.length > 0;
  let filteredJobs = jobs.filter(j => {
    const jobType = j.job_type || 'Full-time';
    const matchesType = !typeFilterActive ? true : selectedTypes.includes(jobType);
    const matchesSubType = selectedSubTypes.length === 0 ? true : (j.sub_type && selectedSubTypes.includes(j.sub_type));
    const matchesSearch = searchTerm.trim() === "" || (
      (j.title && j.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (j.company && j.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (j.location && j.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (j.skills && j.skills.join(' ').toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return matchesType && matchesSubType && matchesSearch;
  });

  // Bookmarked jobs view
  const bookmarkedJobs = filteredJobs.filter(j => saved[j.id]);

  // Sort jobs
  if (sortBy === "date") {
    filteredJobs = filteredJobs.slice().sort((a, b) => {
      const dateA = new Date(a.posted_at || a.created_at || 0);
      const dateB = new Date(b.posted_at || b.created_at || 0);
      return dateB - dateA;
    });
  } else if (sortBy === "salary") {
    filteredJobs = filteredJobs.slice().sort((a, b) => {
      const salaryA = parseInt(a.salary) || 0;
      const salaryB = parseInt(b.salary) || 0;
      return salaryB - salaryA;
    });
  } // relevance is default (API order)

  // Pagination
  const jobsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

  return (
    <main className="min-h-screen" style={{ backgroundImage: `linear-gradient(rgba(6,6,23,0.6), rgba(6,6,23,0.4)), url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-6xl mx-auto py-24 px-6">
        <div className="bg-white/95 rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900">Your recommended jobs</h1>
          <p className="text-gray-600 mt-2">Jobs selected by our AI just for you.</p>

          {/* Search Bar & Sort Dropdown */}
          <div className="mt-4 mb-2 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, company, location, or skill..."
              className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="date">Sort by Date</option>
              <option value="salary">Sort by Salary</option>
            </select>
          </div>

          {/* Types of Jobs Section with multi-select filter and job count */}
          {jobTypes.length > 0 && (
            <div className="mt-6 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Types of Jobs</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium shadow border ${!typeFilterActive && selectedSubTypes.length === 0 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
                    onClick={() => { setSelectedTypes([]); setSelectedSubTypes([]); }}
                  >All <span className="ml-1 text-xs">({jobs.length})</span></button>
                  {jobTypes.map((type, idx) => (
                    <div key={type} className="flex flex-col items-start">
                      <button
                        className={`px-3 py-1 rounded-full text-sm font-medium shadow border ${selectedTypes.includes(type) ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
                        onClick={() => {
                          setSelectedTypes(selectedTypes.includes(type)
                            ? selectedTypes.filter(t => t !== type)
                            : [...selectedTypes, type]);
                        }}
                      >{type} <span className="ml-1 text-xs">({jobTypeCounts[type]})</span></button>
                      {/* Sub types for this job type */}
                      {jobSubTypes[type] && jobSubTypes[type].length > 0 && (
                        <div className="ml-2 mt-1 flex flex-wrap gap-1">
                          {jobSubTypes[type].map((sub, subIdx) => (
                            <button
                              key={subIdx}
                              className={`px-2 py-0.5 rounded text-xs font-normal border ${selectedSubTypes.includes(sub) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                              onClick={() => {
                                setSelectedSubTypes(selectedSubTypes.includes(sub)
                                  ? selectedSubTypes.filter(s => s !== sub)
                                  : [...selectedSubTypes, sub]);
                              }}
                            >{sub}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Clear Filters Button */}
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium border shadow"
                onClick={() => {
                  setSelectedTypes([]);
                  setSelectedSubTypes([]);
                  setSearchTerm("");
                  setSortBy("relevance");
                  setPage(1);
                }}
              >Clear Filters</button>
            </div>
          )}

          {/* Tabs for All Jobs / Bookmarks */}
          <div className="mt-8 mb-4 flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg font-medium border shadow ${!showBookmarks ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
              onClick={() => setShowBookmarks(false)}
            >All Jobs</button>
            <button
              className={`px-4 py-2 rounded-lg font-medium border shadow ${showBookmarks ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
              onClick={() => setShowBookmarks(true)}
            >Bookmarked Jobs</button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(showBookmarks ? bookmarkedJobs : paginatedJobs).length === 0 && (
              <div className="text-gray-500">No recommendations yet.</div>
            )}

            {(showBookmarks ? bookmarkedJobs : paginatedJobs).map((j) => (
              <article key={j.id} className="p-4 border rounded-xl bg-white flex flex-col justify-between shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                <div>
                  {/* Company Logo */}
                  {j.logo_url ? (
                    <img src={j.logo_url} alt={j.company + ' logo'} className="h-10 w-10 object-contain mb-2 rounded-full shadow" />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 mb-2 rounded-full text-indigo-700 text-lg font-bold shadow-inner">
                      <span>{j.company ? j.company[0] : '?'}</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-lg cursor-pointer hover:underline" onClick={() => setModalJob(j)}>{j.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{j.company} • <span className="text-gray-500">{j.location || 'Remote'}</span></p>

                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-700">
                    <span className="px-2 py-1 bg-gray-100 rounded">{j.job_type || 'Full-time'}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{j.experience_level || 'Mid'}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{j.salary ? j.salary : 'Salary not listed'}</span>
                  </div>

                  {j.skills && j.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {j.skills.slice(0,5).map((s, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{s}</span>
                      ))}
                    </div>
                  )}

                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">{j.description || j.short_description || 'No description available.'}</p>
                </div>

                  <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">{j.posted_at || j.created_at || ''}</div>
                  <div className="flex items-center gap-3">
                    <Link to={`/jobs/${j.id}`} className="inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-50 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 7v6l5-3-5-3z"/></svg>
                      View
                    </Link>
                    <ApplyButton jobId={j.id} applyToJob={async (...args) => {
                      await applyToJob(...args);
                      setNotification('Application submitted successfully.');
                      setTimeout(() => setNotification(''), 3000);
                    }} />
                    <SaveButton jobId={j.id} saved={!!saved[j.id]} toggleSaveJob={async (jobIdArg, wasSaved, setSavingArg) => {
                      const newSaved = await toggleSaveJob(jobIdArg, wasSaved, setSavingArg);
                      setNotification(newSaved ? 'Job saved to bookmarks.' : 'Job removed from bookmarks.');
                      setTimeout(() => setNotification(''), 3000);
                    }} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Modal for job details */}
          {modalJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setModalJob(null)}>&times;</button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 flex flex-col items-center md:items-start">
                    {modalJob.logo_url ? (
                      <img src={modalJob.logo_url} alt={modalJob.company + ' logo'} className="h-24 w-24 object-contain mb-4 rounded-full shadow-lg" />
                    ) : (
                      <div className="h-24 w-24 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 mb-4 rounded-full text-indigo-700 text-3xl font-bold shadow-inner">
                        <span>{modalJob.company ? modalJob.company[0] : '?'}</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{modalJob.company}</h3>
                    <p className="text-sm text-gray-600">{modalJob.location || 'Remote'}</p>
                    <div className="mt-4 flex flex-col gap-2 w-full">
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{modalJob.job_type || 'Full-time'}</span>
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{modalJob.experience_level || 'Mid'}</span>
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{modalJob.salary ? modalJob.salary : 'Salary not listed'}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <h2 className="text-2xl font-bold mb-2">{modalJob.title}</h2>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {modalJob.skills && modalJob.skills.map((s, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{s}</span>
                      ))}
                    </div>
                    <p className="mb-6 text-gray-800">{modalJob.description || modalJob.short_description || 'No description available.'}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setConfirmApplyJob(modalJob)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-transform transform hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Apply
                      </button>
                      <SaveButton jobId={modalJob.id} saved={!!saved[modalJob.id]} toggleSaveJob={async (jobIdArg, wasSaved, setSavingArg) => {
                        const newSaved = await toggleSaveJob(jobIdArg, wasSaved, setSavingArg);
                        setNotification(newSaved ? 'Job saved to bookmarks.' : 'Job removed from bookmarks.');
                        setTimeout(() => setNotification(''), 3000);
                      }} />
                      <Link to={`/jobs/${modalJob.id}`} className="ml-2 text-sm text-blue-600 hover:underline">Open full page</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Apply confirmation modal */}
          {confirmApplyJob && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40 px-4">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-2">Confirm Application</h3>
                <p className="text-sm text-gray-700 mb-4">Are you sure you want to apply to <strong>{confirmApplyJob.title}</strong> at <strong>{confirmApplyJob.company}</strong>?</p>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-md border" onClick={() => setConfirmApplyJob(null)}>Cancel</button>
                  <button
                    className="px-4 py-2 rounded-md bg-green-600 text-white"
                    onClick={async () => {
                      await applyToJob(confirmApplyJob.id, setConfirmLoading);
                      setConfirmApplyJob(null);
                      setNotification('Application submitted successfully.');
                      setTimeout(() => setNotification(''), 3000);
                    }}
                    disabled={confirmLoading}
                  >
                    {confirmLoading ? 'Applying...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification */}
          {notification && (
            <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-2xl z-50 font-medium flex items-center gap-3 animate-bounce-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2a1 1 0 102 0zm-1 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd"/></svg>
              <span>{notification}</span>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 rounded border font-medium ${page === num ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
