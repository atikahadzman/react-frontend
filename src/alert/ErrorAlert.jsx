export default function ErrorAlert({ message }) {
    return (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
                { message }
            </p>
        </div>
    );
};
