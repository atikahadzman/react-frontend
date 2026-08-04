import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiPhotograph, HiDocument } from "react-icons/hi"; 
import Banner from "./Banner";
import List from "./List";
import Form from "./Form";
import ErrorAlert from "../../alert/ErrorAlert";
import { getUsers } from "../../services/userService";
import { getRoles } from "../../services/roleService";

const Users = () => {
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchUsers();
        fetchRoles();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users");
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (err) {
            setError("Failed to fetch roles");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1e1e2c]">
            <div className="w-full px-6 py-8">

                {/* header */}
                <Banner
                    roles={roles}
                    users={users}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchUsers}
                    onError={setError}
                />

                {/* error */}
                {error && (
                    <ErrorAlert message={error}/>
                )}

                <List 
                    users={users}
                    roles={roles}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchUsers}
                    onError={setError}
                />
            </div>
        </div>
    );
};

export default Users;