"""Test configuration. Uses an in-memory SQLite URL for the app engine."""

import os

# Set before app.config / app.db are imported by test modules.
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
