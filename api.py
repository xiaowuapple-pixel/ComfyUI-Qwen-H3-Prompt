import asyncio
import json
import urllib.error
import urllib.request

import server


def _models_url(base_url):
    base = (base_url or "").strip().rstrip("/")
    if not base:
        raise ValueError("请填写在线请求地址。")
    lowered = base.lower()
    if not (lowered.endswith("/v1") or lowered.endswith("/api/v1")):
        base += "/v1"
    return base + "/models"


def _fetch_models(base_url, api_key):
    headers = {"Accept": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key.strip()}"
    request = urllib.request.Request(_models_url(base_url), headers=headers, method="GET")
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.loads(response.read().decode("utf-8"))
    entries = payload.get("data", payload.get("models", []))
    models = []
    for entry in entries:
        name = entry if isinstance(entry, str) else entry.get("id") or entry.get("name")
        if name and name not in models:
            models.append(name)
    if not models:
        raise ValueError("平台 /models 接口没有返回可用模型。")
    return models


@server.PromptServer.instance.routes.post("/qwen-h3-prompt/models")
async def qwen_h3_prompt_models(request):
    try:
        body = await request.json()
        models = await asyncio.to_thread(
            _fetch_models, body.get("base_url", ""), body.get("api_key", "")
        )
        return server.web.json_response({"models": models})
    except urllib.error.HTTPError as exc:
        message = f"平台返回 HTTP {exc.code}：请检查请求地址、API Key 和接口权限。"
    except Exception as exc:
        message = str(exc)
    return server.web.json_response({"error": message}, status=400)
