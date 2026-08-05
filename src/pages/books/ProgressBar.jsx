export default function ProgressBar({ book, user }) {
    const completed = book.bookmark === book.total_pages;
    const hasProgress = book.bookmark && book.progress_id && user?.id === book.user_id;
    const percent = Math.min(
        100,
        Math.round((book.bookmark / book.total_pages) * 100)
    );

    return (
        <div className="mt-4">
            {completed ? (
                <div className="rounded-md bg-lime-400 px-2 py-1 text-xs font-semibold text-lime-900">
                    You finished the book!
                </div>
            ) : hasProgress ? (
                <>
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span>
                            {book.bookmark} / {book.total_pages} pages
                        </span>
                        <span>{percent}%</span>
                    </div>

                    <div className="h-5 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full bg-lime-400 transition-all"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </>
            ) : null}

            {book.last_read_at && (
                <p className="mt-3 text-sm text-gray-700">
                    Last read at {book.last_read_at}
                </p>
            )}
        </div>
    );
}