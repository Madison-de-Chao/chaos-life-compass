import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";

// ============ LIFE COMPASS DATA ============

const ziWeiStars: Record<string, { axis: string; strength: string; blind: string; advice: string }> = {
  "紫微": { axis: "天生的統帥格局，需要掌控全局才安心", strength: "有大局觀、組織力強、天生帶領導磁場，別人容易信服你", blind: "容易把「掌控」當成「安全感」，一旦失控就焦慮；有時聽不進不同意見", advice: "練習區分「我需要主導」和「我害怕失控」" },
  "天機": { axis: "腦子轉很快的軍師型，善於分析但容易想太多", strength: "反應快、善策劃、能同時處理多條線索，適合幕後操盤", blind: "想太多反而不敢動，容易陷入「分析癱瘓」；情緒敏感但不一定會表達", advice: "給自己設「思考截止線」——想到第三輪就行動" },
  "太陽": { axis: "天生的發光體，習慣照顧所有人但忘了自己", strength: "慷慨、有感染力、樂於付出，在團體中容易成為核心", blind: "把「被需要」當成存在感來源，累了也不說；容易為了面子硬撐", advice: "練習在沒有觀眾的時候，也能對自己好" },
  "武曲": { axis: "行動派的實幹家，重效率、重結果、不廢話", strength: "執行力強、目標明確、財務敏感度高，說到做到", blind: "太直接容易傷人而不自知；把效率當唯一標準，忽略人的感受", advice: "效率解決事情，但關係需要慢下來的時刻" },
  "天同": { axis: "溫和的享樂主義者，重感覺、重舒適、抗壓低", strength: "親和力高、懂得享受生活、有藝術感知力，跟誰都處得來", blind: "遇到壓力容易逃避或拖延；「不想面對」常被包裝成「順其自然」", advice: "舒適圈是休息站，不是終點站" },
  "廉貞": { axis: "內在張力很大的矛盾體，感性與野心並存", strength: "有魅力、有衝勁、情感濃度高，做事有自己的堅持", blind: "情緒起伏大、容易鑽牛角尖；對關係要求高但表達方式容易讓人壓力大", advice: "你的強度是資產，但需要學會調節輸出的音量" },
  "天府": { axis: "穩重的大管家，重安全、重累積、重品質", strength: "穩定可靠、有規劃能力、財務觀念強，是別人眼中的安心存在", blind: "太求穩容易錯過機會；有時候「保守」不是謹慎，是害怕改變", advice: "安全感不只來自存款，也來自你能承受多少不確定" },
  "太陰": { axis: "內在細膩的感受型，敏感、重情、需要安全感", strength: "觀察力極強、有同理心、審美好，能感知到別人忽略的細節", blind: "太容易吸收別人的情緒；內心戲多但外表看不出來，容易被誤解為「沒事」", advice: "你的敏感是天線，不是負擔——但天線需要定期校準" },
  "貪狼": { axis: "多才多藝的探索者，好奇心強但容易分散", strength: "學什麼都快、社交能力強、適應力高，人生體驗豐富", blind: "興趣太多容易每樣都淺嚐即止；「什麼都想要」有時是不知道自己真正要什麼", advice: "不是每個門都要推開——選三扇就好" },
  "巨門": { axis: "天生的質疑者，善辯、敏銳、但容易困在懷疑裡", strength: "分析力強、不容易被騙、口才好，適合需要辨別真偽的工作", blind: "懷疑是工具不是性格——過度懷疑會把關係推遠；容易被「我不夠好」的念頭卡住", advice: "把用在質疑別人的力氣，分一點來肯定自己" },
  "天相": { axis: "天生的協調者，重和諧、重公平、怕衝突", strength: "有正義感、善於調和、在團體中是潤滑劑，別人願意跟你合作", blind: "太怕衝突容易委屈自己；「公平」有時是迴避表態的藉口", advice: "和諧不等於每次都你讓——你的需求也值得被放進天平" },
  "天梁": { axis: "老靈魂型的照顧者，有智慧但容易活成長輩", strength: "沉穩、有見地、天生有保護他人的能力，危機處理能力強", blind: "習慣當「大人」會忘記自己也需要被照顧；容易不自覺地說教", advice: "允許自己偶爾當小孩，不用每次都是最成熟的那個人" },
  "七殺": { axis: "孤膽型的開拓者，有魄力但不太需要別人", strength: "決斷力強、不怕困難、有開創精神，逆境中反而表現更好", blind: "容易把「不需要別人」當成驕傲，其實是不知道怎麼開口求助", advice: "你一個人能扛很多，但不代表你應該一個人扛" },
  "破軍": { axis: "破舊立新的革命者，不安於現狀但也不安於自己", strength: "有衝勁、敢打破框架、不怕推翻重來，是天生的變革推動者", blind: "容易把「重來」當成解決方案，忽略有些東西需要修不需要拆；內心其實比外表不安", advice: "破壞之前先確認：你是真的要重建，還是只是待不住" },
};

