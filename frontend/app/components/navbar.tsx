import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router';

export default function Navbar() {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const handleLogout = () => {
        removeCookie('token', { path: '/' });
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <NavLink to="/" >
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Home
                        </Typography>
                    </NavLink>
                    {cookies.token ? (
                        <Button
                            color="inherit"
                            variant="outlined"
                            onClick={handleLogout}
                            sx={{ marginLeft: 2 }}
                        >
                            Wyloguj się
                        </Button>
                    ) : (
                        <>
                            <NavLink to="/login">
                                <Button
                                    color="inherit"
                                    variant="outlined"
                                    sx={{ marginRight: 2, marginLeft: 2 }}
                                >
                                    Zaloguj się
                                </Button>
                            </NavLink>
                            <NavLink to="/register">
                                <Button color="inherit" variant="outlined">
                                    Zarejestruj się
                                </Button>
                            </NavLink>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
