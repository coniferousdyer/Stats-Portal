"""
Contains the necessary fixtures for pytest tests.
"""

import pytest

from application import create_app
from application.models.orm import db


@pytest.fixture()
def env_setup(monkeypatch):
    """
    Sets up the environment for the tests.
    """

    # Define the environment variables for the testing environment
    env = {
        "FLASK_ENV": "development",  # This is optional, since TestingConfig already has FLASK_ENV set to development
        "SECRET_KEY": "test_secret",
        "SQLALCHEMY_DATABASE_DIR": "",  # This is optional, since TestingConfig sets the database to an in-memory one
        "SQLALCHEMY_METADATA_DIR": "",  # This is optional, since TestingConfig sets the database to an in-memory one
        "ORGANIZATION_NUMBER": "1",
        "APPLICATION_HOST": "0.0.0.0",
        "APPLICATION_PORT": "5000",
        "SENTRY_DSN": "",  # We don't want to send any errors to Sentry during testing
        "TIMEZONE": "Asia/Kolkata",
        "LOG_DIR": "",  # Supplying an empty path will disable logging to a file
    }

    # Set the environment variables
    for key, value in env.items():
        monkeypatch.setenv(key, value)

    yield


@pytest.fixture
def app(env_setup):
    """
    Creates the application and configures it in testing mode.
    """

    # Create the application in testing mode
    app = create_app("application.config.TestingConfig")

    # The entrypoint for subsequent tests
    yield app

    # Remove the database
    with app.app_context():
        db.drop_all()


@pytest.fixture
def client(app):
    """
    Creates a test client for the application.
    """

    # Create and return the test client
    return app.test_client()