const baZiDayMasters: Record<string, { axis: string; strength: string; blind: string; advice: string }> = {
  "甲木": { axis: "大樹型人格，正直、有骨氣、不彎腰", strength: "有原則、有擔當、方向感明確，別人看你覺得可靠", blind: "太硬容易折——不懂變通有時不是堅持，是固執", advice: "大樹也需要根的彈性，不是每場風都要硬扛" },
  "乙木": { axis: "藤蔓型人格，柔軟、適應力強、懂得借力", strength: "善於觀察環境、懂得迂迴前進、人際關係靈活", blind: "太會適應有時會忘記自己原本要什麼；容易依賴環境或他人", advice: "柔軟是你的策略，但你需要自己的根" },
  "丙火": { axis: "太陽型人格，熱情、大方、照亮周圍的人", strength: "感染力強、慷慨、有行動力，天生吸引目光", blind: "燃燒太快容易倦怠；習慣照亮別人但自己的暗處沒人看見", advice: "不是每個房間都需要你來點亮" },
  "丁火": { axis: "燭火型人格，溫暖但克制，光芒內斂", strength: "細膩、有洞察力、溫暖而不灼人，適合一對一的深度連結", blind: "容易把事情藏心裡、悶燒型壓力累積；光太小會讓自己覺得不夠亮", advice: "燭火不需要跟太陽比大小——你的光在近距離最強" },
  "戊土": { axis: "大山型人格，穩重、寬厚、扛得住", strength: "包容力強、可靠、有承載力，別人遇到事第一個想找你", blind: "扛太多不會喊累，直到某天突然崩；動作太慢容易錯過時機", advice: "山可以穩，但你不需要替每個人當靠山" },
  "己土": { axis: "田地型人格，滋養、包容、低調但有用", strength: "實際、有耐心、善於培養和支持別人成長", blind: "太低調容易被忽略或被踩；「我沒關係」說太多次自己也會信", advice: "田地養萬物，但你不是所有人的土壤" },
  "庚金": { axis: "刀劍型人格，銳利、果斷、重義氣", strength: "有決斷力、講義氣、效率高，是值得信任的戰友", blind: "太利容易傷人、太直容易得罪人；有時候不是別人太脆弱，是你太快", advice: "刀的價值不只是快——知道什麼時候不出鞘也是本事" },
  "辛金": { axis: "珠寶型人格，精緻、敏感、有品味", strength: "審美好、細節控、有獨到的觀點和品味", blind: "對自己和別人都太挑剔；敏感到容易受傷但不說", advice: "珠寶需要被看見，但不需要被每個人都欣賞" },
  "壬水": { axis: "大海型人格，包容、流動、不受拘束", strength: "適應力極強、思維開闊、能接納各種可能性", blind: "太流動容易沒有方向感；「都可以」有時是不知道自己要什麼", advice: "大海不需要邊界，但你需要一個岸" },
  "癸水": { axis: "雨露型人格，安靜、滲透力強、不知不覺影響你", strength: "直覺強、善於在暗處觀察、影響力是滲透式的", blind: "太安靜容易被忽略；容易把情緒往內收到自己都找不到出口", advice: "你不需要大聲，但你需要被聽見" },
};

const sunSigns: Record<string, { axis: string; strength: string; blind: string; advice: string }> = {
  "牡羊": { axis: "行動第一的開拓者，先衝再說", strength: "有決斷力、不怕失敗、行動力在十二星座裡數一數二", blind: "衝太快容易忽略後果和別人的感受；耐性是你最大的功課", advice: "你的速度是優勢——但偶爾回頭看一下後面的人" },
  "金牛": { axis: "穩定的建造者，重感官、重累積、重安全", strength: "耐力強、有品味、理財觀念好，是長期主義者", blind: "太固定容易變固執；「我需要時間想」有時是在拖延", advice: "穩定是你的根，但根太深有時會讓你動不了" },
  "雙子": { axis: "訊息的集散中心，好奇、善溝通、腦子很忙", strength: "反應快、會聊天、學東西快、能同時應付多件事", blind: "注意力容易分散；表面都聊得來但深度連結不一定有", advice: "你不缺資訊，你缺的是停下來消化的時間" },
  "巨蟹": { axis: "情感驅動的照顧者，家是你的核心座標", strength: "同理心強、記憶力好、對在乎的人付出不計算", blind: "情緒起伏跟安全感直接掛鉤；容易把「照顧別人」當成控制的方式", advice: "照顧人之前先問自己：我現在狀態夠不夠照顧自己？" },
  "獅子": { axis: "天生的舞台人，需要被看見、被肯定", strength: "有領袖氣質、慷慨、創造力強，能帶動氣氛", blind: "自尊心太強容易受傷但不願示弱；「被忽略」對你來說比「被批評」更難受", advice: "你的光不需要別人打——但你需要學會在沒有掌聲時也能站穩" },
  "處女": { axis: "細節的完美主義者，分析力強但容易自我苛求", strength: "觀察力強、做事精準、有服務精神，是團隊裡最可靠的人", blind: "標準太高會先壓死自己；「還不夠好」是你最常跑的內心台詞", advice: "完美是方向，不是標準——80 分出手比 100 分不出手有用" },
  "天秤": { axis: "關係中的平衡者，重公平、重美感、怕衝突", strength: "有美感、善社交、能站在不同角度思考，是天生的調停者", blind: "太怕得罪人容易失去自己的立場；「我都可以」不是隨和，是迴避選擇", advice: "天平兩端平衡很重要——但你自己也要站在天平上" },
  "天蠍": { axis: "深度的掌控者，看穿表象、直指核心", strength: "洞察力強、意志力堅定、一旦投入就全力以赴", blind: "控制欲強、不容易信任人；「看穿別人」有時是一種防禦機制", advice: "你能看見深處，但不是每個人都需要被你看穿" },
  "射手": { axis: "自由的冒險者，需要意義、需要空間、需要可能性", strength: "樂觀、視野開闊、有哲學思考力，走到哪都能活", blind: "太追求自由容易逃避責任；「還有更好的」有時是不願意面對現有的", advice: "自由不只是離開——有時候留下來面對，更自由" },
  "摩羯": { axis: "長期主義的建構者，重紀律、重成就、重社會位置", strength: "有規劃能力、能扛壓、目標感強，是最可能把事情做成的人", blind: "太壓抑情感需求；容易把「成就」當成「存在價值」的唯一指標", advice: "你很會蓋大樓——但記得在裡面留一間房間給自己住" },
  "水瓶": { axis: "獨立的異類，重理念、重群體、但不太想融入", strength: "有創新力、不盲從、能看見別人看不見的可能性", blind: "太抽離容易讓親近的人覺得冷；「我跟別人不一樣」有時是在迴避親密", advice: "你不需要跟誰一樣——但你可以讓人靠近" },
  "雙魚": { axis: "邊界模糊的感受者，共感力極強但容易迷失", strength: "有藝術天分、直覺強、能感受到別人感受不到的層次", blind: "太容易吸收環境情緒；分不清「我的感覺」和「別人的感覺」", advice: "你的天線很靈敏——但記得裝一個開關" },
};

