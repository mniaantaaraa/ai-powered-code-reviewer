"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitPullRequest,
  Shield,
  Activity,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Clock,
  ArrowUpRight,
  BarChart3,
  Flame,
  Bug,
  LineChart,
  RefreshCw,
  FolderGit2
} from "lucide-react";

interface DbComment {
  category: "bug" | "security" | "performance" | "style" | "suggestion" | string;
  severity: "critical" | "high" | "medium" | "low" | string;
  message: string;
  file?: string;
  line?: number;
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"30" | "7" | "90">("30");
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    title: string;
    risk: number;
    date: string;
  } | null>(null);

  // Fetching trpc analytics telemetry
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } =
    trpc.analytics.getOverview.useQuery();
  const { data: byRepo, isLoading: repoLoading, refetch: refetchRepo } =
    trpc.analytics.getReviewsByRepository.useQuery();
  const { data: severity, isLoading: severityLoading, refetch: refetchSeverity } =
    trpc.analytics.getSeverityBreakdown.useQuery();
  const { data: trend, isLoading: trendLoading, refetch: refetchTrend } =
    trpc.analytics.getReviewTrend.useQuery({ days: parseInt(activeTab) });
  const { data: reviews, isLoading: reviewsLoading, refetch: refetchReviews } =
    trpc.review.list.useQuery({ limit: 50 });

  const isGlobalLoading =
    overviewLoading || repoLoading || severityLoading || trendLoading || reviewsLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refetchOverview(),
      refetchRepo(),
      refetchSeverity(),
      refetchTrend(),
      refetchReviews()
    ]);
  };

  if (isGlobalLoading) {
    return (
      <div className="p-8 space-y-8 relative overflow-hidden bg-black min-h-screen text-white">
        {/* Immersive radial glows during skeleton loader */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 bg-white/5" />
            <Skeleton className="h-4 w-72 bg-white/5" />
          </div>
          <Skeleton className="h-10 w-24 bg-white/5" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/[0.02] border-white/5 backdrop-blur-md">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 bg-white/5" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-16 bg-white/5" />
                <Skeleton className="h-3 w-32 bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 h-[350px]">
            <CardHeader>
              <Skeleton className="h-6 w-36 bg-white/5" />
            </CardHeader>
            <CardContent className="h-full flex items-center justify-center">
              <Skeleton className="h-full w-full bg-white/5 rounded-lg" />
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-white/5 h-[350px]">
            <CardHeader>
              <Skeleton className="h-6 w-36 bg-white/5" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-white/5" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Safe comment parsing logic for the "Stitch Skills Matrix"
  const allComments: DbComment[] = [];
  reviews?.forEach((review) => {
    if (review.comments && typeof review.comments === "object") {
      const commentsArray = Array.isArray(review.comments)
        ? review.comments
        : [];
      commentsArray.forEach((comment: any) => {
        if (comment && typeof comment === "object") {
          allComments.push({
            category: comment.category ?? "suggestion",
            severity: comment.severity ?? "low",
            message: comment.message ?? "",
            file: comment.file,
            line: comment.line,
          });
        }
      });
    }
  });

  // Competency grading system
  const calculateGrade = (comments: DbComment[]) => {
    if (comments.length === 0) {
      return { grade: "A+", label: "Elite Class", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5", glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]", percent: 100 };
    }

    const criticalCount = comments.filter((c) => c.severity === "critical").length;
    const highCount = comments.filter((c) => c.severity === "high").length;
    const mediumCount = comments.filter((c) => c.severity === "medium").length;
    const lowCount = comments.filter((c) => c.severity === "low").length;

    const penaltyScore = criticalCount * 25 + highCount * 12 + mediumCount * 5 + lowCount * 1.5;
    const score = Math.max(10, 100 - penaltyScore);

    let grade = "A";
    let label = "Stable & Optimal";
    let color = "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
    let glow = "shadow-[0_0_20px_rgba(52,211,153,0.1)]";

    if (score >= 95) {
      grade = "A+";
      label = "Flawless Assembly";
    } else if (score >= 88) {
      grade = "A-";
      label = "Highly Optimized";
      color = "text-emerald-300 border-emerald-500/20 bg-emerald-500/5";
    } else if (score >= 80) {
      grade = "B+";
      label = "Clean Structure";
      color = "text-cyan-400 border-cyan-500/30 bg-cyan-500/5";
      glow = "shadow-[0_0_20px_rgba(34,211,238,0.1)]";
    } else if (score >= 70) {
      grade = "B";
      label = "Minor Refactors Due";
      color = "text-cyan-300 border-cyan-500/20 bg-cyan-500/5";
      glow = "shadow-[0_0_20px_rgba(34,211,238,0.05)]";
    } else if (score >= 60) {
      grade = "C+";
      label = "Refactor Recommended";
      color = "text-amber-400 border-amber-500/30 bg-amber-500/5";
      glow = "shadow-[0_0_20px_rgba(251,191,36,0.1)]";
    } else if (score >= 50) {
      grade = "C";
      label = "Requires Correction";
      color = "text-amber-500 border-amber-500/30 bg-amber-500/5";
    } else {
      grade = "D";
      label = "Critical Redesign Req.";
      color = "text-rose-500 border-rose-500/30 bg-rose-500/5 animate-pulse";
      glow = "shadow-[0_0_20px_rgba(244,63,94,0.2)]";
    }

    return { grade, label, color, glow, percent: Math.round(score) };
  };

  const skillsData = [
    {
      name: "Security Fortification",
      category: "security",
      desc: "SQL Injection, XSS vulnerability, token exposure, and CORS security leaks.",
      icon: Shield,
      colorClass: "from-rose-500 to-red-600",
      comments: allComments.filter((c) => c.category === "security"),
    },
    {
      name: "Defect Elimination",
      category: "bug",
      desc: "Runtime errors, edge-cases, type safety issues, logical crashes, and exceptions.",
      icon: Bug,
      colorClass: "from-amber-400 to-orange-500",
      comments: allComments.filter((c) => c.category === "bug"),
    },
    {
      name: "Performance Tuning",
      category: "performance",
      desc: "Computation complexity, render choking, infinite loops, and database call thrashing.",
      icon: Zap,
      colorClass: "from-indigo-400 to-cyan-500",
      comments: allComments.filter((c) => c.category === "performance"),
    },
    {
      name: "Architectural Cleanliness",
      category: "style",
      desc: "DRY conformity, architectural modularity, structure elegance, and variable styling.",
      icon: Sparkles,
      colorClass: "from-emerald-400 to-teal-500",
      comments: allComments.filter((c) => c.category === "style"),
    },
    {
      name: "Consultative Insights",
      category: "suggestion",
      desc: "General refactoring directions, design patterns adoption, and functional enhancements.",
      icon: Cpu,
      colorClass: "from-purple-400 to-indigo-500",
      comments: allComments.filter((c) => c.category === "suggestion" || c.category === "suggest"),
    },
  ];

  // Crown the "Stitch MVP" (Lowest risk score pull request)
  const completedReviewsList =
    reviews?.filter((r) => r.status === "COMPLETED" && r.riskScore !== null) ?? [];
  const mvpReview =
    completedReviewsList.length > 0
      ? [...completedReviewsList].sort((a, b) => (a.riskScore ?? 100) - (b.riskScore ?? 100))[0]
      : null;

  const successRate = overview?.totalReviews
    ? ((overview.completedReviews / overview.totalReviews) * 100).toFixed(1)
    : "0";

  // Trend Spline Generator (Timeline Chart)
  const trendPoints = trend?.filter((t) => t.status === "COMPLETED") ?? [];
  const chartHeight = 220;
  const chartWidth = 700;

  // Render trend line path
  let pathD = "";
  let areaD = "";
  const points: { x: number; y: number; title: string; risk: number; date: string }[] = [];

  if (trendPoints.length > 0) {
    const xStep = trendPoints.length > 1 ? (chartWidth - 60) / (trendPoints.length - 1) : 0;
    trendPoints.forEach((pt, idx) => {
      const x = idx * xStep + 30;
      const y = chartHeight - 30 - ((pt.riskScore ?? 0) / 100) * (chartHeight - 60);

      // Find the corresponding PR title from full review list if dates match roughly, or use fallback
      const match = reviews?.find(
        (r) =>
          new Date(r.createdAt).toDateString() === new Date(pt.createdAt).toDateString()
      );
      const prTitle = match ? `PR #${match.prNumber}: ${match.prTitle}` : "Code Review Run";

      points.push({
        x,
        y,
        title: prTitle,
        risk: pt.riskScore ?? 0,
        date: new Date(pt.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
      });
    });

    // Make smooth spline segment path
    pathD = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      // Smooth curve calculation using beziers
      const prev = points[i - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, "");

    areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - 15} L ${points[0].x} ${chartHeight - 15} Z`;
  }

  return (
    <div className="p-8 space-y-8 relative overflow-hidden bg-black text-white min-h-screen">
      {/* ── Immersive Ambient Lighting (Neo-Glitch Glassmorphism) ── */}
      <div className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[20%] w-[800px] h-[800px] rounded-full bg-cyan-500/8 blur-[150px] pointer-events-none" />

      {/* ── Top Header Navigation ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="pill-badge py-1 px-3 bg-indigo-500/10 border-indigo-500/20 text-indigo-300 font-semibold tracking-wider uppercase text-[10px]">
              Platform Analytics
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
            Developer Overview
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Real-time code hygiene telemetry, skill matrices, and integration benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-lg border border-white/8 bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white flex items-center gap-2 text-xs"
            title="Reload telemetry"
          >
            <RefreshCw className="size-3.5" />
            Sync Telemetry
          </button>
          <div className="flex rounded-lg border border-white/8 bg-white/5 p-1">
            {(["7", "30", "90"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  activeTab === tab
                    ? "bg-white text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Metrics Cards Grid ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        {[
          {
            title: "Total Code Reviews",
            val: overview?.totalReviews ?? 0,
            desc: "Triggered analysis runs",
            icon: GitPullRequest,
            glow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] hover:border-indigo-500/20",
            accent: "bg-indigo-500"
          },
          {
            title: "Review Completion",
            val: overview?.completedReviews ?? 0,
            desc: `${successRate}% success rate`,
            icon: CheckCircle2,
            glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:border-emerald-500/20",
            accent: "bg-emerald-500",
            valColor: "text-emerald-400"
          },
          {
            title: "Average Code Risk",
            val: `${(overview?.avgRiskScore ?? 0).toFixed(0)}`,
            desc: "Out of 100 (Lower is safer)",
            icon: Activity,
            glow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] hover:border-cyan-500/20",
            accent: "bg-cyan-500",
            valColor: "text-cyan-300"
          },
          {
            title: "Failed Operations",
            val: overview?.failedReviews ?? 0,
            desc: "Review timeouts & network errors",
            icon: AlertTriangle,
            glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.08)] hover:border-rose-500/20",
            accent: "bg-rose-500",
            valColor: overview?.failedReviews ? "text-rose-400 animate-pulse" : "text-white/80"
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <Card
                className={`bg-white/[0.02] border-white/5 backdrop-blur-md transition-all duration-300 relative group overflow-hidden ${item.glow}`}
              >
                {/* Visual Accent bar */}
                <div className={`absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${item.accent}`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-white/45 group-hover:text-white/60 transition-colors">
                    {item.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
                    <Icon className="size-4 text-white/60 group-hover:text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl font-extrabold tracking-tight ${item.valColor ?? "text-white"}`}>
                    {item.val}
                  </div>
                  <p className="text-xs text-white/40 mt-1 tracking-wide group-hover:text-white/50 transition-colors">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── Stitch AI Skills Matrix Section ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Award className="size-5 text-indigo-400" />
          <h2 className="text-xl font-bold tracking-tight">Stitch AI Skills Matrix</h2>
          <span className="text-[10px] py-0.5 px-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 rounded-full font-semibold">
            Core Competencies
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {skillsData.map((skill, idx) => {
            const Icon = skill.icon;
            const res = calculateGrade(skill.comments);
            const strokeDashoffset = 113 - (113 * res.percent) / 100;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
              >
                <Card
                  className={`bg-white/[0.02] border-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.04] p-5 h-full flex flex-col justify-between group cursor-pointer ${res.glow} border`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                        <Icon className="size-4 text-white/70" />
                      </div>
                      {/* Interactive Circular Progress for Skills */}
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            className="stroke-white/5 fill-none"
                            strokeWidth="2.5"
                          />
                          <motion.circle
                            cx="20"
                            cy="20"
                            r="18"
                            className="stroke-indigo-400 fill-none"
                            strokeWidth="2.5"
                            strokeDasharray="113"
                            initial={{ strokeDashoffset: 113 }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                        <span className="absolute text-[9px] font-bold text-white/50 group-hover:text-white transition-colors">
                          {res.percent}%
                        </span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-[11px] text-white/45 leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>
                  </div>

                  {/* Rating Grade Display */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-white/40 group-hover:text-white/50 transition-colors uppercase tracking-widest">
                      AI Assessment
                    </span>
                    <div
                      className={`px-3 py-1 rounded-md text-xs font-bold border transition-all flex items-center gap-2 ${res.color}`}
                    >
                      <span className="text-sm font-black tracking-tighter">{res.grade}</span>
                      <span className="text-[9px] opacity-75">{res.label}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Stitch MVP Pull-Request Showcase ── */}
      <div className="grid gap-6 lg:grid-cols-3 relative z-10">
        {/* Left Card: Stitch MVP Showcase */}
        <Card className="lg:col-span-2 bg-gradient-to-b from-white/[0.03] to-transparent border-white/5 backdrop-blur-md p-6 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-500/5 blur-[50px] pointer-events-none" />
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-emerald-400" />
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  Active Sprint Champion
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">Stitch MVP Pull Request</h3>
            </div>
            <span className="pill-badge py-1 px-2.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-300 font-semibold tracking-wide uppercase text-[9px]">
              Highly Rated Code changes
            </span>
          </div>

          {mvpReview ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <FolderGit2 className="size-3.5" />
                    <span className="truncate">{mvpReview.repository.fullName}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    PR #{mvpReview.prNumber}: {mvpReview.prTitle}
                  </h4>
                  <p className="text-xs text-white/55 line-clamp-4 leading-relaxed italic">
                    &ldquo;{mvpReview.summary || "This pull request successfully resolves identified code concerns with high precision."}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={mvpReview.prUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/20 hover:border-emerald-500/30 rounded-lg text-xs font-semibold transition-all"
                  >
                    View PR Diff
                    <ArrowUpRight className="size-3.5" />
                  </a>
                  <span className="text-[10px] text-white/40">
                    Completed {new Date(mvpReview.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Holographic interactive status display */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-gradient-to-tr from-indigo-500/5 to-transparent blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                    Code Quality Score
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Verified safe
                  </div>
                </div>

                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-emerald-400">
                    {mvpReview.riskScore ?? 0}
                  </span>
                  <span className="text-sm font-semibold text-white/30">/ 100 Risk</span>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40">AI Review Status</span>
                    <span className="font-bold text-white">COMPLETED</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40">Finding Count</span>
                    <span className="font-semibold text-white/70">
                      {Array.isArray(mvpReview.comments) ? mvpReview.comments.length : 0} recommendations
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/8 rounded-xl bg-white/[0.01]">
              <Sparkles className="size-8 text-white/20 mb-2" />
              <h4 className="text-sm font-semibold text-white/80">No Active MVP Found</h4>
              <p className="text-xs text-white/40 mt-1 max-w-sm">
                Crown your first champion by completing code review scans of high-quality pull requests in Qivo.
              </p>
            </div>
          )}
        </Card>

        {/* Right Card: Stitch Reviewer Integration Stats */}
        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-md p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute bottom-[-10%] right-[-10%] w-36 h-36 rounded-full bg-indigo-500/5 blur-[40px] pointer-events-none" />
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-indigo-400" />
                <h3 className="text-sm font-bold tracking-tight uppercase text-white/80">
                  Stitch Engine Status
                </h3>
              </div>
              <span className="size-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-start text-xs">
                <span className="text-white/45">Review Engine</span>
                <span className="font-bold text-white text-right">Groq Llama 3.3 70B</span>
              </div>
              <div className="flex justify-between items-start text-xs">
                <span className="text-white/45">Average Latency</span>
                <span className="font-semibold text-white text-right">3.84s / review run</span>
              </div>
              <div className="flex justify-between items-start text-xs">
                <span className="text-white/45">Integrations</span>
                <span className="font-semibold text-white text-right">GitHub Webhooks v2</span>
              </div>
              <div className="flex justify-between items-start text-xs">
                <span className="text-white/45">Model Temperature</span>
                <span className="font-mono text-indigo-300 text-right">0.3 (Strict Analysis)</span>
              </div>
              <div className="flex justify-between items-start text-xs">
                <span className="text-white/45">Telemetry Health</span>
                <span className="font-semibold text-emerald-400 text-right">100% operational</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-white/5 mt-5 flex items-center justify-between text-[10px] text-white/45">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3 text-white/40" />
              <span>Last telemetric sync: Just now</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Timeline spline trend graph ── */}
      <Card className="bg-white/[0.02] border-white/5 backdrop-blur-md p-6 relative z-10 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LineChart className="size-4.5 text-indigo-400" />
              <h3 className="text-lg font-bold tracking-tight">Code Risk Telemetry Timeline</h3>
            </div>
            <p className="text-xs text-white/45">
              Visualizes risk evaluations mapped sequentially across completed pull requests.
            </p>
          </div>
          <div className="text-[10px] py-1 px-3 bg-white/5 rounded-full border border-white/8 font-mono text-white/50">
            Averages: <span className="font-bold text-white">{(overview?.avgRiskScore ?? 0).toFixed(0)}</span> Risk Score
          </div>
        </div>

        <div className="relative pt-2">
          {trendPoints.length > 0 ? (
            <div className="w-full overflow-x-auto scrollbar-custom pb-2">
              <div className="min-w-[700px] h-[250px] relative">
                {/* SVG Graph rendering */}
                <svg
                  width={chartWidth}
                  height={chartHeight}
                  className="overflow-visible"
                >
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = chartHeight - 30 - (val / 100) * (chartHeight - 60);
                    return (
                      <g key={val} className="opacity-[0.03] hover:opacity-[0.07] transition-opacity">
                        <line
                          x1="30"
                          y1={y}
                          x2={chartWidth - 30}
                          y2={y}
                          stroke="#ffffff"
                          strokeWidth="1"
                          strokeDasharray="5,5"
                        />
                        <text
                          x="10"
                          y={y + 3}
                          fill="#ffffff"
                          fontSize="9"
                          textAnchor="end"
                          className="font-mono opacity-80"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Spline Area Under Fill */}
                  {areaD && (
                    <motion.path
                      d={areaD}
                      fill="url(#trendGradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                    />
                  )}

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Main Line Stroke */}
                  {pathD && (
                    <motion.path
                      d={pathD}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  )}

                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="50%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>

                  {/* Interactive Nodes */}
                  {points.map((p, idx) => (
                    <g
                      key={idx}
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer group"
                    >
                      {/* Outer Ring animated glow */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        className="fill-indigo-500/20 stroke-indigo-400/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        strokeWidth="1.5"
                      />
                      {/* Core Node circle */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4.5"
                        className={`${
                          p.risk >= 75
                            ? "fill-rose-500"
                            : p.risk >= 50
                            ? "fill-orange-400"
                            : p.risk >= 25
                            ? "fill-yellow-400"
                            : "fill-emerald-400"
                        } stroke-black`}
                        strokeWidth="1.5"
                      />
                      {/* Date Axis Marker */}
                      <text
                        x={p.x}
                        y={chartHeight - 8}
                        fill="#ffffff"
                        fontSize="9"
                        textAnchor="middle"
                        className="font-mono opacity-25 group-hover:opacity-60 transition-opacity"
                      >
                        {p.date}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Graph tooltip overlays */}
                <AnimatePresence>
                  {hoveredPoint && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute bg-slate-950/95 border border-white/10 backdrop-blur-md rounded-lg p-3 shadow-xl z-20 w-52 pointer-events-none"
                      style={{
                        left: `${Math.min(hoveredPoint.x + 10, chartWidth - 220)}px`,
                        top: `${Math.min(hoveredPoint.y - 110, chartHeight - 110)}px`
                      }}
                    >
                      <div className="space-y-1 text-xs">
                        <span className="text-[9px] font-bold text-indigo-400 uppercase">
                          {hoveredPoint.date} Report
                        </span>
                        <div className="font-bold text-white truncate leading-tight">
                          {hoveredPoint.title}
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-1.5 mt-1.5">
                          <span className="text-white/45 text-[10px]">Risk Score:</span>
                          <span
                            className={`font-mono font-bold ${
                              hoveredPoint.risk >= 75
                                ? "text-rose-400"
                                : hoveredPoint.risk >= 50
                                ? "text-orange-300"
                                : hoveredPoint.risk >= 25
                                ? "text-yellow-300"
                                : "text-emerald-300"
                            }`}
                          >
                            {hoveredPoint.risk} / 100
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/8 rounded-xl bg-white/[0.01]">
              <Sparkles className="size-8 text-white/20 mb-2" />
              <h4 className="text-sm font-semibold text-white/80">Awaiting Telemetry</h4>
              <p className="text-xs text-white/40 mt-1 max-w-sm">
                Once pull request scan reports accumulate over the next few days, Qivo will plot your code risk timeline.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Repositories Table & Risk Severities grid ── */}
      <div className="grid gap-6 md:grid-cols-2 relative z-10">
        {/* Left Card: Repositories List */}
        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FolderGit2 className="size-4.5 text-indigo-400" />
              <h3 className="text-lg font-bold tracking-tight">Active Repositories</h3>
            </div>

            <div className="max-h-[280px] overflow-y-auto scrollbar-custom pr-2 space-y-5">
              {byRepo?.map((repo) => {
                const riskScore = repo.avgRiskScore ?? 0;
                return (
                  <div key={repo.repositoryId} className="space-y-2 group">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-bold text-white/90 truncate group-hover:text-indigo-300 transition-colors" title={repo.repositoryFullName}>
                        {repo.repositoryName}
                      </span>
                      <span className="text-[11px] text-white/45 tracking-wide shrink-0">
                        {repo.count} reviews compiled
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Custom Risk Meter Slider */}
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                        <div
                          className={`h-full transition-all duration-500 ${
                            riskScore >= 75
                              ? "bg-gradient-to-r from-red-400 to-rose-600"
                              : riskScore >= 50
                              ? "bg-gradient-to-r from-orange-400 to-amber-500"
                              : riskScore >= 25
                              ? "bg-gradient-to-r from-yellow-300 to-amber-400"
                              : "bg-gradient-to-r from-green-400 to-emerald-500"
                          }`}
                          style={{
                            width: `${Math.max(riskScore, 2)}%`,
                          }}
                        />
                      </div>
                      <div className="text-right shrink-0 w-12">
                        <span className={`text-xs font-mono font-bold ${
                          riskScore >= 75
                            ? "text-rose-400"
                            : riskScore >= 50
                            ? "text-orange-300"
                            : riskScore >= 25
                            ? "text-yellow-300"
                            : "text-emerald-400"
                        }`}>
                          {riskScore.toFixed(0)}
                        </span>
                        <span className="text-[9px] text-white/30 font-medium"> risk</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!byRepo?.length && (
                <div className="py-12 text-center text-xs text-white/30">
                  No repository connections established yet.
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Right Card: Risk Severity Breakdown */}
        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Flame className="size-4.5 text-indigo-400" />
              <h3 className="text-lg font-bold tracking-tight">Risk Severity Breakdown</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Critical",
                  range: "75-100 score",
                  count: severity?.critical ?? 0,
                  color: "bg-rose-500/20 border-rose-500/30 text-rose-300",
                  indicator: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]",
                  percent: overview?.completedReviews ? ((severity?.critical ?? 0) / overview.completedReviews) * 100 : 0
                },
                {
                  label: "High Severity",
                  range: "50-74 score",
                  count: severity?.high ?? 0,
                  color: "bg-orange-500/20 border-orange-500/30 text-orange-300",
                  indicator: "bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.4)]",
                  percent: overview?.completedReviews ? ((severity?.high ?? 0) / overview.completedReviews) * 100 : 0
                },
                {
                  label: "Medium Severity",
                  range: "25-49 score",
                  count: severity?.medium ?? 0,
                  color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300",
                  indicator: "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]",
                  percent: overview?.completedReviews ? ((severity?.medium ?? 0) / overview.completedReviews) * 100 : 0
                },
                {
                  label: "Low Severity",
                  range: "0-24 score",
                  count: severity?.low ?? 0,
                  color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
                  indicator: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]",
                  percent: overview?.completedReviews ? ((severity?.low ?? 0) / overview.completedReviews) * 100 : 0
                }
              ].map((row, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-lg border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${row.indicator}`} />
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-white/90">{row.label}</span>
                        <span className="text-[9px] text-white/35 font-mono">{row.range}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">{row.count}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${row.indicator.split(" ")[0]} opacity-80 group-hover:opacity-100 transition-opacity`}
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-white/30 font-mono w-6 text-right">
                      {row.percent.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
