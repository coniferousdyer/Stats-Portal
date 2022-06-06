from flask import Flask
from datetime import datetime
from os import environ
from pytz import timezone

from application.utils.common import (
    convert_datestring_to_datetime,
    convert_datetime_to_datestring,
)
from application.models.orm import db
from application.models.models import (
    Contest,
    Problem,
    ProblemSolved,
    User,
    ContestParticipant,
    Metadata,
)


"""
Database deletion functions.
"""


def clear_db_tables():
    """
    Clears all tables in the database (except Metadata).
    """

    Contest.query.delete()
    Problem.query.delete()
    User.query.delete()
    ContestParticipant.query.delete()
    ProblemSolved.query.delete()


"""
Database addition functions.
"""


def add_users_to_db(users: list[dict]):
    """
    Add the users to the database.

    Arguments:
    * users - List of users to add to the database.
    """

    for user in users:
        # Convert the datestring to datetime object.
        user["creation_date"] = convert_datestring_to_datetime(user["creation_date"])
        db.session.add(User(**user))


def add_contests_to_db(contests: list[dict]):
    """
    Add the contests to the database.

    Arguments:
    * contests - List of contests to add to the database.
    """

    for contest in contests:
        # Convert the datestring to datetime object.
        contest["date"] = convert_datestring_to_datetime(contest["date"])
        db.session.add(Contest(**contest))


def add_contest_participants_to_db(contest_participants: list[list[dict]]):
    """
    Add the contest participants to the database.

    Arguments:
    * contest_participants - List of contest participation statistics to add to the database.
    """

    # contest_participants is a list of contest participation statistics dictionaries
    # Each list corresponds to a user.
    for contest_participant in contest_participants:
        for contest in contest_participant:
            # Convert the datestring to datetime object.
            contest["rating_update_time"] = convert_datestring_to_datetime(
                contest["rating_update_time"]
            )
            db.session.add(ContestParticipant(**contest))


def add_problems_to_db(problems: list[dict]):
    """
    Add the problems to the database.

    Arguments:
    * problems - List of problems to add to the database.
    """

    for problem in problems:
        db.session.add(Problem(**problem))


def add_problems_solved_to_db(problems_solved: list[dict]):
    """
    Add the problems statistics to the database.

    Arguments:
    * problems_solved - List of problems solved statistics to add to the database.
    """

    for problem_solved in problems_solved:
        for problem in problem_solved:
            # Convert the datestring to datetime object.
            problem["solved_time"] = convert_datestring_to_datetime(
                problem["solved_time"]
            )
            db.session.add(ProblemSolved(**problem))


"""
Metadata-related functions.
"""


def store_last_update_time():
    """
    Stores the last time the database was updated.
    """

    time_zone = environ.get("TIMEZONE", "Asia/Kolkata")

    metadata_last_update_time = Metadata.query.get("last_update_time")

    # If the metadata doesn't exist, create it.
    if metadata_last_update_time is None:
        metadata = Metadata(
            key="last_update_time",
            value=convert_datetime_to_datestring(
                datetime.now(timezone(time_zone)), "%d %B %Y, %H:%M:%S %Z"
            ),
        )
        db.session.add(metadata)
    else:
        metadata_last_update_time.value = convert_datetime_to_datestring(
            datetime.now(timezone(time_zone)), "%d %B %Y, %H:%M:%S %Z"
        )


"""
General database-related functions.
"""


def update_db(
    app: Flask,
    contests: list[dict],
    problems: list[dict],
    users_information: list[dict],
    users_contests: list[list[dict]],
    users_problems: list[dict],
):
    """
    Updates the database with the latest data from the Codeforces API.

    Arguments:
    * app - The Flask application.
    * contests - List of all the contests.
    * problems - List of all the problems.
    * users_information - List of all the users' information.
    * users_contests - List of all the users' contests participated in.
    * users_problems - List of all the users' solved problems.
    """

    with app.app_context():
        # Clear all database tables.
        clear_db_tables()

        # Add the updated information to the database.
        add_contests_to_db(contests)
        add_problems_to_db(problems)
        add_users_to_db(users_information)
        add_contest_participants_to_db(users_contests)
        add_problems_solved_to_db(users_problems)

        # Update the last database update time.
        store_last_update_time()

        # Commit the changes to the database, and rollback if an error occurs.
        # Essentiallly, if there is any error, the database is not updated, ensuring
        # that the database state remains consistent and some data is not lost.
        try:
            db.session.commit()
            app.logger.info("UPDATED DATABASE.")
        except Exception as e:
            app.logger.exception(f"ERROR OCCURRED DURING DATABASE UPDATION: {e}")
            db.session.rollback()
