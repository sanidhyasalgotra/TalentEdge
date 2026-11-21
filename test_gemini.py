import os
import httpx
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get("GEMINI_API_KEY", "").strip()
print("Key found:", bool(key), "| length:", len(key))
base = "https://generativelanguage.googleapis.com/v1beta"
headers = {"x-goog-api-key": key}

r = httpx.get(f"{base}/models", headers=headers, timeout=30)
print("List models status:", r.status_code)
if r.status_code != 200:
    print(r.text[:300])
    raise SystemExit

names = [m["name"].split("/")[-1] for m in r.json().get("models", [])
         if "generateContent" in m.get("supportedGenerationMethods", [])]
print("Models available:", names)
print("GEMINI_MODEL in .env:", os.environ.get("GEMINI_MODEL"))

candidates = []
for n in [os.environ.get("GEMINI_MODEL")] + [x for x in names if "flash" in x][:6]:
    if n and n not in candidates:
        candidates.append(n)

for n in candidates:
    try:
        resp = httpx.post(
            f"{base}/models/{n}:generateContent",
            headers=headers,
            json={"contents": [{"parts": [{"text": "Say OK"}]}]},
            timeout=30,
        )
        print(n, "->", resp.status_code, "OK" if resp.status_code == 200 else resp.text[:150])
    except Exception as e:
        print(n, "->", type(e).__name__)