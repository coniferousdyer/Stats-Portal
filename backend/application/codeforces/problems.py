"""
Contains methods for obtaining information about a Codeforces problem.
"""

import requests
from time import sleep

from application.utils.constants import API_BASE_URL


def get_all_problems():
    """
    Obtains information about all Codeforces problems.
    """

    url = f"{API_BASE_URL}problemset.problems"
    response = None

    # Send the request to the Codeforces API and retry if it fails.
    while not response:
        try:
            response = requests.get(url)
        except requests.exceptions.RequestException:
            sleep(1)

    result = response.json()["result"]["problems"]

    problems = []  # List of problems.

    for problem in result:
        rating = problem.get("rating", 0)

        # Join the tags into a single string so that they can be stored in a convenient
        # format in the database.
        tags = ";".join(problem.get("tags", []))

        problems.append(
            {
                "contest_id": problem["contestId"],
                "index": problem["index"],
                "name": problem["name"],
                "rating": rating,
                "tags": tags,
            }
        )

    return problems
