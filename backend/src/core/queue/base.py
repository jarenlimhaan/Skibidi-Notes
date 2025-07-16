import redis.asyncio as redis
from config.env import get_app_configs  # or use hardcoded redis://localhost:6379

redis_client = redis.StrictRedis.from_url(
    get_app_configs().REDIS_URL, decode_responses=True
)
