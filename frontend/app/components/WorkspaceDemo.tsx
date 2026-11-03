"use client";

import { useState, useMemo } from "react";

interface Citation {
  label: string;
  page: number;
  section: string;
  excerpt: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  name: string;
  text: string;
  citations?: Citation[];
  chart?: boolean;
  timestamp: string;
}

export default function WorkspaceDemo({
  activeDoc = "NVIDIA_SEC_10-K_FY2024.pdf",
}: {
  activeDoc?: string;
}) {
  const [currentPage, setCurrentPage] = useState<number>(14);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeCitationTag, setActiveCitationTag] = useState<string>("p14");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic document content depending on which document is selected
  const docData = useMemo(() => {
    if (activeDoc.includes("Attention") || activeDoc.includes("Transformers")) {
      return {
        title: activeDoc,
        category: "Machine Learning / arXiv Research",
        totalPages: 15,
        defaultPage: 4,
        pages: {
          4: {
            header: "Section 3.2 • Multi-Head Attention",
            p1: "Instead of performing a single attention function with d_model-dimensional keys, values and queries, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections...",
            targetSection: "Equation (2) • Scaled Dot-Product",
            targetCitation: "p4",
            highlightText:
              "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V. We compute the attention function simultaneously on a set of queries packed together into a matrix Q.",
            p2: "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.",
          },
          8: {
            header: "Table 2 • English-to-German Translation",
            p1: "On the WMT 2014 English-to-German translation task, the big transformer model outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4.",
            targetSection: "BLEU Score Benchmark §5.1",
            targetCitation: "p8",
            highlightText:
              "Transformer (big) achieved 28.4 BLEU with training cost of 3.5 days on 8 P100 GPUs, reducing training FLOPs by 4.2x compared to ByteNet.",
            p2: "Training was completed using the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^-9.",
          },
        },
        initialQuestion: "What is the mathematical formulation of Scaled Dot-Product Attention?",
        initialAnswer:
          "Scaled Dot-Product Attention is calculated as Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V, scaled by the square root of key dimension to prevent gradient vanishing in extreme softmax regimes.",
        initialCitations: [
          {
            label: "[P. 4 § 3.2]",
            page: 4,
            section: "3.2",
            excerpt: "Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V",
          },
          {
            label: "[P. 8 § 5.1]",
            page: 8,
            section: "5.1",
            excerpt: "WMT 2014 Benchmark: 28.4 BLEU score achieved",
          },
        ],
      };
    } else if (activeDoc.includes("Employment") || activeDoc.includes("Agreement")) {
      return {
        title: activeDoc,
        category: "Corporate & Legal Agreement",
        totalPages: 24,
        defaultPage: 7,
        pages: {
          7: {
            header: "Section 8 • Non-Disclosure & Confidentiality",
            p1: "Employee acknowledges that during the course of employment, Employee will receive and have access to proprietary trade secrets, customer pipeline matrices, and technical source specifications...",
            targetSection: "Covenant Against Disclosure §8.3",
            targetCitation: "p7",
            highlightText:
              "“Employee shall maintain strict confidentiality in perpetuity for all proprietary algorithm architectures and customer pricing tables, surviving any termination of employment.”",
            p2: "In the event of a breach or threatened breach by Employee, Company shall be entitled to seek emergency injunctive relief in addition to monetary damages.",
          },
          12: {
            header: "Section 14 • Severance & Vesting Acceleration",
            p1: "In the event of a Change of Control occurring within 12 months following effective execution...",
            targetSection: "Double-Trigger Acceleration §14.2",
            targetCitation: "p12",
            highlightText:
              "“Unvested equity grants shall immediately accelerate and vest at 100% of fair market value upon termination without Cause following a Qualifying Transaction.”",
            p2: "Severance payments shall equal six (6) months of base salary payable in equal bi-weekly installments.",
          },
        },
        initialQuestion: "What are the non-disclosure obligations and do they survive termination?",
        initialAnswer:
          "Under Section 8.3, employee confidentiality obligations regarding proprietary algorithm architectures and pricing tables persist in perpetuity and explicitly survive termination of employment.",
        initialCitations: [
          {
            label: "[P. 7 § 8.3]",
            page: 7,
            section: "8.3",
            excerpt: "Confidentiality covenants survive termination in perpetuity",
          },
          {
            label: "[P. 12 § 14.2]",
            page: 12,
            section: "14.2",
            excerpt: "Double-trigger 100% equity acceleration on Change of Control",
          },
        ],
      };
    } else {
      // Default: SEC 10-K / Q3 Earnings
      return {
        title: activeDoc,
        category: "SEC Form 10-K • Audit Division",
        totalPages: 168,
        defaultPage: 14,
        pages: {
          14: {
            header: "SEC Form 10-K • Item 7 • Operations",
            p1: "Consolidated Statement of Cloud Compute Operations. The following discussion should be read in conjunction with our financial statements and accompanying notes...",
            targetSection: "Gross Margin Realization §4.2",
            targetCitation: "p14",
            highlightText:
              "“Gross net cloud margins for the full-year 2024 reached 73.8%, exceeding initial baseline management guidance of 70.0% to 71.5%, driven primarily by accelerated architecture adoption and hyperscale compute contracts.”",
            p2: "Operating expenses associated with cloud cluster scaling surged 24% year-over-year, while total operational throughput expanded 180% during the corresponding period.",
          },
          15: {
            header: "SEC Form 10-K • Item 7 • Capital Expenditure",
            p1: "Data center infrastructure capital outlays expanded in alignment with multi-tenant cluster fulfillment schedules across North America and European operational zones...",
            targetSection: "CapEx & R&D Allocations §2.3",
            targetCitation: "p15",
            highlightText:
              "“Capital investments in specialized generative AI accelerators reached $4.2 Billion, representing a 42% reinvestment rate of operating cash flow.”",
            p2: "Management expects infrastructure scaling investments to moderate in the second half as supply capacity meets existing pipeline commitments.",
          },
          22: {
            header: "SEC Form 10-K • Item 7A • Guidance Reconciliation",
            p1: "Reconciliation of Non-GAAP Guidance Benchmarks to GAAP Operating Metrics for Fiscal Year 2024...",
            targetSection: "Guidance Delta Analysis §1.8",
            targetCitation: "p22",
            highlightText:
              "“Full-year realized EBITDA margin expanded by +230 basis points over the midpoint of management's preliminary guidance range published in Q1.”",
            p2: "Foreign currency exchange headwinds exerted an approximate 80 basis point drag across European enterprise revenue streams.",
          },
        },
        initialQuestion: "What were our net cloud margins in 2024 and how does it compare to guidance?",
        initialAnswer:
          "For Fiscal Year 2024, net cloud gross margins reached 73.8%, notably beating baseline guidance of 70.0% to 71.5% by +230 basis points due to accelerated enterprise architecture contracts.",
        initialCitations: [
          {
            label: "[P. 14 § 4.2]",
            page: 14,
            section: "4.2",
            excerpt: "Gross net cloud margins reached 73.8% vs 70.0%-71.5% guidance",
          },
          {
            label: "[P. 22 § 1.8]",
            page: 22,
            section: "1.8",
            excerpt: "EBITDA margin expanded by +230 bps over guidance midpoint",
          },
        ],
      };
    }
  }, [activeDoc]);

  // Message thread state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "user",
      name: "Principal Analyst",
      text: docData.initialQuestion,
      timestamp: "10:24 AM",
    },
    {
      id: "2",
      sender: "ai",
      name: "Neural Synthesizer",
      text: docData.initialAnswer,
      citations: docData.initialCitations,
      chart: !activeDoc.includes("Employment"),
      timestamp: "10:24 AM",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Current page data fallback
  const pageContent = (docData.pages as Record<number, any>)[currentPage] || {
    header: `${docData.title} • Page ${currentPage}`,
    p1: "Document index node traversing semantic text blocks...",
    targetSection: "Vector Segment",
    targetCitation: `p${currentPage}`,
    highlightText: `Extracted content from vector cluster matching query on page ${currentPage}. All citations are 100% attributable to source coordinates.`,
    p2: "Additional paragraphs indexed in the multi-modal vector database with sub-second retrieval latency.",
  };

  const handleCitationClick = (page: number, citationTag: string) => {
    setCurrentPage(page);
    setActiveCitationTag(citationTag);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSynthesizing) return;

    setInputValue("");
    const userMsgId = Date.now().toString();

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        name: "Principal Analyst",
        text,
        timestamp: "Just now",
      },
    ]);

    setIsSynthesizing(true);

    setTimeout(() => {
      let aiText = `Analysis complete across ${docData.totalPages} indexed pages in ${docData.title}. Synthesizing semantic relationships with zero hallucinations.`;
      let citations: Citation[] = [];

      if (text.toLowerCase().includes("risk") || text.toLowerCase().includes("guidance")) {
        aiText = `Identified key risk & guidance benchmarks: Reinvestment rate stands at 42% of operating cash flow, while foreign exchange volatility contributed an 80 bps drag in European territories.`;
        citations = [
          {
            label: "[P. 15 § 2.3]",
            page: 15,
            section: "2.3",
            excerpt: "42% reinvestment rate in specialized AI accelerators",
          },
        ];
        setCurrentPage(15);
        setActiveCitationTag("p15");
      } else if (text.toLowerCase().includes("table") || text.toLowerCase().includes("capex")) {
        aiText = `CapEx allocations in generative AI compute clusters totaled $4.2B, tracked directly in the infrastructure asset schedule.`;
        citations = [
          {
            label: "[P. 15 § 2.3]",
            page: 15,
            section: "2.3",
            excerpt: "Capital investments reached $4.2B",
          },
        ];
        setCurrentPage(15);
        setActiveCitationTag("p15");
      } else {
        aiText = `Cross-referencing verified citations confirms this finding with 99.8% semantic attribution. Exact source coordinates are pinned in the viewer on Page ${currentPage}.`;
        citations = [
          {
            label: `[P. ${currentPage} § 1.2]`,
            page: currentPage,
            section: "1.2",
            excerpt: `Attributed from Page ${currentPage}`,
          },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          name: "Neural Synthesizer",
          text: aiText,
          citations,
          timestamp: "Just now",
        },
      ]);
      setIsSynthesizing(false);
    }, 850);
  };

  // Preset query suggestions
  const suggestions = [
    "Summarize operating margins",
    "Extract CapEx figures",
    "Audit risk factors",
    "Compare vs previous year",
  ];

  return (
    <div className="w-full rounded-2xl bg-[#101420] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden p-2 sm:p-5">
      {/* Top Application Bar */}
      <div className="w-full flex flex-wrap items-center justify-between pb-3.5 px-2 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors inline-block cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors inline-block cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors inline-block cursor-pointer"></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <span className="material-symbols-outlined text-[18px] text-cyan-400">
              picture_as_pdf
            </span>
            <span className="font-semibold text-sm text-slate-100 max-w-[220px] sm:max-w-[340px] truncate">
              {docData.title}
            </span>
            <span className="text-xs text-slate-400 font-label-code hidden sm:inline">
              (Page {currentPage} of {docData.totalPages})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-cyan-500/30 text-xs font-label-code text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Vector Space: 1,536 Dim
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 border border-indigo-500/30 text-xs font-label-code text-indigo-300">
            <span className="material-symbols-outlined text-[14px]">speed</span>
            382ms Latency
          </div>
        </div>
      </div>

      {/* Split Console Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3">
        {/* Left Console: High-Fidelity PDF Canvas */}
        <div className="lg:col-span-6 rounded-xl bg-[#090d16] p-4 flex flex-col justify-between shadow-inner border border-slate-800/90 min-h-[520px]">
          {/* Document Viewer Toolbar */}
          <div className="flex flex-wrap items-center justify-between pb-2.5 mb-3 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 gap-2">
            {/* Zoom & Page Nav */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
                title="Zoom Out"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <span className="font-label-code text-xs text-slate-200 px-1.5 min-w-[44px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
                title="Zoom In"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>

              <span className="text-slate-700 font-label-code mx-1">|</span>

              {/* Page Navigator buttons */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
                title="Previous Page"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">navigate_before</span>
              </button>
              <span className="font-label-code text-xs text-cyan-300 px-1">
                P.{currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(docData.totalPages, p + 1))}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
                title="Next Page"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">navigate_next</span>
              </button>
            </div>

            {/* In-document filter/search */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
              <span className="material-symbols-outlined text-[15px] text-slate-400">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in page..."
                className="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-24 sm:w-28"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Rendered Document Page Simulated Viewport */}
          <div
            className="flex-1 bg-slate-950/60 rounded-lg p-5 text-slate-200 space-y-3.5 relative border border-slate-800/80 overflow-hidden transition-all duration-300 shadow-inner"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left" }}
          >
            {/* Page Header Stamp */}
            <div className="flex justify-between items-center text-xs font-label-code text-slate-500 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {pageContent.header}
              </span>
              <span>VERIFIED ORIGINAL</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {pageContent.p1}
            </p>

            {/* Glowing Grounded Citation Bounding Box Target */}
            <div className="relative p-3.5 rounded-lg bg-cyan-950/25 border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.22)] transition-all">
              <div className="absolute -left-1.5 top-0 bottom-0 w-1.5 bg-cyan-400 rounded-full"></div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-citation-tag text-[10.5px] text-cyan-300 uppercase flex items-center gap-1 font-bold tracking-wider">
                  <span className="material-symbols-outlined text-[13px]">pin_drop</span>
                  [{pageContent.targetSection}]
                </span>
                <span className="text-[10px] font-label-code text-cyan-300/80 px-2 py-0.5 rounded bg-cyan-900/40 border border-cyan-500/30">
                  Cosine Match: 0.94
                </span>
              </div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                {pageContent.highlightText}
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {pageContent.p2}
            </p>

            {/* Page Bottom Ledger */}
            <div className="pt-4 flex justify-between items-center text-slate-500 font-label-code text-[11px] border-t border-slate-800/60 mt-auto">
              <span>
                Sheet ID: #NV-10K-{currentPage} • SHA-256 Validated
              </span>
              <span>Page {currentPage} of {docData.totalPages}</span>
            </div>
          </div>

          {/* OCR & Anchor Status Strip */}
          <div className="mt-3 flex items-center justify-between text-slate-400 font-label-code text-xs px-1 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              OCR Confidence: 99.8% (Vision Model v4.0)
            </span>
            <span className="text-slate-500 hidden sm:inline">Active Anchor: Bounding Box #41</span>
          </div>
        </div>

        {/* Right Console: Conversational Neural Feed */}
        <div className="lg:col-span-6 rounded-xl bg-[#141824] p-4 flex flex-col justify-between shadow-inner border border-slate-800/90 min-h-[520px]">
          {/* Feed Message Stream */}
          <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[380px] pr-1.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.sender === "user"
                    ? "self-end max-w-[85%] rounded-xl p-3.5 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 shadow-md"
                    : "self-start w-full rounded-xl p-4 bg-slate-900/90 border border-slate-800 shadow-lg relative"
                }
              >
                {msg.sender === "ai" && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-gradient-to-b from-indigo-400 to-cyan-400"></div>
                )}

                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-cyan-500/20 text-cyan-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {msg.sender === "user" ? "person" : "neurology"}
                      </span>
                    </span>
                    <span className="font-semibold text-xs text-slate-200">
                      {msg.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-label-code text-[11px] text-slate-500">
                      {msg.timestamp}
                    </span>
                    {msg.sender === "ai" && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Copy answer"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedId === msg.id ? "check" : "content_copy"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {msg.text}
                </p>

                {/* Citation Chips */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-label-code text-slate-400">
                      Sources:
                    </span>
                    {msg.citations.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCitationClick(c.page, `p${c.page}`)}
                        className={`font-citation-tag text-[10.5px] px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 cursor-pointer ${
                          currentPage === c.page
                            ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                            : "bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/30"
                        }`}
                        title={`Jump to Page ${c.page}`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[12px]">visibility</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Inline Mini Chart for financial comparisons */}
                {msg.chart && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-label-code text-[11px] text-slate-400 mb-2 block font-medium">
                      Margin Realization vs Guidance (FY24)
                    </span>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] font-label-code text-slate-400 mb-0.5">
                          <span>Guidance Baseline</span>
                          <span>70.0% – 71.5%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-500 h-full rounded-full" style={{ width: "71.5%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] font-label-code text-cyan-300 mb-0.5 font-semibold">
                          <span>Actual Achieved</span>
                          <span>73.8% (+230 bps beat)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full"
                            style={{ width: "73.8%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isSynthesizing && (
              <div className="self-start rounded-xl p-3 bg-slate-900 border border-cyan-500/40 flex items-center gap-2.5">
                <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
                <span className="font-label-code text-xs text-cyan-300">
                  Traversing vector space &amp; calculating cosine similarities...
                </span>
              </div>
            )}
          </div>

          {/* Quick Query Suggestion Pills */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-label-code text-slate-500">Ask:</span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700/60 text-slate-300 transition-colors cursor-pointer"
                type="button"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Interactive Chat Input Pod */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="mt-3 p-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 focus-within:border-indigo-500/70 transition-all shadow-lg"
          >
            <button
              className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
              type="button"
              title="Attach context node"
            >
              <span className="material-symbols-outlined text-[19px]">attach_file</span>
            </button>
            <input
              className="w-full bg-transparent px-1 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              placeholder={`Ask a question about ${docData.title}...`}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer transition-all"
              type="submit"
              title="Send Prompt"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
