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
    return (
        jsonify(
            {
                "last_update_time": Metadata.query.get("last_update_time").value,
                "problems": problems,
            }
        ),
        200,
    )
