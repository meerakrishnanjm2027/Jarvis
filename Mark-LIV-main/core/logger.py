"""
JARVIS Logging Subsystem
Handles structured logging across jarvis.log, actions.log, and errors.log.
Strictly sanitizes API keys and sensitive tokens before writing to disk.
"""

import logging
import os
import re
from pathlib import Path
from typing import Any, Optional

# Secret sanitization patterns
SENSITIVE_PATTERNS = [
    re.compile(r"(AIzaSy[A-Za-z0-9_-]{33})"),  # Google API keys
    re.compile(r"(GEMINI_API_KEY\s*[:=]\s*)['\"]?([^'\"\s]+)['\"]?", re.IGNORECASE),
    re.compile(r"(password\s*[:=]\s*)['\"]?([^'\"\s]+)['\"]?", re.IGNORECASE),
    re.compile(r"(token\s*[:=]\s*)['\"]?([^'\"\s]+)['\"]?", re.IGNORECASE),
    re.compile(r"(bearer\s+)([a-zA-Z0-9_\-\.]+)", re.IGNORECASE),
]


def sanitize_text(text: str) -> str:
    """Mask sensitive tokens, credentials, and API keys from log lines."""
    if not isinstance(text, str):
        return str(text)

    sanitized = text
    for pattern in SENSITIVE_PATTERNS:
        sanitized = pattern.sub(r"[REDACTED_CREDENTIAL]", sanitized)
    return sanitized


class SanitizedFormatter(logging.Formatter):
    """Custom logging formatter that strips API keys and secrets."""

    def format(self, record: logging.LogRecord) -> str:
        original = super().format(record)
        return sanitize_text(original)


class JarvisLogger:
    """Centralized JARVIS Logger managing multiple target log files."""

    _instance: Optional["JarvisLogger"] = None

    def __init__(self, log_dir: Optional[str] = None):
        if log_dir is None:
            # Base log dir relative to project root
            base_path = Path(__file__).resolve().parent.parent
            self.log_dir = base_path / "logs"
        else:
            self.log_dir = Path(log_dir)

        self.log_dir.mkdir(parents=True, exist_ok=True)

        self.main_log_file = self.log_dir / "jarvis.log"
        self.action_log_file = self.log_dir / "actions.log"
        self.error_log_file = self.log_dir / "errors.log"

        self._setup_loggers()

    def _setup_loggers(self) -> None:
        formatter = SanitizedFormatter(
            "%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        # 1. Main Root JARVIS Logger
        self.logger = logging.getLogger("JARVIS")
        self.logger.setLevel(logging.INFO)
        self.logger.propagate = False

        # Console Handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        console_handler.setLevel(logging.INFO)

        # Main File Handler
        main_handler = logging.FileHandler(self.main_log_file, encoding="utf-8")
        main_handler.setFormatter(formatter)
        main_handler.setLevel(logging.INFO)

        # Action File Handler (for structured actions)
        self.action_logger = logging.getLogger("JARVIS.Action")
        self.action_logger.setLevel(logging.INFO)
        self.action_logger.propagate = False
        action_handler = logging.FileHandler(self.action_log_file, encoding="utf-8")
        action_handler.setFormatter(formatter)
        self.action_logger.addHandler(action_handler)
        self.action_logger.addHandler(console_handler)

        # Error File Handler (for failures and tracebacks)
        error_handler = logging.FileHandler(self.error_log_file, encoding="utf-8")
        error_handler.setFormatter(formatter)
        error_handler.setLevel(logging.ERROR)

        # Attach handlers
        self.logger.addHandler(console_handler)
        self.logger.addHandler(main_handler)
        self.logger.addHandler(error_handler)

    @classmethod
    def get_instance(cls) -> "JarvisLogger":
        if cls._instance is None:
            cls._instance = JarvisLogger()
        return cls._instance

    def info(self, msg: str, *args: Any) -> None:
        self.logger.info(msg, *args)

    def warning(self, msg: str, *args: Any) -> None:
        self.logger.warning(msg, *args)

    def error(self, msg: str, *args: Any) -> None:
        self.logger.error(msg, *args)

    def log_action(self, action_name: str, route: str, status: str, details: str = "") -> None:
        """Structured recording of action executions."""
        clean_details = sanitize_text(details)
        log_entry = f"ACTION: {action_name} | ROUTE: {route} | STATUS: {status} | DETAILS: {clean_details}"
        self.action_logger.info(log_entry)


# Singleton export
logger = JarvisLogger.get_instance()
