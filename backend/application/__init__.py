"""
The main application package. The application is created and configured here.
"""

from flask import Flask, jsonify
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
        f"{len(handles)} HANDLES FOUND IN {environ.get('ORGANIZATION_NAME', '')}."
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


def register_error_handlers(app: Flask):
    """
    Registers the error handlers.

    Arguments:
    * app - The Flask application.
    """

    # 404 - Page not found
    @app.errorhandler(404)
    def page_not_found(error):
        """
        Handles 404 (page not found) errors.
        """

        app.logger.error(f"404 ERROR: {error}")
        return jsonify({"error": "Page not found"}), 404

    # 500 - Internal server error
    @app.errorhandler(500)
    def internal_server_error(error):
        """
        Handles 500 (internal server errors) errors.
        """

        # Roll back any database changes
        db.session.rollback()

        app.logger.error(f"500 ERROR: {error}")
        return jsonify({"error": "Internal server error"}), 500


def init_logger():
    """
    Initializes the logger for the application.
    """

    log_dir = environ.get("LOG_DIR", "./logs")

    # Creating a directory to store logs
    if not path.exists(log_dir):
        mkdir(log_dir)

    # Create and configure logger
    basicConfig(
        handlers=[
            RotatingFileHandler(
                path.join(log_dir, "status.log"), maxBytes=100000, backupCount=10
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
        dsn=environ.get("SENTRY_DSN", ""),
        integrations=[FlaskIntegration()],
        traces_sample_rate=1.0,
    )


def init_db(app: Flask):
    """
    Initializes the database and creates the tables.

    Arguments:
    * app - The Flask application.
    """

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


def create_app(config_class: str):
    """
    Creates the application and configures it.

    Arguments:
    * config_class - The name of the configuration class in config.py.
    eg. "application.config.DevelopmentConfig", "application.config.ProductionConfig"
    """

    # Create the application
    app = Flask(__name__)

    # Load the configuration class depending on the mode, from config.py
    app.config.from_object(config_class)

    # Makes app treat route URLs with and without trailing slashes the same
    app.url_map.strict_slashes = False

    # Initialize the logger
    init_logger()

    # Register the error handlers
    register_error_handlers(app)

    # Initialize the Sentry client
    init_sentry()

    # Register the blueprints
    register_blueprints(app)

    # Initialize the database
    init_db(app)

    # Initialize the scheduler
    init_scheduler(app)

    return app


# TODO: Take care of ContentType errors
# TODO: Look into flask extensions
# TODO: Check for db update conflicts and how to resolve them

# TODO: Consider adding tasks to queue using Celery
# TODO: Create API documentation
# TODO: Try to write tests for Codeforces functions
