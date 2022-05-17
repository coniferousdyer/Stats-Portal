"""
Configuration for the Gunicorn server.
"""

from wsgi import app
from application import init_db


# Address the server is bound to and will be listening for requests on.
bind = "0.0.0.0:5000"

# Number of worker processes for handling requests.
workers = 12

# If preload_app is True, the app is created and configured first. A copy of it is made and
# passed to each worker process. This is necessary because the scheduler is initialized by the
# app, and should not be initialized by all worker processes.
preload_app = True


def post_fork(server, worker):
    """
    Initializes the database and creates the tables.
    """

    # If we use preload_app, the worker processes end up sharing the same database
    # connection, since they get a copy of the app. Therefore, we need to initialize
    # the database after the forking takes place so that each worker gets its own
    # database connection.
    init_db(app)
