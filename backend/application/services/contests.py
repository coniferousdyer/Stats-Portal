"""
The service functions take the data obtained from the database and transform it
into a format that is suitable for the frontend.

services/contests.py contains contest-related service functions.
"""

from datetime import datetime


def get_user_contest_statistics(
    contests_participated: list[dict],
    rating_history: bool = False,
    user_creation_date: any = None,
):
    """
    Returns the contest participation statistics for a single user.
    * Total number of contests given.
    * Highest rating change.
    * Rating change history (if rating_history is True).

    Arguments:
    * contests_participated - List of contest participation statistics for the user.
    * rating_history - Boolean flag indicating whether the rating history of the user should be returned.
    * user_creation_date - User's account creation date. Relevant only if rating_history is True.
    """

    contest_statistics = {}

    # Finding the user's highest rating change
    contest_statistics["highest_rating_change"] = max(
        [
            contest_participated["rating_change"]
            for contest_participated in contests_participated
        ]
    )

    # Finding total number of contests participated
    contest_statistics["total_number_participated"] = len(contests_participated)

    if rating_history:
        # Finding the date of the user's first contest. We need this to find the user's initial rating.
        first_contest_date = contests_participated[0]["rating_update_time"]
        initial_rating = 1500 if first_contest_date < datetime(2020, 6, 1) else 0

        # Initializing the rating history list. We will append to it as we go.
        # We store it in this format because:
        # - ApexCharts expects it in this format for its time series plot.
        # - It is regardless a clear format with only the naming being a slight issue.
        ratings_list = [
            {"x": user_creation_date.strftime("%Y-%m-%d"), "y": initial_rating}
        ]

        for contest_participated in contests_participated:
            rating_update_time = contest_participated["rating_update_time"]
            previous_contest_rating = ratings_list[-1]["y"]

            # Appending the rating change to the rating history list
            ratings_list.append(
                {
                    "x": rating_update_time.strftime("%Y-%m-%d"),
                    "y": previous_contest_rating
                    + contest_participated["rating_change"],
                }
            )

        # Adding the rating history to the contest statistics
        contest_statistics["rating_history"] = ratings_list

    return contest_statistics


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
