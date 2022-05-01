"""
Contains problem-related endpoints exposed externally. The endpoints are grouped
under the /problems blueprint.
"""

from flask import Blueprint, jsonify

from application.models.models import Metadata, Problem
from application.utils.common import (
    get_all_rows_as_dict,
    convert_datestring_to_datetime,
)


# Blueprint for problem-related endpoints
problems_routes = Blueprint("problems_routes", __name__)


@problems_routes.route("/", methods=["GET"])
def get_all_problems():
    """
    Returns all problems.
    """

    problems = get_all_rows_as_dict(Problem.query.all())
    return (
        jsonify(
            {
                "last_update_time": convert_datestring_to_datetime(
                    Metadata.query.get("last_update_time").value,
                    "%Y-%m-%d %H:%M:%S.%f%z",
                ),
                "problems": problems,
            }
        ),
        200,
    )
