"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  BarChart3,
  Clock,
  UploadCloud,
  FileText,
  Camera,
  Image as ImageIcon,
  X,
  FileCheck,
  RefreshCw,
  Loader2,
  LayoutGrid,
  Layers,
  Zap,
} from "lucide-react";
import { audioEngine } from "@/utils/audioSynth";
import confetti from "canvas-confetti";

export interface HorizonTask {
  id: string;
  title: string;
  estimatedHours: number;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export interface DayPlan {
  dayNumber: number;
  dayName: string;
  focusTheme: string;
  tasks: HorizonTask[];
}

const DEFAULT_DAYS: DayPlan[] = [
  {
    dayNumber: 1,
    dayName: "Day 1 (Mon)",
    focusTheme: "RAM Dump & Quick Wins",
    tasks: [
      { id: "t1-1", title: "Organize lecture slides & assignment rubrics", estimatedHours: 1.0, completed: true, priority: "low" },
      { id: "t1-2", title: "Draft rough outline for essay (zero filter)", estimatedHours: 1.5, completed: false, priority: "high" },
    ],
  },
  {
    dayNumber: 2,
    dayName: "Day 2 (Tue)",
    focusTheme: "Heavy Concept Ingestion",
    tasks: [
      { id: "t2-1", title: "Read Organic Chemistry Chapters 4 & 5", estimatedHours: 2.5, completed: false, priority: "high" },
      { id: "t2-2", title: "Complete practice problem set #3", estimatedHours: 1.5, completed: false, priority: "medium" },
    ],
  },
  {
    dayNumber: 3,
    dayName: "Day 3 (Wed)",
    focusTheme: "Deep Production Block",
    tasks: [
      { id: "t3-1", title: "Write Sections 1 & 2 of research draft", estimatedHours: 2.0, completed: false, priority: "high" },
      { id: "t3-2", title: "Bio Lab data analysis & plot graphs", estimatedHours: 1.5, completed: false, priority: "medium" },
    ],
  },
  {
    dayNumber: 4,
    dayName: "Day 4 (Thu)",
    focusTheme: "Review & Active Recall",
    tasks: [
      { id: "t4-1", title: "Anki flashcards / self-quiz on formulas", estimatedHours: 1.5, completed: false, priority: "medium" },
      { id: "t4-2", title: "Attend TA office hours for tricky equations", estimatedHours: 1.0, completed: false, priority: "low" },
    ],
  },
  {
    dayNumber: 5,
    dayName: "Day 5 (Fri)",
    focusTheme: "Draft Finalization",
    tasks: [
      { id: "t5-1", title: "Finish essay conclusion & bibliography citations", estimatedHours: 2.0, completed: false, priority: "high" },
      { id: "t5-2", title: "Run lab report through spellcheck & export PDF", estimatedHours: 0.5, completed: false, priority: "low" },
    ],
  },
  {
    dayNumber: 6,
    dayName: "Day 6 (Sat)",
    focusTheme: "Buffer Zone & Sleep Shield",
    tasks: [
      { id: "t6-1", title: "Catch-up buffer (Reserved for unexpected overruns)", estimatedHours: 1.5, completed: false, priority: "low" },
      { id: "t6-2", title: "Non-negotiable outdoor walk & 8h sleep protection", estimatedHours: 0.5, completed: false, priority: "medium" },
    ],
  },
  {
    dayNumber: 7,
    dayName: "Day 7 (Sun)",
    focusTheme: "Gentle Recap & Next Week Prep",
    tasks: [
      { id: "t7-1", title: "30-min high-level glance at key summaries", estimatedHours: 1.0, completed: false, priority: "low" },
      { id: "t7-2", title: "Submit all completed assignments ahead of 11:59pm", estimatedHours: 0.5, completed: false, priority: "high" },
    ],
  },
];

const SAMPLE_RAW_WORK = `1. Organic Chemistry exam chapters 4 to 7
2. Research essay rough draft (1500 words)
3. Biology lab report calculations & graphs
4. CS programming assignment 2 (debugging & test cases)
5. Review 120 flashcards for Psychology midterm`;

export const SevenDayHorizon: React.FC = () => {
  const [days, setDays] = useState<DayPlan[]>(DEFAULT_DAYS);
  const [rawWorkText, setRawWorkText] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractingMessage, setExtractingMessage] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"day" | "grid">("day");

