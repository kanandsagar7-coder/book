const { GoogleGenerativeAI } = require("@google/generative-ai");

// 只初始化Google Gemini客户端
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Serverless Function 入口点
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    // 第一步：只使用Gemini Pro生成故事文本
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const storyPrompt = `为5岁儿童创作关于“${topic}”的10页绘本故事。要求积极温暖，语言简单。每个段落以“PAGE:”开头。`;
    
    const result = await model.generateContent(storyPrompt);
    const storyText = await result.response.text();
    
    const storyPages = storyText.split('PAGE:').map(p => p.trim()).filter(Boolean);
    if (storyPages.length === 0) {
      throw new Error('Story generation failed.');
    }

    // 第二步：使用占位图，确保图片部分100%成功
    const finalStory = storyPages.map((text, index) => ({
      text,
      // 使用picsum.photos作为可靠的图片占位符
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(topic)}-${index}/1024/1024`
    }));

    // 返回成功响应
    res.status(200).json({ story: finalStory });

  } catch (error) {
    console.error('Error generating storybook:', error);
    // 将详细错误信息返回给前端，方便我们看到
    res.status(500).json({ error: 'Failed to generate storybook.', details: error.message });
  }
};
