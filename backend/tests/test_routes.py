"""
Contains the testing functions for the routes. Tests for the routes ensure:
* Routes are correctly configured.
* Routes return the correct status codes (and data, if applicable).
* Helper functions used by the routes work as intended.

To test this suite only, run `pytest -v tests/test_routes.py`.
"""

import pytest
from datetime import datetime

from application.models.orm import db
from application.models.models import (
    User,
    Contest,
    ContestParticipant,
    Problem,
    ProblemSolved,
)


@pytest.mark.usefixtures("app", "client")
class TestUserRoutes:
    """
    User-related routes.
    """

    def test_users_routes(self, app, client):
        """
        * GIVEN a Flask application
        * WHEN the '/users' route is requested
        * THEN check the status code is 200
        """

        # Create a user and add to the database
        with app.app_context():
            user = User(
                handle="test_user",
                creation_date=datetime(2020, 1, 1),
                rating=1000,
                max_rating=2000,
                rank="test_rank",
            )
            db.session.add(user)
            db.session.commit()

        response = client.get("/users")
        assert response.status_code == 200

    def test_users_routes_with_handle(self, app, client):
        """
        * GIVEN a Flask application and an existing user in the database
        * WHEN the '/users/<handle>' route is requested
        * THEN check the status code is 200
        * IF the user does not exist, check the status code is 404
        """

        # Test without a user
        response = client.get("/users/test_user")
        assert response.status_code == 404

        # Create a user and add to the database
        with app.app_context():
            user = user = User(
                handle="test_user",
                creation_date=datetime(2020, 1, 1),
                rating=1000,
                max_rating=2000,
                rank="test_rank",
            )
            db.session.add(user)
            db.session.commit()

        # Test with the incorrect route (essentially looking for a different user)
        response = client.get("/users/test_user2")
        assert response.status_code == 404

        # Test with the correct user handle
        response = client.get("/users/test_user")
        assert response.status_code == 200

    def test_user_contests_routes(self, app, client):
        """
        * GIVEN a Flask application
        * WHEN the '/users/contests-participated' route is requested
        * THEN check the status code is 200
        """

        # Create a user, a contest, a contest given and add to the database
        with app.app_context():
            db.session.add(
                User(
                    handle="test_user",
                    creation_date=datetime(2020, 1, 1),
                    rating=1000,
                    max_rating=2000,
                    rank="test_rank",
                )
            )
            db.session.add(
                Contest(
                    contest_id=1,
                    name="test_contest",
                    date=datetime(2020, 1, 1),
                    duration=100,
                )
            )
            db.session.add(
                ContestParticipant(
                    handle="test_handle",
                    contest_id=1,
                    rank=1,
                    old_rating=1000,
                    new_rating=2000,
                    rating_update_time=datetime(2020, 1, 1),
                )
            )
            db.session.commit()

        response = client.get("/users/contests-participated")
        assert response.status_code == 200

    def test_user_contests_routes_with_handle(self, app, client):
        """
        * GIVEN a Flask application and an existing user in the database
        * WHEN the 'users/<handle>/contests-participated' route is requested
        * THEN check the status code is 200
        * IF the user does not exist, check the status code is 404
        """

        # Test without the user
        response = client.get("/users/test_user/contests-participated")
        assert response.status_code == 404

        # Create a user, a contest, a contest given and add to the database
        with app.app_context():
            db.session.add(
                User(
                    handle="test_user",
                    creation_date=datetime(2020, 1, 1),
                    rating=1000,
                    max_rating=2000,
                    rank="test_rank",
                )
            )
            db.session.add(
                Contest(
                    contest_id=1,
                    name="test_contest",
                    date=datetime(2020, 1, 1),
                    duration=100,
                )
            )
            db.session.add(
                ContestParticipant(
                    handle="test_handle",
                    contest_id=1,
                    rank=1,
                    old_rating=1000,
                    new_rating=2000,
                    rating_update_time=datetime(2020, 1, 1),
                )
            )
            db.session.commit()

        # Test with the incorrect route (essentially looking for a different user)
        response = client.get("/users/test_user2/contests-participated")
        assert response.status_code == 404

        # Test with the correct user handle
        response = client.get("/users/test_user/contests-participated")
        assert response.status_code == 200

    def test_user_problems_solved_routes(self, app, client):
        """
        * GIVEN a Flask application
        * WHEN the '/users/problems-solved' route is requested
        * THEN check the status code is 200
        """

        # Create a user, a problem and a problem solved and add to the database
        with app.app_context():
            db.session.add(
                User(
                    handle="test_user",
                    creation_date=datetime(2020, 1, 1),
                    rating=1000,
                    max_rating=2000,
                    rank="test_rank",
                )
            )
            db.session.add(
                Problem(
                    contest_id=1,
                    index="test_index",
                    name="test_name",
                    rating=1000,
                    tags="tag1;tag2",
                )
            )
            db.session.add(
                ProblemSolved(
                    handle="test_handle",
                    contest_id=1,
                    index="test_index",
                    rating=1000,
                    tags="tag1;tag2",
                    language="test_language",
                    solved_time=datetime(2020, 1, 1),
                )
            )
            db.session.commit()

        response = client.get("/users/problems-solved")
        assert response.status_code == 200

    def test_user_problems_solved_routes_with_handle(self, app, client):
        """
        * GIVEN a Flask application and an existing user in the database
        * WHEN the '/users/<handle>/problems-solved' route is requested
        * THEN check the status code is 200
        * IF the user does not exist, check the status code is 404
        """

        # Test without the user
        response = client.get("/users/test_user/problems-solved")
        assert response.status_code == 404

        # Create a user, a problem and a problem solved and add to the database
        with app.app_context():
            db.session.add(
                User(
                    handle="test_user",
                    creation_date=datetime(2020, 1, 1),
                    rating=1000,
                    max_rating=2000,
                    rank="test_rank",
                )
            )
            db.session.add(
                Problem(
                    contest_id=1,
                    index="test_index",
                    name="test_name",
                    rating=1000,
                    tags="tag1;tag2",
                )
            )
            db.session.add(
                ProblemSolved(
                    handle="test_handle",
                    contest_id=1,
                    index="test_index",
                    rating=1000,
                    tags="tag1;tag2",
                    language="test_language",
                    solved_time=datetime(2020, 1, 1),
                )
            )
            db.session.commit()

        # Test with the incorrect route (essentially looking for a different user)
        response = client.get("/users/test_user2/problems-solved")
        assert response.status_code == 404

        # Test with the correct user handle
        response = client.get("/users/test_user/problems-solved")
        assert response.status_code == 200


