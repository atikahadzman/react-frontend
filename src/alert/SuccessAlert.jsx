export default function SuccessAlert({ message }) {
    return (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
                { message }
            </p>
        </div>
    );
};
