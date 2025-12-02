import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function RegisterPage() {
    const [cookies, setCookie] = useCookies(['token']);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/register",
                { email, username, password },
            );

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage("Rejestracja zakończona sukcesem! Możesz się teraz zalogować.");
                setEmail("");
                setUsername("");
                setPassword("");
            } else {
                setErrorMessage("Nie udało się zarejestrować. Spróbuj ponownie.");
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.error) {
                setErrorMessage(err.response.data.error);
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
                Rejestracja
            </Typography>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Nazwa użytkownika"
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
                    Zarejestruj się
                </Button>
            </form>
        </Box>
    );
}
