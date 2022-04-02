"""
Contains user-related endpoints exposed externally. The endpoints are grouped
under the /users blueprint.
"""

from flask import Blueprint, jsonify

from application.models.models import (
    ProblemStatistics,
    ProblemIndexes,
    ProblemRatings,
    ProblemTags,
    User,
    ContestParticipant,
)
from application.services.contests import get_user_contest_statistics
from application.services.problems import get_all_users_problem_statistics
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
    Returns statistics of contests given by all users in tbe organization.
    """

    # Getting all users
    users = get_all_rows_as_dict(User.query.all())

    contest_statistics = {}

    for user in users:
        # Getting contest participation statistics for all users
        contests_participated = get_all_rows_as_dict(
            ContestParticipant.query.filter_by(handle=user["handle"])
        )

        # In this case, we do not need rating history. Note that rating_history is
        # set to False by default.
        contest_statistics[user["handle"]] = get_user_contest_statistics(
            contests_participated
        )

    return jsonify(contest_statistics), 200


@users_routes.route("/<handle>/contests-participated", methods=["GET"])
def get_user_contests_participated(handle: str):
    """
    Returns statistics of contests given by a specific user.
    * Total number of contests given.
    * Highest rating change.
    * Rating change history (if specified).

    Arguments:
    * handle - The handle of the user. Supplied as part of the URL.
    """

    # Checking if the user exists
    user = User.query.get(handle)
    if not user:
        return jsonify({"error": "User not found."}), 404
    else:
        user = row_to_dict(user)

    # Obtaining contest participation statistics for the user from the database
    contests_participated = get_all_rows_as_dict(
        ContestParticipant.query.filter_by(handle=handle).all()
    )

    # Extracting the relevant information from the above statistics
    contest_statistics = get_user_contest_statistics(
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
    Returns statistics of problems solved by all users in the organization.
    """

    # Obtaining the problem solved statistics for all users
    submission_statistics = get_all_rows_as_dict(ProblemStatistics.query.all())
    tags = get_all_rows_as_dict(ProblemTags.query.all())
    ratings = get_all_rows_as_dict(ProblemRatings.query.all())
    indexes = get_all_rows_as_dict(ProblemIndexes.query.all())

    # Obtaining the problem solved statistics for the organization.
    # We do this by summing up the value of each attribute for the metric
    # across all users.
    problem_statistics = get_all_users_problem_statistics(
        submission_statistics, tags, ratings, indexes
    )

    return jsonify(problem_statistics), 200


@users_routes.route("/<handle>/problems-solved", methods=["GET"])
def get_user_problems_solved(handle: str):
    """
    Returns statistics of problems solved by a specific user.
    * Total number of problems solved.
    * Number of problems solved per tag.
    * Number of problems solved per index.
    * Number of problems solved per rating.

    Arguments:
    * handle - The handle of the user. Supplied as part of the URL.
    """

    # Checking if the user exists
    user = User.query.get(handle)
    if not user:
        return jsonify({"error": "User not found."}), 404
    else:
        user = row_to_dict(user)

    # Obtaining problem solved statistics for the user from the database
    problem_statistics = {
        "submission_statistics": row_to_dict(ProblemStatistics.query.get(handle)),
        "tags": row_to_dict(ProblemTags.query.get(handle)),
        "indexes": row_to_dict(ProblemIndexes.query.get(handle)),
        "ratings": row_to_dict(ProblemRatings.query.get(handle)),
    }

    return jsonify(problem_statistics), 200
