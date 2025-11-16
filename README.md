# AI中文绘本生成器 V2

这是一个通过线上部署解决本地环境问题的AI绘本应用。它使用Google Gemini Pro生成故事，Stability AI生成插画。

## 部署和运行指南 (全新简化流程)

由于本地开发环境复杂且容易出错，我们采用**直接线上部署**的策略，这是最简单、最可靠的方法。

---

### **你需要准备：**

1.  **一个GitHub账号**：如果你没有，可以免费注册一个 [github.com](https://github.com)。
2.  **一个Vercel账号**：用你的GitHub账号登录即可 [vercel.com](https://vercel.com)。
3.  **两个API密钥**：
    *   **Google API Key**: 从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取。
    *   **Stability AI API Key**: 从 [Stability AI官网](https://platform.stability.ai/) 获取 (登录 -> 右上角头像 -> API Keys)。

---

### **操作步骤 (约5分钟):**

#### **第一步：将代码上传到GitHub**

1.  在GitHub上，创建一个新的代码仓库 (repository)，名字可以叫 `ai-storybook`。
2.  将我为你生成的 `中文绘本` 文件夹里的**所有文件**，上传到这个新的GitHub仓库里。

#### **第二步：在Vercel上部署**

1.  登录Vercel官网，点击 “**Add New...**” -> “**Project**”。
2.  在 “**Import Git Repository**” 列表中，找到并选择你刚刚创建的 `ai-storybook` 仓库，点击 “**Import**”。
3.  **关键一步：配置API密钥**
    *   在部署前的配置页面，找到并展开 “**Environment Variables**” (环境变量) 区域。
    *   添加**第一个**变量：
        *   Name: `GOOGLE_API_KEY`
        *   Value: (粘贴你从Google获取的API密钥)
    *   点击 “**Add**”，然后添加**第二个**变量：
        *   Name: `STABILITY_API_KEY`
        *   Value: (粘贴你从Stability AI获取的API密钥)
4.  点击底部的 “**Deploy**” 按钮。

---

### **第三步：访问你的绘本应用**

Vercel会自动开始构建和部署你的项目。这个过程大约需要1-2分钟。

完成后，Vercel会为你生成一个**公开的、永久的网址** (例如 `ai-storybook-xyz.vercel.app`)。

**点击这个网址，你就可以随时随地访问和使用你的AI绘本生成器了！** 这个网址也可以分享给朋友们体验。

这个方法一劳永逸地解决了所有本地环境问题。如果你在操作过程中遇到任何疑问，随时问我。
