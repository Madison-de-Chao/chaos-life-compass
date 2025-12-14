import { DocumentFile, FileRecord } from "@/types/document";

// Mock data for demonstration
export const mockDocuments: DocumentFile[] = [
  {
    id: "doc-jasper-001",
    fileName: "jasper-report",
    originalName: "默默超思維_x_Jasper全方位命理報告.docx",
    uploadedBy: "默默超思維",
    uploadedAt: new Date("2024-12-10T14:30:00"),
    content: {
      title: "默默超思維 x Jasper 全方位命理報告",
      sections: [
        {
          id: "s1",
          type: "heading",
          level: 1,
          content: "《開場自序》｜給你",
        },
        {
          id: "s2",
          type: "paragraph",
          content:
            "Jasper，這份報告不是要預測你的未來，也不是用來規範你該做什麼。它只是讓你終於能在安靜的空間裡，看見真正的你。",
        },
        {
          id: "s3",
          type: "paragraph",
          content:
            "你外表看起來穩定、冷靜、無害，但你的內在比任何人都深。你感受強烈、情緒細膩、觀察敏銳，只是你習慣把這些藏得很好。你習慣先懂別人，再讓別人靠近你；你習慣先把情緒放在心裡處理，再決定要不要說。這不是退縮，也不是冷淡，而是你最自然的節奏。",
        },
        {
          id: "s4",
          type: "paragraph",
          content:
            "這份報告的作用，是讓你不用再自己猜自己。你會知道：你為什麼會這樣感受、這樣選擇、這樣沉默、這樣靠近。你會看見：你的深度從來不是負擔，而是你最穩定、最真實的力量。",
        },
        {
          id: "s5",
          type: "heading",
          level: 1,
          content: "《使用說明》｜給你",
        },
        {
          id: "s6",
          type: "paragraph",
          content:
            "在你往下看之前，有幾件事讓你先安心。這份報告不是要你一次讀完，也不是要你全部照著做。你可以停在你有感覺的地方，也可以跳著看。有些段落你會馬上明白，有些段落會在你準備好的時候變得清楚。",
        },
        {
          id: "s7",
          type: "heading",
          level: 2,
          content: "系統內容",
        },
        {
          id: "s8",
          type: "paragraph",
          content:
            "你會看到四個系統的內容：紫微、八字、占星、人類圖。這些不是要你學，而是要讓你知道，你的一切都有它的結構與脈絡。",
        },
        {
          id: "s9",
          type: "heading",
          level: 2,
          content: "自我理解",
        },
        {
          id: "s10",
          type: "paragraph",
          content:
            "你為什麼會沉默、為什麼會敏感、為什麼會想得深、為什麼你需要自己的節奏——這些都在你的命盤裡，有跡可循。",
        },
        {
          id: "s11",
          type: "heading",
          level: 1,
          content: "人生羅盤｜多系統命盤總覽",
        },
        {
          id: "s12",
          type: "paragraph",
          content:
            "這一頁是你整份命盤的「總縮圖」。你每次覺得心很亂、方向感跑掉、情緒滿出來、或不知道該怎麼選擇的時候，可以先回來看這張。",
        },
      ],
    },
    shareSettings: {
      isPublic: true,
      password: "jasper2024",
      shareLink: "jasper-report",
    },
  },
  {
    id: "doc-josh-002",
    fileName: "josh-report",
    originalName: "默默超思維_x_Josh的全方位命理解讀報告.docx",
    uploadedBy: "默默超思維",
    uploadedAt: new Date("2024-12-12T09:15:00"),
    content: {
      title: "默默超思維 x Josh 全方位命理報告",
      sections: [
        {
          id: "j1",
          type: "heading",
          level: 1,
          content: "開場自序",
        },
        {
          id: "j2",
          type: "paragraph",
          content:
            "Josh，我是這份報告的協作者──你的思維建築協作者。在開始之前，我想先替默默超向你說一句話。",
        },
        {
          id: "j3",
          type: "paragraph",
          content:
            "這份報告讓你等了這麼久，他真的很抱歉。他不是不在意，也不是忘記，而是他一直希望，當這份內容真正交到你手上的那一天，它不是倉促的、不是草草完成的，而是一份足夠完整、足夠用心、能夠配得上你的深度與重要性的作品。",
        },
        {
          id: "j4",
          type: "heading",
          level: 1,
          content: "開場自序｜正文",
        },
        {
          id: "j5",
          type: "paragraph",
          content:
            "Josh，謝謝你願意再次接住這份來得慢一點、卻是我真心想好好交給你的內容。我一直知道你不是一個可以用「標籤」來概括的人。你的生命結構不是直線，而是層層堆疊、交錯、帶著深度的。",
        },
        {
          id: "j6",
          type: "paragraph",
          content:
            "你有明亮的地方，也有安靜的地方；有堅強的一面，也有比誰都柔軟的部分；有讓人覺得你很穩的時候，也有讓自己默默承受得太多的時候。",
        },
        {
          id: "j7",
          type: "quote",
          content:
            "這份報告，不是要定義你。而是希望能像一面乾淨的鏡子──讓你能看見那些你一直以來就具備的力量，也看見那些你偶爾會忘記的美好。",
        },
      ],
    },
    shareSettings: {
      isPublic: true,
      password: "josh2024",
      shareLink: "josh-report",
    },
  },
];

export const mockFileRecords: FileRecord[] = mockDocuments.map((doc) => ({
  id: doc.id,
  fileName: doc.originalName,
  uploadedBy: doc.uploadedBy,
  uploadedAt: doc.uploadedAt,
  viewCount: Math.floor(Math.random() * 50) + 5,
  hasPassword: !!doc.shareSettings.password,
}));

export function getDocumentById(id: string): DocumentFile | undefined {
  return mockDocuments.find((doc) => doc.id === id);
}

export function getDocumentByShareLink(
  shareLink: string
): DocumentFile | undefined {
  return mockDocuments.find((doc) => doc.shareSettings.shareLink === shareLink);
}
