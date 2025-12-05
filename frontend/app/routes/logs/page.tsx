import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from "axios";
import { useCookies } from "react-cookie";

interface Log {
    id: number;
    content: string;
    status: string;
    timestamp: string;
}

export default function LogsPage() {
    const [cookies] = useCookies(["token"]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [error, setError] = useState("");

    const API_URL = "http://localhost:8000/api/logs";

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${cookies.token || ""}`,
            "Content-Type": "application/json",
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await axios.get(API_URL, axiosConfig);
            setLogs(response.data);
        } catch (err) {
            setError("Nie udało się pobrać logów.");
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getRowStyle = (status: string) => {
        switch (status) {
            case "CREATE":
                return { backgroundColor: "#d0f5da" };
            case "UPDATE":
                return { backgroundColor: "#ffe9bf" };
            case "DELETE":
                return { backgroundColor: "#ffd1d1" };
            case "READ":
            default:
                return { backgroundColor: "#e3edff" };
        }
    };

    return (
        <Box sx={{ width: 800, mx: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
                Logi API
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Endpoint</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Timestamp</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id} sx={getRowStyle(log.status)}>
                            <TableCell>{log.id}</TableCell>
                            <TableCell>{log.content}</TableCell>
                            <TableCell>{log.status}</TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}
