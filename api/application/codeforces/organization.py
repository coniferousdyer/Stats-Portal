"""
Contains methods for obtaining information about an organization and its users.
"""

from os import environ
import requests
from time import sleep
from concurrent.futures import ThreadPoolExecutor

from application.codeforces.users import get_user_problems, get_user_contests
from application.utils.common import convert_timestamp_to_datetime
from application.utils.constants import MAX_WORKER_THREADS, API_BASE_URL


def get_organization_users_problems(handles: list[str]):
    """
    Obtains information about an organization's users' solved problems.

    Arguments:
    * handles - List of handles of the organization's users.
    """

    # Initialize the thread pool.
    with ThreadPoolExecutor(max_workers=MAX_WORKER_THREADS) as executor:
        users_problems = list(executor.map(get_user_problems, handles))

    return users_problems


def get_organization_users_contests(handles: list[str]):
    """
    Obtains information about an organization's users' contests.

    Arguments:
    * handles - List of handles of the organization's users.
    """

    # Initialize the thread pool.
    with ThreadPoolExecutor(max_workers=MAX_WORKER_THREADS) as executor:
        users_contests = list(executor.map(get_user_contests, handles))

    return users_contests


def get_organization_users_information():
    """
    Obtains list of all Codeforces users of the organization and information about them.
    """

    # We do this differently than in the other methods because the Codeforces API
    # gives us a method to obtain all users of the organization in one go, while it
    # does not do this for contests or problems. Therefore, we use this method to
    # obtain all the handles in this method and use that in the other methods.
    url = f"{API_BASE_URL}user.ratedList"

    # We include all-time users, not just those who have been active recently.
    # Therefore we set the parameters "activeOnly" to false and "includeRetired" to false.
    payload = {
        "activeOnly": "false",
        "includeRetired": "true",
    }
    response = None

    # Send the request to the Codeforces API and retry if it fails.
    while not response:
        try:
            response = requests.get(url, params=payload)
            response.raise_for_status()
        except requests.exceptions.RequestException:
            sleep(1)

    # We filter the users belonging to the organization.
    result = filter(
        lambda x: "organization" in x
        and x["organization"] == environ.get("ORGANIZATION_NAME", ""),
        response.json()["result"],
    )

    users_information = []

    # The result contains a list of dictionaries containing information about the users
    # belonging to the organization. We extract the relevant information required by the model
    # and return it.
    for user in result:
        # If the user is unrated (i.e. has not given a contest yet), the rating is 0.
        rating = user.get("rating", 0)
        max_rating = user.get("maxRating", 0)
        rank = user.get("rank", "Unrated")

        # Obtaining account creation time in DateTime format.
        creation_date = convert_timestamp_to_datetime(user["registrationTimeSeconds"])

        users_information.append(
            {
                "handle": user["handle"],
                "creation_date": creation_date,
                "rating": rating,
                "max_rating": max_rating,
                "rank": rank,
            }
        )

    return users_information
