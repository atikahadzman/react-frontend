import api from "../api/axios";

export const getBooks = async () => {
    const response = await api.get("/books");
    return response.data;
};

export const getBookById = async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
};

export const createBook = async (formData) => {
    const response = await api.post("/books", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const updateBook = async (id, formData) => {
    const response = await api.post(`/books/${id}`, formData);

    return response.data;
};

export const deleteBook = async (id) => {
    const response = await api.delete(`/books/${id}`);

    return response.data;
};

export const getBookOfTheMonth = async () => {
    const response = await api.get("/book/book-of-the-month");

    const book = response.data.data;

    return {
        ...book,
        cover_image_url:
            book.media?.find(
                (m) => m.collection_name === "cover_image"
            )?.original_url ?? "/not-exist.jpg",

        pdf_url:
            book.media?.find(
                (m) => m.collection_name === "book_url"
            )?.original_url ?? null,
    };
};