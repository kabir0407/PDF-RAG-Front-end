"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Show,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

// Document Definitions
interface DocumentData {
  id: string;
  name: string;
  category: string;
  totalPages: number;
  fileSize: string;
  uploadDate: string;
  status: "ready" | "indexing";
  ragChunks: number;
  confidence: string;
  pages: {
    [key: number]: {
      title: string;
      section: string;
      bodyParagraphs: string[];
      highlightTag?: string;
      highlightText?: string;
      tableData?: { headers: string[]; rows: string[][] };
      notes?: string;
    };
  };
  samplePrompts: string[];
}

const DOCUMENTS: DocumentData[] = [
  {
    id: "nvidia-10k",
    name: "NVIDIA_SEC_10-K_FY2024.pdf",
    category: "Financial & SEC Filing",
    totalPages: 148,
    fileSize: "14.2 MB",
    uploadDate: "March 15, 2025",
    status: "ready",
    ragChunks: 842,
    confidence: "99.8%",
    samplePrompts: [
      "Break down Data Center revenue growth vs Gaming in FY2024",
      "What are the major geopolitical supply chain risks disclosed?",
      "Summarize gross margin drivers and operating leverage",
      "Extract the full year Consolidated Statement of Operations",
    ],
    pages: {
      14: {
        title: "Item 7. Management's Discussion and Analysis of Financial Condition",
        section: "Results of Operations — Data Center Architecture & Cloud Demand",
        bodyParagraphs: [
          "Fiscal Year 2024 was a transformative year for NVIDIA as accelerated computing reached mainstream adoption across cloud service providers, enterprise software vendors, and consumer internet companies.",
          "Our Data Center revenue surged to $47.5 billion, up 217% from the previous fiscal year, driven primarily by the NVIDIA HGX platform and Hopper GPU architectures including the H100 and H200 Tensor Core GPUs.",
          "Operating margins expanded to 54.1%, compared to 33.8% in fiscal 2023, reflecting unprecedented operational leverage and strong average selling prices for advanced multi-node compute clusters.",
        ],
        highlightTag: "Ref 1: P.14 §7",
        highlightText:
          "Data Center revenue surged to $47.5 billion, up 217% from the previous fiscal year, driven primarily by the NVIDIA HGX platform and Hopper GPU architectures.",
        tableData: {
          headers: ["Segment", "FY 2024 ($M)", "FY 2023 ($M)", "YoY Growth"],
          rows: [
            ["Data Center", "$47,525", "$15,005", "+217%"],
            ["Gaming", "$10,447", "$9,067", "+15%"],
            ["Professional Vis.", "$1,553", "$1,544", "+1%"],
            ["Automotive", "$1,091", "$903", "+21%"],
            ["OEM & Other", "$306", "$455", "-33%"],
          ],
        },
      },
      15: {
        title: "Item 7. MD&A (Continued) — Gross Margin & Cost of Revenue",
        section: "Gross Profit & Supply Chain Commitments",
        bodyParagraphs: [
          "GAAP Gross margin for fiscal year 2024 expanded to 72.7%, up from 56.9% in fiscal year 2023. Non-GAAP gross margin was 73.8%.",
          "The increase in gross margin was primarily driven by higher Data Center platform mix and lower inventory provisioning charges, partially offset by increased packaging complexity for CoWoS substrate fabrication.",
          "Our long-term supply and capacity commitments totaled $18.4 billion as of January 28, 2024, reflecting prepayments to foundry and advanced memory partners for High Bandwidth Memory (HBM3e).",
        ],
        highlightTag: "Ref 2: P.15 §GrossMargin",
        highlightText:
          "GAAP Gross margin for fiscal year 2024 expanded to 72.7%, up from 56.9% in fiscal year 2023, reflecting favorable Data Center mix.",
      },
      16: {
        title: "Item 7A. Quantitative Disclosures About Market & Supply Risk",
        section: "Geopolitical Considerations & Export Regulations",
        bodyParagraphs: [
          "Our operations depend substantially on single-source suppliers located in the Asia-Pacific region, primarily Taiwan for advanced silicon wafer fabrication and assembly.",
          "During the third quarter of fiscal 2024, the U.S. government implemented updated export controls requiring licensing for shipments of our highest-performance chips to specified geographical destinations.",
          "While we introduced localized product variants compliant with regulatory thresholds, shifts in customer demand or subsequent regulatory revisions may materially affect international market share.",
        ],
        highlightTag: "Ref 3: P.16 §Geopolitics",
        highlightText:
          "Our operations depend substantially on single-source suppliers located in the Asia-Pacific region, primarily Taiwan for advanced silicon wafer fabrication.",
      },
    },
  },
  {
    id: "transformer-paper",
    name: "Attention_Is_All_You_Need.pdf",
    category: "AI & arXiv Research",
    totalPages: 15,
    fileSize: "2.4 MB",
    uploadDate: "March 18, 2025",
    status: "ready",
    ragChunks: 198,
    confidence: "99.9%",
    samplePrompts: [
      "Explain the Scaled Dot-Product formula and why scaling is necessary",
      "How does Multi-Head Attention compare to single-head attention?",
      "What were the BLEU score results on WMT 2014 English-to-German?",
      "Summarize the computational complexity per layer comparison in Table 1",
    ],
    pages: {
      4: {
        title: "Section 3.2 • Multi-Head Attention & Scaled Dot-Product",
        section: "Mathematical Formulation of Self-Attention Mechanism",
        bodyParagraphs: [
          "An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors.",
          "We compute the attention function simultaneously on a set of queries packed together into a matrix Q. The keys and values are also packed into matrices K and V.",
          "Instead of performing a single attention function with d_model-dimensional keys, values and queries, we linearly project the queries, keys and values h times with different learned projections to d_k, d_k and d_v dimensions.",
        ],
        highlightTag: "Ref: P.4 §3.2 Eq.2",
        highlightText:
          "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V. We divide by sqrt(d_k) to prevent dot products from growing excessively large for large dimensions.",
        tableData: {
          headers: ["Layer Type", "Complexity / Layer", "Sequential Ops", "Max Path Length"],
          rows: [
            ["Self-Attention", "O(n² · d)", "O(1)", "O(1)"],
            ["Recurrent (RNN)", "O(n · d²)", "O(n)", "O(n)"],
            ["Convolutional", "O(k · n · d²)", "O(1)", "O(log_k(n))"],
            ["Self-Attn (Restricted)", "O(r · n · d)", "O(1)", "O(n/r)"],
          ],
        },
      },
      8: {
        title: "Section 5.1 • Training & Benchmark Evaluation",
        section: "WMT 2014 Machine Translation Results",
        bodyParagraphs: [
          "On the WMT 2014 English-to-German translation task, the big transformer model outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU.",
          "The model achieved a state-of-the-art BLEU score of 28.4 on En-De, and 41.8 on English-to-French.",
          "Training took 3.5 days on 8 P100 GPUs, requiring a fraction of the computational training FLOPs compared to antecedent recurrent or convolutional models.",
        ],
        highlightTag: "Ref: P.8 §5.1 Table 2",
        highlightText:
          "The Transformer (big) achieved 28.4 BLEU with training cost of 3.5 days on 8 P100 GPUs, establishing new SOTA benchmarks.",
      },
    },
  },
  {
    id: "legal-agreement",
    name: "Enterprise_SaaS_Master_Agreement_v4.pdf",
    category: "Legal & Corporate Contract",
    totalPages: 32,
    fileSize: "1.9 MB",
    uploadDate: "March 20, 2025",
    status: "ready",
    ragChunks: 245,
    confidence: "99.7%",
    samplePrompts: [
      "What is the limitation of liability cap and are there carve-outs?",
      "Summarize data protection and GDPR compliance obligations",
      "What happens upon early termination for convenience?",
      "Verify indemnification obligations for third-party IP claims",
    ],
    pages: {
      8: {
        title: "Section 10 • Limitation of Liability & Consequential Damages",
        section: "Commercial Risk Allocation & Direct Loss Caps",
        bodyParagraphs: [
          "Except for breaches of Section 8 (Confidentiality) or indemnification obligations under Section 11, neither party shall be liable for indirect, incidental, or consequential damages.",
          "Each party's maximum aggregate cumulative liability arising out of or related to this Agreement shall be strictly capped at the total fees actually paid or payable by Customer in the twelve (12) months preceding the incident.",
          "The limitations in this Section 10 apply regardless of whether an action is in contract, tort, strict liability, or under any other legal or equitable theory.",
        ],
        highlightTag: "Ref: P.8 §10.2 Liability Cap",
        highlightText:
          "Each party's maximum aggregate cumulative liability shall be strictly capped at the total fees actually paid in the twelve (12) months preceding the claim.",
      },
    },
  },
];

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  citationPills?: {
    tag: string;
    page: number;
    textExcerpt: string;
  }[];
  thoughtProcess?: string;
  table?: { headers: string[]; rows: string[][] };
}

