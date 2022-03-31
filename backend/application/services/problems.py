"""
The service functions take the data obtained from the database and transform it
into a format that is suitable for the frontend.

services/problems.py contains problem-related service functions.
"""


from collections import defaultdict


def get_all_users_problem_statistics(
    solved_counts: list[dict],
    tags: list[dict],
    ratings: list[dict],
    indexes: list[dict],
):
    """
    Returns the problem statistics for all users.
    * Total number of problems solved for the entire organization.
    * Number of problems solved per tag for the entire organization.
    * Number of problems solved per index for the entire organization.
    * Number of problems solved per rating for the entire organization.

    Arguments:
    * solved_counts - List of problem solved counts for all users.
    * tags - List of problem solved counts per tag for all users.
    * ratings - List of problem solved counts per rating for all users.
    * indexes - List of problem solved counts per index for all users.
    """

    problem_statistics = {}

    # Number of problems solved by each user in the form {handle: count}
    problem_statistics["solved_count"] = {
        row["handle"]: row["count"] for row in solved_counts
    }

    # For each metric, we sum the values for each attribute across all users
    # and store the resultant dictionary.

    # Tags in the form {tag: count}
    problem_statistics["tags"] = defaultdict(int)
    for row in tags:
        for key, value in row.items():
            if key == "handle":
                continue
            problem_statistics["tags"][key] += value

    # Indexes in the form {index: count}
    problem_statistics["indexes"] = defaultdict(int)
    for row in indexes:
        for key, value in row.items():
            if key == "handle":
                continue
            problem_statistics["indexes"][key] += value

    # Ratings in the form {rating: count}
    problem_statistics["ratings"] = defaultdict(int)
    for row in ratings:
        for key, value in row.items():
            if key == "handle":
                continue
            problem_statistics["ratings"][key] += value

    return problem_statistics
