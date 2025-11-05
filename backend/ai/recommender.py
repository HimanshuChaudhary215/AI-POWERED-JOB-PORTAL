# simple content-based recommender using TF-IDF & cosine similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from jobs.models import Job
from users.models import User

def recommend_jobs_for_user(user: User, top_n=10):
    """
    Returns a list of Job instances most similar to user's skills.
    """
    # collect jobs
    jobs = list(Job.objects.all())
    if not jobs:
        return []

    # documents: job skills + maybe job title
    job_docs = []
    job_map = []
    for j in jobs:
        doc = " ".join([j.skills_required or "", j.title or "", j.description[:200] if j.description else ""])
        job_docs.append(doc)
        job_map.append(j)

    # include user skills as a separate doc at the end
    user_doc = user.skills or ""
    corpus = job_docs + [user_doc]

    tf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tf.fit_transform(corpus)
    # cosine similarity between user's vector (last row) and all jobs
    cosine_similarities = linear_kernel(tfidf_matrix[-1:], tfidf_matrix[:-1]).flatten()

    # get top indices
    related_indices = cosine_similarities.argsort()[::-1][:top_n]
    recommendations = [job_map[idx] for idx in related_indices if cosine_similarities[idx] > 0]
    return recommendations
