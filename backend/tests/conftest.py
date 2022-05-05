"""
Contains the necessary fixtures for pytest tests.
"""

import pytest

from application import create_app
from application.models.orm import db
from application.models.models import Metadata


@pytest.fixture()
def env_setup(monkeypatch):
    """
    Sets up the environment for the tests.
    """

    # Define the environment variables for the testing environment.
    env = {
        "FLASK_ENV": "development",  # This is optional, since TestingConfig already has FLASK_ENV set to development.
        "SECRET_KEY": "test_secret",
        "SQLALCHEMY_DATABASE_DIR": "",  # This is optional, since TestingConfig sets the database to an in-memory one.
        "SQLALCHEMY_METADATA_DIR": "",  # This is optional, since TestingConfig sets the database to an in-memory one.
        "ORGANIZATION_NUMBER": "1",
        "APPLICATION_HOST": "0.0.0.0",
        "APPLICATION_PORT": "5000",
        "SENTRY_DSN": "",  # We don't want to send any errors to Sentry during testing.
        "TIMEZONE": "Asia/Kolkata",
        "LOG_DIR": "",  # Supplying an empty path will disable logging to a file.
    }

    for key, value in env.items():
        monkeypatch.setenv(key, value)

    yield


@pytest.fixture
def app(env_setup):
    """
    Creates the application and configures it in testing mode.
    """

    app = create_app("application.config.TestingConfig")

    # We add dummy metadata to the database as part of the initial setup. This
    # is actually done during the database update but we add it as a fixture as
    # part of the test setup so that the database doesn't have to be updated first.
    with app.app_context():
        db.session.add(
            Metadata(key="last_update_time", value="2022-01-01 00:00:00.000000+05:30")
        )
        db.session.commit()

    # The entrypoint for subsequent tests.
    yield app

    with app.app_context():
        db.drop_all()


@pytest.fixture
def client(app):
    """
    Creates a test client for the application.
    """

    return app.test_client()
