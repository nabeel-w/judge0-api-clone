import React, { useState } from "react";
import { Grid, Paper, Avatar, TextField, Button, Typography, InputAdornment, IconButton  } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import validator from 'validator';
import { LockOpen, AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "axios";

function LoginPage() {
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: '20px auto' }
    const iconStyle = { backgroundColor: "white", color: "#000", border: "2px solid black" }
    const inputStyle={margin:'20px 0px'};
    const btnStyle={margin:'10px 0px 15px 0px'};

    const [showPassword,setShowPassword]=useState(false);
    const [emailError,setEmailError]=useState(false);
    const [passError,setPassError]=useState(false);
    const [redirect,setRedirect]=useState(false);
    const [dis,setDis]=useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {event.preventDefault();};

    const token = localStorage.getItem('jwt');
    if(token){
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Authorization': `${token}`,
            }
        });
        axiosInstance.post("auth/token")
        .then(()=>{setRedirect(true)})
        .catch(err=>{console.log(err);})
    }

    const handleLogin=()=>{
        const email=document.getElementById("emailInput").value;
        const pass=document.getElementById("passInput").value;
        setEmailError(false);
        setPassError(false);
        setDis(true);
        if(email.length===0||pass.length===0){
            setDis(false);
            return;
        }
        if(!validator.isEmail(email)){
            setEmailError(true);
            return;
        }
        const data= new URLSearchParams({
            'email':email,
            'password':pass
        });
        axios.post("http://localhost:5000/auth/log",data)
        .then(res=>{
            const jwtToken=res.data.token;
            localStorage.setItem('jwt', jwtToken);
            setDis(false);
            setRedirect(true);
        })
        .catch((err)=>{
            console.log(err.response.status);
            const status=err.response.status;
            if(status===404){
                setEmailError(true);
                setPassError(true);
                setDis(false);
                return;
            }
            else if(status===401){
                setPassError(true);
                setDis(false);
                return;
            }
        });

        
    }

    return (
        <div>
            {redirect && <Navigate to="/" replace={true} />}
            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={iconStyle}><LockOpen /></Avatar>
                        <h2 style={{margin:"40px 0px 45px 0px"}}>Sign In</h2>
                        <TextField id="emailInput" label={emailError?"Incorrect Email":"Email"} variant="outlined" fullWidth required type="email" placeholder="example@gmail.com" style={inputStyle}
                        error={emailError}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccountCircle />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField id="passInput" label={passError?"Wrong Password":"Password"} variant="outlined" fullWidth required placeholder="Password" style={inputStyle}
                        type={showPassword ? 'text' : 'password'}
                        error={passError}
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button variant="outlined" fullWidth style={btnStyle} onClick={handleLogin} disabled={dis}>Sign In</Button>
                        <Typography >
                            Do you Have an Account?  <Link to="/register">Sign Up</Link>
                        </Typography>
                    </Grid>
                </Paper>
            </Grid>
        </div>
    );
}

export default LoginPage;