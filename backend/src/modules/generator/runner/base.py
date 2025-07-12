# celery_app.py
from celery import Celery

celery_app = Celery(
    "video_generator",
    broker="redis://localhost:6379/0",        # Redis as broker
    backend="redis://localhost:6379/0",       # Redis as result backend
)

celery_app.conf.task_track_started = True
celery_app.conf.result_expires = 3600  # Optional: auto-expire results
