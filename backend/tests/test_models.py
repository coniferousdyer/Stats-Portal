"""
Contains testing functions for the models. Tests for the models ensure:
* The SQLAlchemy interface works as expected.
* Model objects are stored in the database correctly.
* Model attributes are correctly set and retrieved.

To test this suite only, run `pytest -v tests/test_models.py`.
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
    Metadata,
)


@pytest.mark.usefixtures("app")
class TestUserModel:
    """
    Tests for the User model.
    """

    def test_user_creation(self, app):
        """
        * GIVEN a Flask application
        * WHEN a User object is created
        * THEN the object is stored in the database correctly
        """

        with app.app_context():
            # Create a User object
            user = User(
                handle="test_user",
                creation_date=datetime(2020, 1, 1),
                rating=1000,
                max_rating=2000,
                rank="test_rank",
            )
            db.session.add(user)
            db.session.commit()

            # Check the object was stored correctly
            retrieved_user = User.query.get("test_user")
            assert retrieved_user.handle == "test_user"
            assert retrieved_user.creation_date == datetime(2020, 1, 1)
            assert retrieved_user.rating == 1000
            assert retrieved_user.max_rating == 2000
            assert retrieved_user.rank == "test_rank"
            # Do not use PROFILE_BASE_URL here, as the goal is to test the URL generation
            assert retrieved_user.url() == "https://codeforces.com/profile/test_user"


@pytest.mark.usefixtures("app")
class TestContestModel:
    """
    Tests for the Contest model.
    """

    def test_contest_creation(self, app):
        """
        * GIVEN a Flask application
        * WHEN a Contest object is created
        * THEN the object is stored in the database correctly
        """

        with app.app_context():
            # Create a Contest object
            contest = Contest(
                contest_id=1,
                name="test_contest",
                date=datetime(2020, 1, 1),
                duration=100,
            )
            db.session.add(contest)
            db.session.commit()

            # Check the object was stored correctly
            retrieved_contest = Contest.query.get(1)
            assert retrieved_contest.contest_id == 1
            assert retrieved_contest.name == "test_contest"
            assert retrieved_contest.date == datetime(2020, 1, 1)
            assert retrieved_contest.duration == 100
            # Do not use CONTEST_BASE_URL here, as the goal is to test the URL generation
            assert retrieved_contest.url() == "https://codeforces.com/contest/1"


@pytest.mark.usefixtures("app")
class TestProblemModel:
    """
    Tests for the Problem model.
    """

    def test_problem_creation(self, app):
        """
        * GIVEN a Flask application
        * WHEN a Problem object is created
        * THEN the object is stored in the database correctly
        """

        with app.app_context():
            # Create a Problem object
            problem = Problem(
                contest_id=1,
                index="test_index",
                name="test_name",
                rating=1000,
                tags="tag1;tag2",
            )
            db.session.add(problem)
            db.session.commit()

            # Check the object was stored correctly
            retrieved_problem = Problem.query.get((1, "test_index"))
            assert retrieved_problem.contest_id == 1
            assert retrieved_problem.index == "test_index"
            assert retrieved_problem.name == "test_name"
            assert retrieved_problem.rating == 1000
            assert retrieved_problem.tags.split(";") == ["tag1", "tag2"]
            # Do not use PROBLEM_BASE_URL here, as the goal is to test the URL generation
            assert (
                retrieved_problem.url()
                == "https://codeforces.com/problemset/problem/1/test_index"
            )


@pytest.mark.usefixtures("app")
class TestContestParticipantModel:
    """
    Tests for the ContestParticipant model.
    """

    def test_contest_participant_creation(self, app):
        """
        * GIVEN a Flask application
        * WHEN a ContestParticipant object is created
        * THEN the object is stored in the database correctly
        """

        with app.app_context():
            # Create a ContestParticipant object
            contest_participant = ContestParticipant(
                handle="test_handle",
                contest_id=1,
                rank=1,
                old_rating=1000,
                new_rating=2000,
                rating_update_time=datetime(2020, 1, 1),
            )
            db.session.add(contest_participant)
            db.session.commit()

            # Check the object was stored correctly
            retrieved_contest_participant = ContestParticipant.query.filter_by(
                contest_id=1, handle="test_handle"
            ).first()
            assert retrieved_contest_participant.contest_id == 1
            assert retrieved_contest_participant.handle == "test_handle"
            assert retrieved_contest_participant.rank == 1
            assert retrieved_contest_participant.old_rating == 1000
            assert retrieved_contest_participant.new_rating == 2000
            assert retrieved_contest_participant.rating_update_time == datetime(
                2020, 1, 1
            )


@pytest.mark.usefixtures("app")
class TestProblemSolvedModel:
    """
    Tests for the ProblemSolved model.
    """

    def test_problem_solved_creation(self, app):
        """
        * GIVEN a Flask application
        * WHEN a ProblemSolved object is created
        * THEN the object is stored in the database correctly
        """

        with app.app_context():
            # Create a ProblemSolved object
            problem_solved = ProblemSolved(
                handle="test_handle",
                contest_id=1,
                index="test_index",
                rating=1000,
                tags="tag1;tag2",
                language="test_language",
                solved_time=datetime(2020, 1, 1),
            )
            db.session.add(problem_solved)
            db.session.commit()

            # Check the object was stored correctly
            retrieved_problem_solved = ProblemSolved.query.filter_by(
                contest_id=1, handle="test_handle", index="test_index"
            ).first()
            assert retrieved_problem_solved.contest_id == 1
            assert retrieved_problem_solved.handle == "test_handle"
            assert retrieved_problem_solved.index == "test_index"
            assert retrieved_problem_solved.rating == 1000
            assert retrieved_problem_solved.tags.split(";") == ["tag1", "tag2"]
            assert retrieved_problem_solved.language == "test_language"
            assert retrieved_problem_solved.solved_time == datetime(2020, 1, 1)