export default function PDFDiscussPage() {
  const { user } = useUser();

  // Document State
  const [selectedDocId, setSelectedDocId] = useState<string>("nvidia-10k");
  const [activePage, setActivePage] = useState<number>(14);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeHighlight, setActiveHighlight] = useState<string | null>("Ref 1: P.14 §7");
  const [activeCitationJump, setActiveCitationJump] = useState<string | null>(null);

  // Layout & View Mode: 'split' | 'viewer-focus' | 'chat-focus'
  const [viewMode, setViewMode] = useState<"split" | "viewer-focus" | "chat-focus">("split");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [sidebarTab, setSidebarTab] = useState<"thumbnails" | "outline" | "metadata">("thumbnails");

  // Document In-Page Search
  const [docSearchQuery, setDocSearchQuery] = useState<string>("");
  const [docSearchMatchCount, setDocSearchMatchCount] = useState<number>(0);

  // Model Selection
  const [selectedModel, setSelectedModel] = useState<string>("Gemini 2.5 Flash");
  const [modelDropdownOpen, setModelDropdownOpen] = useState<boolean>(false);

  // Audio Waveform Toggle
  const [audioModeActive, setAudioModeActive] = useState<boolean>(false);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Chat Input & Messages
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentDoc = DOCUMENTS.find((d) => d.id === selectedDocId) || DOCUMENTS[0];

  // Conversation history initial state for active doc
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "user",
      text: "How much did Data Center revenue grow in FY2024, and what were the primary architectural drivers according to the 10-K?",
      timestamp: "10:24 AM",
    },
    {
      id: "msg-2",
      sender: "ai",
      text: "According to **Item 7 (Page 14)** of NVIDIA's FY2024 10-K filing:\n\n1. **Data Center Revenue**: Reached **$47.525 billion**, which is an increase of **+217% year-over-year** (up from $15.005 billion in FY2023).\n2. **Architectural Drivers**: Growth was spearheaded by the **NVIDIA HGX platform** leveraging **Hopper GPU architectures** (specifically H100 and H200 Tensor Core GPUs).\n3. **Operating Margin Expansion**: Operating margins surged to **54.1%** (from 33.8% in FY2023), driven by massive operational leverage.",
      timestamp: "10:24 AM",
      thoughtProcess:
        "Retrieved 3 chunks from Section 7 (Management Discussion) with cosine similarity 0.942. Verified numbers against Table on Page 14.",
      citationPills: [
        {
          tag: "Ref 1: P.14 §7",
          page: 14,
          textExcerpt:
            "Data Center revenue surged to $47.5 billion, up 217% from the previous fiscal year, driven primarily by the NVIDIA HGX platform and Hopper GPU architectures.",
        },
        {
          tag: "Ref 2: P.15 §GrossMargin",
          page: 15,
          textExcerpt: "Gross margin expanded to 72.7%, up from 56.9% in fiscal 2023.",
        },
      ],
      table: {
        headers: ["Segment", "FY2024", "FY2023", "YoY Change"],
        rows: [
          ["Data Center", "$47,525 M", "$15,005 M", "+217%"],
          ["Gaming", "$10,447 M", "$9,067 M", "+15%"],
          ["Operating Margin", "54.1%", "33.8%", "+2,030 bps"],
        ],
      },
    },
  ]);

  // Scroll to bottom on message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiThinking]);

  // Citation click handler -> jump to page & highlight
  const handleCitationClick = (page: number, tag: string) => {
    setActivePage(page);
    setActiveHighlight(tag);
    setActiveCitationJump(tag);
    setTimeout(() => setActiveCitationJump(null), 2500);
  };

  // Switch document
  const handleSelectDoc = (docId: string) => {
    setSelectedDocId(docId);
    const doc = DOCUMENTS.find((d) => d.id === docId);
    if (doc) {
      const firstPage = Number(Object.keys(doc.pages)[0]) || 1;
      setActivePage(firstPage);
      setActiveHighlight(doc.pages[firstPage]?.highlightTag || null);
    }
  };

  // Submit question in chat
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim() || isAiThinking) return;

    const userText = inputQuestion.trim();
    setInputQuestion("");

    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setIsAiThinking(true);

    // Realistic grounded UI response simulation
    setTimeout(() => {
      let aiResponseText = "";
      let thought = `Retrieved relevant vector embeddings from ${currentDoc.name} across indexed pages. Strict zero-hallucination filter applied.`;
      let citations: { tag: string; page: number; textExcerpt: string }[] = [];

      if (userText.toLowerCase().includes("margin") || userText.toLowerCase().includes("gross")) {
        aiResponseText = `Based on **Page 15 (§ Gross Margin)**:\n- **GAAP Gross Margin**: Reached **72.7%** (up from 56.9% in the prior year).\n- **Primary Drivers**: Favorable product mix toward higher-margin accelerated computing compute clusters and diminished inventory write-downs.\n- **Purchase Commitments**: NVIDIA maintained **$18.4 billion** in long-term capacity prepayments for High Bandwidth Memory (HBM3e).`;
        citations = [
          {
            tag: "Ref 2: P.15 §GrossMargin",
            page: 15,
            textExcerpt: "GAAP Gross margin for fiscal year 2024 expanded to 72.7%, up from 56.9%.",
          },
        ];
      } else if (
        userText.toLowerCase().includes("risk") ||
        userText.toLowerCase().includes("supply") ||
        userText.toLowerCase().includes("geopolitic")
      ) {
        aiResponseText = `Referencing **Page 16 (Item 7A: Market Risk & Supply)**:\n- **Single-Source Dependency**: Relies on key foundry partners in Taiwan for sub-5nm wafer fabrication and CoWoS advanced substrate packaging.\n- **Export Controls**: New licensing constraints implemented in Q3 FY2024 limit shipments of sovereign AI accelerators without prior approval.\n- **Mitigations**: Developed localized compliant variants, though regional revenue volatility remains subject to trade policy shifts.`;
        citations = [
          {
            tag: "Ref 3: P.16 §Geopolitics",
            page: 16,
            textExcerpt:
              "Our operations depend substantially on single-source suppliers located in the Asia-Pacific region.",
          },
        ];
      } else {
        aiResponseText = `Analysis of **${currentDoc.name}** for your query:\n\n* **Grounded Summary**: Extracted from Page ${activePage} with 99.8% semantic relevance.\n* **Key Finding**: The data confirms steady operational growth with strict audit trail validation.\n* **Citation Anchor**: Verified against paragraph 2 of Section ${currentDoc.pages[activePage]?.section || "Core Operations"}.`;
        citations = [
          {
            tag: currentDoc.pages[activePage]?.highlightTag || `Ref: P.${activePage}`,
            page: activePage,
            textExcerpt:
              currentDoc.pages[activePage]?.highlightText ||
              currentDoc.pages[activePage]?.bodyParagraphs[0] ||
              "Document passage verified.",
          },
        ];
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          thoughtProcess: thought,
          citationPills: citations,
        },
      ]);
      setIsAiThinking(false);
    }, 1200);
  };

  const currentPageData = currentDoc.pages[activePage] || {
    title: `Page ${activePage} • Document Overview`,
    section: "Section Content & Structured Extraction",
    bodyParagraphs: [
      `This is page ${activePage} of ${currentDoc.name}. Full text indexing and vector embeddings are stored in ChromaDB vector space.`,
      "You can ask any question in the right-hand discussion panel to search, analyze, cross-reference formulas, or generate executive summaries.",
    ],
  };

  return (
    <>
      {/* 1. SIGNED-OUT ACCESS GATE (Security Fallback UI) */}
      <Show when="signed-out">
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden font-body text-slate-100">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-md w-full glass-panel-elevated rounded-3xl p-8 border border-slate-800 text-center relative z-10 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 mx-auto flex items-center justify-center shadow-lg mb-6">
              <span className="material-symbols-outlined text-white text-3xl">lock</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-xs font-label-code mb-4">
              <span>PROTECTED WORKSPACE</span>
            </div>

            <h1 className="font-headline-sm text-2xl font-bold text-white mb-2">
              Authentication Required
            </h1>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              The <span className="text-cyan-400 font-medium">/pdf-discuss</span> interactive
              workspace is accessible only to authenticated users. Sign in to view and discuss your
              private documents.
            </p>

            <div className="space-y-3">
              <SignInButton mode="modal">
                <button className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer">
                  Sign In to Continue
                </button>
              </SignInButton>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-sm font-medium transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </Show>

      {/* 2. SIGNED-IN AUTHENTICATED WORKSPACE */}
      <Show when="signed-in">
        <div className="min-h-screen h-screen flex flex-col bg-[#090d16] text-slate-100 overflow-hidden font-body selection:bg-indigo-600 selection:text-white">
          {/* TOP APP HEADER */}
          <header className="h-16 flex-shrink-0 bg-[#0c101a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-30">
            {/* Left Brand & Document Selector */}
            <div className="flex items-center gap-4">
              {/* Back to Home Link */}
              <Link
                href="/"
                className="group flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors"
                title="Return to Landing Page"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-white text-[18px]">neurology</span>
                </div>
                <span className="hidden sm:inline font-headline-sm font-bold text-sm tracking-tight text-slate-200">
                  PDF Conversation
                </span>
              </Link>

              <span className="text-slate-700 hidden sm:inline">/</span>

              {/* Document Dropdown Pill */}
              <div className="relative group">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-indigo-400 text-[18px]">
                    description
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-100 max-w-[160px] sm:max-w-[220px] truncate">
                      {currentDoc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-label-code">
                      {currentDoc.totalPages} Pages • {currentDoc.fileSize}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[16px] group-hover:translate-y-0.5 transition-transform">
                    expand_more
                  </span>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-1 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in-50">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-label-code border-b border-slate-800 mb-1">
                    Select Active Document
                  </div>
                  {DOCUMENTS.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc.id)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                        doc.id === selectedDocId
                          ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/30"
                          : "hover:bg-slate-800/80 text-slate-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-indigo-400 text-[20px]">
                        article
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{doc.name}</div>
                        <div className="text-[10px] text-slate-400 font-label-code">
                          {doc.category} • {doc.totalPages} pages
                        </div>
                      </div>
                      {doc.id === selectedDocId && (
                        <span className="material-symbols-outlined text-cyan-400 text-[18px]">
                          check_circle
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setUploadModalOpen(true)}
                      className="w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      <span>Upload Another Document</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-label-code text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>RAG Synced</span>
              </div>
            </div>

            {/* Center View Mode Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode("split")}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "split"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Split View: Document & Discussion"
              >
                <span className="material-symbols-outlined text-[16px]">vertical_split</span>
                <span>Split View</span>
              </button>
              <button
                onClick={() => setViewMode("viewer-focus")}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "viewer-focus"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Document Focus View"
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Document Focus</span>
              </button>
              <button
                onClick={() => setViewMode("chat-focus")}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "chat-focus"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Discussion Focus View"
              >
                <span className="material-symbols-outlined text-[16px]">forum</span>
                <span>Discuss Focus</span>
              </button>
            </div>

            {/* Right Action Icons & User Profile */}
            <div className="flex items-center gap-2.5">
              {/* Model Picker Pill */}
              <div className="relative hidden xl:block">
                <button
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-cyan-400 text-[16px]">
                    auto_awesome
                  </span>
                  <span>{selectedModel}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">
                    arrow_drop_down
                  </span>
                </button>

                {modelDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
                    {["Gemini 2.5 Flash", "Claude 3.5 Sonnet", "GPT-4o Omnimodal"].map((model) => (
                      <button
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                          selectedModel === model
                            ? "bg-indigo-600/20 text-indigo-300"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span>{model}</span>
                        {selectedModel === model && (
                          <span className="material-symbols-outlined text-[14px] text-cyan-400">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload PDF Button */}
              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span className="hidden sm:inline">Upload PDF</span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => setShareModalOpen(true)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title="Share Workspace Session"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>

              {/* Export Briefing Button */}
              <button
                onClick={() => setExportModalOpen(true)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title="Export Briefing & Notes"
              >
                <span className="material-symbols-outlined text-[18px]">ios_share</span>
              </button>

              {/* User Avatar via Clerk */}
              <div className="ml-1 pl-2 border-l border-slate-800 flex items-center">
                <UserButton />
              </div>
            </div>
          </header>

          {/* MAIN WORKSPACE BODY */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* 1. LEFT SIDEBAR (Thumbnails, Outline, Document Metadata) */}
            {viewMode !== "chat-focus" && (
              <aside
                className={`bg-[#0c101a] border-r border-slate-800 flex flex-col transition-all duration-300 z-20 ${
                  sidebarOpen ? "w-64" : "w-12"
                }`}
              >
                {/* Sidebar Header & Toggle */}
                <div className="h-12 border-b border-slate-800 px-3 flex items-center justify-between">
                  {sidebarOpen ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSidebarTab("thumbnails")}
                        className={`text-xs font-medium px-2 py-1 rounded-md transition-colors cursor-pointer ${
                          sidebarTab === "thumbnails"
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Pages
                      </button>
                      <button
                        onClick={() => setSidebarTab("outline")}
                        className={`text-xs font-medium px-2 py-1 rounded-md transition-colors cursor-pointer ${
                          sidebarTab === "outline"
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Outline
                      </button>
                      <button
                        onClick={() => setSidebarTab("metadata")}
                        className={`text-xs font-medium px-2 py-1 rounded-md transition-colors cursor-pointer ${
                          sidebarTab === "metadata"
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Stats
                      </button>
                    </div>
                  ) : null}

                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto cursor-pointer"
                    title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {sidebarOpen ? "keyboard_double_arrow_left" : "keyboard_double_arrow_right"}
                    </span>
                  </button>
                </div>

                {/* Sidebar Content */}
                {sidebarOpen && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {/* THUMBNAILS TAB */}
                    {sidebarTab === "thumbnails" && (
                      <div className="grid grid-cols-2 gap-2.5">
                        {Array.from({ length: Math.min(currentDoc.totalPages, 16) }, (_, i) => {
                          const pageNum = i + 1;
                          const isCurrent = pageNum === activePage;
                          const hasCitation = currentDoc.pages[pageNum]?.highlightTag;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => {
                                setActivePage(pageNum);
                                if (currentDoc.pages[pageNum]?.highlightTag) {
                                  setActiveHighlight(currentDoc.pages[pageNum].highlightTag!);
                                }
                              }}
                              className={`p-2 rounded-xl flex flex-col items-center justify-between h-28 border text-left transition-all cursor-pointer relative overflow-hidden group ${
                                isCurrent
                                  ? "bg-indigo-950/40 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40"
                              }`}
                            >
                              {/* Mini Page Simulation Lines */}
                              <div className="w-full space-y-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                <div className="h-1 bg-slate-600 rounded-full w-3/4"></div>
                                <div className="h-1 bg-slate-700 rounded-full w-full"></div>
                                <div className="h-1 bg-slate-700 rounded-full w-5/6"></div>
                                {hasCitation && (
                                  <div className="h-1 bg-amber-400/80 rounded-full w-full"></div>
                                )}
                                <div className="h-1 bg-slate-700 rounded-full w-4/6"></div>
                              </div>

                              {/* Footer tag */}
                              <div className="w-full flex items-center justify-between text-[10px] font-label-code text-slate-400 mt-2">
                                <span>P. {pageNum}</span>
                                {hasCitation && (
                                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* OUTLINE TAB */}
                    {sidebarTab === "outline" && (
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-label-code px-2 py-1">
                          Table of Contents
                        </div>
                        {[
                          { title: "Item 1. Business Overview", page: 4 },
                          { title: "Item 1A. Risk Factors", page: 8 },
                          { title: "Item 7. Management Discussion (MD&A)", page: 14 },
                          { title: "— Data Center & Cloud Architecture", page: 14 },
                          { title: "— Gross Margin & Capacity Commitments", page: 15 },
                          { title: "Item 7A. Geopolitical Market Risk", page: 16 },
                          { title: "Item 8. Consolidated Financial Statements", page: 24 },
                          { title: "Note 17. Segment Reporting & Disclosures", page: 42 },
                        ].map((section, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActivePage(section.page);
                              if (currentDoc.pages[section.page]?.highlightTag) {
                                setActiveHighlight(currentDoc.pages[section.page].highlightTag!);
                              }
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              activePage === section.page
                                ? "bg-indigo-600/20 text-indigo-300 font-medium"
                                : "text-slate-300 hover:bg-slate-800/80"
                            }`}
                          >
                            <span className="truncate pr-2">{section.title}</span>
                            <span className="text-[10px] font-label-code text-slate-500 flex-shrink-0">
                              p.{section.page}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* METADATA TAB */}
                    {sidebarTab === "metadata" && (
                      <div className="space-y-3 p-1">
                        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2">
                          <div className="text-xs font-semibold text-slate-200">
                            Document Metadata
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Total Pages</span>
                            <span className="font-label-code text-slate-200">
                              {currentDoc.totalPages}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>File Size</span>
                            <span className="font-label-code text-slate-200">
                              {currentDoc.fileSize}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Vector Chunks</span>
                            <span className="font-label-code text-cyan-400">
                              {currentDoc.ragChunks}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Index Confidence</span>
                            <span className="font-label-code text-emerald-400">
                              {currentDoc.confidence}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Indexed With</span>
                            <span className="font-label-code text-purple-300">
                              ChromaDB • Cohere
                            </span>
                          </div>
                        </div>

                        <div className="bg-indigo-950/30 border border-indigo-800/30 p-3 rounded-xl">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>Audit &amp; Security</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Zero-retention mode active. Embeddings are cached in encrypted tenant
                            namespace with strict SOC2 Type II compliance.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </aside>
            )}

            {/* 2. CENTER PANEL: HIGH-FIDELITY PDF VIEWER */}
            {viewMode !== "chat-focus" && (
              <main className="flex-1 flex flex-col bg-[#080b12] border-r border-slate-800 relative overflow-hidden">
                {/* Document Viewer Sticky Toolbar */}
                <div className="h-12 bg-[#0c101a] border-b border-slate-800 px-4 flex items-center justify-between flex-shrink-0 z-10">
                  {/* Page Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                      disabled={activePage <= 1}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Previous Page"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs font-label-code text-slate-300">
                      <span>Page</span>
                      <input
                        type="number"
                        value={activePage}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1 && val <= currentDoc.totalPages) {
                            setActivePage(val);
                          }
                        }}
                        className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-xs text-cyan-300 focus:outline-none focus:border-indigo-500"
                      />
                      <span>of {currentDoc.totalPages}</span>
                    </div>

                    <button
                      onClick={() => setActivePage((p) => Math.min(currentDoc.totalPages, p + 1))}
                      disabled={activePage >= currentDoc.totalPages}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Next Page"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>

                  {/* Document Search In-Page */}
                  <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
                    <span className="material-symbols-outlined text-slate-400 text-[16px]">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Find in page text..."
                      value={docSearchQuery}
                      onChange={(e) => {
                        setDocSearchQuery(e.target.value);
                        setDocSearchMatchCount(e.target.value.trim() ? 3 : 0);
                      }}
                      className="bg-transparent border-none text-xs text-slate-200 focus:outline-none w-32 xl:w-44 placeholder:text-slate-500"
                    />
                    {docSearchMatchCount > 0 && (
                      <span className="text-[10px] font-label-code text-cyan-400">
                        {docSearchMatchCount} matches
                      </span>
                    )}
                  </div>

                  {/* Zoom & View Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <span className="material-symbols-outlined text-[18px]">zoom_out</span>
                    </button>
                    <span className="text-xs font-label-code text-slate-400 min-w-[36px] text-center">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                    </button>
                    <button
                      onClick={() => setZoomLevel(100)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-label-code transition-colors cursor-pointer"
                      title="Reset Zoom"
                    >
                      <span className="material-symbols-outlined text-[18px]">fit_screen</span>
                    </button>
                  </div>
                </div>

                {/* Document Paper Canvas Area */}
                <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-[#070a12]/90">
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                    className={`w-full max-w-3xl bg-[#0e121d] border border-slate-800/90 rounded-2xl shadow-2xl p-8 sm:p-12 text-slate-200 relative transition-transform duration-150 ${
                      activeCitationJump ? "ring-2 ring-indigo-500 animate-pulse" : ""
                    }`}
                  >
                    {/* Document Header & Confidentiality Watermark */}
                    <div className="border-b border-slate-800/80 pb-4 mb-6 flex items-center justify-between text-xs text-slate-500 font-label-code">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-400 text-[16px]">
                          picture_as_pdf
                        </span>
                        <span>{currentDoc.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-semibold">FORM 10-K</span>
                        <span>•</span>
                        <span>Page {activePage}</span>
                      </div>
                    </div>

                    {/* Section Titles */}
                    <div className="mb-6">
                      <h2 className="font-headline-sm text-lg font-bold text-slate-100 tracking-tight mb-1">
                        {currentPageData.title}
                      </h2>
                      <div className="text-xs font-label-code text-indigo-400">
                        {currentPageData.section}
                      </div>
                    </div>

                    {/* Body Paragraphs */}
                    <div className="space-y-4 text-sm leading-relaxed text-slate-300 font-body">
                      {currentPageData.bodyParagraphs.map((paragraph, idx) => {
                        const isHighlighted =
                          currentPageData.highlightText &&
                          paragraph.includes(currentPageData.highlightText.slice(0, 30));

                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl transition-all relative ${
                              isHighlighted
                                ? "bg-indigo-950/40 border-l-4 border-indigo-400 pl-4 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                                : "hover:bg-slate-900/40"
                            }`}
                          >
                            {isHighlighted && currentPageData.highlightTag && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600/40 border border-indigo-500/50 text-[10px] font-label-code text-indigo-200 mb-2">
                                <span className="material-symbols-outlined text-[12px]">bookmark</span>
                                <span>{currentPageData.highlightTag}</span>
                              </div>
                            )}
                            <p>{paragraph}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Render Structured Table if present on page */}
                    {currentPageData.tableData && (
                      <div className="mt-8 border border-slate-800 rounded-xl overflow-hidden shadow-lg bg-slate-900/50">
                        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200">
                            Financial Table Breakdown
                          </span>
                          <span className="text-[10px] font-label-code text-cyan-400">
                            Extracted via OCR &amp; Vision
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-label-code">
                              <tr>
                                {currentPageData.tableData.headers.map((h, i) => (
                                  <th key={i} className="p-3">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-body">
                              {currentPageData.tableData.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-indigo-950/20 transition-colors">
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`p-3 ${
                                        cIdx === 0
                                          ? "font-medium text-slate-100"
                                          : "font-label-code text-slate-300"
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Page Footer Guideline */}
                    <div className="mt-12 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-label-code">
                      <span>NVIDIA CORPORATION • ANNUAL REPORT 2024</span>
                      <span>SEC FILE NO. 000-23985</span>
                    </div>
                  </div>
                </div>
              </main>
            )}

            {/* 3. RIGHT PANEL: PDF DISCUSS & AI CHAT ASSISTANT */}
            {viewMode !== "viewer-focus" && (
              <section
                className={`flex flex-col bg-[#0b0f19] transition-all duration-300 z-10 ${
                  viewMode === "chat-focus" ? "flex-1" : "w-full md:w-[480px] lg:w-[540px] xl:w-[600px]"
                }`}
              >
                {/* Chat Panel Header */}
                <div className="h-12 bg-[#0c101a] border-b border-slate-800 px-4 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="font-headline-sm text-xs font-bold text-slate-100">
                      PDF Discuss Engine
                    </span>
                    <span className="text-[10px] font-label-code px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-700/40 text-indigo-300">
                      Zero Hallucination
                    </span>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* Audio Discuss Toggle */}
                    <button
                      onClick={() => setAudioModeActive(!audioModeActive)}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                        audioModeActive
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                      title="Toggle Voice Discussion Mode"
                    >
                      <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                      <span className="hidden sm:inline text-[11px]">Audio</span>
                    </button>

                    {/* Clear Conversation */}
                    <button
                      onClick={() =>
                        setChatMessages([
                          {
                            id: `welcome-${Date.now()}`,
                            sender: "ai",
                            text: `Discussion cleared for **${currentDoc.name}**. What would you like to explore or verify next?`,
                            timestamp: new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                          },
                        ])
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Clear Discussion History"
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    </button>
                  </div>
                </div>

                {/* Animated Voice Waveform Banner if active */}
                {audioModeActive && (
                  <div className="bg-gradient-to-r from-indigo-950/70 via-cyan-950/60 to-purple-950/70 border-b border-cyan-800/40 px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in">
                    <div className="flex items-center gap-2 text-cyan-300 font-label-code">
                      <span className="material-symbols-outlined text-[16px] animate-pulse">
                        mic
                      </span>
                      <span>Listening for document inquiries...</span>
                    </div>
                    {/* Sound Waves */}
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
                      <span className="w-1 h-5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                      <span className="w-1 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1 h-6 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                      <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    </div>
                  </div>
                )}

                {/* Starter Prompt Chips */}
                <div className="px-4 py-2.5 bg-[#090d16]/80 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2 no-scrollbar">
                  <span className="text-[10px] font-label-code text-slate-500 uppercase tracking-wider flex-shrink-0">
                    Suggested:
                  </span>
                  {currentDoc.samplePrompts.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        setInputQuestion(prompt);
                      }}
                      className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Conversation Message Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      } space-y-1.5`}
                    >
                      {/* Sender label & Timestamp */}
                      <div className="flex items-center gap-2 text-[11px] font-label-code text-slate-400 px-1">
                        <span className="font-semibold text-slate-300">
                          {msg.sender === "user"
                            ? user?.firstName || "You"
                            : "PDF Intelligence Assistant"}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[92%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md"
                            : "glass-panel-elevated border border-slate-800 text-slate-200 rounded-tl-sm shadow-xl"
                        }`}
                      >
                        {/* Thought process badge for AI */}
                        {msg.thoughtProcess && (
                          <div className="mb-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-label-code flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-indigo-400 text-[14px] mt-0.5">
                              psychology
                            </span>
                            <span>{msg.thoughtProcess}</span>
                          </div>
                        )}

                        {/* Message content */}
                        <div className="whitespace-pre-line space-y-2">{msg.text}</div>

                        {/* Structured mini-table if returned */}
                        {msg.table && (
                          <div className="mt-3 border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60">
                            <table className="w-full text-left text-[11px]">
                              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-label-code">
                                <tr>
                                  {msg.table.headers.map((h, i) => (
                                    <th key={i} className="p-2">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60">
                                {msg.table.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-800/40">
                                    {row.map((c, cIdx) => (
                                      <td
                                        key={cIdx}
                                        className={`p-2 ${
                                          cIdx === 0
                                            ? "font-medium text-slate-200"
                                            : "font-label-code text-slate-300"
                                        }`}
                                      >
                                        {c}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Interactive Citation Pills */}
                        {msg.citationPills && msg.citationPills.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] font-label-code text-slate-500 uppercase tracking-wider">
                              Verified Citations:
                            </span>
                            {msg.citationPills.map((cit, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => handleCitationClick(cit.page, cit.tag)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/60 hover:border-indigo-400 text-indigo-300 hover:text-white text-[11px] font-label-code transition-all cursor-pointer shadow-sm group"
                                title={`Click to view on Page ${cit.page}: "${cit.textExcerpt.slice(
                                  0,
                                  50
                                )}..."`}
                              >
                                <span className="material-symbols-outlined text-[13px] text-cyan-400 group-hover:scale-110 transition-transform">
                                  find_in_page
                                </span>
                                <span>{cit.tag}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* AI Response Utility Actions */}
                      {msg.sender === "ai" && (
                        <div className="flex items-center gap-2 px-1 text-slate-500 text-[11px]">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.text);
                            }}
                            className="hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy response"
                          >
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                            <span>Copy</span>
                          </button>
                          <span>•</span>
                          <button
                            className="hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Regenerate with higher reasoning depth"
                          >
                            <span className="material-symbols-outlined text-[14px]">autorenew</span>
                            <span>Regenerate</span>
                          </button>
                          <span>•</span>
                          <button
                            className="hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Helpful citation"
                          >
                            <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                          </button>
                          <button
                            className="hover:text-rose-400 transition-colors cursor-pointer"
                            title="Report discrepancy"
                          >
                            <span className="material-symbols-outlined text-[14px]">thumb_down</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Thinking status indicator */}
                  {isAiThinking && (
                    <div className="flex flex-col items-start space-y-1.5 animate-in fade-in">
                      <div className="flex items-center gap-2 text-[11px] font-label-code text-slate-400 px-1">
                        <span className="font-semibold text-slate-300">PDF Intelligence Engine</span>
                        <span>•</span>
                        <span>Analyzing document...</span>
                      </div>
                      <div className="glass-panel rounded-2xl p-4 text-xs text-slate-300 flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-label-code text-cyan-400">
                          Retrieving grounded chunks from ChromaDB vector index...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Bar */}
                <div className="p-4 bg-[#0c101a] border-t border-slate-800">
                  <form onSubmit={handleSendMessage} className="relative flex flex-col space-y-2">
                    <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all p-2.5">
                      <textarea
                        value={inputQuestion}
                        onChange={(e) => setInputQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={2}
                        placeholder={`Ask anything about ${currentDoc.name}, type '/' for commands or '@page' to cite...`}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 resize-none focus:outline-none"
                      />

                      {/* Input Footer Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        {/* Prompt Helpers */}
                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            type="button"
                            onClick={() => setInputQuestion((q) => q + ` @Page ${activePage} `)}
                            className="px-2 py-1 rounded-md hover:bg-slate-800 text-[11px] font-label-code flex items-center gap-1 transition-colors cursor-pointer"
                            title={`Cite active page ${activePage}`}
                          >
                            <span className="material-symbols-outlined text-[13px] text-indigo-400">
                              alternate_email
                            </span>
                            <span>Page {activePage}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setInputQuestion("Summarize key findings and risk disclosures:")
                            }
                            className="px-2 py-1 rounded-md hover:bg-slate-800 text-[11px] font-label-code flex items-center gap-1 transition-colors cursor-pointer"
                            title="Insert Summary Prompt"
                          >
                            <span className="material-symbols-outlined text-[13px] text-cyan-400">
                              summarize
                            </span>
                            <span>Summary</span>
                          </button>
                        </div>

                        {/* Send Action */}
                        <button
                          type="submit"
                          disabled={!inputQuestion.trim() || isAiThinking}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <span>Send</span>
                          <span className="material-symbols-outlined text-[15px]">send</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[10px] text-slate-500 font-label-code">
                      <span>Press Enter to send, Shift+Enter for new line</span>
                      <span className="text-emerald-400">● 100% Deterministic Grounding</span>
                    </div>
                  </form>
                </div>
              </section>
            )}
          </div>

          {/* 3. UPLOAD PDF MODAL */}
          {uploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="max-w-lg w-full bg-[#0e121d] border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                      <span className="material-symbols-outlined text-[20px]">upload_file</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-base font-bold text-slate-100">
                        Upload Document to RAG Index
                      </h3>
                      <p className="text-xs text-slate-400">
                        Extract vectors, tables, and structured citations
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Drag and Drop Box */}
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center bg-slate-900/40 hover:bg-slate-900/80 transition-all cursor-pointer mb-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-700/50 mx-auto flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mb-3">
                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200 mb-1">
                    Drag and drop your PDF here, or{" "}
                    <span className="text-indigo-400 underline underline-offset-2">browse files</span>
                  </div>
                  <p className="text-xs text-slate-500 font-label-code">
                    Supports PDF, DOCX, PPTX up to 100 MB per file
                  </p>
                </div>

                {/* Parsing Configuration Options */}
                <div className="space-y-2 mb-6">
                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>High-Precision OCR &amp; Mathematical Equation Parsing</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Extract Structured Tabular Data &amp; Financial Statements</span>
                  </label>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setUploadModalOpen(false);
                      handleSelectDoc("nvidia-10k");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
                  >
                    Process &amp; Index Document
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. SHARE MODAL */}
          {shareModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="max-w-md w-full bg-[#0e121d] border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <h3 className="font-headline-sm text-base font-bold text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-400 text-[18px]">
                      share
                    </span>
                    <span>Share Discussion Session</span>
                  </h3>
                  <button
                    onClick={() => setShareModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  Invite collaborators to discuss{" "}
                  <span className="text-slate-200 font-medium">{currentDoc.name}</span> with all
                  current annotations and verified citations intact.
                </p>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 mb-6">
                  <input
                    type="text"
                    readOnly
                    value={`https://pdf-explain-rag.app/pdf-discuss?doc=${currentDoc.id}`}
                    className="bg-transparent text-xs text-slate-300 w-full focus:outline-none font-label-code"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://pdf-explain-rag.app/pdf-discuss?doc=${currentDoc.id}`
                      );
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer flex-shrink-0"
                  >
                    {copiedLink ? "Copied!" : "Copy Link"}
                  </button>
                </div>

                <button
                  onClick={() => setShareModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* 5. EXPORT MODAL */}
          {exportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="max-w-md w-full bg-[#0e121d] border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <h3 className="font-headline-sm text-base font-bold text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-[18px]">
                      download
                    </span>
                    <span>Export Briefing &amp; Citations</span>
                  </h3>
                  <button
                    onClick={() => setExportModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-5">
                  Select your preferred export format for the current conversation and citation
                  references:
                </p>

                <div className="space-y-2.5 mb-6">
                  {[
                    { title: "Executive Markdown Briefing (.md)", icon: "code", badge: "Ready" },
                    { title: "Complete PDF Summary Report (.pdf)", icon: "picture_as_pdf", badge: "A4 Format" },
                    { title: "JSON Vector Citations & Entities (.json)", icon: "data_object", badge: "Raw Data" },
                  ].map((fmt, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => setExportModalOpen(false)}
                      className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-indigo-400 text-[18px]">
                          {fmt.icon}
                        </span>
                        <span className="font-medium text-slate-200">{fmt.title}</span>
                      </div>
                      <span className="text-[10px] font-label-code text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                        {fmt.badge}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setExportModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </Show>
    </>
  );
}
