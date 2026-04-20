export default function Navbar({ onLogout }) {
    <nav className="bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-semibold text-gray-900 text-lg">My Library</span>
        </div>
        <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg transition"
        >
            Logout
        </button>
    </nav>
}