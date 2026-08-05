export default function Badges({ book, user }) {
    const completed = book.bookmark === book.total_pages;
    const hasProgress = book.bookmark && book.progress_id && user?.id === book.user_id;

    return (
        <div className={`w-fit rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${
            book.bookmark === book.total_pages
                ? "bg-lime-400 text-lime-900"
                : hasProgress
                ? "bg-rose-400 text-rose-900"
                : "bg-sky-400 text-sky-900"
            }`}>
            {completed ? "Completed" : hasProgress ? "In progress" : "Not started"}
        </div>
    );
}