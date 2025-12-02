import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function Page() {
    const [cookies, setCookie] = useCookies(['token']);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:8000/api/auth/login", {
                username,
                password,
            });

            if (response.status === 200) {
                setCookie("token", response.data.token, { path: "/" });
                window.location.href = "/";
            } else {
                setErrorMessage("Błąd logowania. Sprawdź dane i spróbuj ponownie.");
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage("Błąd połączenia z serwerem.");
            }
        }
    };

    return (
        <Box
            sx={{
                width: 400,
                mx: "auto",
                mt: 10,
                p: 4,
                border: "1px solid #ccc",
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "#fff",
            }}
        >
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
                Logowanie
            </Typography>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="text"
                    fullWidth
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Hasło"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Zaloguj się
                </Button>
            </form>
        </Box>
    );
}