const moonSigns: Record<string, { axis: string; strength: string; blind: string; advice: string }> = {
  "牡羊": { axis: "情緒來得快去得快，需要即時回應", strength: "情感直接、不記仇、恢復力強", blind: "情緒反應太快容易傷人；不擅長處理需要慢慢談的事", advice: "你的情緒是快火——學會給自己 10 秒再回應" },
  "金牛": { axis: "需要穩定和實感才覺得安全", strength: "情緒穩定、忠誠、有安撫他人的能力", blind: "變動會讓你極度不安；有時抓太緊反而窒息", advice: "安全感可以自己建——不需要所有東西都不變" },
  "雙子": { axis: "需要透過說話和交流來處理情緒", strength: "能理性看待自己的感受、善於表達情緒", blind: "容易用分析取代感受；「講清楚」不等於「處理好了」", advice: "有時候情緒不需要被理解——需要被感受" },
  "巨蟹": { axis: "情緒最深、需求最強的月亮位置", strength: "共感力極強、直覺好、對親近的人有強大的保護本能", blind: "情緒波動大、容易因為小事觸發深層不安全感", advice: "你的感受是真的——但不是每個感受都需要馬上被解決" },
  "獅子": { axis: "需要被重視、被欣賞才能安心", strength: "慷慨、溫暖、會讓親近的人覺得被照亮", blind: "「被忽略」是你最大的情緒地雷；有時會不自覺地用表現換愛", advice: "你值得被看見——但不需要一直表演才能被看見" },
  "處女": { axis: "需要秩序和掌控感才能安心", strength: "細心、實際、會用行動表達關心", blind: "容易用「挑毛病」表達焦慮；對自己的情緒也會苛求", advice: "你不需要把情緒也整理得完美——亂一點也可以" },
  "天秤": { axis: "需要和諧的關係環境才覺得安全", strength: "善於讀氣氛、調解衝突、有美感", blind: "為了維持和諧會壓自己的真實感受；討厭衝突但壓久了會爆", advice: "和諧如果是壓出來的，那不是和諧" },
  "天蠍": { axis: "情緒極深、極濃、要嘛全要嘛不要", strength: "忠誠到底、直覺精準、對信任的人會完全敞開", blind: "佔有欲強、容易鑽牛角尖；受傷之後的報復心很重但未必會表現出來", advice: "你的深度是禮物——但不是每段關係都需要挖到底" },
  "射手": { axis: "需要自由和空間才能安心", strength: "樂觀、恢復力強、不容易被負面情緒困住", blind: "容易用樂觀逃避真正的情緒；「沒事」不一定是真的沒事", advice: "跑遠一點看風景可以——但記得帶上你的感受一起" },
  "摩羯": { axis: "壓抑型的情緒處理者，習慣自己扛", strength: "堅強、獨立、不會隨便崩潰", blind: "太會忍讓別人以為你不需要支持；「我可以」說太多次，自己也信了", advice: "強不等於不需要人——偶爾讓人進來不會塌" },
  "水瓶": { axis: "需要距離感才能處理情緒", strength: "能客觀看待自己的情緒、不容易被情緒綁架", blind: "太抽離會讓身邊的人覺得冷；容易把「分析情緒」當成「處理情緒」", advice: "你可以用腦袋理解情緒——但有時候需要用身體感受它" },
  "雙魚": { axis: "像海綿一樣吸收所有人的情緒", strength: "共感力最強、有藝術靈性、能療癒別人", blind: "分不清哪些情緒是自己的、哪些是吸收來的", advice: "每天問自己一次：這個感覺是我的，還是別人的？" },
};

