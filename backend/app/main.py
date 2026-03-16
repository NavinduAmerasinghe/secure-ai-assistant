from fastapi import FastAPI

app = FastAPI(
    title="Secure AI Programming Assistant",
    description="Backend API for vulnerability detection and secure coding guidance",
    version="0.1.0"
)


@app.get("/")
def root():
    return {"message": "Secure AI Programming Assistant API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}