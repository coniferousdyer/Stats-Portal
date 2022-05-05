"""
The helper functions take the data obtained from the database (via routes) and
transform it into a format that is suitable for the frontend.

helpers/contests.py contains contest-related helper functions.
"""

from datetime import datetime


def extract_contests_information(
    contests_participated: list[dict], rating_history: bool
):
    """
    Given a list of contests participated, returns:
    * The total number of contests given.
    * The best and worst ranks.
    * The highest rating increase and decrease.
    * The rating history (if rating_history is True. Only applicable to a single user).

    Arguments:
    * contests_participated - List of contests participated.
    * rating_history - Boolean flag indicating whether to extract the rating history.
    """

    statistics = {
        "total_contests": 0,
        "best_rank": None,
        "worst_rank": None,
        "highest_rating_increase": 0,
        "highest_rating_decrease": 0,
    }

    if rating_history:
        statistics["rating_history"] = []

    for contest_participated in contests_participated:
        statistics["total_contests"] += 1

        # Check if the rank is the best.
        if (
            statistics["best_rank"] is None
            or contest_participated["rank"] < statistics["best_rank"]
        ):
            statistics["best_rank"] = contest_participated["rank"]

        # Check if the rank is the worst.
        if (
            statistics["worst_rank"] is None
            or contest_participated["rank"] > statistics["worst_rank"]
        ):
            statistics["worst_rank"] = contest_participated["rank"]

        # Check if the rating increase is the highest.
        if (
            contest_participated["new_rating"] - contest_participated["old_rating"]
            > statistics["highest_rating_increase"]
        ):
            statistics["highest_rating_increase"] = (
                contest_participated["new_rating"] - contest_participated["old_rating"]
            )

        # Check if the rating decrease is the highest.
        if (
            contest_participated["new_rating"] - contest_participated["old_rating"]
            < statistics["highest_rating_decrease"]
        ):
            statistics["highest_rating_decrease"] = (
                contest_participated["new_rating"] - contest_participated["old_rating"]
            )

        if rating_history:
            statistics["rating_history"].append(
                {
                    "date": contest_participated["rating_update_time"],
                    "rating": contest_participated["new_rating"],
                }
            )

    return statistics


def get_contest_statistics(
    contests: list[dict],
    contests_participated: list[dict],
    rating_history: bool = False,
):
    """
    Returns the contest statistics (all-time, this month, this week, today) from
    the given list of contests participated.

    Arguments:
    * contests - List of contests.
    * contests_participated - List of contests participated.
    * rating_history - Boolean flag indicating whether to extract the rating history.
    """

    all_time, this_month, this_week, today = [], [], [], []

    for contest_participated in contests_participated:
        all_time.append(contest_participated)

        contest_date = next(
            (
                contest["date"]
                for contest in contests
                if contest["contest_id"] == contest_participated["contest_id"]
            )
        )

        # If the contest took place this year.
        if contest_date.year == datetime.now().year:
            # If the contest took place this month.
            if contest_date.month == datetime.now().month:
                this_month.append(contest_participated)

                # If the contest took place this week.
                if contest_date.isocalendar()[1] == datetime.now().isocalendar()[1]:
                    this_week.append(contest_participated)

                    # If the contest took place today.
                    if contest_date.day == datetime.now().day:
                        today.append(contest_participated)

    statistics = {
        "all_time": extract_contests_information(all_time, rating_history),
        "this_month": extract_contests_information(this_month, rating_history),
        "this_week": extract_contests_information(this_week, rating_history),
        "today": extract_contests_information(today, rating_history),
    }

    return statistics


def sort_contest_participants(contest_participants: list[dict]):
    """
    Sorts, formats and returns the list of contest participants in order of
    increasing rank in the contest.

    Arguments:
    * contest_participants - List of contest participation statistics.
    """

    # Sorting the contest participants by rank.
    contest_participants.sort(key=lambda x: x["rank"])

    contest_standings = [
        {
            "handle": contest_participant["handle"],
            "global_rank": contest_participant["rank"],
            "organization_rank": index + 1,
            "old_rating": contest_participant["old_rating"],
            "new_rating": contest_participant["new_rating"],
        }
        for index, contest_participant in enumerate(contest_participants)
    ]

    return contest_standings
