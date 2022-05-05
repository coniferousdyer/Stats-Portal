from dotenv import load_dotenv
from os import environ

from application import create_app


load_dotenv()


# The configuration class is inferred from the environment variable FLASK_ENV.
# The configuration is either "development" or "production". If neither of these
# is supplied, the configuration defaults to "development".
environment = environ.get("FLASK_ENV", "development")
configuration_class = (
    "application.config.ProductionConfig"
    if environment == "production"
    else "application.config.DevelopmentConfig"
)

app = create_app(configuration_class)

if __name__ == "__main__":
    app.run(
        host=environ.get("APPLICATION_HOST", "0.0.0.0"),
        port=int(environ.get("APPLICATION_PORT", "5000")),
        use_reloader=False,
    )
