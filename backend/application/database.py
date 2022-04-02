from flask import Flask
from datetime import datetime
from os import environ
from pytz import timezone

from application.utils.common import convert_datestring_to_datetime
from application.models.orm import db
from application.models.models import (
    Contest,
    Problem,
    User,
    ContestParticipant,
    ProblemStatistics,
    ProblemIndexes,
    ProblemRatings,
    ProblemTags,
    Metadata,
)


"""
Database deletion functions.
"""


def clear_db_tables(app: Flask):
    """
    Clears all tables in the database.

    Arguments:
    * app - The Flask application.
    """

    with app.app_context():
        Contest.query.delete()
        Problem.query.delete()
        User.query.delete()
        ContestParticipant.query.delete()
        ProblemStatistics.query.delete()
        ProblemIndexes.query.delete()
        ProblemRatings.query.delete()
        ProblemTags.query.delete()


"""
Database addition functions.
"""


def add_users_to_db(app: Flask, users: list[dict]):
    """
    Add the users to the database.

    Arguments:
    * app - The Flask application.
    * users - List of users to add to the database.
    """

    with app.app_context():
        for user in users:
            # Convert the datestring to datetime object
            user["creation_date"] = convert_datestring_to_datetime(
                user["creation_date"]
            )

            # Add the user to the database
            db.session.add(User(**user))
            db.session.commit()


def add_contests_to_db(app: Flask, contests: list[dict]):
    """
    Add the contests to the database.

    Arguments:
    * app - The Flask application.
    * contests - List of contests to add to the database.
    """

    with app.app_context():
        for contest in contests:
            # Convert the datestring to datetime object
            contest["date"] = convert_datestring_to_datetime(contest["date"])

            # Add the contest to the database
            db.session.add(Contest(**contest))
            db.session.commit()


def add_contest_participants_to_db(app: Flask, contest_participants: list[dict]):
    """
    Add the contest participants to the database.

    Arguments:
    * app - The Flask application.
    * contest_participants - List of contest participation statistics to add to the database.
    """

    with app.app_context():
        # contest_participants is a list of contest participation statistics dictionaries
        # Each list corresponds to a user
        for contest_participant in contest_participants:
            for contest in contest_participant:
                # Convert the datestring to datetime object
                contest["rating_update_time"] = convert_datestring_to_datetime(
                    contest["rating_update_time"]
                )

                # Add the contest participant to the database
                db.session.add(ContestParticipant(**contest))
                db.session.commit()


def add_problems_to_db(app: Flask, problems: list[dict]):
    """
    Add the problems to the database.

    Arguments:
    * app - The Flask application.
    * problems - List of problems to add to the database.
    """

    with app.app_context():
        for problem in problems:
            # Add the problem to the database
            db.session.add(Problem(**problem))
            db.session.commit()


def add_problems_statistics_to_db(app: Flask, problems_statistics: list[dict]):
    """
    Add the problems statistics to the database.

    Arguments:
    * app - The Flask application.
    * problems_statistics - List of problems statistics to add to the database.
    """

    with app.app_context():
        for problem_statistics in problems_statistics:
            # Add the problem statistics to the database
            db.session.add(ProblemStatistics(**problem_statistics["submission_statistics"]))
            db.session.add(ProblemTags(**problem_statistics["tags"]))
            db.session.add(ProblemIndexes(**problem_statistics["indexes"]))
            db.session.add(ProblemRatings(**problem_statistics["ratings"]))
            db.session.commit()


"""
Metadata-related functions.
"""


def get_last_update_time(app: Flask):
    """
    Gets/stores the last time the database was updated.

    Arguments:
    * app - The Flask application.
    """

    with app.app_context():
        metadata_last_update_time = Metadata.query.get("last_update_time")

        # If the metadata doesn't exist, create it
        if metadata_last_update_time is None:
            metadata = Metadata(
                key="last_update_time",
                value=datetime.now(timezone(environ.get("TIMEZONE"))),
            )
            db.session.add(metadata)
            db.session.commit()
        else:
            metadata_last_update_time.value = datetime.now(
                timezone(environ.get("TIMEZONE"))
            )
            db.session.commit()


"""
General database-related functions.
"""


def update_db(
    app: Flask,
    contests: list[dict],
    problems: list[dict],
    users_information: list[dict],
    users_contests: list[dict],
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

    # Clear all database tables
    clear_db_tables(app)

    # Add the updated information to the database
    add_contests_to_db(app, contests)
    add_problems_to_db(app, problems)
    add_users_to_db(app, users_information)
    add_contest_participants_to_db(app, users_contests)
    add_problems_statistics_to_db(app, users_problems)

    # Update the last database update time
    get_last_update_time(app)
