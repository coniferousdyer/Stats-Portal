"""
Contains testing functions for common errors that may occur and the response returned.

To test this suite only, run `pytest -v tests/test_errors.py`.
"""

import pytest


@pytest.mark.usefixtures("app", "client")
class TestErrors:
    """
    Tests for the error handlers.
    """

    def test_error_handlers_404(self, client):
        """
        * GIVEN a Flask application
        * WHEN a request is made to a route that does not exist
        * THEN a 404 error is returned
        """

        # Send a request to the server
        response = client.get("/unknown_route")

        # Check the response
        assert response.status_code == 404
        assert response.json == {"error": "Page not found"}

    def test_error_handlers_500(self, app, client):
        """
        * GIVEN a Flask application
        * WHEN a request is made to a route that throws an exception
        * THEN a 500 error is returned
        """

        # Register a route that throws an exception
        @app.route("/error")
        def error():
            raise Exception("Test exception")

        # Send a request to the server
        with pytest.raises(Exception):
            response = client.get("/error")

            # Check the response
            assert response.status_code == 500
            assert response.json == {"error": "Internal server error"}
