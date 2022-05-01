"""
Contains organization-related endpoints exposed externally. The endpoints are grouped
under the /organization blueprint.
"""

from flask import Blueprint, jsonify
from dotenv import load_dotenv
from os import environ

from application.models.models import Metadata, Organization
from application.utils.common import row_to_dict, convert_datestring_to_datetime


load_dotenv()


# Blueprint for organization-related endpoints
organization_routes = Blueprint("organization_routes", __name__)


@organization_routes.route("/", methods=["GET"])
def get_organization_information():
    """
    Returns the organization information.
    """

    # Check if the organization exists
    organization = Organization.query.get(environ.get("ORGANIZATION_NUMBER", ""))
    if organization is None:
        return (
            jsonify(
                {
                    "error": f"Organization with id {environ.get('ORGANIZATION_NUMBER', '')} not found."
                }
            ),
            404,
        )
    else:
        organization = row_to_dict(organization)

    return (
        jsonify(
            {
                "last_update_time": convert_datestring_to_datetime(
                    Metadata.query.get("last_update_time").value,
                    "%Y-%m-%d %H:%M:%S.%f%z",
                ),
                "organization": organization,
            }
        ),
        200,
    )
