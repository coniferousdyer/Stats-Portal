"""
Contains contest-related endpoints exposed externally. The endpoints are grouped
under the /contests blueprint.
"""

from flask import Blueprint, jsonify

from application.models.models import Metadata, Contest, ContestParticipant
from application.helpers.contests import sort_contest_participants
from application.utils.common import get_all_rows_as_dict, row_to_dict


contests_routes = Blueprint("contests_routes", __name__)


@contests_routes.route("/", methods=["GET"])
def get_all_contests():
    """
    Returns all contests.
    """

    contests = get_all_rows_as_dict(Contest.query.all())
    last_update_time = Metadata.query.get("last_update_time")

    # If the database was not updated, last_update_time will not be set in the database.
    # In this case, we set it to "NONE".
    if last_update_time is not None:
        last_update_time = last_update_time.value
    else:
        last_update_time = "NONE"

    return (
        jsonify(
            {
                "last_update_time": last_update_time,
                "contests": contests,
            }
        ),
        200,
    )


@contests_routes.route("/<int:contest_id>", methods=["GET"])
def get_contest(contest_id: int):
    """
    Returns the contest with the given id.

    Arguments:
    * contest_id - The id of the contest.
    """

    # Check if the contest exists.
    contest = Contest.query.get(contest_id)
    if contest is None:
        return (
            jsonify({"error": f"Contest with id {contest_id} not found."}),
            404,
        )
    else:
        contest = row_to_dict(contest)

    last_update_time = Metadata.query.get("last_update_time")

    # If the database was not updated, last_update_time will not be set in the database.
    # In this case, we set it to "NONE".
    if last_update_time is not None:
        last_update_time = last_update_time.value
    else:
        last_update_time = "NONE"

    return (
        jsonify(
            {
                "last_update_time": last_update_time,
                "contest": contest,
            }
        ),
        200,
    )


@contests_routes.route("/<int:contest_id>/standings", methods=["GET"])
def get_contest_standings(contest_id: int):
    """
    Returns the standings among the organization's users for the contest with the given id.

    Arguments:
    * contest_id - The id of the contest.
    """

    # Check if the contest exists. We must check the contest because it is possible
    # that the contest exists, but no one in the organization participated.
    contest = Contest.query.get(contest_id)
    if contest is None:
        return (
            jsonify({"error": f"Contest with id {contest_id} not found."}),
            404,
        )

    # Get the participants' list.
    contest_participants = get_all_rows_as_dict(
        ContestParticipant.query.filter_by(contest_id=contest_id)
    )

    contest_standings = sort_contest_participants(contest_participants)

    last_update_time = Metadata.query.get("last_update_time")

    # If the database was not updated, last_update_time will not be set in the database.
    # In this case, we set it to "NONE".
    if last_update_time is not None:
        last_update_time = last_update_time.value
    else:
        last_update_time = "NONE"

    return (
        jsonify(
            {
                "last_update_time": last_update_time,
                "contest_standings": contest_standings,
            }
        ),
        200,
    )