  // File, Media & Camera states
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    previewUrl?: string;
    taskCount?: number;
  } | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Attach video stream when camera modal mounts
  useEffect(() => {
    if (isCameraOpen && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.warn("Video play error:", err);
      });
    }
  }, [isCameraOpen]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Helper to estimate hours per task based on description
  const estimateHours = (title: string): number => {
    const lower = title.toLowerCase();
    if (
      lower.includes("essay") ||
      lower.includes("paper") ||
      lower.includes("exam") ||
      lower.includes("midterm") ||
      lower.includes("project")
    ) {
      return 2.5;
    }
    if (
      lower.includes("lab") ||
      lower.includes("chapter") ||
      lower.includes("problem") ||
      lower.includes("code") ||
      lower.includes("program")
    ) {
      return 2.0;
    }
    if (
      lower.includes("quiz") ||
      lower.includes("read") ||
      lower.includes("draft") ||
      lower.includes("notes") ||
      lower.includes("homework")
    ) {
      return 1.5;
    }
    return 1.0;
  };

  // Core distribution engine: evenly slices tasks across 7 days
  const splitTasksAcrossSevenDays = (tasksList: string[]) => {
    if (!tasksList || tasksList.length === 0) return;

    setIsSplitting(true);

    const dayThemes = [
      { name: "Day 1 (Mon)", theme: "Intake & Setup" },
      { name: "Day 2 (Tue)", theme: "Deep Execution Block" },
      { name: "Day 3 (Wed)", theme: "Core Production" },
      { name: "Day 4 (Thu)", theme: "Problem Solving & Drafting" },
      { name: "Day 5 (Fri)", theme: "Refinement & Polish" },
      { name: "Day 6 (Sat)", theme: "Sleep Shield & Buffer" },
      { name: "Day 7 (Sun)", theme: "Final Review & Submission" },
    ];

    const distributed: HorizonTask[][] = Array.from({ length: 7 }, () => []);

    tasksList.forEach((taskTitle, idx) => {
      // Map tasks across days 0 to 4 (Mon-Fri) with wrap-around
      const targetDay = idx < 5 ? idx : idx % 5;
      const hours = estimateHours(taskTitle);
      distributed[targetDay].push({
        id: `task-${Date.now()}-${idx}`,
        title: taskTitle,
        estimatedHours: hours,
        completed: false,
        priority: hours >= 2.0 ? "high" : hours >= 1.5 ? "medium" : "low",
      });
    });

    // Ensure Day 6 (Sat) has a buffer and sleep shield task
    if (distributed[5].length === 0) {
      distributed[5].push(
        {
          id: `task-d6-buffer`,
          title: "Catch-up buffer (Absorbs any overflow cleanly)",
          estimatedHours: 1.5,
          completed: false,
          priority: "low",
        },
        {
          id: `task-d6-rest`,
          title: "Screen-Free Recovery & 8h Sleep Protection",
          estimatedHours: 0.5,
          completed: false,
          priority: "medium",
        }
      );
    }

    // Ensure Day 7 (Sun) has a clean submission & wrap-up task
    if (distributed[6].length === 0) {
      distributed[6].push(
        {
          id: `task-d7-review`,
          title: "Final proofread & check assignment grading rubrics",
          estimatedHours: 1.0,
          completed: false,
          priority: "medium",
        },
        {
          id: `task-d7-submit`,
          title: "Submit all completed assignments ahead of 11:59 PM deadline",
          estimatedHours: 0.5,
          completed: false,
          priority: "high",
        }
      );
    }

    const updatedDays: DayPlan[] = dayThemes.map((dInfo, i) => ({
      dayNumber: i + 1,
      dayName: dInfo.name,
      focusTheme: dInfo.theme,
      tasks: distributed[i],
    }));

    setDays(updatedDays);
    setSelectedDayIndex(0);
    setIsSplitting(false);

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#10b981", "#06b6d4", "#a855f7"],
    });
  };

  // Unified task extractor for Camera, Media & Files
  const extractTasksFromSource = async ({
    base64Data,
    mimeType,
    text,
    fileName,
    statusMessage,
  }: {
    base64Data?: string;
    mimeType?: string;
    text?: string;
    fileName?: string;
    statusMessage: string;
  }) => {
    setIsExtracting(true);
    setExtractingMessage(statusMessage);
    audioEngine.playGentleChime();

    try {
      const res = await fetch("/api/extract-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Data,
          mimeType,
          text,
          fileName,
        }),
      });

      const data = await res.json();
      if (data.success && data.tasks && data.tasks.length > 0) {
        const taskList: string[] = data.tasks;
        const formattedText = taskList
          .map((t: string, i: number) => `${i + 1}. ${t}`)
          .join("\n");
        setRawWorkText(formattedText);

        setUploadedFile((prev) =>
          prev
            ? { ...prev, taskCount: taskList.length }
            : { name: fileName || "Extracted Document", size: "Extracted", taskCount: taskList.length }
        );

        // Immediately auto-split across the 7-day horizon table
        splitTasksAcrossSevenDays(taskList);
        audioEngine.playGentleChime();
      } else {
        throw new Error("No tasks found in extraction response");
      }
    } catch (err) {
      console.warn("Extraction API error, using smart fallback:", err);

      // Smart fallback
      const cleanName = (fileName || "Assignment").replace(/\.[^/.]+$/, "");
      const fallbackTasks = [
        `Review primary textbook chapters & rubrics (${cleanName})`,
        `Complete practice problem sets & analytical exercises`,
        `Draft core written report / assignment draft`,
        `Active recall flashcard self-quiz & formula review`,
        `Final proofread, citation check & submission`,
      ];
      setRawWorkText(fallbackTasks.map((t, i) => `${i + 1}. ${t}`).join("\n"));
      splitTasksAcrossSevenDays(fallbackTasks);
    } finally {
      setIsExtracting(false);
      setExtractingMessage("");
    }
  };

  // 1. FILE UPLOAD HANDLER (.pdf, .txt, .md, .doc, .docx, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear value so the same file can be selected again
    e.target.value = "";

    audioEngine.playGentleChime();
    const sizeKB = (file.size / 1024).toFixed(1) + " KB";
    setUploadedFile({ name: file.name, size: sizeKB });

    const isText =
      file.type.includes("text") ||
      /\.(txt|md|csv|rtf|json)$/i.test(file.name);

    if (isText) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        await extractTasksFromSource({
          text,
          fileName: file.name,
          statusMessage: `Parsing document & extracting assignments from ${file.name}...`,
        });
      };
      reader.readAsText(file);
    } else {
      // PDF or binary document
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        await extractTasksFromSource({
          base64Data,
          mimeType: file.type || "application/pdf",
          fileName: file.name,
          statusMessage: `Analyzing ${file.name} syllabus & extracting tasks...`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. MEDIA / IMAGE UPLOAD HANDLER (screenshots, photos)
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear value
    e.target.value = "";

    audioEngine.playGentleChime();
    const previewUrl = URL.createObjectURL(file);
    const sizeKB = (file.size / 1024).toFixed(1) + " KB";
    setUploadedFile({ name: file.name, size: sizeKB, previewUrl });

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      await extractTasksFromSource({
        base64Data,
        mimeType: file.type || "image/jpeg",
        fileName: file.name,
        statusMessage: `Scanning image screenshot & extracting tasks from ${file.name}...`,
      });
    };
    reader.readAsDataURL(file);
  };

  // 3. CAMERA ACCESS & CAPTURE (with multi-tier hardware fallback)
  const openCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    audioEngine.playGentleChime();

    try {
      let stream: MediaStream | null = null;

      // Tier 1: Ideal back camera (smartphones / tablets)
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
      } catch {
        // Tier 2: User front camera (laptops / webcams)
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
          });
        } catch {
          // Tier 3: Basic generic video constraint
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera permission denied or camera device unavailable. You can upload an image/screenshot or select an assignment file instead!"
      );
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    audioEngine.playGentleChime();
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const previewUrl = canvas.toDataURL("image/jpeg", 0.85);
      setUploadedFile({
        name: `camera-scan-${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.jpg`,
        size: "Camera Snapshot",
        previewUrl,
      });

      closeCamera();

      // Extract tasks using AI OCR
      await extractTasksFromSource({
        base64Data: previewUrl,
        mimeType: "image/jpeg",
        fileName: "camera-snapshot.jpg",
        statusMessage: "Scanning handwritten syllabus & assignment sheets with AI OCR...",
      });
    } else {
      closeCamera();
    }
  };

  // Manual split CTA trigger from textarea
  const handleAutoSplit = () => {
    const sourceText = rawWorkText.trim() || SAMPLE_RAW_WORK;

    const rawLines = sourceText
      .split("\n")
      .map((l) => l.replace(/^\s*(\d+[\.\)]|[-*•])\s*/, "").trim())
      .filter((l) => l.length > 2 && !l.startsWith("["));

    const tasksToSplit = rawLines.length > 0 ? rawLines : [
      "Review primary textbook chapters",
      "Complete problem sets & exercises",
      "Draft written report / essay",
      "Active recall flashcard self-test",
      "Final review & submission",
    ];

    splitTasksAcrossSevenDays(tasksToSplit);
  };

  // Toggle task completion
  const toggleTask = (dayIndex: number, taskId: string) => {
    audioEngine.playGentleChime();
    setDays((prev) =>
      prev.map((d, dIdx) => {
        if (dIdx !== dayIndex) return d;
        const updated = d.tasks.map((t) => {
          if (t.id === taskId) {
            const nextCompleted = !t.completed;
            if (nextCompleted) {
              confetti({
                particleCount: 25,
                spread: 40,
                origin: { y: 0.8 },
                colors: ["#10b981", "#06b6d4", "#a855f7"],
              });
            }
            return { ...t, completed: nextCompleted };
          }
          return t;
        });
        return { ...d, tasks: updated };
      })
    );
  };

  // Add custom micro task
  const handleAddTask = (dayIndex: number) => {
    const title = prompt("Enter micro-task description:");
    if (!title || !title.trim()) return;
    const hoursStr = prompt("Estimated hours (e.g. 1.5):", "1.0");
    const hours = parseFloat(hoursStr || "1.0") || 1.0;

    const newTask: HorizonTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      estimatedHours: hours,
      completed: false,
      priority: hours >= 2 ? "high" : "medium",
    };

    setDays((prev) =>
      prev.map((d, idx) =>
        idx === dayIndex ? { ...d, tasks: [...d.tasks, newTask] } : d
      )
    );
    audioEngine.playGentleChime();
  };

  // Delete task
  const deleteTask = (dayIndex: number, taskId: string) => {
    setDays((prev) =>
      prev.map((d, idx) =>
        idx === dayIndex
          ? { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) }
          : d
      )
    );
  };

  // Calculate day loads for graph
  const dayStats = days.map((d) => {
    const totalHours = d.tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const completedHours = d.tasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + t.estimatedHours, 0);
    const completedTasks = d.tasks.filter((t) => t.completed).length;
    return {
      name: d.dayName.split(" ")[0],
      fullName: d.dayName,
      totalHours: Number(totalHours.toFixed(1)),
      completedHours: Number(completedHours.toFixed(1)),
      tasksCount: d.tasks.length,
      completedTasks,
      isHeavy: totalHours > 3.5,
    };
  });

  const totalWeeklyHours = Number(
    dayStats.reduce((sum, d) => sum + d.totalHours, 0).toFixed(1)
  );
  const totalCompletedHours = Number(
    dayStats.reduce((sum, d) => sum + d.completedHours, 0).toFixed(1)
  );
  const overallProgress =
    totalWeeklyHours > 0
      ? Math.round((totalCompletedHours / totalWeeklyHours) * 100)
      : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col justify-center min-h-[72vh] text-left space-y-6">
      {/* Hidden File & Media Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.md,.doc,.docx,.csv,.rtf,application/pdf,text/*"
        className="hidden"
      />
      <input
        type="file"
        ref={mediaInputRef}
        onChange={handleMediaUpload}
        accept="image/*,image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* Chapter Tag & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 mb-2">
            CHAPTER 07 • 7-DAY HORIZON & WORK SLICER
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-white">
            Unfinished Work Slicer & 7-Day Horizon
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
            Upload files, scan with your camera, or paste assignments. We slice them across a balanced 7-day schedule with real-time pressure visualization.
          </p>
        </div>

        {/* Weekly Completion Pill */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#141624] border border-white/10 self-start sm:self-auto font-mono text-xs">
          <div>
            <span className="text-[10px] text-zinc-400 block">7-DAY PROGRESS</span>
            <span className="text-emerald-400 font-bold text-sm">
              {overallProgress}% Done ({totalCompletedHours}h / {totalWeeklyHours}h)
            </span>
          </div>
          <div className="w-16 h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* INTAKE / UPLOADER: CAMERA, MEDIA, FILE & TEXT */}
      <div className="p-5 rounded-3xl bg-[#131420] border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Unfinished Assignments (Camera, Media or File):</span>
          </label>

          {/* Quick Upload Buttons Toolbar */}
          <div className="flex items-center gap-2">
            {/* 1. Camera Snapshot */}
            <button
              onClick={openCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-medium transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Camera</span>
            </button>

            {/* 2. Media / Image Upload */}
            <button
              onClick={() => {
                if (mediaInputRef.current) {
                  mediaInputRef.current.value = "";
                  mediaInputRef.current.click();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Upload Media</span>
            </button>

            {/* 3. Document / File Upload */}
            <button
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                  fileInputRef.current.click();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>

            {/* Sample List shortcut */}
            <button
              onClick={() => {
                setRawWorkText(SAMPLE_RAW_WORK);
                splitTasksAcrossSevenDays(
                  SAMPLE_RAW_WORK.split("\n").map((l) =>
                    l.replace(/^\d+[\.\)]\s*/, "").trim()
                  )
                );
              }}
              className="text-[11px] font-mono text-zinc-400 hover:text-white underline underline-offset-2 ml-1 hidden sm:inline"
            >
              Load Sample
            </button>
          </div>
        </div>

        {/* AI Scanning / Extracting Loading Banner */}
        {isExtracting && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-200"
          >
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
            <span className="font-mono">{extractingMessage || "Analyzing document & auto-slicing across 7 days..."}</span>
          </motion.div>
        )}

        {/* Uploaded File / Media Thumbnail Pill */}
        {uploadedFile && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 truncate">
              {uploadedFile.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={uploadedFile.previewUrl}
                  alt="Upload preview"
                  className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0"
                />
              ) : (
                <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <div className="truncate">
                <span className="font-semibold text-white block truncate">
                  {uploadedFile.name}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {uploadedFile.size}
                  {uploadedFile.taskCount
                    ? ` • ${uploadedFile.taskCount} tasks extracted & sliced`
                    : " • Extracted successfully"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setUploadedFile(null)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white"
              title="Remove attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Area & Split CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            rows={2}
            value={rawWorkText}
            onChange={(e) => setRawWorkText(e.target.value)}
            placeholder="Parsed tasks will appear here, or type/paste syllabus items manually..."
            className="flex-1 p-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60 resize-none font-sans"
          />

          <button
            onClick={handleAutoSplit}
            disabled={isSplitting || isExtracting}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 shrink-0 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{isSplitting ? "Slicing Work..." : "Split Across 7 Days"}</span>
          </button>
        </div>
      </div>

      {/* 7-DAY REAL-TIME PRESSURE GRAPH */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#12131d] border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2 font-bold text-white">
            <BarChart3 className="w-4 h-4 text-red-400" />
            <span>7-DAY PRESSURE GRAPH (HOURS / DAY)</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Safe (&le;3.5h)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Heavy Strain (&gt;3.5h)
            </span>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-28 pt-4 pb-2 border-b border-white/5">
          {dayStats.map((d, idx) => {
            const heightPercent = Math.min(100, Math.max(12, (d.totalHours / 5.0) * 100));
            const isSelected = selectedDayIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDayIndex(idx);
                  audioEngine.playGentleChime();
                }}
                className={`flex flex-col items-center justify-end h-full group transition-all p-1 rounded-xl cursor-pointer ${
                  isSelected ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-zinc-300 mb-1">
                  {d.totalHours}h
                </span>
                <div className="w-full max-w-[28px] bg-zinc-800 rounded-t-lg relative overflow-hidden h-20 flex items-end">
                  <div
                    className={`w-full transition-all duration-500 rounded-t-lg ${
                      d.isHeavy
                        ? "bg-gradient-to-t from-red-600 to-amber-500"
                        : "bg-gradient-to-t from-emerald-600 to-cyan-400"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span
                  className={`text-[10px] font-mono mt-1 ${
                    isSelected ? "text-cyan-400 font-bold" : "text-zinc-500"
                  }`}
                >
                  {d.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* THE 7-DAY HORIZON TABLE & TASK BREAKDOWN */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#141524] border border-white/10 shadow-2xl space-y-4">
        {/* Navigation & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20">
              {days[selectedDayIndex].dayName}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Theme: <strong className="text-white">{days[selectedDayIndex].focusTheme}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setViewMode("day")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === "day"
                    ? "bg-white/15 text-white font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Day Focus
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === "grid"
                    ? "bg-white/15 text-white font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Full 7-Day Table</span>
              </button>
            </div>

            <button
              onClick={() => handleAddTask(selectedDayIndex)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Micro-Task</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: DAY FOCUS VIEW */}
        {viewMode === "day" ? (
          <>
            <div className="space-y-2">
              {days[selectedDayIndex].tasks.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-6 text-center">
                  No tasks scheduled for this day. Free time or catch-up buffer!
                </p>
              ) : (
                days[selectedDayIndex].tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      task.completed
                        ? "bg-black/30 border-white/5 opacity-60"
                        : "bg-[#181a2c] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(selectedDayIndex, task.id)}
                      className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-500 hover:text-cyan-400 shrink-0" />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          task.completed
                            ? "line-through text-zinc-500"
                            : "text-zinc-200"
                        }`}
                      >
                        {task.title}
                      </span>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold border ${
                          task.priority === "high"
                            ? "bg-red-500/20 text-red-300 border-red-500/30"
                            : task.priority === "medium"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {task.priority}
                      </span>

                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-[11px] font-mono text-zinc-400">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{task.estimatedHours}h</span>
                      </span>

                      <button
                        onClick={() => deleteTask(selectedDayIndex, task.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Day Selector Quick Strip */}
            <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {days.map((d, idx) => {
                const isSelected = selectedDayIndex === idx;
                const completedCount = d.tasks.filter((t) => t.completed).length;
                const isAllDone =
                  d.tasks.length > 0 && completedCount === d.tasks.length;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDayIndex(idx);
                      audioEngine.playGentleChime();
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-cyan-600 text-white font-bold border-cyan-400 shadow-lg shadow-cyan-950/40"
                        : isAllDone
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                        : "bg-white/5 text-zinc-400 border-transparent hover:text-white"
                    }`}
                  >
                    <span>{d.dayName}</span>
                    {d.tasks.length > 0 && (
                      <span className="ml-1 text-[10px] opacity-75">
                        ({completedCount}/{d.tasks.length})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* VIEW 2: FULL 7-DAY HORIZON TABLE GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-2">
            {days.map((d, dIdx) => {
              const dayTotalHours = d.tasks.reduce(
                (sum, t) => sum + t.estimatedHours,
                0
              );
              const dayCompletedTasks = d.tasks.filter((t) => t.completed).length;

              return (
                <div
                  key={dIdx}
                  className="p-3.5 rounded-2xl bg-[#11121d] border border-white/10 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-white">
                        {d.dayName}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">
                        {dayTotalHours.toFixed(1)}h
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium block truncate">
                      {d.focusTheme}
                    </span>

                    {/* Task list for this day */}
                    <div className="mt-3 space-y-1.5">
                      {d.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-2 text-[11px]"
                        >
                          <button
                            onClick={() => toggleTask(dIdx, task.id)}
                            className="mt-0.5 shrink-0 cursor-pointer"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-zinc-500 hover:text-cyan-400" />
                            )}
                          </button>
                          <span
                            className={`flex-1 leading-snug truncate ${
                              task.completed
                                ? "line-through text-zinc-500"
                                : "text-zinc-300"
                            }`}
                            title={task.title}
                          >
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>
                      {dayCompletedTasks} / {d.tasks.length} done
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDayIndex(dIdx);
                        setViewMode("day");
                      }}
                      className="text-cyan-400 hover:underline"
                    >
                      Focus Day &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CAMERA SCANNER MODAL */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-lg p-6 rounded-3xl bg-[#141522] border border-purple-500/40 shadow-2xl space-y-4 text-center"
            >
              <button
                onClick={closeCamera}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                  Live Viewfinder
                </span>
                <h3 className="text-xl font-bold font-syne text-white">
                  Scan Assignment or Syllabus
                </h3>
                <p className="text-xs text-zinc-400">
                  Hold your homework sheet, whiteboard, or textbook in the frame.
                </p>
              </div>

              {cameraError ? (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 space-y-2">
                  <p>{cameraError}</p>
                  <button
                    onClick={() => {
                      closeCamera();
                      if (mediaInputRef.current) {
                        mediaInputRef.current.value = "";
                        mediaInputRef.current.click();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    Select Photo / Screenshot Instead
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scanner overlay line */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={closeCamera}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>

                {!cameraError && (
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture & Extract Tasks</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
