"""
Contains methods for obtaining information about an organization and its users.
"""

from os import environ
import requests
from bs4 import BeautifulSoup
from time import sleep
from concurrent.futures import ThreadPoolExecutor

from application.utils.constants import (
    ORGANIZATION_BASE_URL,
    MAX_WORKER_THREADS,
    ORGANIZATION_LIST_BASE_URL,
)
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


def get_organization_users_information(handles: list[str]):
    """
    Obtains information about an organization's users.

    Arguments:
    * handles - List of handles of the organization's users.
    """

    # Initialize the thread pool.
    with ThreadPoolExecutor(max_workers=MAX_WORKER_THREADS) as executor:
        users_information = list(executor.map(get_user_information, handles))

    return users_information


def get_organization_user_handles():
    """
    Obtains list of all Codeforces users of the organization and information about them.
    This information is scraped from https://codeforces.com/ratings/organization/<ORGANIZATION_NUMBER>/page/<i>.
    """

    i = 1  # Page number.
    handles = []  # List of user handles.
    last_handle = (
        ""  # Handle of the first user on the last page; used to determine when to stop.
    )

    while True:
        url = f"{ORGANIZATION_BASE_URL}{environ.get('ORGANIZATION_NUMBER', '')}/page/{str(i)}"
        response = None

        # Send the request to the Codeforces API and retry if it fails.
        while not response:
            try:
                response = requests.get(url)
            except requests.exceptions.RequestException:
                sleep(1)

        soup = BeautifulSoup(response.text, "html.parser")

        # Get the list of users.
        users_on_page = soup.find("div", class_="ratingsDatatable").find_all(
            "a", class_="rated-user"
        )

        # If there are no users or the page is repeated, stop.
        if not users_on_page or users_on_page[0].text == last_handle:
            break

        # Store the handle of the first user on the last page to determine when to stop.
        last_handle = users_on_page[0].text

        # Add the users to the list. user.text is the handle of the user.
        handles += [user.text for user in users_on_page]

        i += 1

    return handles


def get_organization_information():
    """
    Obtains information about the organization, namely:
    * Organization ID
    * Global rank
    * Organization rating
    * Number of users
    This information is scraped from https://codeforces.com/ratings/organizations.
    """

    url = ORGANIZATION_LIST_BASE_URL
    response = None

    # Send the request to the Codeforces API and retry if it fails.
    while not response:
        try:
            response = requests.get(url)
        except requests.exceptions.RequestException:
            sleep(1)

    soup = BeautifulSoup(response.text, "html.parser")

    # We find the link leading to the organization's ratings page. Since there may
    # be multiple organizations with the same name, we find the one with the specified
    # organization number. The parent of the div containing the link is the table row
    # that contains the information we need in.
    organization_row = soup.find(
        "a",
        href=f"/ratings/organization/{environ.get('ORGANIZATION_NUMBER', '')}",
    ).parent.parent.find_all("td")

    # First column contains global rank, second column contains organization name,
    # third column contains number of users, and fourth column contains organization
    # rating.
    organization_information = {
        "organization_id": int(environ.get("ORGANIZATION_NUMBER", "")),
        "global_rank": organization_row[0].text,
        "name": organization_row[1].find("a").text,
        "number_of_users": int(
            organization_row[2].find_all("span")[1].text.strip("()")
        ),
        "rating": int(organization_row[3].find_all("span")[1].text.strip("()")),
    }

    return organization_information
