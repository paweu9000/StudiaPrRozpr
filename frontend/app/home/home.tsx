import { Box, Typography } from "@mui/material";

export function HomePage() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    padding: 2,
                    borderRadius: 2,
                    backgroundColor: "#e3f2fd",
                    boxShadow: 3,
                }}
            >
                Strona główna
            </Typography>
        </Box>
    );
}