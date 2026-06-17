import redis
import logging
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

class RedisClient:
    def __init__(self):
        self.client = None
        self.is_connected = False
        self.connect()

    def connect(self):
        try:
            self.client = redis.Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=2.0
            )
            # Ping to test connection
            self.client.ping()
            self.is_connected = True
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            self.client = None
            self.is_connected = False
            logger.warning(f"Could not connect to Redis: {e}. Fallback behavior enabled.")

    def get(self, key: str):
        if not self.is_connected or not self.client:
            return None
        try:
            return self.client.get(key)
        except Exception as e:
            logger.error(f"Redis get error for key {key}: {e}")
            return None

    def set(self, key: str, value: str, ex: int = 3600):
        if not self.is_connected or not self.client:
            return False
        try:
            return self.client.set(key, value, ex=ex)
        except Exception as e:
            logger.error(f"Redis set error for key {key}: {e}")
            return False

# Global instance
redis_client = RedisClient()
