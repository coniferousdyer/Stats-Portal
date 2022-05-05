"""
Contains methods for obtaining information about a Codeforces user of the organization.
"""

import requests
from time import sleep
from datetime import datetime

from application.utils.constants import API_BASE_URL
from application.utils.common import convert_timestamp_to_datetime


def get_user_problems(handle: str):
    """
    Obtains information about a user's solved problems.

    Arguments:
    * handle - The handle of the user.
    """

    url = f"{API_BASE_URL}user.status?handle={handle}"
    response = None

    # Send the request to the Codeforces API and retry if it fails.
    while not response:
        try:
            response = requests.get(url)
        except requests.exceptions.RequestException:
            sleep(1)

    # Filter out submissions that are not solved problems and sorting them by
    # the time of submission (from oldest to newest, so that we count only the
    # first submission in case of duplicates). "verdict" in x is necessary because
    # the verdict of the submission is not present if the contest of the problem is
    # undergoing system testing.
    result = filter(
        lambda x: "verdict" in x and x["verdict"] == "OK",
        response.json()["result"][::-1],
    )

    # Ensuring that if the user has solved the same problem twice, the second
    # submission is not counted.
    already_solved = {}

    problems = []  # List of problems.

    for problem in result:
        # For each problem, contest ID + index of the problem in the contest is
        # its unique identifier.
        if "contestId" in problem["problem"]:
            problem_id = (
                str(problem["problem"]["contestId"]) + problem["problem"]["index"]
            )

        # If the problem was not part of a contest or was already solved before, we skip it.
        if "contestId" not in problem["problem"] or problem_id in already_solved:
            continue

        # Else, we add it to the list of solved problems.
        already_solved[problem_id] = True

        rating = problem["problem"].get("rating", 0)
        tags = ";".join(problem["problem"].get("tags", []))

        # Obtaining contest creation time in DateTime format.
        solved_time = convert_timestamp_to_datetime(problem["creationTimeSeconds"])

        problems.append(
            {
                "handle": handle,
                "contest_id": problem["problem"]["contestId"],
                "index": problem["problem"]["index"],
                "rating": rating,
                "tags": tags,
                "language": problem["programmingLanguage"],
                "solved_time": solved_time,
            }
        )

    return problems


def get_user_contests(handle: str):
    """
    Obtains information about a user's participation in contests.

    Arguments:
    * handle - The handle of the user.
    """

    url = f"{API_BASE_URL}user.rating?handle={handle}"
    response = None

    # Send the request to the Codeforces API and retry if it fails.
    while not response:
        try:
            response = requests.get(url)
        except requests.exceptions.RequestException:
            sleep(1)

    result = response.json()["result"]

    # Before May 23, 2020, the initial rating of users was 1500, after which
    # it changed to the current initial rating of 0. For accounts that gave their
    # first contest before May 23, 2020, we set the initial rating to 1500.
    # Check https://codeforces.com/blog/entry/77890.
    date = datetime.fromtimestamp(result[0]["ratingUpdateTimeSeconds"])
    if date < datetime(2020, 5, 23):
        result[0]["oldRating"] = 1500

    contests = []  # List of contests.

    for contest in result:
        # Obtaining contest creation time in DateTime format.
        rating_update_time = convert_timestamp_to_datetime(
            contest["ratingUpdateTimeSeconds"]
        )

        contests.append(
            {
                "handle": handle,
                "contest_id": contest["contestId"],
                "rank": contest["rank"],
                "old_rating": contest["oldRating"],
                "new_rating": contest["newRating"],
                "rating_update_time": rating_update_time,
            }
        )

    return contests


def get_user_information(handle: str):
    """
    Obtains information about a user.

    Arguments:
    * handle - The handle of the user.
    """

    url = f"{API_BASE_URL}user.info?handles={handle}"
    response = None

    # Send the request to the Codeforces API and retry if it fails.
    while not response:
        try:
            response = requests.get(url)
        except requests.exceptions.RequestException:
            sleep(1)

    # The "result" field is a list of dictionaries, where each dictionary contains information about a user.
    # We only need the first dictionary, which corresponds to the user we're looking for.
    result = response.json()["result"][0]

    # If the user is unrated (i.e. has not given a contest yet), the rating is 0.
    rating = result.get("rating", 0)
    max_rating = result.get("maxRating", 0)
    rank = result.get("rank", "Unrated")

    # Obtaining account creation time in DateTime format.
    creation_date = convert_timestamp_to_datetime(result["registrationTimeSeconds"])

    return {
        "handle": handle,
        "creation_date": creation_date,
        "rating": rating,
        "max_rating": max_rating,
        "rank": rank,
    }
