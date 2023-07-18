import React, { useEffect, useState } from "react";
import { Grid, Paper, Box, Toolbar, Button, ListItemIcon, AppBar, Typography, Tabs, Tab, TextField, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import CodeIcon from '@mui/icons-material/Code';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";
import { Navigate } from "react-router";
import { render } from "@testing-library/react";


function CodeSpace() {
    const [redirect, setRedirect] = useState(false)
    const [value, setValue] = useState();
    const [render,setRender]=useState();
    const [endpoint, setEndpoint] = useState();
    const [label, setLabel] = useState("Code");
    const [error, setError] = useState(false);
    const [patch, setPatch] = useState(false);
    const token = localStorage.getItem('jwt');
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000',
        headers: {
            'Authorization': `${token}`,
        }
    });

    function pageRerender() {

        const input = document.getElementById("codeField");
        const output = document.getElementById("outputField");
        input.value = "";
        output.value="";
        setError(false);
        setLabel("");
        setValue(null);
        setPatch(false);
        setRender(render=>{ return !render});
    }

    function GenerateHistory() {
        const [codeData, setCodeData] = useState([]);

        function handleHistory(e) {
            console.log("Clicked");
            const Data = e.target.id.split("$or");
            const input = document.getElementById("codeField");
            const output = document.getElementById("outputField");
            if (Data.length !== 3) return
            output.value="";
            setError(false);
            console.log(Data);
            setLabel(Data[0]);
            input.value = `${Data[1]}`;
            setPatch(true);
            switch (Data[2]) {
                case "c":
                    setValue(0);
                    setEndpoint("code/c");
                    break;
                case "c++":
                    setValue(1);
                    setEndpoint("code/cpp");
                    break;
                case "javascript":
                    setValue(3);
                    setEndpoint("code/js");
                    break;
                case "python":
                    setValue(2);
                    setEndpoint("code/python");
                    break;
                case "php":
                    setEndpoint("code/php");
                    setValue(4);
                    break;
                default:
                    break;
            }
        }

        function deleteHandle(e) {
            console.log(e.target.id);
            if (!e.target.id) return;
            axiosInstance.delete(`code/${e.target.id}`)
                .then((data) => {
                    pageRerender()
                })
                .catch(err => { console.log(err); });
        }

        useEffect(() => {
            axiosInstance.get("code")
                .then(data => {
                    if (data.status === 204) {
                        setCodeData(<h3>No Code Found!!!</h3>);
                    } else {
                        //console.log(data.data.userCodes);
                        const codes = data.data.userCodes;
                        codes.forEach(element => {
                            //console.log(element);
                            const code = element.code.substring(0, 20);
                            const eleID = `${element._id}$or${element.code}$or${element.format}`;
                            const listComponent =

                                <ListItem disablePadding>
                                    <ListItemButton id={eleID} onClick={handleHistory}>
                                        <ListItemText primary={element.format.toUpperCase()} secondary={code} />
                                        <Button color="error" variant="outlined"> <DeleteOutlineIcon id={element._id} onClick={deleteHandle} /> </Button>
                                    </ListItemButton>
                                </ListItem>
                                ;
                            setCodeData(prevComp => [...prevComp, listComponent]);
                        });
                        //List+=`\n</List>`
                        //console.log(codeData);
                        //setCodeData(List);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }, [render]);

        return (
            <List>
                {codeData}
            </List>
        );
    }






    function tokenCheck() {
        axiosInstance.post("auth/token")
            .then(data => { /*console.log("Token Valid");*/ })
            .catch(err => {
                setRedirect(true);
            })
    }
    useEffect(tokenCheck, [axiosInstance]);
    function handleTab(e, value) {
        const input = document.getElementById("codeField");
        const output=document.getElementById("outputField");
        output.value="";
        setError(false);
        setPatch(false);
        setValue(value);
        switch (value) {
            case 0:
                const cCode = `#include <stdio.h>\n\nint main() {\n\t// Write C code here\n\tprintf("Hello world");\n\n\treturn 0;\n\t}`;
                setEndpoint("code/c");
                input.value = `${cCode}`;
                setLabel("C");
                break;
            case 1:
                const cppCode = `#include <iostream>\n\nint main() {\n\t// Write C++ code here\n\tstd::cout << "Hello world!";\n\n\treturn 0;\n\t}
                `
                setEndpoint("code/cpp");
                input.value = `${cppCode}`;
                setLabel("C++");
                break;
            case 2:
                const pythonCode = `# Write Python 3 code and run it.\nprint("Hello world")`
                setEndpoint("code/python");
                input.value = `${pythonCode}`;
                setLabel("Python");
                break;
            case 3:
                const jsCode = `// Write, Edit and Run your Javascript code\nconsole.log("Hello World!");`
                setEndpoint("code/js");
                input.value = `${jsCode}`;
                setLabel("JavaScript");
                break;
            case 4:
                const phpCode = `//Run PHP program\necho "Hello World!";`
                setEndpoint("code/php");
                input.value = `${phpCode}`;
                setLabel("PHP")
                break;
            default:
                break;
        }
    }

    function handleLogout() {
        axiosInstance.post("auth/logout")
            .then(data => {
                localStorage.removeItem('jwt');
                setRedirect(true);
            })
            .catch(err => { console.log(err); })
    }

    function submitCode() {
        const code = document.getElementById("codeField").value;
        const argsIn = document.getElementById("argsInput").value;
        const output = document.getElementById("outputField")
        setError(false);
        let Data = null;
        console.log(code);
        console.log(patch);
        console.log(endpoint);
        if (argsIn.length > 0) {
            Data = new URLSearchParams({
                id: token,
                ucode: code,
                args: argsIn
            });
        } else {
            Data = new URLSearchParams({
                id: token,
                ucode: code
            });
        }
        if (code.length === 0 || !endpoint) return;
        if (patch === true) {
            Data = new URLSearchParams({
                id: token,
                ucode: code,
                code_id: label
            });
            output.value="Waiting for an Output";
            axiosInstance.patch(`${endpoint}`, Data)
                .then(data => {
                    const response = data.data;
                    output.value = `${response.output}`;
                })
                .catch(err => {
                    //console.log(err.response.data);
                    output.value = `${err.response.data.err}`;
                    if(output.value.length===0){
                        output.value="Runtime Error"
                    }
                    setError(true);
                });
        } else {
            axiosInstance.post(`${endpoint}`, Data)
                .then(data => {
                    const response = data.data;
                    output.value = `${response.output}`;
                })
                .catch(err => {
                    //console.log(err.response.data);
                    output.value = `${err.response.data.err}`;
                    if(output.value.length===0){
                        output.value="Runtime Error"
                    }
                    setError(true);
                });
        }
        setRender(render=>{ return !render});
    }

    return (
        <div>
            {redirect && <Navigate to="/login" replace={true} />}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ marginRight: "20px" }}>
                            <CodeIcon fontSize="medium" />CodeSpace
                        </Typography>
                        <Tabs sx={{ flexGrow: 1 }} value={value} indicatorColor="primary" onChange={handleTab}>
                            <Tab label="C" />
                            <Tab label="C++" />
                            <Tab label="Python" />
                            <Tab label="JavaScript" />
                            <Tab label="PHP" />
                        </Tabs>
                        <Button color="error" variant="contained" onClick={handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <Grid sx={{ display: "flex" }}>
                <Paper elevation={5} sx={{ height: "90vh", width: "20%", padding: "10px 5vh" }}>
                    <h3>History</h3>
                    <Paper elevation={10} sx={{ height: "70vh", width: "90%", overflow: "auto", padding: "10px 20px" }}>
                        <GenerateHistory />
                    </Paper>
                </Paper>
                <Paper elevation={5} sx={{ height: "90vh", width: "50%", padding: "10px 5vh" }}>
                    <Grid sx={{ display: "flex", flexGrow: 1 }}>
                        <h3>Code Here</h3>
                        <TextField label="Command Line Arguments" sx={{ margin: "auto 30px" }} id="argsInput" />
                        <Button color="success" variant="contained" sx={{ margin: "auto 0px auto 100px" }} onClick={submitCode}>submit</Button>
                    </Grid>
                    <TextField
                        id="codeField"
                        label={label}
                        multiline
                        rows={20}
                        defaultValue="Select a Language"
                        sx={{ width: "90%", marginTop: "20px" }}
                    />
                </Paper>
                <Paper elevation={5} sx={{ height: "90vh", width: "30%", padding: "10px 5vh" }}>
                    <h3 style={{ flexGrow: 1 }}>Output</h3>
                    <TextField
                        error={error}
                        id="outputField"
                        label={error ? "Error" : "Output"}
                        multiline
                        rows={20}
                        defaultValue="Code Output"
                        sx={{ width: "90%" }}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Paper>
            </Grid>
        </div>
    )
}
export default CodeSpace;