const hdTypes: Record<string, { axis: string; strength: string; blind: string; advice: string }> = {
  "顯示者 × 情緒": { axis: "有行動力但要等情緒波穩定才能下好決定", strength: "天生的發起者，一旦等到清明的時刻，決策品質很高", blind: "衝動和決斷之間只差一個「等」——但等是你最不擅長的", advice: "不是不能動，是動之前先問自己：我現在是清明還是激動？" },
  "顯示者 × 直覺": { axis: "直覺一閃就該動的行動者", strength: "反應快、直覺準、適合即時決策", blind: "直覺訊號是瞬間的——錯過就沒了，不能事後補", advice: "身體第一個反應通常是對的——不要用腦袋去推翻它" },
  "顯示者 × 意志力": { axis: "憑意志力驅動的發起者，「我要」就是你的引擎", strength: "目標明確、承諾感強、說到做到", blind: "不是每件事都值得你拼意志力；要確認「我想要」不是「我應該要」", advice: "只承諾你真心想做的事——假承諾會反噬" },
  "顯示者 × 自我投射": { axis: "透過說出來才知道自己要什麼", strength: "表達的過程就是釐清的過程", blind: "一個人想可能會卡住——你需要可信任的對話對象", advice: "找到你的聲音夥伴——跟他們講話的過程就是你的決策流程" },
  "生產者 × 薦骨": { axis: "身體會告訴你答案——「嗯哼」是 yes，「呃」是 no", strength: "有用不完的工作能量，只要做的是對的事", blind: "腦袋說應該做的事，薦骨不一定同意；硬做會累到壞掉", advice: "用是非題問自己的身體，不要用開放題問腦袋" },
  "生產者 × 情緒": { axis: "有能量也有耐心，但要等情緒波穩才能決定", strength: "等到清明點的決定特別穩、特別持久", blind: "容易在情緒高點說好、低點反悔；別人會覺得你「怎麼又變了」", advice: "重要決定睡三天——三天後還想要的才是真的" },
  "顯示生產者 × 薦骨": { axis: "多工高速的回應者，做中學、學中做", strength: "速度快、效率高、能同時跑多條線", blind: "太快容易跳過步驟，事後補的成本更高", advice: "你可以快，但重要的事讓薦骨確認一次再起跑" },
  "顯示生產者 × 情緒": { axis: "很快但不能馬上決定的矛盾型", strength: "行動力加上情緒深度，一旦方向確認會非常強大", blind: "你最大的功課就是「明明手腳很快但腦袋說要等」的拉扯", advice: "你可以先行動試探，但最終決定留到情緒清明時再鎖" },
  "投射者 × 情緒": { axis: "等邀請、等清明——雙重等待的智慧型", strength: "看人看事極準，等到對的時機出手效果驚人", blind: "等待容易變成被動；「沒人邀請我」有時是你沒讓人看見你", advice: "等待不是什麼都不做——是把自己準備好" },
  "投射者 × 直覺": { axis: "直覺型的引導者，當下就知道對不對", strength: "對人的判斷很準、適合做顧問和引導角色", blind: "直覺是瞬間訊號——過了就回不來，不能反覆推敲", advice: "相信你的第一個反應——它比你的第三個想法更準" },
  "投射者 × 意志力": { axis: "用「我想不想」來判斷的引導者", strength: "一旦真的想做，能量和專注力都會到位", blind: "真的不想做的時候硬逼自己會嚴重耗能", advice: "別接你心裡沒有「嗯我要」的任務" },
  "投射者 × 自我投射": { axis: "說出來才知道答案的引導者", strength: "你的洞見在對話中會自然浮現", blind: "獨處時容易迷路、卡在腦袋裡出不來", advice: "重大決定不要自己想——找人聊，答案在你嘴巴裡" },
  "投射者 × 環境": { axis: "環境對了，答案就會浮現", strength: "對環境氛圍極度敏感，在對的地方你會自然知道該做什麼", blind: "在錯的環境裡你會做出錯的決定——不是你判斷力差，是訊號被干擾", advice: "做重要決定前，先去一個讓你感覺舒服的地方" },
  "反映者 × 月循環": { axis: "用 28 天月循環做決定的鏡子型", strength: "能映照出環境的真實狀態，是團體的健康指標", blind: "太容易被環境影響，以為是自己的想法其實是環境的投射", advice: "重大決定等一個月循環——不是拖延，是你的設計" },
};

// ============ BIAS COMPASS DATA ============

const biasZiWei: Record<string, { decision: string; energy: string; emotion: string }> = {
  "紫微": { decision: "要掌控全局才敢決定", energy: "高續航，但需要主導感", emotion: "需要被尊重，不是被需要" },
  "天機": { decision: "分析完三輪才動", energy: "腦力消耗大，體力消耗小", emotion: "需要被理解，怕被當膚淺" },
  "太陽": { decision: "為了別人的需求而決定", energy: "發光型，亮給別人看但自己會空", emotion: "需要被看見，但不會說" },
  "武曲": { decision: "看效率，不看感覺", energy: "高效能短爆發，不擅長慢燉", emotion: "需要被信任，不是被擔心" },
  "天同": { decision: "能不決定就不決定", energy: "低耗能，舒適區裡最穩", emotion: "需要安穩，怕被推出舒適圈" },
  "廉貞": { decision: "感覺對了就衝", energy: "高張力，燃燒快但波動大", emotion: "需要強烈的情感連結" },
  "天府": { decision: "評估風險後才動", energy: "穩定輸出型，不爆發但持久", emotion: "需要穩定感和可預測性" },
  "太陰": { decision: "猶豫，怕選錯", energy: "內耗型，外面看不出來但裡面很忙", emotion: "需要安全感，極度需要" },
  "貪狼": { decision: "哪個有趣選哪個", energy: "多線切換型，同時開好幾個視窗", emotion: "需要新鮮感和自由" },
  "巨門": { decision: "質疑完所有選項才選", energy: "思辨型，動腦比動手多", emotion: "需要被肯定，怕被否定" },
  "天相": { decision: "看大家怎麼選再選", energy: "協調型，人群中最穩", emotion: "需要和諧，怕衝突" },
  "天梁": { decision: "用「對不對」來判斷", energy: "照顧型，幫別人時能量最高", emotion: "需要被感謝，但不會要求" },
  "七殺": { decision: "快、狠、直接", energy: "爆發型，衝完就空", emotion: "需要被尊敬，不要被管" },
  "破軍": { decision: "先打掉重來再說", energy: "破壞型，破舊的能量比建新的強", emotion: "需要突破感，安定太久會焦躁" },
};

