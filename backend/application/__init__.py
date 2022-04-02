"""
The main application package. The application is created and configured here.
"""

from flask import Flask
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from datetime import datetime
from os import environ, path, mkdir
from dotenv import load_dotenv
from logging import basicConfig, INFO
from logging.handlers import RotatingFileHandler

from application.models.orm import db
from application.codeforces.organization import (
    get_organization_user_handles,
    get_organization_users_contests,
    get_organization_users_problems,
    get_organization_users_information,
)
from application.codeforces.contests import get_all_contests
from application.codeforces.problems import get_all_problems
from application.database import update_db


# Load environment variables from the .env file
load_dotenv()


def perform_update(app: Flask):
    """
    Performs a scheduled update to the database.

    Arguments:
    * app - The Flask application.
    """

    # 1. List of handles of users of the organization
    handles = get_organization_user_handles()
    app.logger.info(
        f"{len(handles)} HANDLES FOUND IN {environ.get('ORGANIZATION_NAME')}."
    )

    # 2. Get the required information from the Codeforces API.

    # List of all the contests
    contests = get_all_contests()
    app.logger.info(f"{len(contests)} CONTESTS RETRIEVED.")

    # List of all the problems
    problems = get_all_problems()
    app.logger.info(f"{len(problems)} PROBLEMS RETRIEVED.")

    # Obtain the information of the users
    users_information = get_organization_users_information(handles)
    app.logger.info(f"{len(users_information)} USERS' INFORMATION RETRIEVED.")

    # Obtain the contests statistics of the users
    users_contests = get_organization_users_contests(handles)
    app.logger.info(f"{len(users_contests)} USERS' CONTESTS RETRIEVED.")

    # Obtain the problems statistics of the users
    users_problems = get_organization_users_problems(handles)
    app.logger.info(f"{len(users_problems)} USERS' PROBLEMS RETRIEVED.")

    # 3. Update the database with the retrieved data.
    update_db(
        app, contests, problems, users_information, users_contests, users_problems
    )
    app.logger.info("UPDATED DATABASE.")


def init_logger():
    """
    Initializes the logger for the application.
    """

    # Creating a directory to store logs
    if not path.exists("application/logs"):
        mkdir("application/logs")

    # Create and configure logger
    basicConfig(
        handlers=[
            RotatingFileHandler(
                "application/logs/status.log", maxBytes=100000, backupCount=10
            )
        ],
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=INFO,
    )


def init_sentry():
    """
    Initializes the Sentry client.
    """

    sentry_sdk.init(
        dsn=environ.get("SENTRY_DSN"),
        integrations=[FlaskIntegration()],
        traces_sample_rate=1.0,
    )


def init_db(app: Flask):
    """
    Initializes the database and creates the tables.

    Arguments:
    * app - The Flask application.
    """

    from application.models.models import create_model_attrs

    # Add the dynamically created attributes to the models
    create_model_attrs()

    db.init_app(app)
    db.create_all(app=app)


def init_scheduler(app: Flask):
    """
    Initializes the scheduler and registers the jobs.

    Arguments:
    * app - The Flask application.
    """

    # Create the scheduler and register the update_db function as a job
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=perform_update,
        args=[app],
        trigger="interval",
        hours=12,
        misfire_grace_time=3600,
        # next_run_time=datetime.now(),
    )  # TODO: Decide upon the optimal interval time and misfire_grace_time
    scheduler.start()

    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())


def register_blueprints(app: Flask):
    """
    Registers the blueprints. Endpoints are grouped into blueprints depending on their purpose.

    Arguments:
    * app - The Flask application.
    """

    from application.routes.users import users_routes
    from application.routes.contests import contests_routes
    from application.routes.problems import problems_routes

    # Register the blueprints
    app.register_blueprint(users_routes, url_prefix="/users")
    app.register_blueprint(contests_routes, url_prefix="/contests")
    app.register_blueprint(problems_routes, url_prefix="/problems")


def create_app(config_filename: str):
    """
    Creates the application and configures it.

    Arguments:
    * config_filename - The name of the configuration class in config.py.
    eg. "application.config.DevelopmentConfig", "application.config.ProductionConfig"
    """

    # Create the application
    app = Flask(__name__)

    # Load the configuration class depending on the mode, from config.py
    app.config.from_object(config_filename)

    # Makes app treat route URLs with and without trailing slashes the same
    app.url_map.strict_slashes = False

    # Initialize the logger
    init_logger()

    # Initialize the Sentry client
    init_sentry()

    # Register the blueprints
    register_blueprints(app)

    # Initialize the database
    init_db(app)

    # Initialize the scheduler
    init_scheduler(app)

    return app


# TODO: Search for an alternative to passing the app around to the database functions
