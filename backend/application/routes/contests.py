"""
Contains contest-related endpoints exposed externally. The endpoints are grouped
under the /contests blueprint.
"""

from flask import Blueprint, jsonify

from application.models.models import Contest, ContestParticipant
from application.helpers.contests import sort_contest_participants
from application.utils.common import get_all_rows_as_dict, row_to_dict


# Blueprint for contest-related endpoints
contests_routes = Blueprint("contests_routes", __name__)


@contests_routes.route("/", methods=["GET"])
def get_all_contests():
    """
    Returns all contests.
    """

    contests = get_all_rows_as_dict(Contest.query.all())
    return jsonify(contests), 200


@contests_routes.route("/<int:contest_id>", methods=["GET"])
def get_contest(contest_id: int):
    """
    Returns the contest with the given id.

    Arguments:
    * contest_id - The id of the contest.
    """

    # Check if the contest exists
    contest = Contest.query.get(contest_id)
    if contest is None:
        return (
            jsonify({"error": f"Contest with id {contest_id} not found."}),
            404,
        )
    else:
        contest = row_to_dict(contest)

    return jsonify(contest), 200


@contests_routes.route("/<int:contest_id>/standings", methods=["GET"])
def get_contest_standings(contest_id: int):
    """
    Returns the standings among the organization's users for the contest with the given id.

    Arguments:
    * contest_id - The id of the contest.
    """

    # Check if the contest exists. We must check the contest because it is possible
    # that the contest exists, but no one in the organization prticipated.
    contest = Contest.query.get(contest_id)
    if contest is None:
        return (
            jsonify({"error": f"Contest with id {contest_id} not found."}),
            404,
        )

    # Get the participants' list
    contest_participants = get_all_rows_as_dict(
        ContestParticipant.query.filter_by(contest_id=contest_id)
    )

    # Get the standings
    contest_standings = sort_contest_participants(contest_participants)

    return jsonify(contest_standings), 200