const biasBaZi: Record<string, { decision: string; energy: string; emotion: string }> = {
  "甲木": { decision: "認定方向就直走，不回頭", energy: "大樹型穩定輸出", emotion: "需要空間往上長" },
  "乙木": { decision: "看環境調整方向再走", energy: "藤蔓型依附前進", emotion: "需要依靠但不想被綁" },
  "丙火": { decision: "憑熱情決定", energy: "太陽型強力輸出，持續發光", emotion: "需要回應，不能被無視" },
  "丁火": { decision: "慢慢燒，想清楚再動", energy: "燭火型穩定但不耐強風", emotion: "需要親密的深度連結" },
  "戊土": { decision: "想很久，但決定了就不改", energy: "大山型不動如山", emotion: "需要被依賴的感覺" },
  "己土": { decision: "配合別人的需求而定", energy: "田地型默默承載", emotion: "需要被重視，而不只是被用" },
  "庚金": { decision: "直接、果斷、不拖泥帶水", energy: "刀劍型短快爆發", emotion: "需要義氣和信任" },
  "辛金": { decision: "在意細節，挑過才選", energy: "珠寶型精緻但怕碰撞", emotion: "需要被欣賞和珍惜" },
  "壬水": { decision: "什麼都可以，沒有非要", energy: "大海型廣但不深", emotion: "需要自由和空間" },
  "癸水": { decision: "直覺先行，理由後補", energy: "雨露型滲透式影響", emotion: "需要被懂，而不只是被聽" },
};

const biasSunSign: Record<string, string> = {
  "牡羊": "衝刺型，先動再想", "金牛": "蓄電型，慢但持久", "雙子": "切換型，同時多工",
  "巨蟹": "情緒驅動，安全感高能量就高", "獅子": "舞台型，有觀眾能量就爆發", "處女": "精密型，條理越清楚能量越穩",
  "天秤": "關係型，有夥伴才有動力", "天蠍": "深潛型，集中火力在單一目標", "射手": "探索型，有目標就有油",
  "摩羯": "馬拉松型，長跑耐力最強", "水瓶": "靈感型，被理念驅動", "雙魚": "流動型，跟著感覺走",
};

const biasMoonSign: Record<string, { decision: string; emotion: string }> = {
  "牡羊": { decision: "快，憑直覺", emotion: "需要即時被回應" },
  "金牛": { decision: "慢，需要安全感才動", emotion: "需要穩定和實質的安心感" },
  "雙子": { decision: "講出來就清楚了", emotion: "需要對話和思想交流" },
  "巨蟹": { decision: "看感覺，感覺對就對", emotion: "需要歸屬感和被保護" },
  "獅子": { decision: "選讓自己有光的那個", emotion: "需要被重視和欣賞" },
  "處女": { decision: "分析完所有選項再選", emotion: "需要秩序和掌控感" },
  "天秤": { decision: "兩邊都看，很難選", emotion: "需要和諧和被公平對待" },
  "天蠍": { decision: "直覺極準但不一定會說", emotion: "需要深度信任和全然的忠誠" },
  "射手": { decision: "選自由度高的那個", emotion: "需要空間和意義感" },
  "摩羯": { decision: "選穩的、選對的", emotion: "需要成就感和被認可" },
  "水瓶": { decision: "選不一樣的那個", emotion: "需要獨立空間和理念認同" },
  "雙魚": { decision: "跟感覺走，常常選不了", emotion: "需要被理解，不是被修理" },
};

const hdTypeDecision: Record<string, string> = {
  "顯示者 × 情緒": "想動但要等，等到不焦躁再決定", "顯示者 × 直覺": "當下一閃就知道，不用想",
  "顯示者 × 意志力": "問自己「我真的要嗎」，要就動", "顯示者 × 自我投射": "說出來才知道要不要",
  "生產者 × 薦骨": "身體說好就好，腦袋閉嘴", "生產者 × 情緒": "等情緒波穩了再決定",
  "顯示生產者 × 薦骨": "身體說好就衝，快但要確認", "顯示生產者 × 情緒": "手腳快但腦袋說要等的拉扯",
  "投射者 × 情緒": "等邀請、等清明，雙重等待", "投射者 × 直覺": "被邀請的那一刻直覺就有答案",
  "投射者 × 意志力": "被邀請後問自己想不想", "投射者 × 自我投射": "被邀請後跟人聊，聊出答案",
  "投射者 × 環境": "到對的地方，答案自然浮現", "反映者 × 月循環": "等 28 天，讓時間告訴你",
};

