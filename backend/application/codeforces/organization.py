"""
Contains methods for obtaining information about an organization and its users.
"""

from os import environ
import requests
from bs4 import BeautifulSoup
from time import sleep
from concurrent.futures import ThreadPoolExecutor

from application.utils.constants import ORGANIZATION_BASE_URL, MAX_WORKER_THREADS
from application.codeforces.users import (
    get_user_problems,
    get_user_contests,
    get_user_information,
)


def get_organization_users_problems(handles: list[str]):
    """
    Obtains information about an organization's users' solved problems.

    Arguments:
    * handles - List of handles of the organization's users.
    """

    # Initialize the thread pool
    with ThreadPoolExecutor(max_workers=MAX_WORKER_THREADS) as executor:
        users_problems = list(executor.map(get_user_problems, handles))

    return users_problems


def get_organization_users_contests(handles: list[str]):
    """
    Obtains information about an organization's users' contests.

    Arguments:
    * handles - List of handles of the organization's users.
    """

    # Initialize the thread pool
    with ThreadPoolExecutor(max_workers=MAX_WORKER_THREADS) as executor:
        users_contests = list(executor.map(get_user_contests, handles))

    return users_contests


def get_organization_users_information(handles: list[str]):
    """
    Obtains information about an organization's users.

    Arguments:
    * handles - List of handles of the organization's users.
    """

    # Initialize the thread pool
    with ThreadPoolExecutor(max_workers=MAX_WORKER_THREADS) as executor:
        users_information = list(executor.map(get_user_information, handles))

    return users_information


def get_organization_user_handles():
    """
    Obtains list of all Codeforces users of the organization and information about them.
    This information is scraped from https://codeforces.com/ratings/organization/<ORGANIZATION_NUMBER>/page/<i>.
    """

    i = 1  # Page number
    handles = []  # List of user handles
    last_handle = (
        ""  # Handle of the first user on the last page; used to determine when to stop
    )

    while True:
        url = f"{ORGANIZATION_BASE_URL}{environ.get('ORGANIZATION_NUMBER', '')}/page/{str(i)}"
        response = None

        # Send the request to the Codeforces API and retry if it fails
        while not response:
            try:
                response = requests.get(url)
            except requests.exceptions.RequestException:
                sleep(1)

        # Initialize the BeautifulSoup object
        soup = BeautifulSoup(response.text, "html.parser")

        # Get the list of users
        users_on_page = soup.find("div", class_="ratingsDatatable").find_all(
            "a", class_="rated-user"
        )

        # If there are no users or the page is repeated, stop
        if not users_on_page or users_on_page[0].text == last_handle:
            break

        # Store the handle of the first user on the last page to determine when to stop
        last_handle = users_on_page[0].text

        # Add the users to the list. user.text is the handle of the user.
        handles += [user.text for user in users_on_page]

        i += 1

    return handles
