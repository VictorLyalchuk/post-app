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
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { Status } from '../../../utils/enums/index.ts';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IRegister } from '../../../interfaces/account/index.ts';
import { register } from '../../../store/accounts/accounts.actions.ts';
import MaskedInput from 'react-text-mask';
import React from 'react';

interface TextMaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}

const TextMaskCustom = React.forwardRef(function TextMaskCustom(
    props: TextMaskCustomProps,
    ref: React.ForwardedRef<MaskedInput>,
) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref}
            mask={[
                '(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/,
            ]}
            placeholderChar={'\u2000'}
        />
    );
});
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

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const { handleError } = useNotification(messageApi);
    const status = useAppSelector(state => state.account.status);
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    interface State {
        textmask: string;
    }

    const [values, setValues] = useState<State>({
        textmask: '(   )    -  -  ',
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors: {
            firstName: string;
            lastName: string;
            confirmPassword: string;
            phone: string;
            email: string;
            password: string;
        } = {
            firstName: "",
            lastName: "",
            confirmPassword: "",
            phone: "",
            email: "",
            password: ""
        };

        if (firstName.trim() === '') {
            newErrors.firstName = 'First Name is required';
            isValid = false;
        }

        if (lastName.trim() === '') {
            newErrors.lastName = 'Last Name is required';
            isValid = false;
        }
        const cleanedPhoneNumber = values.textmask.replace(/\D/g, '');
        if (cleanedPhoneNumber.trim() === '') {
            newErrors.phone = 'Phone Number is required';
            isValid = false;
        }
        else if (!/^(067|099|066|063|098|097|096)\d{7}$/.test(cleanedPhoneNumber)) {
            newErrors.phone = 'Invalid phone number format';
            isValid = false;
        }

        if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (email.trim() === '' || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (password.trim() === '') {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        validatePhoneNumber(value);

        const cleanedValue = value.replace(/\D/g, '');
        setPhone(cleanedValue);
    };

    const validatePhoneNumber = (value: string) => {
        const isValidPrefix = /^(067|099|066|063|098|097|096)/.test(value.substr(0, 3));

        const isValidDigits = /^\d{7}$/.test(value.substr(3));

        const isValid = isValidPrefix && isValidDigits;

        setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: isValid ? '' : 'Invalid phone number format',
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (validateForm()) {
            const values: IRegister = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
            }
            try {
                const response = await dispatch(register(values));
                unwrapResult(response);
                navigate('/login');

            } catch (error) {
                handleError(error);
            }
        }
    };

    const handleClose = () => {
        navigate('/');
    }

    const handlePasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const handleConfirmPasswordToggle = () => {
        setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };
    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Container >
                <Spin tip="Loading" size="large" spinning={status === Status.LOADING}>
                    {contextHolder}
                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>

                        <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: 5 }}>
                            <CardHeader title="Register" />
                            <Divider />
                            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
                                <TextField
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    helperText="Please enter First Name."
                                    error={!!errors.firstName}

                                />
                                {errors.firstName ? (
                                    <div style={{ fontSize: '0.75rem', color: '#f44336' }}>Error: {errors.firstName}</div>
                                ) : (<div style={{ minHeight: '0.90rem' }}> </div>)}
                            </FormControl>
                            <br />

                            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
                                <TextField
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    error={!!errors.lastName}
                                    helperText="Please enter your Last Name."
                                />
                                {errors.lastName ? (
                                    <div style={{ fontSize: '0.75rem', color: '#f44336' }}>Error: {errors.lastName}</div>
                                ) : (<div style={{ minHeight: '0.90rem' }}> </div>)}
                            </FormControl>
                            <br />
                            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
                                <TextField
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={!!errors.email}
                                    helperText="Please enter your email."
                                />
                                {errors.email ? (
                                    <div style={{ fontSize: '0.75rem', color: '#f44336' }}>Error: {errors.email}</div>
                                ) : (<div style={{ minHeight: '0.90rem' }}> </div>)}
                            </FormControl>
                            <br />
                            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
                                <TextField
                                    label="Phone Number"
                                    name="textmask"
                                    value={values.textmask}
                                    onChange={handleChangePhoneNumber}
                                    id="formatted-text-mask-input"
                                    InputProps={{
                                        inputComponent: TextMaskCustom as any,
                                    }}
                                    helperText="Please enter your phone number."
                                    error={!!errors.phone}

                                />
                                {errors.phone ? (
                                    <div style={{ fontSize: '0.75rem', color: '#f44336' }}>Error: {errors.phone}</div>
                                ) : (<div style={{ minHeight: '0.90rem' }}> </div>)}
                            </FormControl>
                            <br />

                            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    helperText="Please enter your password."
                                    error={!!errors.password}
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
                                {errors.password ? (
                                    <div style={{ fontSize: '0.75rem', color: '#f44336' }}>Error: {errors.password}</div>
                                ) : (<div style={{ minHeight: '0.90rem' }}> </div>)}
                            </FormControl>
                            <br />

                            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
                                <TextField
                                    label="Confirm Password "
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    helperText="Please confirm your password."
                                    error={!!errors.confirmPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleConfirmPasswordToggle} edge="end">
                                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {errors.confirmPassword ? (
                                    <div style={{ fontSize: '0.75rem', color: '#f44336' }}>Error: {errors.confirmPassword}</div>
                                ) : (
                                    <div style={{ minHeight: '0.90rem' }}></div>

                                )}

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
                                    Register
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

export default RegisterPage;