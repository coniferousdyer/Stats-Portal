"""
The service functions take the data obtained from the database and transform it
into a format that is suitable for the frontend.

services/contests.py contains contest-related service functions.
"""

from datetime import datetime


def summarize_contest_information(
    contest_participants: list[dict],
    rating_history: bool,
    user_creation_date: any,
):
    """
    Given the list of contests given, returns:
    * Total number of contests given.
    * Highest and lowest rating change.
    * Best and worst contest ranks.
    * Rating change history (if rating_history is True).

    Arguments:
    * contest_participants - List of contest participation statistics.
    * rating_history - Boolean flag indicating whether the rating history of the user should be returned.
    * user_creation_date - User's account creation date. Relevant only if rating_history is True.
    """

    statistics = {}

    # Total number of contests participated
    statistics["total_number_participated"] = len(contest_participants)

    # If the user did not participate in any contest, then there is no need to continue
    if contest_participants:
        # Highest and lowest rating change
        statistics["highest_rating_change"] = max(
            contest["rating_change"] for contest in contest_participants
        )
        statistics["lowest_rating_change"] = min(
            contest["rating_change"] for contest in contest_participants
        )

        # The goal of lowest rating change is basically to find the highest rating decrease.
        # If the user's lowest rating change is positive, then the user's highest rating decrease is "None".
        if statistics["lowest_rating_change"] > 0:
            statistics["lowest_rating_change"] = "None"

        # Best and worst contest ranks
        statistics["best_rank"] = min(
            contest["rank"] for contest in contest_participants
        )
        statistics["worst_rank"] = max(
            contest["rank"] for contest in contest_participants
        )

        # Rating change history
        if rating_history:
            # Finding the date of the user's first contest. We need this to find the user's initial rating.
            first_contest_date = contest_participants[0]["rating_update_time"]
            initial_rating = 1500 if first_contest_date < datetime(2020, 6, 1) else 0

            # Initializing the rating history list. We will append to it as we go.
            # We store it in the format of [{"date": datetime, "rating": int}, ...]
            ratings_list = [
                {
                    "date": user_creation_date.strftime("%Y-%m-%d"),
                    "rating": initial_rating,
                }
            ]

            for contest_participated in contest_participants:
                rating_update_time = contest_participated["rating_update_time"]
                previous_contest_rating = ratings_list[-1]["rating"]

                # Appending the rating change to the rating history list
                ratings_list.append(
                    {
                        "date": rating_update_time.strftime("%Y-%m-%d"),
                        "rating": previous_contest_rating
                        + contest_participated["rating_change"],
                    }
                )

            # Adding the rating history to the contest statistics
            statistics["rating_history"] = ratings_list

    return statistics


def get_user_contest_statistics(
    contests: list[dict],
    contest_participants: list[dict],
    rating_history: bool = False,
    user_creation_date: any = None,
):
    """
    Extracts the relevant statistics (all-time, this month, this week, today) from
    the given list of contest participants.

    Arguments:
    * contests - List of contests.
    * contest_participants - List of contest participation statistics.
    * rating_history - Boolean flag indicating whether the rating history of the user should be returned.
    * user_creation_date - User's account creation date. Relevant only if rating_history is True.
    """

    this_month_contests, this_week_contests, today_contests = [], [], []

    for contest_participant in contest_participants:
        # Finding the date of the contest
        contest_date = next(
            (
                contest["date"]
                for contest in contests
                if contest["contest_id"] == contest_participant["contest_id"]
            )
        )

        # If contest was in this month
        if (
            contest_date.month == datetime.now().month
            and contest_date.year == datetime.now().year
        ):
            this_month_contests.append(contest_participant)
        # If contest was in this week
        if (
            contest_date.isocalendar()[1] == datetime.now().isocalendar()[1]
            and contest_date.year == datetime.now().year
        ):
            this_week_contests.append(contest_participant)
        # If contest was today
        if (
            contest_date.day == datetime.now().day
            and contest_date.month == datetime.now().month
            and contest_date.year == datetime.now().year
        ):
            today_contests.append(contest_participant)

    # We call summarize_problems_information to obtain the statistics. At each turn,
    # we filter the list of contests given according to the time period we are interested in.
    statistics = {
        "all_time": summarize_contest_information(
            contest_participants, rating_history, user_creation_date
        ),
        "this_month": summarize_contest_information(
            this_month_contests, rating_history, user_creation_date
        ),
        "this_week": summarize_contest_information(
            this_week_contests, rating_history, user_creation_date
        ),
        "today": summarize_contest_information(
            today_contests, rating_history, user_creation_date
        ),
    }

    return statistics


def sort_contest_participants(contest_participants: list[dict]):
    """
    Sorts, formats and returns the list of contest participants in order of
    increasing rank in the contest.

    Arguments:
    * contest_participants - List of contest participation statistics.
    """

    # Sorting the contest participants by rank
    contest_participants.sort(key=lambda x: x["rank"])

    # # Formatting the contest participants
    contest_standings = [
        {
            "handle": contest_participant["handle"],
            "global_rank": contest_participant["rank"],
            "organization_rank": index + 1,
            "rating_change": contest_participant["rating_change"],
        }
        for index, contest_participant in enumerate(contest_participants)
    ]

    return contest_standings
