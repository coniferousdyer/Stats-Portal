"""
Configuration for the Flask backend.
"""

from os import environ, urandom, path
from dotenv import load_dotenv


# Load environment variables from the .env file
load_dotenv()


class Config:
    """
    Base configuration.
    """

    SECRET_KEY = environ.get("SECRET_KEY", urandom(16).hex())
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{path.join(environ.get('SQLALCHEMY_DATABASE_DIR', '.'), '../stats.db')}"
    SQLALCHEMY_BINDS = {
        "metadata": f"sqlite:///{path.join(environ.get('SQLALCHEMY_METADATA_DIR', '.'), '../metadata.db')}",
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    """
    Development configuration.
    """

    FLASK_ENV = "development"
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """
    Production configuration.
    """

    FLASK_ENV = "production"
    DEBUG = False
    TESTING = False


# Since this is purely for testing purposes, we should not use any environment
# variables for the testing configuration. They should be supplied from within.
# That is the reason we do not use Config as the base class.
class TestingConfig:
    """
    Testing configuration.
    """

    SECRET_KEY = urandom(16).hex()

    # We use an in-memory SQLite database for the tests
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_BINDS = {"metadata": "sqlite:///:memory:"}

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FLASK_ENV = "development"
    DEBUG = True
    TESTING = True
