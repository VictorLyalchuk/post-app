import { AppBar, Toolbar, Container, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import Logout from '@mui/icons-material/Logout';
import { AccountCircle, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleHome = () => {
        navigate("/");
    };
    return (
        <>
            <AppBar color="primary">
                <Container >
                    <Toolbar>
                        <div>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                color="inherit"
                            >
                                Profile
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <AccountCircle fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Login" />
                                </MenuItem>

                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Registration" />
                                </MenuItem>

                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </MenuItem>
                            </Menu>
                        </div>
                        <Button onClick={handleHome} color="inherit">Posts</Button>
                    </Toolbar>
                </Container>
            </AppBar>
            <br />
            <br />
            <br />
            <br />
        </>

    );
}

export default Header;