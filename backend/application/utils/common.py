"""
Contains common utility functions required for the application.
"""

from datetime import date, datetime


def convert_timestamp_to_datetime(timestamp: int):
    """
    Converts a timestamp to DateTime format.

    Arguments:
    * timestamp - Timestamp to convert.
    """

    result_date = date.fromtimestamp(timestamp)

    if isinstance(result_date, date):
        result_date = result_date.isoformat()

    return result_date


def convert_datestring_to_datetime(datestring: str):
    """
    Converts a datestring to a DateTime objext.

    Arguments:
    * datestring - The datestring of format (%Y-%m-%d) to convert.
    """

    return datetime.strptime(datestring, "%Y-%m-%d")
