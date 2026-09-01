import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";

const NODE_NAME = "Qwen36MultiImageH3ChinesePrompt";

app.registerExtension({
    name: "QwenH3Prompt.OnlineModels",
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== NODE_NAME) return;

        const originalCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            const result = originalCreated?.apply(this, arguments);
            // Older workflows may carry the legacy Chinese image widgets as
            // unknown fields. Remove those duplicates from the visible node;
            // the Python executor still accepts their values for compatibility.
            if (this.widgets) {
                this.widgets = this.widgets.filter((widget) =>
                    !/^图片_[1-9]$/.test(widget.name) && !/^Reference Image [1-9]$/.test(widget.name)
                );
            }
            const addressWidget = this.widgets?.find((widget) => widget.name === "Online Request URL");
            const keyWidget = this.widgets?.find((widget) => widget.name === "Online API Key");
            const modelWidget = this.widgets?.find((widget) => widget.name === "Online Model");
            if (!addressWidget || !keyWidget || !modelWidget) return result;

            const savedModel = modelWidget.value || "";
            modelWidget.type = "combo";
            modelWidget.options = modelWidget.options || {};
            modelWidget.options.values = savedModel ? [savedModel] : ["请点击刷新在线模型"];
            if (!savedModel) modelWidget.value = "";

            const refresh = this.addWidget("button", "刷新在线模型", null, async () => {
                const oldLabel = refresh.name;
                refresh.name = "正在获取模型...";
                this.setDirtyCanvas(true, true);
                try {
                    const response = await api.fetchApi("/qwen-h3-prompt/models", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            base_url: addressWidget.value || "",
                            api_key: keyWidget.value || "",
                        }),
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
                    modelWidget.options.values = data.models;
                    if (!data.models.includes(modelWidget.value)) modelWidget.value = data.models[0];
                    refresh.name = `刷新在线模型（${data.models.length}）`;
                } catch (error) {
                    refresh.name = oldLabel;
                    alert(`获取在线模型失败：${error.message}`);
                }
                this.setDirtyCanvas(true, true);
            });

            const refreshIndex = this.widgets.indexOf(refresh);
            const modelIndex = this.widgets.indexOf(modelWidget);
            if (refreshIndex > modelIndex + 1) {
                this.widgets.splice(refreshIndex, 1);
                this.widgets.splice(modelIndex + 1, 0, refresh);
            }
            this.setSize(this.computeSize());
            return result;
        };
    },
});
