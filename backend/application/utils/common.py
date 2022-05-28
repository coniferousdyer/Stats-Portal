"""
Contains common utility functions required for the application.
"""

from datetime import date, datetime

from application.models.orm import db


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


def convert_datestring_to_datetime(datestring: str, dateformat: str = "%Y-%m-%d"):
    """
    Converts a datestring to a DateTime objext.

    Arguments:
    * datestring - The datestring of format of given format to convert.
    * dateformat - The format of the datestring. Defaults to "%Y-%m-%d".
    """

    return datetime.strptime(datestring, dateformat)


def convert_datetime_to_datestring(
    datetimeobject: datetime, dateformat: str = "%Y-%m-%d"
):
    """
    Converts a datetime object to a datestring.

    Arguments:
    * datetimeobject - The datetime object to convert.
    * dateformat - The format of the datestring. Defaults to "%Y-%m-%d".
    """

    return datetimeobject.strftime(dateformat)


def row_to_dict(row: db.Model):
    """
    Converts an SQLAlchemy row/object to a dictionary.

    Arguments:
    * row - The SQLAlchemy row/object to convert.
    """
    return {c.name: getattr(row, c.name) for c in row.__table__.columns}


def get_all_rows_as_dict(rows: list[db.Model]):
    """
    Returns all SQLAlchemy rows/objects as a list of dictionaries.

    Arguments:
    * rows - The list of SQLAlchemy rows/objects to convert.
    """
    return [row_to_dict(row) for row in rows]
