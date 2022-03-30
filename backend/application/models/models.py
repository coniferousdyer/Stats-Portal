"""
Contains the models for the database.
"""

from application.models.orm import db
from application.utils.constants import (
    PROBLEM_INDEXES,
    PROFILE_BASE_URL,
    CONTEST_BASE_URL,
    PROBLEM_BASE_URL,
    MAX_PROBLEM_RATING,
    MIN_PROBLEM_RATING,
    TAGS,
)


"""
Application models.
* Stored in the database whose path is specified by SQL_DATABASE_URI.
"""


class User(db.Model):
    """
    User on Codeforces, part of the organization.
    """

    __tablename__ = "user"

    # Codeforces handle of the user
    handle = db.Column(db.String(50), primary_key=True)
    # Account creation date
    creation_date = db.Column(db.DateTime, nullable=False)
    # Codeforces rating of the user
    rating = db.Column(db.Integer, nullable=False)
    # The maximum rating of the user
    max_rating = db.Column(db.String(50), nullable=False)
    # "rank" refers to the Title of the user in official terminology
    rank = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<User: {self.handle}>"

    @staticmethod
    def __url__(self):
        return f"{PROFILE_BASE_URL}{self.handle}"


class Contest(db.Model):
    """
    Codeforces contest.
    """

    __tablename__ = "contest"

    # Codeforces contest ID
    contest_id = db.Column(db.Integer, primary_key=True)
    # Name of the contest
    name = db.Column(db.String(50), nullable=False)
    # Date of the contest
    date = db.Column(db.DateTime, nullable=False)
    # Duration of the contest
    duration = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Contest: {self.contest_id} - {self.name}>"

    @staticmethod
    def __url__(self):
        return f"{CONTEST_BASE_URL}{self.contest_id}"


class ContestParticipant(db.Model):
    """
    Model describing a user's participation in a contest.
    """

    __tablename__ = "contest_participant"

    # Unique ID assigned to the relation
    id = db.Column(db.Integer, primary_key=True)
    # Codeforces handle of the user
    handle = db.Column(db.String(50), db.ForeignKey("user.handle"), nullable=False)
    # Codeforces contest ID
    contest_id = db.Column(
        db.Integer, db.ForeignKey("contest.contest_id"), nullable=False
    )
    # Rank of the user in the contest
    rank = db.Column(db.Integer, nullable=False)
    # Rating change of the user in the contest
    rating_change = db.Column(db.Integer, nullable=False)
    # Rating update time
    rating_update_time = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"<ContestParticipant: {self.handle} - {self.contest_id}>"


class Problem(db.Model):
    """
    Codeforces problem.
    """

    __tablename__ = "problem"

    # ID of the contest in which the problem is present
    contest_id = db.Column(
        db.Integer, db.ForeignKey("contest.contest_id"), primary_key=True
    )
    # Index of problem in the contest
    index = db.Column(db.String(50), primary_key=True)
    # Problem name
    name = db.Column(db.String(50), nullable=False)
    # Problem rating
    rating = db.Column(db.Integer, nullable=False)
    # Tags of the problem (stored as a string to store in the database)
    tags = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"<Problem: {self.contest_id}-{self.index}: {self.name}>"

    @staticmethod
    def __url__(self):
        return f"{PROBLEM_BASE_URL}{self.contest_id}/{self.index}"


"""
NOTE: Here, according to the convention, we should have made a ProblemSolved class
instead. However, since a user may have solved a huge number of problems, for
performance reasons, we have adopted this structure. Not only does it require
less database space, but it also decreases frontend load times.
"""


class ProblemCount(db.Model):
    """
    Model for the count of problems solved by a user.
    """

    __tablename__ = "problem_count"

    # Codeforces handle of the user
    handle = db.Column(db.String(50), db.ForeignKey("user.handle"), primary_key=True)
    # Count of problems solved by the user
    count = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<ProblemCount: {self.handle} - {self.count}>"


class ProblemTags(db.Model):
    """
    Number of problems of each tag that a user has solved.
    """

    __tablename__ = "problem_tags"

    handle = db.Column(db.String(50), db.ForeignKey("user.handle"), primary_key=True)

    def __repr__(self):
        return f"<ProblemTags: {self.handle}>"


class ProblemRatings(db.Model):
    """
    Number of problems of each rating that a user has solved.
    """

    __tablename__ = "problem_ratings"

    handle = db.Column(db.String(50), db.ForeignKey("user.handle"), primary_key=True)

    def __repr__(self):
        return f"<ProblemRatings: {self.handle}>"


class ProblemIndexes(db.Model):
    """
    Number of problems of each contest index that a user has solved.
    """

    __tablename__ = "problem_indexes"

    handle = db.Column(db.String(50), db.ForeignKey("user.handle"), primary_key=True)

    def __repr__(self):
        return f"<ProblemIndexes: {self.handle}>"


"""
Metadata for the application (not directly used in the application).
* Stored in the database whose path is specified by SQL_METADATA_URI.
"""


class Metadata(db.Model):
    """
    Model for storing the metadata of the database.
    """

    __bind_key__ = "metadata"
    __tablename__ = "metadata"

    # Property name (eg. "version")
    key = db.Column(db.String(50), primary_key=True)
    # Property value (eg. "1.0.0")
    value = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<{self.key}: {self.value}>"


"""
Model-related functions.
"""


def create_model_attrs():
    """
    Dynamically creates the attributes for the models.
    """

    # An attribute for each possible index
    for char in PROBLEM_INDEXES:
        setattr(ProblemIndexes, char, db.Column(char, db.Integer, nullable=False))

    # An attribute for each possible rating
    for i in range(MIN_PROBLEM_RATING, MAX_PROBLEM_RATING + 1, 100):
        setattr(ProblemRatings, str(i), db.Column(str(i), db.Integer, nullable=False))

    # An attribute for each possible tag
    for tag in TAGS:
        setattr(
            ProblemTags,
            tag,
            db.Column(tag, db.Integer, nullable=False),
        )
