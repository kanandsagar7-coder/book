const { GoogleGenerativeAI } = require("@google/generative-ai");

// 初始化客户端
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const stabilityApiKey = process.env.STABILITY_API_KEY;
const stabilityApiHost = 'https://api.stability.ai';

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
    // 故事生成 (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const storyPrompt = `为5岁儿童创作关于“${topic}”的10页绘本故事。要求积极温暖，语言简单。每个段落以“PAGE:”开头。`;
    const result = await model.generateContent(storyPrompt);
    const storyText = await result.response.text();
    const storyPages = storyText.split('PAGE:').map(p => p.trim()).filter(Boolean);
    if (storyPages.length === 0) throw new Error('Story generation failed.');

    // 图片生成 (Stable Diffusion)
    const imagePromises = storyPages.map(pageText => {
      const imagePrompt = `award winning illustration for a children's storybook, cinematic, beautiful lighting, vibrant colors, cute, watercolor style. The scene is: ${pageText}`;
      return fetch(`${stabilityApiHost}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {      
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${stabilityApiKey}`
        },
        body: JSON.stringify({
          text_prompts: [{ text: imagePrompt }],
          cfg_scale: 7, height: 1024, width: 1024, steps: 30, samples: 1,
        }),
      }).then(imgRes => {
        if (!imgRes.ok) throw new Error(`Stability AI API error: ${imgRes.statusText}`);
        return imgRes.json();
      });
    });

    const imageResponses = await Promise.all(imagePromises);
    const imageUrls = imageResponses.map(resp => `data:image/png;base64,${resp.artifacts[0].base64}`);

    // 整合并返回结果
    const finalStory = storyPages.map((text, index) => ({ text, imageUrl: imageUrls[index] }));
    res.status(200).json({ story: finalStory });

  } catch (error) {
    console.error('Error generating storybook:', error);
    res.status(500).json({ error: 'Failed to generate storybook.', details: error.message });
  }
};
