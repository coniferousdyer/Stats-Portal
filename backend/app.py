from dotenv import load_dotenv
from os import environ

from application import create_app


# Load environment variables from the .env file
load_dotenv()


# Create the application. To run it in development or production mode,
# change the name of the config class in the create_app function.
# 1. Development mode: application.config.DevelopmentConfig
# 2. Production mode: application.config.ProductionConfig
app = create_app("application.config.DevelopmentConfig")

# Run the app
if __name__ == "__main__":
    app.run(
        host=environ.get("APPLICATION_HOST"),
        port=int(environ.get("APPLICATION_PORT")),
        use_reloader=False,
    )
