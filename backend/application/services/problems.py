"""
The service functions take the data obtained from the database and transform it
into a format that is suitable for the frontend.

services/problems.py contains problem-related service functions.
"""

from collections import defaultdict
from datetime import datetime


def summarize_problems_information(problems_solved: list[dict]):
    """
    Given the list of problems solved, returns:
    * Total number of problems solved.
    * Number of problems solved per tag.
    * Number of problems solved per index.
    * Number of problems solved per rating.

    Arguments:
    * problems_solved - List of problems solved by the user.
    """

    # Initializing the statistics
    statistics = {
        "total_solved": 0,
        "tags": defaultdict(int),
        "indexes": defaultdict(int),
        "ratings": defaultdict(int),
    }

    # Summarizing the information
    for problem_solved in problems_solved:
        statistics["total_solved"] += 1
        # We only count the first letter of the index, for eg. A1 is considered to be A
        statistics["indexes"][problem_solved["index"][0]] += 1

        # Rating 0 was assigned to those problems which are not rated. We do not count those.
        if problem_solved["rating"] != 0:
            statistics["ratings"][problem_solved["rating"]] += 1

        # As the tags are in the form of a ";" separated string, we split them
        for tag in problem_solved["tags"].split(";"):
            if tag != "":
                statistics["tags"][tag] += 1

    return statistics


def get_user_problems_statistics(problems_solved: list[dict]):
    """
    Extracts the relevant statistics (all-time, this month, this week, today) from
    the given list of problems solved by the user.

    Arguments:
    * problems_solved - List of problems solved by the user.
    """

    # We call summarize_problems_information to obtain the statistics. At each turn,
    # we filter the list of problems solved according to the time period we are interested in.
    statistics = {
        # All-time statistics
        "all_time": summarize_problems_information(problems_solved),
        # This month's statistics
        "this_month": summarize_problems_information(
            filter(
                lambda problem: problem["solved_time"].month == datetime.now().month
                and problem["solved_time"].year == datetime.now().year,
                problems_solved,
            )
        ),
        # This week's statistics
        "this_week": summarize_problems_information(
            filter(
                lambda problem: problem["solved_time"].isocalendar()[1]
                == datetime.now().isocalendar()[1]
                and problem["solved_time"].year == datetime.now().year,
                problems_solved,
            )
        ),
        # Today's statistics
        "today": summarize_problems_information(
            filter(
                lambda problem: problem["solved_time"].day == datetime.now().day
                and problem["solved_time"].month == datetime.now().month
                and problem["solved_time"].year == datetime.now().year,
                problems_solved,
            )
        ),
    }

    return statistics
