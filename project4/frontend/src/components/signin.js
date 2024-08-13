import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState(""); // To display backend messages

    const navigate = useNavigate();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        const newPerson = { ...form };

        try {
            const response = await fetch("http://localhost:4000/record/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include', // Include credentials for session
                body: JSON.stringify(newPerson),
            });

            const data = await response.json();

            if (response.ok) {
                // Successful login
                setMessage(data.msg); // Set the success message

                // Call session_set to set the session
                await fetch("http://localhost:4000/session_set", {
                    method: "GET",
                    credentials: 'include', // Include credentials for session
                });

                setForm({ email: "", password: "" });
                navigate("/signedin", { state: data }); // Navigate to the signed-in page
            } else {
                // Invalid credentials
                setMessage(data.msg); // Set the error message
                setForm({ email: "", password: "" });
                // Optional: you can navigate to a different page or stay on the same page
            }
        } catch (error) {
            window.alert(error);
        }
    }

    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Email: </label>
                    <input
                        type="text"
                        id="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
                </div>
                <br />
                <div>
                    <input type="submit" value="Log in" />
                </div>
            </form>
            {message && <p>{message}</p>} {/* Display the message */}
        </div>
    );
}
