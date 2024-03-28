import { AppBar, Toolbar, Container, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import Logout from '@mui/icons-material/Logout';
import { AccountCircle, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import TagIcon from '@mui/icons-material/Tag';
import StoreIcon from '@mui/icons-material/Store';
import { useDispatch } from "react-redux";
import { logout } from '../../store/accounts/accounts.slice';
import { useAppSelector } from '../../hooks/redux';

const Header = () => {
    const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
    const [adminAnchorEl, setAdminAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useDispatch();
    const { isLogin, user } = useAppSelector(state => state.account);

    const profileOpen = Boolean(profileAnchorEl);
    const adminOpen = Boolean(adminAnchorEl);

    const navigate = useNavigate();

    const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProfileAnchorEl(event.currentTarget);
    };
    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    };

    const handleAdminClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAdminAnchorEl(event.currentTarget);
    };
    const handleAdminClose = () => {
        setAdminAnchorEl(null);
    };

    const handleHome = () => {
        navigate("/");
    };

    const handleTagList = () => {
        navigate('/tag');
    };
    const handleCategoryList = () => {
        navigate('/category');
    };
    const handlePostList = () => {
        navigate('/post');
    };

    const handleLogin = () => {
        navigate("/login");
    }
    const handleLogout = (() => {
        dispatch(logout());
    });

    const handleRegister = () => {
        navigate("/register");
    }
    return (
        <>
            <AppBar color="primary">
                <Container >
                    <Toolbar>
                        <div>
                            <Button
                                id="profile-button"
                                aria-controls={profileOpen ? 'profile-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={profileOpen ? 'true' : undefined}
                                onClick={handleProfileClick}
                                color="inherit"
                            >
                                Profile
                            </Button>
                            <Menu
                                id="profile-menu"
                                anchorEl={profileAnchorEl}
                                open={profileOpen}
                                onClose={handleProfileClose}
                                MenuListProps={{
                                    'aria-labelledby': 'profile-button',
                                }}
                            >
                                {!isLogin ? (
                                    <>
                                        <MenuItem onClick={handleLogin}>
                                            <ListItemIcon>
                                                <AccountCircle fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Login" />
                                        </MenuItem>

                                        <MenuItem onClick={handleRegister}>
                                            <ListItemIcon>
                                                <PersonAdd fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Registration" />
                                        </MenuItem>
                                    </>
                                ) : (
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Logout" />
                                    </MenuItem>
                                )}
                            </Menu>
                        </div>
                        <Button onClick={handleHome} color="inherit">Posts</Button>
                        {user && user.roles[0] === 'admin' && (
                            <div>
                                <Button
                                    id="admin-button"
                                    aria-controls={adminOpen ? 'admin-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={adminOpen ? 'true' : undefined}
                                    onClick={handleAdminClick}
                                    color="inherit"
                                >
                                    Admin Panel
                                </Button>
                                <Menu
                                    id="admin-menu"
                                    anchorEl={adminAnchorEl}
                                    open={adminOpen}
                                    onClose={handleAdminClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'admin-button',
                                    }}
                                >
                                    <MenuItem onClick={handlePostList}>
                                        <ListItemIcon>
                                            <StoreIcon color="primary" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Post Panel" />
                                    </MenuItem>

                                    <MenuItem onClick={handleCategoryList}>
                                        <ListItemIcon>
                                            <CategoryIcon color="primary" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Category Panel" />
                                    </MenuItem>

                                    <MenuItem onClick={handleTagList}>
                                        <ListItemIcon>
                                            <TagIcon color="primary" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Tag Panel" />
                                    </MenuItem>
                                </Menu>
                            </div>
                        )}
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