const hdTypeEnergy: Record<string, string> = {
  "顯示者": "爆發型，發起後能量就在，沒發起就空轉", "生產者": "持續型，只要做對的事能量用不完",
  "顯示生產者": "高速多工型，快但容易跳步", "投射者": "聚焦型，引導別人時最有力", "反映者": "映照型，能量隨環境變化",
};

const hdAuthorityEmotion: Record<string, string> = {
  "薦骨": "需要做讓身體有反應的事", "情緒": "需要時間和空間等情緒清明",
  "直覺": "需要被允許跟著直覺走", "意志力": "需要被尊重「我想不想」的權利",
  "自我投射": "需要可以說話被傾聽的對象", "環境": "需要對的環境和氛圍", "月循環": "需要不被催促的時間空間",
};

// ============ CONSISTENCY LOGIC ============

type ConsistencyTag = "fast" | "slow" | "emotional" | "external";

const keywordGroups: Record<ConsistencyTag, string[]> = {
  fast: ["快", "衝", "直覺", "當下", "直接", "果斷", "憑熱情", "先動", "一閃", "爆發", "狠"],
  slow: ["慢", "等", "分析", "評估", "穩", "想很久", "掌控", "風險", "三輪", "質疑", "挑過", "28天", "月循環"],
  emotional: ["感覺", "情緒", "感受", "猶豫", "情感", "熱情"],
  external: ["看環境", "看大家", "配合", "別人", "邀請", "對不對"],
};

function classifyText(text: string): ConsistencyTag | null {
  const scores: Record<ConsistencyTag, number> = { fast: 0, slow: 0, emotional: 0, external: 0 };
  for (const [tag, keywords] of Object.entries(keywordGroups)) {
    for (const kw of keywords) {
      if (text.includes(kw)) scores[tag as ConsistencyTag]++;
    }
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] as ConsistencyTag : null;
}

function getConsistency(tags: (ConsistencyTag | null)[]): { symbol: string; label: string; color: string } {
  const valid = tags.filter(Boolean) as ConsistencyTag[];
  if (valid.length === 0) return { symbol: "—", label: "資料不足", color: "text-muted-foreground" };
  const counts: Record<string, number> = {};
  for (const t of valid) counts[t] = (counts[t] || 0) + 1;
  const max = Math.max(...Object.values(counts));
  if (max >= 4) return { symbol: "○", label: "四系統一致", color: "text-green-400" };
  if (max >= 3) return { symbol: "△", label: "有一個系統說的不太一樣", color: "text-yellow-400" };
  return { symbol: "✗", label: "偏勝——不同情境用不同版本的自己", color: "text-red-400" };
}

// ============ SELECT OPTIONS ============

const zodiacSigns = ["牡羊", "金牛", "雙子", "巨蟹", "獅子", "處女", "天秤", "天蠍", "射手", "摩羯", "水瓶", "雙魚"];
const ziWeiOptions = Object.keys(ziWeiStars);
const baZiOptions = Object.keys(baZiDayMasters);
const hdTypeOptions = ["顯示者", "生產者", "顯示生產者", "投射者", "反映者"];
const hdAuthorityOptions = ["薦骨", "情緒", "直覺", "意志力", "自我投射", "環境", "月循環"];

