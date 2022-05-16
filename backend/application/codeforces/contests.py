"""
Contains methods for obtaining information about a Codeforces contest.
"""

import requests
from time import sleep

from application.utils.constants import API_BASE_URL
from application.utils.common import convert_timestamp_to_datetime


def get_all_contests():
    """
    Obtains information about all Codeforces contests.
    """

    url = f"{API_BASE_URL}contest.list"
    response = None

    # Send the request to the Codeforces API and retry if it fails.
    while not response:
        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException:
            sleep(1)

    # Filtering out the contests that have not finished.
    result = filter(lambda x: x["phase"] == "FINISHED", response.json()["result"])

    contests = []  # List of contests.

    for contest in result:
        # Obtaining contest time in DateTime format.
        contest_time = convert_timestamp_to_datetime(contest["startTimeSeconds"])

        contests.append(
            {
                "contest_id": contest["id"],
                "name": contest["name"],
                "date": contest_time,
                "duration": contest["durationSeconds"],
            }
        )

    return contests
