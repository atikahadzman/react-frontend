import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi"; 

const BackButton = () => {
    const navigate = useNavigate();
    
    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-white transition mb-4"
        >
            <HiArrowLeft size={18} />
            Back
        </button>
    );
};
export default BackButton;