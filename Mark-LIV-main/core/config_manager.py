"""
JARVIS Configuration Manager
Loads, validates, and manages runtime settings, commands, and environment variables.
"""

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
from core.logger import logger


class ConfigManager:
    """Manages application settings, command definitions, and secrets safely."""

    def __init__(self, base_dir: Optional[Path] = None):
        self.base_dir = base_dir or Path(__file__).resolve().parent.parent
        self.config_dir = self.base_dir / "config"
        self.settings_path = self.config_dir / "settings.json"
        self.commands_path = self.config_dir / "commands.json"
        self.env_path = self.base_dir / ".env"

        self._settings: Dict[str, Any] = {}
        self._commands: List[Dict[str, Any]] = []

        self._load_env()
        self._load_settings()
        self._load_commands()

    def _load_env(self) -> None:
        """Loads .env file into os.environ if present without external dependencies."""
        if self.env_path.exists():
            try:
                with open(self.env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            key, val = line.split("=", 1)
                            key = key.strip()
                            val = val.strip().strip("'\"")
                            if key and key not in os.environ:
                                os.environ[key] = val
                logger.info(".env configuration loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to parse .env file: {e}")

    def _load_settings(self) -> None:
        """Loads settings.json with reliable fallback defaults."""
        defaults: Dict[str, Any] = {
            "assistant_name": "JARVIS",
            "version": "54.0.0",
            "mode": "HYBRID",
            "gemini": {
                "model": "gemini-2.5-flash",
                "temperature": 0.3,
                "max_output_tokens": 1024,
            },
            "security": {
                "protected_actions": [
                    "shutdown",
                    "restart",
                    "delete_file",
                    "delete_folder",
                    "kill_process",
                ],
                "require_confirmation": True,
            },
            "speech": {
                "wake_word": "jarvis",
                "stt_engine": "speech_recognition",
                "tts_engine": "pyttsx3",
                "voice_rate": 185,
            },
            "system": {
                "log_level": "INFO",
                "history_limit": 50,
            },
        }

        if self.settings_path.exists():
            try:
                with open(self.settings_path, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    defaults.update(loaded)
                    self._settings = defaults
                    logger.info("settings.json loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to read settings.json: {e}. Using defaults.")
                self._settings = defaults
        else:
            self._settings = defaults

    def _load_commands(self) -> None:
        """Loads regex-based command routes from commands.json."""
        if self.commands_path.exists():
            try:
                with open(self.commands_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._commands = data.get("routes", [])
                    logger.info(f"Loaded {len(self._commands)} command patterns.")
            except Exception as e:
                logger.error(f"Failed to read commands.json: {e}")
                self._commands = []

    def get(self, key: str, default: Any = None) -> Any:
        return self._settings.get(key, default)

    @property
    def mode(self) -> str:
        return self._settings.get("mode", "HYBRID")

    @property
    def gemini_api_key(self) -> Optional[str]:
        return os.environ.get("GEMINI_API_KEY")

    @property
    def protected_actions(self) -> List[str]:
        sec = self._settings.get("security", {})
        return sec.get("protected_actions", [])

    @property
    def commands(self) -> List[Dict[str, Any]]:
        return self._commands


# Global configuration instance
config = ConfigManager()
