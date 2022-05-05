"""
Contains testing functions for the models. Tests for the models ensure:
* The SQLAlchemy interface works as expected.
* Model objects are stored in the database correctly.
* Model attributes are correctly set and retrieved.

To test this suite only, run `pytest -v tests/test_models.py`.
"""

import pytest
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from application.models.orm import db
from application.models.models import (
    Organization,
    User,
    Contest,
    ContestParticipant,
    Problem,
    ProblemSolved,
    Metadata,
)


@pytest.mark.usefixtures("app")
class TestOrganizationModel:
    """
    Tests for the Organization model.
    """

    def test_organization_creation(self, app):
        """
        * GIVEN a Flask application
        * WHEN an Organization object is created
        * THEN the object is stored in the database correctly
        """

        with app.app_context():
            # Create the Organization object.
            organization = Organization(
                organization_id=1,
                name="test_organization",
                global_rank=1,
                number_of_users=1,
                rating=1000,
            )
            db.session.add(organization)
            db.session.commit()

            # Check the object was added to the database.
            retrieved_organization = Organization.query.get(1)
            assert retrieved_organization.organization_id == 1
            assert retrieved_organization.name == "test_organization"
            assert retrieved_organization.global_rank == 1
            assert retrieved_organization.number_of_users == 1
            assert retrieved_organization.rating == 1000
            # Do not use ORGANIZATION_BASE_URL here, as the goal is to test the URL generation.
            assert (
                retrieved_organization.url()
                == "https://codeforces.com/ratings/organization/1"
            )

    def test_duplicate_organization_addition(self, app):
        """
        * GIVEN a Flask application
        * WHEN an Organization object is created with an organization_id that already exists in the database
        * THEN the object is not stored in the database
        """

        # Create the Organization object.
        with app.app_context():
            organization = Organization(
                organization_id=1,
                name="test_organization",
                global_rank=1,
                number_of_users=1,
                rating=1000,
            )
            db.session.add(organization)
            db.session.commit()

            # Try to create an organization with the same organization_id.
            with pytest.raises(IntegrityError):
                organization = Organization(
                    organization_id=1,
                    name="test_organization_2",
                    global_rank=2,
                    number_of_users=5,
                    rating=2000,
                )
                db.session.add(organization)
                db.session.commit()


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

            # Check the object was stored correctly.
            retrieved_user = User.query.get("test_user")
            assert retrieved_user.handle == "test_user"
            assert retrieved_user.creation_date == datetime(2020, 1, 1)
            assert retrieved_user.rating == 1000
            assert retrieved_user.max_rating == 2000
            assert retrieved_user.rank == "test_rank"
            # Do not use PROFILE_BASE_URL here, as the goal is to test the URL generation.
            assert retrieved_user.url() == "https://codeforces.com/profile/test_user"

    def test_duplicate_user_addition(self, app):
        """
        * GIVEN a Flask application
        * WHEN a User object is created with a handle that already exists in the database
        * THEN the object is not stored in the database
        """

        with app.app_context():
            # Create a User object.
            user = User(
                handle="test_user",
                creation_date=datetime(2020, 1, 1),
                rating=1000,
                max_rating=2000,
                rank="test_rank",
            )
            db.session.add(user)
            db.session.commit()

            # Try to create a User object with the same handle.
            with pytest.raises(IntegrityError):
                user = User(
                    # The handle must be unique for every user.
                    handle="test_user",
                    creation_date=datetime(2022, 2, 1),
                    rating=1200,
                    max_rating=2300,
                    rank="test_rank_1",
                )
                db.session.add(user)
                db.session.commit()


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
            # Create a Contest object.
            contest = Contest(
                contest_id=1,
                name="test_contest",
                date=datetime(2020, 1, 1),
                duration=100,
            )
            db.session.add(contest)
            db.session.commit()

            # Check the object was stored correctly.
            retrieved_contest = Contest.query.get(1)
            assert retrieved_contest.contest_id == 1
            assert retrieved_contest.name == "test_contest"
            assert retrieved_contest.date == datetime(2020, 1, 1)
            assert retrieved_contest.duration == 100
            # Do not use CONTEST_BASE_URL here, as the goal is to test the URL generation.
            assert retrieved_contest.url() == "https://codeforces.com/contest/1"

    def test_duplicate_contest_addition(self, app):
        """
        * GIVEN a Flask application
        * WHEN a Contest object is created with a contest_id that already exists in the database
        * THEN the object is not stored in the database
        """

        with app.app_context():
            # Create a Contest object.
            contest = Contest(
                contest_id=1,
                name="test_contest",
                date=datetime(2020, 1, 1),
                duration=100,
            )
            db.session.add(contest)
            db.session.commit()

            # Try to create a Contest object with the same contest_id.
            with pytest.raises(IntegrityError):
                contest = Contest(
                    # The contest_id must be unique for every contest.
                    contest_id=1,
                    name="test_contest_2",
                    date=datetime(2022, 2, 1),
                    duration=200,
                )
                db.session.add(contest)
                db.session.commit()


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
            # Create a Problem object.
            problem = Problem(
                contest_id=1,
                index="test_index",
                name="test_name",
                rating=1000,
                tags="tag1;tag2",
            )
            db.session.add(problem)
            db.session.commit()

            # Check the object was stored correctly.
            retrieved_problem = Problem.query.get((1, "test_index"))
            assert retrieved_problem.contest_id == 1
            assert retrieved_problem.index == "test_index"
            assert retrieved_problem.name == "test_name"
            assert retrieved_problem.rating == 1000
            assert retrieved_problem.tags.split(";") == ["tag1", "tag2"]
            # Do not use PROBLEM_BASE_URL here, as the goal is to test the URL generation.
            assert (
                retrieved_problem.url()
                == "https://codeforces.com/problemset/problem/1/test_index"
            )

    def test_duplicate_problem_addition(self, app):
        """
        * GIVEN a Flask application
        * WHEN a Problem object is created with a contest_id + index that already exists in the database
        * THEN the object is not stored in the database
        """

        with app.app_context():
            # Create a Problem object.
            problem = Problem(
                contest_id=1,
                index="test_index",
                name="test_name",
                rating=1000,
                tags="tag1;tag2",
            )
            db.session.add(problem)
            db.session.commit()

            # Try to create a Problem object with the same contest_id and index.
            with pytest.raises(IntegrityError):
                problem = Problem(
                    # The contest_id + index must be unique for every problem.
                    contest_id=1,
                    index="test_index",
                    name="test_name_2",
                    rating=1200,
                    tags="tag3;tag4",
                )
                db.session.add(problem)
                db.session.commit()


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
            # Create a ContestParticipant object.
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

            # Check the object was stored correctly.
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
            # Create a ProblemSolved object.
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

            # Check the object was stored correctly.
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


@pytest.mark.usefixtures("app")
class TestMetadataModel:
    """
    Tests for the Metadata model.
    """

    def test_metadata_creation(self, app):
        """
        * GIVEN a Flask application
        * WHEN a Metadata object is created
        * THEN the object is stored in the database correctly
        """

        with app.app_context():
            # Create a Metadata object.
            metadata = Metadata(key="test_key", value="test_value")
            db.session.add(metadata)
            db.session.commit()

            # Check the object was stored correctly.
            retrieved_metadata = Metadata.query.get("test_key")
            assert retrieved_metadata.key == "test_key"
            assert retrieved_metadata.value == "test_value"

    def test_duplicate_metadata_addition(self, app):
        """
        * GIVEN a Flask application
        * WHEN a Metadata object is created with a key that already exists in the database
        * THEN the object is not stored in the database
        """

        with app.app_context():
            # Create a Metadata object.
            metadata = Metadata(key="test_key", value="test_value")
            db.session.add(metadata)
            db.session.commit()

            # Try to create a Metadata object with the same key.
            with pytest.raises(IntegrityError):
                # The key must be unique for every metadata.
                metadata = Metadata(key="test_key", value="test_value_2")
                db.session.add(metadata)
                db.session.commit()