@pytest.mark.usefixtures("app", "client")
class TestContestRoutes:
    """
    Contest-related routes.
    """

    def test_contests_routes(self, app, client):
        """
        * GIVEN a Flask application
        * WHEN the '/contests' route is requested
        * THEN check the status code is 200
        """

        # Create a contest and add to the database
        with app.app_context():
            db.session.add(
                Contest(
                    contest_id=1,
                    name="test_contest",
                    date=datetime(2020, 1, 1),
                    duration=100,
                )
            )
            db.session.commit()

        response = client.get("/contests")
        assert response.status_code == 200

    def test_contests_routes_with_id(self, app, client):
        """
        * GIVEN a Flask application and an existing contest in the database
        * WHEN the '/contests/<id>' route is requested
        * THEN check the status code is 200
        * IF the contest does not exist, check the status code is 404
        """

        # Test without a contest
        response = client.get("/contests/1")
        assert response.status_code == 404

        # Create a contest and add to the database
        with app.app_context():
            db.session.add(
                Contest(
                    contest_id=1,
                    name="test_contest",
                    date=datetime(2020, 1, 1),
                    duration=100,
                )
            )
            db.session.commit()

        # Test with the incorrect route (essentially looking for a different contest)
        response = client.get("/contests/2")
        assert response.status_code == 404

        # Test with the correct contest id
        response = client.get("/contests/1")
        assert response.status_code == 200

    def test_contest_standing_routes(self, app, client):
        """
        * GIVEN a Flask application and an existing contest
        * WHEN the '/contests/<id>/standings' route is requested
        * THEN check the status code is 200
        * IF the contest does not exist, check the status code is 404
        """

        # Test without a contest
        response = client.get("/contests/1/standings")
        assert response.status_code == 404

        # Create a contest and a contest participant and add to the database
        with app.app_context():
            db.session.add(
                Contest(
                    contest_id=1,
                    name="test_contest",
                    date=datetime(2020, 1, 1),
                    duration=100,
                )
            )
            db.session.add(
                ContestParticipant(
                    handle="test_handle",
                    contest_id=1,
                    rank=1,
                    old_rating=1000,
                    new_rating=2000,
                    rating_update_time=datetime(2020, 1, 1),
                )
            )
            db.session.commit()

        # Test with the incorrect route (essentially looking for a different contest)
        response = client.get("/contests/2/standings")
        assert response.status_code == 404

        # Test with the correct contest id
        response = client.get("/contests/1/standings")
        assert response.status_code == 200


@pytest.mark.usefixtures("app", "client")
class TestProblemRoutes:
    """
    Problem-related routes.
    """

    def test_problems_routes(self, app, client):
        """
        * GIVEN a Flask application
        * WHEN the '/problems' route is requested
        * THEN check the status code is 200
        """

        # Create a problem and add to the database
        with app.app_context():
            db.session.add(
                Problem(
                    contest_id=1,
                    index="test_index",
                    name="test_name",
                    rating=1000,
                    tags="tag1;tag2",
                )
            )
            db.session.commit()

        response = client.get("/problems")
        assert response.status_code == 200
