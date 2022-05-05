"""
Contains user-related endpoints exposed externally. The endpoints are grouped
under the /users blueprint.
"""

from flask import Blueprint, jsonify

from application.models.models import (
    Metadata,
    Contest,
    ProblemSolved,
    User,
    ContestParticipant,
)
from application.helpers.contests import get_contest_statistics
from application.helpers.problems import get_problems_statistics
from application.utils.common import (
    row_to_dict,
    get_all_rows_as_dict,
    convert_datestring_to_datetime,
)


users_routes = Blueprint("users_routes", __name__)


"""
User information.
"""


@users_routes.route("/", methods=["GET"])
def get_all_users_information():
    """
    Returns information of all users in the organization.
    """

    users = get_all_rows_as_dict(User.query.all())
    return (
        jsonify(
            {
                "last_update_time": convert_datestring_to_datetime(
                    Metadata.query.get("last_update_time").value,
                    "%Y-%m-%d %H:%M:%S.%f%z",
                ),
                "users": users,
            }
        ),
        200,
    )


@users_routes.route("/<handle>", methods=["GET"])
def get_user_information(handle: str):
    """
    Returns information of a specific user in the organization.

    Arguments:
    * handle - The handle of the user. Supplied as part of the URL.
    """

    # Checking if the user exists.
    user = User.query.get(handle)
    if not user:
        return jsonify({"error": "User not found."}), 404
    else:
        user = row_to_dict(user)

    return (
        jsonify(
            {
                "last_update_time": convert_datestring_to_datetime(
                    Metadata.query.get("last_update_time").value,
                    "%Y-%m-%d %H:%M:%S.%f%z",
                ),
                "user": user,
            }
        ),
        200,
    )


"""
User contest participation statistics.
"""


@users_routes.route("/contests-participated", methods=["GET"])
def get_all_users_contests_participated():
    """
    Returns statistics of contests given by all users in the organization.
    """

    users = get_all_rows_as_dict(User.query.all())
    contests = get_all_rows_as_dict(Contest.query.all())

    contest_statistics = {}

    for user in users:
        # Finding the contests participated by the user.
        contests_participated = get_all_rows_as_dict(
            ContestParticipant.query.filter_by(handle=user["handle"]).all()
        )

        contest_statistics[user["handle"]] = get_contest_statistics(
            contests, contests_participated
        )

    return (
        jsonify(
            {
                "last_update_time": convert_datestring_to_datetime(
                    Metadata.query.get("last_update_time").value,
                    "%Y-%m-%d %H:%M:%S.%f%z",
                ),
                "contest_statistics": contest_statistics,
            }
        ),
        200,
    )


@users_routes.route("/<handle>/contests-participated", methods=["GET"])
def get_user_contests_participated(handle: str):
    """
    Returns statistics of contests given by a specific user.

    Arguments:
    * handle - The handle of the user. Supplied as part of the URL.
    """

    # Checking if the user exists.
    user = User.query.get(handle)
    if not user:
        return jsonify({"error": "User not found."}), 404
    else:
        user = row_to_dict(user)

    contests = get_all_rows_as_dict(Contest.query.all())

    # Obtaining contest participation statistics for the user from the database.
    contests_participated = get_all_rows_as_dict(
        ContestParticipant.query.filter_by(handle=handle).all()
    )

    # For single users, we do require the rating history.
    contest_statistics = get_contest_statistics(
        contests, contests_participated, rating_history=True
    )

    return (
        jsonify(
            {
                "last_update_time": convert_datestring_to_datetime(
                    Metadata.query.get("last_update_time").value,
                    "%Y-%m-%d %H:%M:%S.%f%z",
                ),
                "contest_statistics": contest_statistics,
            }
        ),
        200,
    )


"""
User problem solved statistics.
"""


@users_routes.route("/problems-solved", methods=["GET"])
def get_all_users_problems_solved():
    """
    Returns statistics of problems solved and submissions made by all users in the organization.
    """

    users = get_all_rows_as_dict(User.query.all())

    problem_statistics = {}

    for user in users:
        # Finding the problems solved by the user.
        problems_solved = get_all_rows_as_dict(
            ProblemSolved.query.filter_by(handle=user["handle"]).all()
        )

        problem_statistics[user["handle"]] = get_problems_statistics(problems_solved)

    return (
        jsonify(
            {
                "last_update_time": convert_datestring_to_datetime(
                    Metadata.query.get("last_update_time").value,
                    "%Y-%m-%d %H:%M:%S.%f%z",
                ),
                "problem_statistics": problem_statistics,
            }
        ),
        200,
    )


@users_routes.route("/<handle>/problems-solved", methods=["GET"])
def get_user_problems_solved(handle: str):
    """
    Returns statistics of problems solved and submissions made by a specific user.

    Arguments:
    * handle - The handle of the user. Supplied as part of the URL.
    """

    # Checking if the user exists.
    user = User.query.get(handle)
    if not user:
        return jsonify({"error": "User not found."}), 404
    else:
        user = row_to_dict(user)

    # Obtaining problems solved by the user from the database.
    problems_solved = get_all_rows_as_dict(
        ProblemSolved.query.filter_by(handle=handle).all()
    )

    problem_statistics = get_problems_statistics(problems_solved)

    return (
        jsonify(
            {
                "last_update_time": convert_datestring_to_datetime(
                    Metadata.query.get("last_update_time").value,
                    "%Y-%m-%d %H:%M:%S.%f%z",
                ),
                "problem_statistics": problem_statistics,
            }
        ),
        200,
    )
