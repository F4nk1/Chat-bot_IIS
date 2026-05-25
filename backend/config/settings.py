import os

from dotenv import load_dotenv

load_dotenv()


class Settings:

    APP_NAME = os.getenv("APP_NAME")

    API_HOST = os.getenv("API_HOST")

    API_PORT = int(os.getenv("API_PORT"))

    DEBUG = os.getenv("DEBUG") == "True"

    FAQ_PATH = os.getenv("FAQ_PATH")

    SIMILARITY_THRESHOLD = float(
        os.getenv("SIMILARITY_THRESHOLD")
    )


settings = Settings()