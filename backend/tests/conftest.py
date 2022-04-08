"""
Contains the necessary fixtures for pytest tests.
"""

import pytest

from application import create_app
from application.models.orm import db


@pytest.fixture
def app():
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
