"""
The helper functions take the data obtained from the database (via routes) and
transform it into a format that is suitable for the frontend.

helpers/problems.py contains problem-related helper functions.
"""

from collections import defaultdict
from datetime import datetime


def extract_problems_information(problems_solved: list[dict]):
    """
    Given a list of problems solved, returns:
    * The total number of problems solved.
    * Number of problems solved per tag.
    * Number of problems solved per index.
    * Number of problems solved per rating.
    * Number of problems solved per language.

    Arguments:
    * problems_solved - List of problems solved.
    """

    statistics = {
        "total_problems": 0,
        "tags": defaultdict(int),
        "indexes": defaultdict(int),
        "ratings": defaultdict(int),
        "languages": defaultdict(int),
    }

    for problem_solved in problems_solved:
        statistics["total_problems"] += 1

        # Adding the tags to the statistics
        for tag in problem_solved["tags"].split(";"):
            if tag != "":
                statistics["tags"][tag] += 1

        # Adding the indexes to the statistics. Only the first letter of the index matters
        # to us. eg. "A1" is considered to be and counted as "A".
        statistics["indexes"][problem_solved["index"][0]] += 1

        # Adding the ratings to the statistics. Rating is 0, if the rating for the problem
        # is not specified in the Codeforces API.
        if problem_solved["rating"] != 0:
            statistics["ratings"][problem_solved["rating"]] += 1

        # Adding the languages to the statistics
        statistics["languages"][problem_solved["language"]] += 1

    return statistics


def get_problems_statistics(problems_solved: list[dict]):
    """
    Returns the problems statistics (all-time, this month, this week, today) from
    the given list of problems solved.

    Arguments:
    * problems_solved - List of problems solved.
    """

    all_time, this_month, this_week, today = [], [], [], []

    for problem_solved in problems_solved:
        all_time.append(problem_solved)

        # If the problem was solved this year
        if problem_solved["solved_time"].year == datetime.now().year:
            # If the problem was solved this month
            if problem_solved["solved_time"].month == datetime.now().month:
                this_month.append(problem_solved)

                # If the problem was solved this week
                if (
                    problem_solved["solved_time"].isocalendar()[1]
                    == datetime.now().isocalendar()[1]
                ):
                    this_week.append(problem_solved)

                    # If the problem was solved today
                    if problem_solved["solved_time"].day == datetime.now().day:
                        today.append(problem_solved)

    statistics = {
        "all_time": extract_problems_information(all_time),
        "this_month": extract_problems_information(this_month),
        "this_week": extract_problems_information(this_week),
        "today": extract_problems_information(today),
    }

    return statistics
