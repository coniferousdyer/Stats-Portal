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

# Number of top users to be displayed on leaderboards, etc.
TOP_N = 10


"""
Codeforces-specific constants.
"""


# All possible tags for a Codeforces problem
TAGS = [
    "2-sat",
    "binary search",
    "bitmasks",
    "brute force",
    "chinese remainder theorem",
    "combinatorics",
    "constructive algorithms",
    "data structures",
    "dfs and similar",
    "divide and conquer",
    "dp",
    "dsu",
    "expression parsing",
    "fft",
    "flows",
    "games",
    "geometry",
    "graph matchings",
    "graphs",
    "greedy",
    "hashing",
    "implementation",
    "interactive",
    "math",
    "matrices",
    "meet-in-the-middle",
    "number theory",
    "probabilities",
    "schedules",
    "shortest paths",
    "sortings",
    "string suffix structures",
    "strings",
    "ternary search",
    "trees",
    "two pointers",
    "*special",
]

# The minimum and maximum rating a problem can have
MIN_PROBLEM_RATING = 800
MAX_PROBLEM_RATING = 3500

# The string of possible indexes for a problem
PROBLEM_INDEXES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
