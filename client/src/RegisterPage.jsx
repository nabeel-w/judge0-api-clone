import React, { useState } from "react";
import { Grid, Paper, Avatar, TextField, Button, Typography, InputAdornment, IconButton  } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import validator from 'validator';
import { LockOpen, AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "axios";

function RegisterPage(){
    const paperStyle = { padding: 20, height: '75vh', width: 280, margin: '20px auto' }
    const iconStyle = { backgroundColor: "white", color: "#000", border: "2px solid black" }
    const inputStyle={margin:'20px 0px'};
    const btnStyle={margin:'10px 0px 15px 0px'};

    const [showPassword,setShowPassword]=useState(false);
    const [showCPassword,setShowCPassword]=useState(false);
    const [emailError,setEmailError]=useState(false);
    const [passError,setPassError]=useState(false);
    const [redirect,setRedirect]=useState(false);
    const [dis,setDis]=useState(false);
    const [emailLabel,setEmailLabel]=useState("Email");
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowCPassword = () => setShowCPassword((show) => !show);
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

    const handleSignup=()=>{
        const name=document.getElementById("nameInput").value;
        const email=document.getElementById("emailInput").value;
        const pass=document.getElementById("passInput").value;
        const cpass=document.getElementById("cpassInput").value;
        setEmailError(false);
        setPassError(false);
        setDis(true);
        if(email.length===0||pass.length===0||name.length===0){
            setDis(false);
            return;
        }
        if(!validator.isEmail(email)){
            setEmailError(true);
            setEmailLabel("Email Not Valid!")
            setDis(false);
            return;
        }
        else if(pass!==cpass){
            setPassError(true);
            setDis(false);
            return;
        }
        const data= new URLSearchParams({
            'uname':name,
            'email':email,
            'password':pass
        });
        axios.post("http://localhost:5000/auth/new",data)
        .then(res=>{
            const jwtToken=res.data.token;
            localStorage.setItem('jwt', jwtToken);
            setDis(false);
            setRedirect(true);
        })
        .catch((err)=>{
            console.log(err.response.status);
            const status=err.response.status;
            if(status===409){
                setEmailError(true);
                setEmailLabel("Email Already in use")
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
                        <h2 style={{margin:"10px 0px 10px 0px"}}>Sign Up</h2>
                        <TextField id="nameInput" label="Name" variant="outlined" fullWidth required type="text" placeholder="example@gmail.com" style={inputStyle}/>
                        <TextField id="emailInput" label={emailLabel} variant="outlined" fullWidth required type="email" placeholder="example@gmail.com" style={inputStyle}
                        error={emailError}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccountCircle />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField id="passInput" label={passError?"Passwords Didn't Match":"Password"} variant="outlined" fullWidth required placeholder="Password" style={inputStyle}
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
                        <TextField id="cpassInput" label={passError?"Passwords Didn't Match":"Confirm Password"} variant="outlined" fullWidth required placeholder="Password" style={inputStyle}
                        type={showCPassword ? 'text' : 'password'}
                        error={passError}
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowCPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showCPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button variant="outlined" fullWidth style={btnStyle} onClick={handleSignup} disabled={dis}>Sign Up</Button>
                        <Typography >
                            Already Have an Account?  <Link to="/login">Sign In</Link>
                        </Typography>
                    </Grid>
                </Paper>
            </Grid>
        </div>
    );
}

export default RegisterPage;