# External Imports
from celery import Celery

# Internal Imports 
from config.env import get_app_configs

redis_url = get_app_configs().REDIS_URL

celery_app = Celery(
    "video_generator",
    broker=redis_url + "/0",        # Redis as broker
    backend=redis_url + "/0",       # Redis as result backend
)

celery_app.conf.task_track_started = True
celery_app.conf.result_expires = 3600  # Optional: auto-expire results

from src.modules.generator.runner import tasks
celery_app.autodiscover_tasks(["src.modules.generator.runner.tasks"])