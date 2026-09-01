# ComfyUI-Qwen-H3-Prompt

## 中文说明

独立的 ComfyUI 节点，使用本地 GGUF 视觉语言模型或在线 OpenAI 兼容 API，
为 MiniMax H3 生成可直接使用的视频提示词。支持 1-9 张参考图、纯文生视频、
生成类型选择、创意技能选择，以及英文/简体中文输出切换。

### 功能

- 扫描 `models/LLM` 和 `extra_model_paths.yaml` 注册的全部 LLM 路径
- 本地 GGUF + `mmproj` 视觉模型推理，支持 GPU 卸载层数
- 在线 OpenAI 兼容 `chat/completions` API，模型可自动从 `/models` 获取
- 在线模型刷新按钮与模型下拉选择，无需手动输入模型名
- 自动判别、文生视频、图生视频、首尾帧、尾帧和多参考生成
- 使用随仓库附带的 MiniMax 官方 skills 本地副本，不运行时联网
- 可选择生成后卸载本地模型（默认开启）
- 3D 动画、品牌宣传、产品广告、音乐字幕、纸艺科普等创意技能

### 安装与使用

将仓库目录放入 `ComfyUI/custom_nodes/` 后重启 ComfyUI。在线 API 模式无需安装 `llama-cpp-python`；
只有使用本地 GGUF 时才需要安装 `llama-cpp-python>=0.3.46`。
在节点中选择模型、生成类型和创意技能；无图且选择“自动判别”时会自动采用文生视频方式。
GPU 卸载层数默认为 `-1`，表示全部放入显存；显存不足时可改为 16-24。

在线模式要求服务支持 OpenAI 多模态消息格式；API Key 只在节点运行时使用，不写入文件。

## English

Standalone ComfyUI node for generating production-ready MiniMax H3 video prompts with a local
GGUF vision-language model or an OpenAI-compatible hosted API. It supports 1-9 reference images,
text-to-video mode, generation-type selection, creative skill selection, and English/Chinese output.

### Features

- Scans local `models/LLM` plus paths registered in `extra_model_paths.yaml`
- Local GGUF + `mmproj` vision inference with configurable GPU offload layers (default: `-1`, all layers on GPU)
- OpenAI-compatible `chat/completions` API with automatic `/models` discovery
- Refresh button and dropdown selection for hosted models; no manual model-name entry required
- Auto, text-to-video, image-to-video, first/last-frame, last-frame, and multi-reference modes
- Vendored MiniMax official skills are used locally; no runtime network synchronization
- Optional model unload after generation (enabled by default)
- Creative skills for 3D shorts, brand ads, product ads, music subtitles, and paper-craft explainers

### Installation

Place this folder under `ComfyUI/custom_nodes/` and restart ComfyUI. Online API mode does not require
`llama-cpp-python`; install `llama-cpp-python>=0.3.46` only when using local GGUF models.
With no image connected and generation type set to Auto, the node automatically uses text-to-video.

For online mode, the endpoint must support OpenAI multimodal messages. API keys are used only at
runtime and are never written to disk.

## License

See the upstream MiniMax-H3 license for the bundled official skills and the repository license.
