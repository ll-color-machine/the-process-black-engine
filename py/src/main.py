import os
import subprocess
import tempfile
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()  # loads py/.env if present
app = FastAPI(title="process-black-jobs")


@app.get("/health")
def health():
    return {
        "machine": os.getenv("MACHINE_NAME", "unknown"),
        "color": os.getenv("MACHINE_COLOR", "unknown"),
        "status": "ok",
    }


class TranscodeReq(BaseModel):
    input: str
    preset: str = "medium"


@app.post("/transcode")
def transcode(req: TranscodeReq):
    out = tempfile.mktemp(suffix=".mp4")
    cmd = ["ffmpeg", "-y", "-i", req.input, "-preset", req.preset, out]
    subprocess.run(cmd, check=True)
    return {"output": out}

