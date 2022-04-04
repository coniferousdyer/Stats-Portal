"""
Contains constants used in the application.
"""


"""
Base URLs for the application, as well as for accessing data from Codeforces.
"""


API_BASE_URL = "https://codeforces.com/api/"
ORGANIZATION_BASE_URL = "https://codeforces.com/ratings/organization/"
PROFILE_BASE_URL = "https://codeforces.com/profile/"
CONTEST_BASE_URL = "https://codeforces.com/contest/"
PROBLEM_BASE_URL = "https://codeforces.com/problemset/problem/"


"""
Application-specific constants.
"""


# Maximum number of worker threads for making requests to the Codeforces API.
# Used in ThreadPoolExecutor (see application/codeforces/organization.py).
# Affects the speed of the periodic database updates. Do not increase above 5
# as the Codeforces API allows only <= 5 requests per second. 4 is optimal.
MAX_WORKER_THREADS = 4


"""
Codeforces-specific constants.
"""


# All possible verdicts for a Codeforces submission.
# Required for dynamically initializing the SubmissionStatistics model and counting
# submission statistics (see models/models.py and codeforces/users.py).
VERDICTS = [
    "OK",
    "COMPILATION_ERROR",
    "RUNTIME_ERROR",
    "WRONG_ANSWER",
    "TIME_LIMIT_EXCEEDED",
    "MEMORY_LIMIT_EXCEEDED",
    "IDLENESS_LIMIT_EXCEEDED",
    "CHALLENGED",
    "SKIPPED",
    "PARTIAL",
    "CRASHED",
    "FAILED",
    "REJECTED",
]
