"""
Contains user-related endpoints exposed externally. The endpoints are grouped
under the /users blueprint.
"""

from flask import Blueprint, jsonify

from application.models.models import (
    Contest,
    ProblemSolved,
    SubmissionStatistics,
    User,
    ContestParticipant,
)
from application.services.contests import get_user_contest_statistics
from application.services.problems import get_user_problems_statistics
from application.utils.common import row_to_dict, get_all_rows_as_dict


# Blueprint for user-related endpoints
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
    return jsonify(users), 200


@users_routes.route("/<handle>", methods=["GET"])
def get_user_information(handle: str):
    """
    Returns information of a specific user in the organization.

    Arguments:
    * handle - The handle of the user. Supplied as part of the URL.
    """

    # Checking if the user exists
    user = User.query.get(handle)
    if not user:
        return jsonify({"error": "User not found."}), 404
    else:
        user = row_to_dict(user)

    return jsonify(user), 200


"""
User contest participation statistics.
"""


@users_routes.route("/contests-participated", methods=["GET"])
def get_all_users_contests_participated():
    """
    Returns statistics of contests given by all users in the organization.
    """

    # Getting all users and contests
    users = get_all_rows_as_dict(User.query.all())
    contests = get_all_rows_as_dict(Contest.query.all())

    contest_statistics = {}

    for user in users:
        # Getting contest participation statistics for all users from database
        contests_participated = get_all_rows_as_dict(
            ContestParticipant.query.filter_by(handle=user["handle"]).all()
        )

        # Parsing the data to extract the important statistics
        contest_statistics[user["handle"]] = get_user_contest_statistics(
            contests, contests_participated
        )

    return jsonify(contest_statistics), 200


@users_routes.route("/<handle>/contests-participated", methods=["GET"])
def get_user_contests_participated(handle: str):
    """
    Returns statistics of contests given by a specific user.

    Arguments:
    * handle - The handle of the user. Supplied as part of the URL.
    """

    # Checking if the user exists
    user = User.query.get(handle)
    if not user:
        return jsonify({"error": "User not found."}), 404
    else:
        user = row_to_dict(user)

    # Obtaining all contests
    contests = get_all_rows_as_dict(Contest.query.all())

    # Obtaining contest participation statistics for the user from the database
    contests_participated = get_all_rows_as_dict(
        ContestParticipant.query.filter_by(handle=handle).all()
    )

    # Parsing the data to extract the important statistics
    contest_statistics = get_user_contest_statistics(
        contests,
        contests_participated,
        rating_history=True,
        user_creation_date=user["creation_date"],
    )

    return jsonify(contest_statistics), 200


"""
User problem solved statistics.
"""


@users_routes.route("/problems-solved", methods=["GET"])
def get_all_users_problems_solved():
    """
    Returns statistics of problems solved and submissions made by all users in the organization.
    """

    # Getting all users
    users = get_all_rows_as_dict(User.query.all())

    # Obtaining the problem solved statistics for all users
    problem_statistics = {}

    for user in users:
        problems_solved = get_all_rows_as_dict(
            ProblemSolved.query.filter_by(handle=user["handle"]).all()
        )
        problem_statistics[user["handle"]] = get_user_problems_statistics(
            problems_solved
        )

    # Obtaining the submission statistics for all users
    submission_statistics = get_all_rows_as_dict(SubmissionStatistics.query.all())

    statistics = {
        "problem_statistics": problem_statistics,
        "submission_statistics": submission_statistics,
    }

    return jsonify(statistics), 200


@users_routes.route("/<handle>/problems-solved", methods=["GET"])
def get_user_problems_solved(handle: str):
    """
    Returns statistics of problems solved and submissions made by a specific user.

    Arguments:
    * handle - The handle of the user. Supplied as part of the URL.
    """

    # Checking if the user exists
    user = User.query.get(handle)
    if not user:
        return jsonify({"error": "User not found."}), 404
    else:
        user = row_to_dict(user)

    # Obtaining problem solved and submission statistics for the user from the database
    problems_solved = get_all_rows_as_dict(
        ProblemSolved.query.filter_by(handle=handle).all()
    )
    problem_statistics = get_user_problems_statistics(problems_solved)
    submission_statistics = row_to_dict(SubmissionStatistics.query.get(handle))

    statistics = {
        "problem_statistics": problem_statistics,
        "submission_statistics": submission_statistics,
    }

    return jsonify(statistics), 200
