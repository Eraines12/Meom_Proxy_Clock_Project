FROM python:3.12-slim
WORKDIR /service
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend backend
COPY app app
RUN useradd --create-home appuser
USER appuser
ENV PORT=8000
EXPOSE 8000
# Model is mounted privately at runtime; neither the image nor public app contains weights.
CMD ["sh", "-c", "exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1 --no-access-log"]
