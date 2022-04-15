"""
Contains constants used in the application.
"""


"""
Base URLs for the application, as well as for accessing data from Codeforces.
"""


API_BASE_URL = "https://codeforces.com/api/"
ORGANIZATION_LIST_BASE_URL = "https://codeforces.com/ratings/organizations"  
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
