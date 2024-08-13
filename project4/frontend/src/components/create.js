import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
    const [form, setForm] = useState({
        email: "",
        fname: "",
        lname: "",
        phone: "",
        password: "",
    });

    const navigate = useNavigate();

    function updateForm(jsonObj) {
        setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        const newUser = { ...form };

        try {
            const response = await fetch("http://localhost:4000/record/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                navigate("/");
            } else {
                const data = await response.json();
                alert(data.msg); // Display backend error message
            }
        } catch (error) {
            console.error("Error creating account:", error);
            alert("An error occurred. Please try again.");
        }

        setForm({
            email: "",
            fname: "",
            lname: "",
            phone: "",
            password: "",
        });
    }

    return (
        <div>
            <h3>Register</h3>
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
                    <label>First Name: </label>
                    <input
                        type="text"
                        id="fname"
                        value={form.fname}
                        onChange={(e) => updateForm({ fname: e.target.value })}
                    />
                </div>
                <div>
                    <label>Last Name: </label>
                    <input
                        type="text"
                        id="lname"
                        value={form.lname}
                        onChange={(e) => updateForm({ lname: e.target.value })}
                    />
                </div>
                <div>
                    <label>Phone: </label>
                    <input
                        type="text"
                        id="phone"
                        value={form.phone}
                        onChange={(e) => updateForm({ phone: e.target.value })}
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
                    <input type="submit" value="Create Account" />
                </div>
            </form>
        </div>
    );
}
