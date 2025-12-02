import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import {useCookies} from "react-cookie";

interface Item {
    id: number;
    name: string;
    price: string;
}

export default function ItemsPage() {
    const [cookies] = useCookies(["token"]);
    const [items, setItems] = useState<Item[]>([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    const API_URL = "http://localhost:8000/api/items";

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${cookies.token || ""}`,
            "Content-Type": "application/json",
        }
    };

    const fetchItems = async () => {
        try {
            const response = await axios.get(API_URL, axiosConfig);
            setItems(response.data);
        } catch (err: any) {
            setError("Nie udało się pobrać listy przedmiotów.");
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, { name, price }, axiosConfig);
                setEditingId(null);
            } else {
                await axios.post(API_URL, { name, price }, axiosConfig);
            }
            setName("");
            setPrice("");
            fetchItems();
        } catch (err: any) {
            setError("Nie udało się zapisać przedmiotu.");
        }
    };

    // Delete item
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`, axiosConfig);
            fetchItems();
        } catch (err: any) {
            setError("Nie udało się usunąć przedmiotu.");
        }
    };

    // Start editing
    const handleEdit = (item: Item) => {
        setEditingId(item.id);
        setName(item.name);
        setPrice(item.price);
    };

    return (
        <Box sx={{ width: 500, mx: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
                Lista Przedmiotów
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
                <TextField
                    label="Nazwa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Cena"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {editingId ? "Edytuj" : "Dodaj"} przedmiot
                </Button>
            </form>

            <List>
                {items.map((item) => (
                    <ListItem
                        key={item.id}
                        secondaryAction={
                            <>
                                <Button onClick={() => handleEdit(item)} sx={{ mr: 1 }} variant="outlined" size="small">
                                    Edytuj
                                </Button>
                                <IconButton edge="end" color="error" onClick={() => handleDelete(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText primary={item.name} secondary={`Cena: ${item.price}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
