"""
Contains problem-related endpoints exposed externally. The endpoints are grouped
under the /problems blueprint.
"""

from flask import Blueprint, jsonify

from application.models.models import Metadata, Problem
from application.utils.common import get_all_rows_as_dict


problems_routes = Blueprint("problems_routes", __name__)


@problems_routes.route("/", methods=["GET"])
def get_all_problems():
    """
    Returns all problems.
    """

    problems = get_all_rows_as_dict(Problem.query.all())
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
                "problems": problems,
            }
        ),
        200,
    )