export default function CompassPage() {
  useSEO({
    title: "四系統羅盤體驗版 Four-System Compass | 虹靈御所",
    description: "30 秒填完 6 個選項，看見紫微斗數、八字、占星、人類圖四套系統怎麼描述你。",
    keywords: ["羅盤", "四系統", "紫微斗數", "八字", "占星", "人類圖", "命理體驗"],
  });

  const [ziWei, setZiWei] = useState("");
  const [baZi, setBaZi] = useState("");
  const [sunSign, setSunSign] = useState("");
  const [moonSign, setMoonSign] = useState("");
  const [hdType, setHdType] = useState("");
  const [hdAuthority, setHdAuthority] = useState("");
  const [showResults, setShowResults] = useState(false);

  const allSelected = ziWei && baZi && sunSign && moonSign && hdType && hdAuthority;
  const hdKey = `${hdType} × ${hdAuthority}`;

  const handleGenerate = () => {
    if (allSelected) setShowResults(true);
  };

  const handleReset = () => {
    setZiWei(""); setBaZi(""); setSunSign(""); setMoonSign(""); setHdType(""); setHdAuthority("");
    setShowResults(false);
  };

  // Bias consistency calculation
  const biasDecisionTags = [
    classifyText(biasZiWei[ziWei]?.decision || ""),
    classifyText(biasBaZi[baZi]?.decision || ""),
    classifyText(biasMoonSign[moonSign]?.decision || ""),
    classifyText(hdTypeDecision[hdKey] || ""),
  ];
  const biasEnergyTags = [
    classifyText(biasZiWei[ziWei]?.energy || ""),
    classifyText(biasBaZi[baZi]?.energy || ""),
    classifyText(biasSunSign[sunSign] || ""),
    classifyText(hdTypeEnergy[hdType] || ""),
  ];
  const biasEmotionTags = [
    classifyText(biasZiWei[ziWei]?.emotion || ""),
    classifyText(biasBaZi[baZi]?.emotion || ""),
    classifyText(biasMoonSign[moonSign]?.emotion || ""),
    classifyText(hdAuthorityEmotion[hdAuthority] || ""),
  ];

  const decisionConsistency = getConsistency(biasDecisionTags);
  const energyConsistency = getConsistency(biasEnergyTags);
  const emotionConsistency = getConsistency(biasEmotionTags);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Compass className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              你的四系統羅盤<span className="block text-lg md:text-xl text-muted-foreground mt-2">Your Four-System Compass (Trial)</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              30 秒填完 6 個選項，看見四套系統怎麼描述你
            </p>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2 text-sm">
              不用懂命理。不用輸入完整命盤。選好你的紫微命宮主星、八字日主、太陽星座、月亮星座、人類圖類型和內在權威，立刻看到四個系統各自怎麼看你——以及它們有沒有在互相打架。
            </p>
          </motion.div>
        </section>

        {/* Input Section */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">選你的配置 Select Your Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">紫微命宮主星</label>
                  <Select value={ziWei} onValueChange={setZiWei}>
                    <SelectTrigger><SelectValue placeholder="選擇主星" /></SelectTrigger>
                    <SelectContent>{ziWeiOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">不知道的話，可以用免費紫微排盤工具查詢</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">八字日主</label>
                  <Select value={baZi} onValueChange={setBaZi}>
                    <SelectTrigger><SelectValue placeholder="選擇日主" /></SelectTrigger>
                    <SelectContent>{baZiOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">日主就是你出生那天的天干</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">太陽星座</label>
                  <Select value={sunSign} onValueChange={setSunSign}>
                    <SelectTrigger><SelectValue placeholder="選擇太陽星座" /></SelectTrigger>
                    <SelectContent>{zodiacSigns.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">月亮星座</label>
                  <Select value={moonSign} onValueChange={setMoonSign}>
                    <SelectTrigger><SelectValue placeholder="選擇月亮星座" /></SelectTrigger>
                    <SelectContent>{zodiacSigns.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">不知道的話，可以用免費星盤工具查詢</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">人類圖類型</label>
                  <Select value={hdType} onValueChange={setHdType}>
                    <SelectTrigger><SelectValue placeholder="選擇類型" /></SelectTrigger>
                    <SelectContent>{hdTypeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">人類圖內在權威</label>
                  <Select value={hdAuthority} onValueChange={setHdAuthority}>
                    <SelectTrigger><SelectValue placeholder="選擇權威" /></SelectTrigger>
                    <SelectContent>{hdAuthorityOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">在人類圖報告裡找「內在權威」欄位</p>
                </div>
              </div>
              <div className="mt-8 flex justify-center gap-4">
                <Button onClick={handleGenerate} disabled={!allSelected} size="lg" className="min-w-[200px]">
                  <Compass className="w-4 h-4 mr-2" /> 查看我的羅盤
                </Button>
                {showResults && (
                  <Button onClick={handleReset} variant="outline" size="lg">重新選擇</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Results */}
        {showResults && allSelected && (
          <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto px-4 pb-20">
            <Tabs defaultValue="life" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="life">🧭 人生羅盤 Life Compass</TabsTrigger>
                <TabsTrigger value="bias">🎯 偏勝羅盤 Bias Compass</TabsTrigger>
              </TabsList>

              {/* Life Compass Tab */}
              <TabsContent value="life">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">你的人生羅盤 Your Life Compass</h2>
                  <p className="text-muted-foreground">四系統各自怎麼看你——優勢、盲點、建議，一張表收齊</p>
                </div>

                {/* Config summary */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline">紫微：{ziWei}</Badge>
                  <Badge variant="outline">八字：{baZi}</Badge>
                  <Badge variant="outline">太陽：{sunSign}</Badge>
                  <Badge variant="outline">月亮：{moonSign}</Badge>
                  <Badge variant="outline">人類圖：{hdType}・{hdAuthority}</Badge>
                </div>

                {/* Four system cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "紫微斗數", subtitle: `命宮主星：${ziWei}`, data: ziWeiStars[ziWei] },
                    { title: "八字命理", subtitle: `日主：${baZi}`, data: baZiDayMasters[baZi] },
                    { title: "西洋占星", subtitle: `太陽${sunSign}／月亮${moonSign}`, data: sunSigns[sunSign] },
                    { title: "人類圖", subtitle: `${hdType}・${hdAuthority}`, data: hdTypes[hdKey] },
                  ].map((sys) => (
                    <Card key={sys.title} className="border-primary/10 hover:border-primary/30 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{sys.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{sys.subtitle}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {sys.data ? (
                          <>
                            <div><span className="text-xs font-semibold text-primary">主軸設定</span><p className="text-sm mt-1">{sys.data.axis}</p></div>
                            <div><span className="text-xs font-semibold text-green-400">優勢</span><p className="text-sm mt-1">{sys.data.strength}</p></div>
                            <div><span className="text-xs font-semibold text-yellow-400">盲點</span><p className="text-sm mt-1">{sys.data.blind}</p></div>
                            <div><span className="text-xs font-semibold text-blue-400">建議</span><p className="text-sm mt-1">{sys.data.advice}</p></div>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">此組合暫無查表資料</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Moon sign card */}
                <Card className="mt-6 border-primary/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">月亮星座補充 Moon Sign Details</CardTitle>
                    <p className="text-sm text-muted-foreground">月亮{moonSign}——管內在需求和情緒反應</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {moonSigns[moonSign] && (
                      <>
                        <div><span className="text-xs font-semibold text-primary">主軸設定</span><p className="text-sm mt-1">{moonSigns[moonSign].axis}</p></div>
                        <div><span className="text-xs font-semibold text-green-400">優勢</span><p className="text-sm mt-1">{moonSigns[moonSign].strength}</p></div>
                        <div><span className="text-xs font-semibold text-yellow-400">盲點</span><p className="text-sm mt-1">{moonSigns[moonSign].blind}</p></div>
                        <div><span className="text-xs font-semibold text-blue-400">建議</span><p className="text-sm mt-1">{moonSigns[moonSign].advice}</p></div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-primary/10">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    這是體驗版，只用了每個系統最基礎的一個指標。完整版人生羅盤會使用四系統的完整命盤資料（十二宮位、四化、格局、全星盤、九大中心⋯⋯），進行交叉驗證與深度整合。
                  </p>
                  <div className="mt-4 text-center">
                    <Button asChild variant="outline">
                      <Link to="/reports">了解共振版完整報告 →</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Bias Compass Tab */}
              <TabsContent value="bias">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">你的偏勝羅盤 Your Bias Compass</h2>
                  <p className="text-muted-foreground">同樣的六個選項，換一個角度看——四套系統在你身上，有沒有在互相打架？</p>
                </div>

                {/* Three dimensions comparison */}
                <div className="space-y-6">
                  {[
                    {
                      dim: "你怎麼做決定 Decision Making",
                      items: [
                        { sys: "紫微說", text: biasZiWei[ziWei]?.decision },
                        { sys: "八字說", text: biasBaZi[baZi]?.decision },
                        { sys: "占星說（月亮）", text: biasMoonSign[moonSign]?.decision },
                        { sys: "人類圖說", text: hdTypeDecision[hdKey] },
                      ],
                      consistency: decisionConsistency,
                    },
                    {
                      dim: "你的能量模式 Energy Pattern",
                      items: [
                        { sys: "紫微說", text: biasZiWei[ziWei]?.energy },
                        { sys: "八字說", text: biasBaZi[baZi]?.energy },
                        { sys: "占星說（太陽）", text: biasSunSign[sunSign] },
                        { sys: "人類圖說", text: hdTypeEnergy[hdType] },
                      ],
                      consistency: energyConsistency,
                    },
                    {
                      dim: "你的情感需求 Emotional Needs",
                      items: [
                        { sys: "紫微說", text: biasZiWei[ziWei]?.emotion },
                        { sys: "八字說", text: biasBaZi[baZi]?.emotion },
                        { sys: "占星說（月亮）", text: biasMoonSign[moonSign]?.emotion },
                        { sys: "人類圖說", text: hdAuthorityEmotion[hdAuthority] },
                      ],
                      consistency: emotionConsistency,
                    },
                  ].map((row) => (
                    <Card key={row.dim} className="border-primary/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <CardTitle className="text-lg">{row.dim}</CardTitle>
                          <div className={`flex items-center gap-2 text-sm font-semibold ${row.consistency.color}`}>
                            {row.consistency.symbol === "○" && <CheckCircle2 className="w-5 h-5" />}
                            {row.consistency.symbol === "△" && <AlertTriangle className="w-5 h-5" />}
                            {row.consistency.symbol === "✗" && <XCircle className="w-5 h-5" />}
                            <span className="text-2xl">{row.consistency.symbol}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{row.consistency.label}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {row.items.map((item) => (
                            <div key={item.sys} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                              <p className="text-xs font-semibold text-primary mb-1">{item.sys}</p>
                              <p className="text-sm">{item.text || "—"}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-primary/10 space-y-2">
                  <p className="text-sm"><span className="text-green-400 font-bold">○</span> = 四系統看法一致。這個維度你比較不容易有內在衝突。</p>
                  <p className="text-sm"><span className="text-yellow-400 font-bold">△</span> = 有一個系統的聲音不太一樣。那個不同的聲音，可能是你忽略的面向，也可能是你最常壓下去的部分。</p>
                  <p className="text-sm"><span className="text-red-400 font-bold">✗</span> = 四系統各說各話。這個維度在你身上可能最不穩定，不同場合你會切換不同模式——你自己可能都沒注意到。</p>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-primary/10">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    體驗版只比對了三個維度的表面指標。完整版偏勝羅盤會用四系統的完整命盤資料做交叉比對，找出你一直在用的「錯誤版本的自己」——不只是標記哪裡不一致，還會告訴你為什麼不一致、怎麼校正。
                  </p>
                  <div className="mt-4 text-center">
                    <Button asChild variant="outline">
                      <Link to="/reports">了解偏勝版完整報告 →</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* About Trial */}
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-3">關於體驗版 About the Trial</h3>
              <p className="text-sm text-muted-foreground">
                這個工具不使用 AI 生成個人化內容。所有文字都是預寫的查表結果。它的目的不是給你完整解讀，而是讓你體驗「四系統並排」的感覺——看見四套系統各自怎麼描述你，以及它們有沒有在說不一樣的話。
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                如果你覺得有意思，完整版報告會做得更深、更準、更有用。
              </p>
            </div>
          </motion.section>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
