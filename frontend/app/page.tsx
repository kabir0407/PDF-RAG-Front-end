"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

// 3D Canvas visual element
const ThreeCanvas = dynamic(() => import("./components/ThreeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-[#090d16] flex items-center justify-center">
      <div className="flex items-center gap-3 text-cyan-400 font-label-code text-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
        Loading 3D Visual Space...
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="bg-[#090d16] font-body text-slate-100 min-h-screen relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Glows & Dot Grid */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse-glow"></div>
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#262c3e_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>
      </div>

      {/* Sticky Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#090d16]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-[0_2px_15px_rgba(0,0,0,0.5)]">
        <div className="h-16 w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-[20px]">
                neurology
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm font-bold text-slate-100 tracking-tight leading-none">
                PDF Conversation
              </span>
              <span className="font-label-code text-[10px] text-cyan-400 tracking-wider">
                DOCUMENT INTELLIGENCE
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800 shadow-inner">
            <a
              href="#stage-3d"
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors rounded-full"
            >
              Overview
            </a>
            <a
              href="#console-preview"
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors rounded-full"
            >
              Console
            </a>
            <a
              href="#features"
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors rounded-full"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors rounded-full"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors rounded-full"
            >
              Pricing
            </a>
          </nav>

          {/* Header Action Buttons with Clerk Auth */}
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-purple-700 hover:bg-purple-600 text-white rounded-full font-medium text-xs sm:text-sm h-9 px-4 cursor-pointer transition-colors shadow-lg">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/pdf-discuss"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-medium transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">forum</span>
                <span>Open Discuss Workspace</span>
              </Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="w-full pt-20">
        {/* HERO SECTION */}
        <section className="w-full px-4 sm:px-8 lg:px-12 pt-10 pb-16 flex flex-col items-center text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-label-code text-xs text-cyan-300 uppercase tracking-wider font-semibold">
              v3.4 Deterministic Hybrid RAG Engine Live
            </span>
          </div>

          {/* Primary Headline */}
          <h1 className="font-display-hero text-slate-100 max-w-5xl tracking-tight mb-5">
            Turn Static PDFs Into{" "}
            <span className="text-gradient-hero">Dynamic Conversations</span>
          </h1>

          {/* Subheadline */}
          <p className="font-body-lg text-slate-400 max-w-3xl mb-8 leading-relaxed">
            Upload financial audits, legal briefs, research papers, or entire
            textbooks. Ask complex questions, extract verified citations,
            summarize complex charts, and synthesize insights in seconds.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
            <Link
              href="/pdf-discuss"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white font-headline-sm text-sm shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_45px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Launch PDF Discuss</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
            <a
              href="#console-preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 font-headline-sm text-sm backdrop-blur-md shadow-md transition-all cursor-pointer"
            >
              <span>Explore Interactive Demo</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_downward
              </span>
            </a>
          </div>

          {/* Trust Metrics Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-label-code text-slate-300">
              <span className="material-symbols-outlined text-cyan-400 text-[16px]">
                bolt
              </span>
              <span>0.38s Semantic Latency</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-label-code text-slate-300">
              <span className="material-symbols-outlined text-purple-400 text-[16px]">
                verified_user
              </span>
              <span>100% Private &amp; SOC2 Certified</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-label-code text-slate-300">
              <span className="material-symbols-outlined text-indigo-400 text-[16px]">
                dataset
              </span>
              <span>Multi-Million Vector Indexing</span>
            </div>
          </div>

          {/* 3D INTERACTIVE HERO STAGE */}
          <div
            id="stage-3d"
            className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800/90 bg-[#090d16]"
          >
            <ThreeCanvas />

            {/* Bottom Visual Tag */}
            <div className="absolute inset-x-4 sm:inset-x-8 bottom-4 sm:bottom-6 p-3 sm:p-4 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-semibold text-slate-100">
                  Interactive 3D Neural Viewport
                </span>
                <span className="text-slate-500 hidden md:inline">•</span>
                <span className="text-slate-400 hidden md:inline">
                  Drag and tilt to inspect floating document layers &amp;
                  semantic citation graphs
                </span>
              </div>
              <span className="font-label-code text-cyan-300 text-[11px] uppercase tracking-wider hidden sm:inline">
                Real-Time WebGL
              </span>
            </div>
          </div>
        </section>

        {/* COGNITIVE ARCHITECTURE FEATURES */}
        <section
          id="features"
          className="w-full px-4 sm:px-8 lg:px-12 py-20 border-t border-slate-800/80"
        >
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="font-label-code text-xs text-indigo-400 uppercase tracking-wider block mb-1">
                // COGNITIVE ARCHITECTURE
              </span>
              <h2 className="font-headline-xl text-slate-100 mb-3">
                Engineered for High-Stakes Accuracy
              </h2>
              <p className="font-body-md text-slate-400">
                Built for legal analysts, researchers, and engineers where
                hallucinations cannot be tolerated.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <span className="material-symbols-outlined text-[26px]">
                        pin_drop
                      </span>
                    </div>
                    <span className="font-label-code text-xs text-cyan-300 px-3 py-1 rounded-full bg-slate-800 border border-cyan-500/20">
                      Deterministic RAG
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-slate-100 mb-2">
                    Deep Citation Grounding
                  </h3>
                  <p className="font-body-md text-slate-400 mb-5 leading-relaxed">
                    Every generated response maps to exact paragraph and table
                    bounding boxes. Zero hallucinations. Click citations to view
                    authenticated passages in the native viewer.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between font-label-code text-xs text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">
                      verified
                    </span>
                    Attributable Vector Traversal
                  </span>
                  <span>Sub-second</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <span className="material-symbols-outlined text-[26px]">
                        folder_copy
                      </span>
                    </div>
                    <span className="font-label-code text-xs text-purple-300 px-3 py-1 rounded-full bg-slate-800 border border-purple-500/20">
                      Multi-Corpus
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-slate-100 mb-2">
                    Multi-Document Synthesis
                  </h3>
                  <p className="font-body-md text-slate-400 mb-5 leading-relaxed">
                    Chat across dozens of PDFs simultaneously to cross-reference
                    legal clauses, M&amp;A provisions, or multi-year quarterly
                    performance without splitting context windows.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between font-label-code text-xs text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">
                      layers
                    </span>
                    Up to 500 Files Per Session
                  </span>
                  <span>Cross-indexed</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <span className="material-symbols-outlined text-[26px]">
                        functions
                      </span>
                    </div>
                    <span className="font-label-code text-xs text-indigo-300 px-3 py-1 rounded-full bg-slate-800 border border-indigo-500/20">
                      Vision OCR 4.0
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-slate-100 mb-2">
                    LaTeX Math &amp; Complex Tables
                  </h3>
                  <p className="font-body-md text-slate-400 mb-5 leading-relaxed">
                    Native multi-modal transformers extract balance sheets,
                    mathematical LaTeX notation, and schematic tables without
                    column transposition or blur.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between font-label-code text-xs text-indigo-300">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">
                      data_table
                    </span>
                    Markdown &amp; LaTeX Autorender
                  </span>
                  <span>Precision OCR</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 hover:border-slate-600 transition-all shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                      <span className="material-symbols-outlined text-[26px]">
                        security
                      </span>
                    </div>
                    <span className="font-label-code text-xs text-slate-300 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                      Zero Retention
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-slate-100 mb-2">
                    Enterprise Data Isolation
                  </h3>
                  <p className="font-body-md text-slate-400 mb-5 leading-relaxed">
                    Your proprietary files and conversations are never utilized
                    to train foundation models. Governed with AES-256 in transit
                    and rest with zero customer data retention defaults.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between font-label-code text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">
                      shield
                    </span>
                    SOC-2 Type II • HIPAA • GDPR
                  </span>
                  <span>Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-STEP PIPELINE SECTION */}
        <section
          id="how-it-works"
          className="w-full px-4 sm:px-8 lg:px-12 py-20 bg-[#0c101a] border-t border-slate-800/80"
        >
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="font-label-code text-xs text-purple-400 uppercase tracking-wider block mb-1">
                // PROCESSING LIFECYCLE
              </span>
              <h2 className="font-headline-xl text-slate-100 mb-3">
                From Raw PDF to Verified Answers
              </h2>
              <p className="font-body-md text-slate-400">
                Instant document ingestion backed by asynchronous neural
                parsing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Step 1 */}
              <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <span className="absolute -right-2 -top-4 font-display-hero text-slate-800/40 select-none text-7xl font-extrabold">
                  01
                </span>
                <div>
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold mb-4 shadow-md">
                    <span className="material-symbols-outlined">
                      cloud_upload
                    </span>
                  </div>
                  <h3 className="font-headline-md text-slate-100 mb-2">
                    Ingest &amp; Vectorize
                  </h3>
                  <p className="font-body-sm text-slate-400 leading-relaxed">
                    Connect documents via API or batch import. Automatic
                    hierarchical parsing partitions text, tabular data, and
                    diagrams into indexed multi-modal embeddings.
                  </p>
                </div>
                <div className="mt-6 pt-3 font-label-code text-xs text-indigo-400 flex items-center gap-1 border-t border-slate-800">
                  <span>Automatic Layout Analysis</span>
                  <span className="material-symbols-outlined text-[15px]">
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <span className="absolute -right-2 -top-4 font-display-hero text-slate-800/40 select-none text-7xl font-extrabold">
                  02
                </span>
                <div>
                  <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold mb-4 shadow-md">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <h3 className="font-headline-md text-slate-100 mb-2">
                    Ask Naturally
                  </h3>
                  <p className="font-body-sm text-slate-400 leading-relaxed">
                    Prompt with nuanced inquiries, demand executive summaries,
                    or probe cross-chapter dependencies using conversational
                    natural language.
                  </p>
                </div>
                <div className="mt-6 pt-3 font-label-code text-xs text-purple-400 flex items-center gap-1 border-t border-slate-800">
                  <span>Cross-Document Semantic Retrieval</span>
                  <span className="material-symbols-outlined text-[15px]">
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <span className="absolute -right-2 -top-4 font-display-hero text-slate-800/40 select-none text-7xl font-extrabold">
                  03
                </span>
                <div>
                  <div className="w-10 h-10 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold mb-4 shadow-md">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                  <h3 className="font-headline-md text-slate-100 mb-2">
                    Verify &amp; Export
                  </h3>
                  <p className="font-body-sm text-slate-400 leading-relaxed">
                    Click interactive citations to inspect authentic passages.
                    Export structured answers, synthesis tables, and memos to
                    Notion, Markdown, or Word.
                  </p>
                </div>
                <div className="mt-6 pt-3 font-label-code text-xs text-cyan-400 flex items-center gap-1 border-t border-slate-800">
                  <span>Sync to Markdown, Docx, Notion</span>
                  <span className="material-symbols-outlined text-[15px]">
                    check
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PLANS */}
        <section
          id="pricing"
          className="w-full px-4 sm:px-8 lg:px-12 py-20 border-t border-slate-800/80"
        >
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="text-center max-w-xl mx-auto">
              <span className="font-label-code text-xs text-cyan-400 uppercase tracking-wider block mb-1">
                // TRANSPARENT TIERS
              </span>
              <h2 className="font-headline-xl text-slate-100 mb-3">
                Predictable Scaling Plans
              </h2>
              <p className="font-body-md text-slate-400 mb-4">
                Flexible tiers for individual research and high-volume
                enterprise teams.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Starter Tier */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-headline-md text-slate-100">
                      Starter
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-800 font-label-code text-xs text-slate-400">
                      Free Forever
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-display-hero text-slate-100">$0</span>
                    <span className="text-xs text-slate-500 font-label-code">
                      /month
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">
                    Essential synthesis for individual research and casual
                    reading.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Up to 5 PDFs / month (max 30MB)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Single-document chat mode
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Instant page jump citations
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-[17px]">
                        close
                      </span>
                      Multi-document synthesis
                    </li>
                  </ul>
                </div>
                <a
                  href="#pricing"
                  className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors border border-slate-700"
                >
                  Get Started Free
                </a>
              </div>

              {/* Pro Tier (Highlighted) */}
              <div className="rounded-2xl p-6 bg-slate-900 border-2 border-indigo-500/80 flex flex-col justify-between shadow-2xl relative transform lg:-translate-y-2">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-label-code text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3 pt-2">
                    <span className="font-headline-md text-slate-100">
                      Professional
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-label-code text-xs border border-indigo-500/30">
                      Full Suite
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-display-hero text-slate-100">
                      $19
                    </span>
                    <span className="text-xs text-slate-500 font-label-code">
                      /month
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">
                    Unlimited cognitive throughput for analysts, developers, and
                    researchers.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      <strong>Unlimited</strong> documents (up to 200MB each)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Multi-document cross-synthesis (50 files/query)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Advanced Vision OCR &amp; LaTeX parsing
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Export to Notion, Markdown &amp; Word
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Priority semantic GPU compute
                    </li>
                  </ul>
                </div>
                <a
                  href="#pricing"
                  className="mt-8 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold text-center shadow-lg transition-all"
                >
                  Start 7-Day Free Trial
                </a>
              </div>

              {/* Enterprise Tier */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-headline-md text-slate-100">
                      Enterprise
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-800 font-label-code text-xs text-cyan-400">
                      Dedicated
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-display-hero text-slate-100">
                      Custom
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">
                    Custom deployments with VPC isolation, SSO, and dedicated
                    SLA guarantees.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Dedicated VPC &amp; On-premise deployment
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Custom fine-tuned domain embeddings
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      SAML SSO, SCIM &amp; Audit logging
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-[17px]">
                        check
                      </span>
                      Dedicated Technical Account Manager
                    </li>
                  </ul>
                </div>
                <a
                  href="#pricing"
                  className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors border border-slate-700"
                >
                  Contact Enterprise Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-16">
          <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-indigo-500/30 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
            <span className="font-label-code text-xs text-cyan-400 uppercase tracking-wider mb-2 block font-semibold">
              // ACCELERATE YOUR ANALYSIS
            </span>
            <h2 className="font-headline-xl text-slate-100 max-w-2xl mb-4">
              Ready to Chat With Your Knowledge Base?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mb-8 leading-relaxed">
              Join thousands of researchers and analysts saving hours every week
              with verified citation grounding.
            </p>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-semibold text-sm shadow-xl hover:opacity-95 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Get Started Now</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#080b13] py-12 border-t border-slate-800/80">
        <div className="w-full px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[16px]">
                    neurology
                  </span>
                </div>
                <span className="font-headline-sm font-bold text-slate-200">
                  PDF Conversation
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Hyper-focused neural workspace for mission-critical document
                synthesis, conversational intelligence, and rapid cross-citation
                analytics.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-label-code text-[10px] text-cyan-400">
                  SOC-2 TYPE II
                </span>
                <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-label-code text-[10px] text-purple-400">
                  GDPR READY
                </span>
                <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-label-code text-[10px] text-slate-400">
                  ISO 27001
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-xs text-slate-200 uppercase tracking-wider font-label-code">
                Platform
              </span>
              <a
                href="#stage-3d"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                3D Document Space
              </a>
              <a
                href="#console-preview"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cognitive Console
              </a>
              <a
                href="#features"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Zero-Hallucination RAG
              </a>
              <a
                href="#pricing"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Pricing Tiers
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-xs text-slate-200 uppercase tracking-wider font-label-code">
                Compliance &amp; Legal
              </span>
              <span className="text-xs text-slate-400">
                Zero Customer Data Retention
              </span>
              <span className="text-xs text-slate-400">
                End-to-End AES-256 Vault
              </span>
              <span className="text-xs text-slate-400">
                Dedicated Tenant Isolation
              </span>
              <span className="text-xs text-slate-400">
                HIPAA BAA Agreements
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>© 2025 PDF Conversation Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-400 cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-slate-400 cursor-pointer">
                Terms of Service
              </span>
              <span className="hover:text-slate-400 cursor-pointer">
                Security Protocol
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
