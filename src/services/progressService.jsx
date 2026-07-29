import api from "../api/axios";

export const getProgressByUser = async (userId) => {
    const res = await api.get("/progress/by-user", {
        params: {
            user_id: userId,
        },
    });

    return res.data.data.map((progress) => ({
        ...progress.book,
        bookmark: progress.bookmark,
        progress_id: progress.id,
        user_id: progress.user_id,

        last_read_at: new Date(
            progress.last_read_at
        ).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }),

        cover_image_url:
            progress.book?.media?.find(
                (m) => m.collection_name === "cover_image"
            )?.original_url ?? null,

        pdf_url:
            progress.book?.media?.find(
                (m) => m.collection_name === "book_url"
            )?.original_url ?? null,
    }));
};