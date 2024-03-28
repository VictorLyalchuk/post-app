import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardActions from '@mui/material/CardActions';
import { Button, CardHeader, Divider, FormControl, TextField, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNotification } from '../../../hooks/notification';
import { message, Spin } from 'antd';
import { login } from '../../../store/accounts/accounts.actions';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { Status } from '../../../utils/enums/index.ts';
import { ILogin } from '../../../interfaces/account/index.ts';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(2),
        },
        withoutLabel: {
            marginTop: theme.spacing(3),
        },
        textField: {
            '& .MuiInputBase-root': {
                height: '60px',
            },
            width: '30%',
        },
    }),
);

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const { handleError } = useNotification(messageApi);
    const status = useAppSelector(state => state.account.status);
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const values: ILogin = {
            email: email,
            password: password,
        }
        try {
            const response = await dispatch(login(values));
            unwrapResult(response);
            console.log(response.payload);
            navigate('/');
        } catch (error) {
            handleError(error);
        }
    };

    const handleClose = () => {
        navigate('/');
    }

    const handlePasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Container >
                <Spin tip="Loading" size="large" spinning={status === Status.LOADING}>
                    {contextHolder}
                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>

                        <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: 5 }}>
                            <CardHeader title="Login" />
                            <Divider />

                            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
                                <TextField
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    helperText="Please enter your email."
                                />
                            </FormControl>
                            <br />
                            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    helperText="Please enter your password."
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handlePasswordToggle} edge="end">
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>

                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <Button
                                    color="inherit"
                                    endIcon={<FileDownloadDoneIcon />}
                                    size="small"
                                    type="submit"
                                    variant="text"
                                    sx={{
                                        '&:hover': {
                                            bgcolor: '#bbdefb',
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    color="inherit"
                                    endIcon={<ClearIcon />}
                                    size="small"
                                    variant="text"
                                    onClick={handleClose}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: '#bbdefb',
                                        },
                                    }}
                                >
                                    Close
                                </Button>
                            </CardActions>
                        </form>
                        <Divider />
                    </Card>
                </Spin>
            </Container>
        </Box>
    )
}

export default LoginPage;