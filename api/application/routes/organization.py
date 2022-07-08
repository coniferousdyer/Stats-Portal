"""
Contains organization-related endpoints exposed externally. The endpoints are grouped
under the /organization blueprint.
"""

from flask import Blueprint, jsonify
from os import environ
from dotenv import load_dotenv

from application.models.models import Metadata


load_dotenv()


organization_routes = Blueprint("organization_routes", __name__)


@organization_routes.route("/name", methods=["GET"])
def get_organization_name():
    """
    Returns the organization name.
    """

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
                "organization_name": environ.get("ORGANIZATION_NAME", ""),
            }
        ),
        200,
    )
