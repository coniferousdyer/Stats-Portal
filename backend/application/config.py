"""
Configuration for the Flask backend.
"""

from os import environ
from dotenv import load_dotenv


# Load environment variables from the .env file
load_dotenv()


class Config:
    """
    Base configuration.
    """

    SECRET_KEY = environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_BINDS = {
        "metadata": environ.get("SQLALCHEMY_METADATA_URI"),
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    """
    Development configuration.
    """

    FLASK_ENV = "development"
    DEBUG = True
    TESTING = True


class ProductionConfig(Config):
    """
    Production configuration.
    """

    FLASK_ENV = "production"
    DEBUG = False
    TESTING = False
