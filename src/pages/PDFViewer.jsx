import React, { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import axios from "axios";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useAuth } from "../context/AuthContext";
import { HiChevronLeft, HiChevronRight, HiMinus, HiPlus, HiOutlinePencil, HiBookmark, HiMenu } from "react-icons/hi";   

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const PDFViewer = ({ bookUrl, bookId, userId, progressId: initialProgressId, initialPage = 1, onClose }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, token } = useAuth();
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [scale, setScale] = useState(1.2);
    const [bookmarks, setBookmarks] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const [showTools, setShowTools] = useState(true);
    const [loading, setLoading] = useState(true);
    const [tool, setTool] = useState("none");
    const containerRef = useRef(null);
    const [progressId, setProgressId] = useState(initialProgressId ?? null);
    const proxyUrl = bookUrl?.replace(/^https?:\/\/localhost:\d+/, '');

  // save bookmark
    useEffect(() => {
        if (!currentPage || !bookId) return;

        const saveProgress = async () => {
            try {
                if (progressId) {
                    // axios argument order is -> axios.put(url, data, config)
                    await axios.put(apiUrl + `/progress/${progressId}`,
                    {
                        bookmark: currentPage,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });
                } else {
                    await axios.post(apiUrl + "/progress",
                    {
                        user_id: user?.id,
                        book_id: bookId,
                        bookmark: currentPage,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });
                }
            } catch (err) {
                console.error("Failed to save reading progress", err);
            }
        };

        saveProgress();
    }, [currentPage]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    // bookmark current page
    const toggleBookmark = () => {
        setBookmarks((prev) => {
            const exists = prev.find((b) => b.page === currentPage);

            // remove bookmark
            if (exists) {
                return prev.filter((b) => b.page !== currentPage);
            }

            // add bookmark
            return [
                ...prev,
                {
                    id: Date.now(),
                    page: currentPage,
                    label: `Page ${currentPage}`,
                    date: new Date().toLocaleDateString(),
                },
            ];
        });
    };

    const isBookmarked = bookmarks.some((b) => b.page === currentPage);

    // highlight selected text
    const handleTextSelection = () => {
        if (tool !== "highlight") return;
        const selection = window.getSelection();
        if (!selection || selection.toString().trim() === "") return;

        const text = selection.toString().trim();
        const exists = highlights.find(
            (h) => h.text === text && h.page === currentPage
        );

        if (!exists) {
            setHighlights([
                ...highlights,
                {
                    id:    Date.now(),
                    text,
                    page:  currentPage,
                    date:  new Date().toLocaleDateString(),
                    color: "bg-yellow-200",
                },
            ]);
        }
        selection.removeAllRanges();
    };

    const removeHighlight = (id) => {
        setHighlights(highlights.filter((h) => h.id !== id));
    };

    const removeBookmark = (id) => {
        setBookmarks(bookmarks.filter((b) => b.id !== id));
    };

    const goToPage = (page) => {
        setCurrentPage(page);
        setShowBookmarks(false);
        containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const pageHighlights = highlights.filter((h) => h.page === currentPage);

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 flex-wrap">
                {/* close button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onClose();
                    }}
                    className="text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg"
                >
                    &larr; Close
                </button>

                {/* divider */}
                <div className="w-px h-6 bg-gray-200"/>

                {/* navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="px-2 py-1 border border-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                        <HiChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-1 text-sm">
                        <input
                            type="number"
                            min={1}
                            max={numPages || 1}
                            value={currentPage}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val >= 1 && val <= numPages) setCurrentPage(val);
                            }}
                            className="w-12 text-center border border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-400">/ {numPages}</span>
                    </div>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                        disabled={currentPage >= numPages}
                        className="px-2 py-1 border border-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                        <HiChevronRight size={20} />
                    </button>
                </div>

                {/* divider */}
                <div className="w-px h-6 bg-gray-200"/>

                {/* zoom tool */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
                        className="px-2 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50"
                    >
                        <HiMinus size={20} />
                    </button>
                    <span className="text-sm text-gray-600 min-w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale((s) => Math.min(3, s + 0.2))}
                        className="px-2 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50"
                    >
                        <HiPlus size={20} />
                    </button>
                </div>

                {/* divider */}
                <div className="w-px h-6 bg-gray-200"/>

                {/* highlight tool */}
                <button
                    onClick={() => setTool(tool === "highlight" ? "none" : "highlight")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    tool === "highlight"
                        ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <span style={{fontSize:"16px"}}>
                        <HiOutlinePencil size={20}/>
                    </span>
                        Highlight
                </button>

                {/* bookmark tool */}
                <button
                    onClick={toggleBookmark}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    isBookmarked
                        ? "bg-blue-100 border-blue-400 text-blue-800"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <span style={{fontSize:"16px"}}>
                        <HiBookmark size={20}/>
                    </span>
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>

                {/* sidebar toggle */}
                <button
                    onClick={() => setShowBookmarks(!showBookmarks)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    showBookmarks
                        ? "bg-gray-100 border-gray-400 text-gray-800"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <span style={{fontSize:"16px"}}>
                        <HiMenu size={20}/>
                    </span>
                        Notes
                    {(bookmarks.length + highlights.length) > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {bookmarks.length + highlights.length}
                        </span>
                    )}
                </button>
            </div>

            {/* highlight tool hint */}
            {tool === "highlight" && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-1.5 text-xs text-yellow-700 text-center">
                    Select any text on the page to highlight it. Click Highlight again to turn off.
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* PDF canvas */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-auto bg-gray-800 flex flex-col items-center py-6 px-4"
                    onMouseUp={handleTextSelection}
                >
                    {loading && (
                    <div className="text-white text-sm mt-20 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"/>
                            Loading PDF...
                        </div>
                    )}

                        <Document
                            file={proxyUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={(err) => console.error(err)}
                            loading=""
                        >
                            <Page
                                pageNumber={currentPage}
                                scale={scale}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="shadow-2xl"
                            />
                        </Document>

                        {/* current page highlights list */}
                        {pageHighlights.length > 0 && (
                        <div className="mt-4 w-full max-w-2xl">
                            <p className="text-xs text-gray-400 mb-2">
                                Highlights on this page:
                            </p>
                            <div className="flex flex-col gap-2">
                                {pageHighlights.map((h) => (
                                    <div
                                        key={h.id}
                                        className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 flex items-start justify-between gap-2"
                                    >
                                        <p className="text-xs text-yellow-900 flex-1">
                                            "{h.text}"
                                        </p>
                                        <button
                                            onClick={() => removeHighlight(h.id)}
                                            className="text-yellow-600 hover:text-red-500 text-xs shrink-0"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* sidebar — bookmarks and highlights */}
                {showBookmarks && (
                    <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden">

                    <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 text-sm">
                        Bookmarks & Highlights
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">

                        {/* Bookmarks section */}
                        <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Bookmarks ({bookmarks.length})
                        </p>
                        {bookmarks.length === 0 ? (
                            <p className="text-xs text-gray-400">
                            No bookmarks yet. Click Bookmark to save a page.
                            </p>
                        ) : (
                            <div className="space-y-2">
                            {bookmarks
                                .sort((a, b) => a.page - b.page)
                                .map((b) => (
                                <div
                                    key={b.id}
                                    className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 group"
                                >
                                    <button
                                    onClick={() => goToPage(b.page)}
                                    className="text-xs text-blue-700 font-medium hover:underline text-left"
                                    >
                                    🔖 Page {b.page}
                                    <span className="block text-blue-400 font-normal">
                                        {b.date}
                                    </span>
                                    </button>
                                    <button
                                    onClick={() => removeBookmark(b.id)}
                                    className="text-blue-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                    >
                                    ✕
                                    </button>
                                </div>
                                ))}
                            </div>
                        )}
                        </div>

                        {/* Highlights section */}
                        <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Highlights ({highlights.length})
                        </p>
                        {highlights.length === 0 ? (
                            <p className="text-xs text-gray-400">
                            No highlights yet. Enable highlight tool and select text.
                            </p>
                        ) : (
                            <div className="space-y-2">
                            {highlights.map((h) => (
                                <div
                                key={h.id}
                                className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 group"
                                >
                                <div className="flex items-start justify-between gap-1">
                                    <button
                                    onClick={() => goToPage(h.page)}
                                    className="text-xs text-yellow-800 hover:underline text-left flex-1"
                                    >
                                    "{h.text.length > 60
                                        ? h.text.slice(0, 60) + "..."
                                        : h.text}"
                                    </button>
                                    <button
                                    onClick={() => removeHighlight(h.id)}
                                    className="text-yellow-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition shrink-0"
                                    >
                                    ✕
                                    </button>
                                </div>
                                <p className="text-xs text-yellow-500 mt-1">
                                    Page {h.page} · {h.date}
                                </p>
                                </div>
                            ))}
                            </div>
                        )}
                        </div>

                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;