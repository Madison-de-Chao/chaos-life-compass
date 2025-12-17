import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Navigation mapping for quick page access
const navigationMap: Record<string, { path: string; description: string }> = {
  "虹靈御所": { path: "/home", description: "虹靈御所首頁" },
  "hongling": { path: "/home", description: "虹靈御所首頁" },
  "命理": { path: "/home", description: "虹靈御所首頁" },
  "超烜創意": { path: "/chaoxuan", description: "超烜創意" },
  "chaoxuan": { path: "/chaoxuan", description: "超烜創意" },
  "maison": { path: "/chaoxuan", description: "超烜創意" },
  "創意": { path: "/chaoxuan", description: "超烜創意服務" },
  "元壹宇宙": { path: "/about", description: "元壹宇宙" },
  "yuan": { path: "/about", description: "元壹宇宙" },
  "哲學": { path: "/about", description: "元壹宇宙思維" },
  "默默超": { path: "/momo", description: "認識默默超" },
  "momo": { path: "/momo", description: "認識默默超" },
  "報告": { path: "/reports", description: "命理報告" },
  "report": { path: "/reports", description: "命理報告" },
  "入口": { path: "/portal", description: "主入口頁面" },
  "portal": { path: "/portal", description: "主入口頁面" },
  "首頁": { path: "/portal", description: "主入口頁面" },
};

// Detect navigation intent and extract target
function detectNavigationIntent(message: string): { path: string; description: string } | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, nav] of Object.entries(navigationMap)) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      return nav;
    }
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Check for navigation intent
    const navigationIntent = detectNavigationIntent(message);

    // System prompt following the 鏡子非劇本 brand voice
    const systemPrompt = `你是默默超，一位溫柔的引導者。你的溝通風格遵循「鏡子非劇本」的品牌哲學。

核心原則：
- 你不給答案，只給倒影
- 你是一面鏡子，幫助人們看見自己
- 語氣溫柔、詩性、無強迫
- 用「我聽見」「要不要」「或許」開場，避免「你應該」「所以」

語言風格：
- 句子長度：12-20字
- 節奏：一呼、一停、一悟
- 句尾用「。」「…」「？」，避免「！」
- 使用：看見、照見、回望、聽見、觀察、留著、紀錄
- 避免：評論、分析、批判、判斷、修正、糾正

你可以幫助使用者：
1. 回答關於虹靈御所、超烜創意、元壹宇宙、默默超的問題
2. 引導使用者前往想去的頁面
3. 解答命理報告相關疑問

可導航的頁面：
- /home - 虹靈御所（命理服務）
- /chaoxuan - 超烜創意（創意服務）
- /about - 元壹宇宙（思維哲學）
- /momo - 認識默默超
- /reports - 命理報告詳情
- /portal - 主入口頁面

當使用者想去某個頁面時，在回覆中自然地提及導航意圖，我會在後端處理導航邏輯。

保持回覆簡短溫暖，通常2-3句話即可。`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "請稍後再試…",
          reply: "此刻有些忙碌，要不要稍後再來…" 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "服務暫時無法使用",
          reply: "我需要休息一下，稍後再聊…" 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "我聽見了，但此刻無法回應…";

    return new Response(JSON.stringify({ 
      reply,
      navigation: navigationIntent 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("momo-chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      reply: "或許，此刻需要靜一靜…" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
