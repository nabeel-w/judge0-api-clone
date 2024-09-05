require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const path = require("path");

const Code = require("../models/code");
const User = require('../models/users');

const secretKey = process.env.JWT_SECRET;
router.use(bodyParser.urlencoded({ extended: true }));

function validateInput(code){
    if(code.length===0) return res.status(400).json({message:"Code not found!"});
}

async function updateDatabase(id, code, language) {
    const userCode = new Code({
        user: id,
        code: code,
        format: language
    });
    await userCode.save();
    await User.updateOne({ _id: id }, { $push: { codes: userCode._id } });
    return userCode._id;
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader

    if (!token) {
        return res.status(401).json({ message: "User Token doesn't exist." }); // Unauthorized
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "User Token expired." }); // Forbidden
        }
        req.decoded = decoded;
        next();
    });
}

router.get('/', verifyToken, async (req, res) => {
    const { id } = req.decoded;
    const userCodes = await Code.find({ user: id });
    if (userCodes.length > 0) {
        return res.status(200).json({ userCodes });
    }
    return res.status(204).json({ message: "No code found!", status:204 });
});

router.post('/python', verifyToken, async (req, res) => {
    const { id } = req.decoded;
    const code = req.body.ucode;
    validateInput(code);
    const commandLineArgs = req.body.args || [];
    let codeOutput = '';
    let codeError = '';
    const codeId = await updateDatabase(id, code, "python");
    const pythonProcess = spawn('python3', ['-c', code, ...commandLineArgs]);
    // Listen for Python process output
    pythonProcess.stdout.on('data', (data) => {
        codeOutput += data;
    });

    // Listen for Python process errors
    pythonProcess.stderr.on('data', (data) => {
        codeError += data;
    });

    // Listen for Python process exit
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.status(200).json({ output: codeOutput, id: codeId });
        } else {
            res.status(500).json({ err: codeError, id: codeId });
        }
    });

});

router.post('/c', verifyToken, async (req, res) => {
    const { id } = req.decoded;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    let codeError = '';
    const codeId = await updateDatabase(id, code, "c");

    const cFilePath = path.join(__dirname, `./temp/${id}.c`);
    fs.writeFileSync(cFilePath, code);

    const gccProcess = spawn('gcc', [cFilePath, '-o', `${id}`, ...commandLineArgs]);

    // Listen for compilation errors
    gccProcess.stderr.on('data', (data) => {
        codeError += data;
    });

    gccProcess.on('close', (data) => {
        //console.log(data);
        if (data === 0) {
            const runProcess = spawn(path.join(__dirname, "../", `./${id}`));
            // Listen for C program output
            runProcess.stdout.on('data', (data) => {
                codeOutput += data;
            });

            // Listen for C program errors
            runProcess.stderr.on('data', (data) => {
                codeError += data;
            });

            // Listen for process exit
            runProcess.on('close', (code) => {
                // Delete the temporary file
                fs.unlinkSync(cFilePath);
                fs.unlink(path.join(__dirname, "../", `./${id}`), (err) => {
                    if (err) console.log("Error", err);
                });
                if (code === 0) {
                    res.status(200).json({ output: codeOutput, id: codeId });
                } else {
                    res.status(500).json({ err: codeError, id: codeId });
                }
            });
        }
        else {
            fs.unlinkSync(cFilePath);
            res.status(500).json({ err: codeError, id: codeId });
        }
    });
});

router.post('/cpp', verifyToken, async (req, res) => {
    const { id } = req.decoded;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    let codeError = '';
    const codeId = await updateDatabase(id, code, "c++");

    const cppFilePath =path.join(__dirname, `./temp/${id}.cpp`);
    fs.writeFileSync(cppFilePath, code);

    const gppProcess = spawn('g++', [cppFilePath, '-o', `${id}`, ...commandLineArgs]);

    // Listen for compilation errors
    gppProcess.stderr.on('data', (data) => {
        codeError += data;
    });

    gppProcess.on('close', (data) => {
        //console.log(data);
        if (data === 0) {
            const runProcess = spawn(path.join(__dirname, "../", `./${id}`));
            // Listen for C program output
            runProcess.stdout.on('data', (data) => {
                codeOutput += data;
            });

            // Listen for C program errors
            runProcess.stderr.on('data', (data) => {
                codeError += data;
            });

            // Listen for process exit
            runProcess.on('close', (code) => {
                // Delete the temporary file
                fs.unlinkSync(cppFilePath);
                fs.unlink(path.join(__dirname, "../", `./${id}`), (err) => {
                    if (err) console.log("Error", err);
                });
                if (code === 0) {
                    res.status(200).json({ output: codeOutput, id: codeId });
                } else {
                    res.status(500).json({ err: codeError, id: codeId });
                }
            });
        }
        else {
            fs.unlinkSync(cppFilePath);
            res.status(500).json({ err: codeError, id: codeId });
        }
    });
})

router.post("/js", verifyToken, async (req, res) => {
    const { id } = req.decoded;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    let codeError = '';
    const codeId = await updateDatabase(id, code, "javascript");

    const jsProcess = spawn("node", ["-e", code, ...commandLineArgs]);

    // Listen for JS process errors
    jsProcess.stdout.on('data', (data) => {
        codeOutput += data;
    });

    // Listen for JS process errors
    jsProcess.stderr.on('data', (data) => {
        codeError += data;
    });

    // Listen for JS process exit
    jsProcess.on('close', (code) => {
        if (code === 0) {
            res.status(200).json({ output: codeOutput, id: codeId });
        } else {
            //console.log(codeError);
            res.status(500).json({ err: codeError, id: codeId });
        }
    });
});

router.post("/php", verifyToken, async (req, res) => {
    const { id } = req.decoded;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    const codeId = await updateDatabase(id, code, "php");

    const phpProcess = spawn("php", ["-r", `${code}`, ...commandLineArgs]);

    // Listen for PHP process errors
    phpProcess.stdout.on('data', (data) => {
        codeOutput += data;
    });

    // Listen for PHP process exit
    phpProcess.on('close', (code) => {
        if (code === 0) {
            res.status(200).json({ output: codeOutput, id: codeId });
        } else {
            res.status(500).json({ err: codeOutput, id: codeId });
        }
    });
})

router.patch("/python", verifyToken, async (req, res) => {
    const id = req.body.code_id;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    let codeError = '';

    const updated = await Code.updateOne({ _id: id }, { code: code });
    if (updated.modifiedCount === 0&&updated.matchedCount===0) {
        res.status(404).json({ message: "Object not found!" })
    } else {
        const pythonProcess = spawn('python3', ['-c', code, ...commandLineArgs]);
        // Listen for Python process output
        pythonProcess.stdout.on('data', (data) => {
            codeOutput += data;
        });

        // Listen for Python process errors
        pythonProcess.stderr.on('data', (data) => {
            codeError += data;
        });

        // Listen for Python process exit
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                res.status(200).json({ output: codeOutput });
            } else {
                res.status(500).json({ err: codeError });
            }
        });
    }
});
router.patch("/c", verifyToken, async (req, res) => {
    const id = req.body.code_id;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    let codeError = '';

    const updated = await Code.updateOne({ _id: id }, { code: code });
    if (updated.modifiedCount === 0&&updated.matchedCount===0) {
        res.status(404).json({ message: "Object not found!" })
    } else {
        const cFilePath = path.join(__dirname,`./temp/${id}.c`);
        fs.writeFileSync(cFilePath, code);

        const gccProcess = spawn('gcc', [cFilePath, '-o', `${id}`, ...commandLineArgs]);

        // Listen for compilation errors
        gccProcess.stderr.on('data', (data) => {
            codeError += data;
        });

        gccProcess.on('close', (data) => {
            //console.log(data);
            if (data === 0) {
                const runProcess = spawn(path.join(__dirname, "../", `./${id}`));
                // Listen for C program output
                runProcess.stdout.on('data', (data) => {
                    codeOutput += data;
                });

                // Listen for C program errors
                runProcess.stderr.on('data', (data) => {
                    codeError += data;
                });

                // Listen for process exit
                runProcess.on('close', (code) => {
                    // Delete the temporary file
                    fs.unlinkSync(cFilePath)
                    .then(()=>{console.log("success");})
                    .catch((err) => {
                        if (err) console.log("Error", err);
                    });
                    fs.unlink(path.join(__dirname, "../", `./${id}`))
                    .then(()=>{console.log("success");})
                    .catch((err) => {
                        if (err) console.log("Error", err);
                    });
                    if (code === 0) {
                        res.status(200).json({ output: codeOutput });
                    } else {
                        res.status(500).json({ err: codeError });
                    }
                });
            }
            else {
                fs.unlinkSync(cFilePath);
                res.status(500).json({ err: codeError });
            }
        });
    }
});
router.patch("/cpp", verifyToken, async (req, res) => {
    const id = req.body.code_id;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    let codeError = '';

    const updated = await Code.updateOne({ _id: id }, { code: code });
    console.log(updated);
    if (updated.modifiedCount === 0&&updated.matchedCount===0) {
        res.status(404).json({ message: "Object not found!" })
    }
    else {
        const cppFilePath = path.join(__dirname,`./temp/${id}.cpp`);
        fs.writeFileSync(cppFilePath, code);

        const gppProcess = spawn('g++', [cppFilePath, '-o', `${id}`, ...commandLineArgs]);

        // Listen for compilation errors
        gppProcess.stderr.on('data', (data) => {
            codeError += data;
        });

        gppProcess.on('close', (data) => {
            //console.log(data);
            if (data === 0) {
                const runProcess = spawn(path.join(__dirname, "../",`./${id}`));
                // Listen for C program output
                runProcess.stdout.on('data', (data) => {
                    codeOutput += data;
                });

                // Listen for C program errors
                runProcess.stderr.on('data', (data) => {
                    codeError += data;
                });

                // Listen for process exit
                runProcess.on('close', (code) => {
                    // Delete the temporary file
                    fs.unlinkSync(cppFilePath);
                    fs.unlink(path.join(__dirname, "../",`./${id}`), (err) => {
                        if (err) console.log("Error", err);
                    });
                    if (code === 0) {
                        res.status(200).json({ output: codeOutput });
                    } else {
                        res.status(500).json({ err: codeError });
                    }
                });
            }
            else {
                fs.unlinkSync(cppFilePath);
                res.status(500).json({ err: codeError });
            }
        });
    }
});
router.patch("/js", verifyToken, async (req, res) => {
    const id = req.body.code_id;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    let codeError = '';

    const updated = await Code.updateOne({ _id: id }, { code: code });
    if (updated.modifiedCount === 0&&updated.matchedCount===0) {
        res.status(404).json({ message: "Object not found!" })
    } else {
        const jsProcess = spawn("node", ["-e", code, ...commandLineArgs]);

        // Listen for JS process errors
        jsProcess.stdout.on('data', (data) => {
            codeOutput += data;
        });

        // Listen for JS process errors
        jsProcess.stderr.on('data', (data) => {
            codeError += data;
        });

        // Listen for JS process exit
        jsProcess.on('close', (code) => {
            if (code === 0) {
                res.status(200).json({ output: codeOutput });
            } else {
                //console.log(codeError);
                res.status(500).json({ err: codeError });
            }
        });
    }

});
router.patch("/php", verifyToken, async (req, res) => {
    const id = req.body.code_id;
    const code = req.body.ucode;
    const commandLineArgs = req.body.args || [];
    validateInput(code);
    let codeOutput = '';
    let codeError = '';

    const updated = await Code.updateOne({ _id: id }, { code: code });
    if (updated.modifiedCount === 0&&updated.matchedCount===0) {
        res.status(404).json({ message: "Object not found!" })
    } else {
        const phpProcess = spawn("php", ["-r", `${code}`, ...commandLineArgs]);

        // Listen for PHP process errors
        phpProcess.stdout.on('data', (data) => {
            codeOutput += data;
        });

        // Listen for PHP process exit
        phpProcess.on('close', (code) => {
            if (code === 0) {
                res.status(200).json({ output: codeOutput });
            } else {
                res.status(500).json({ err: codeOutput });
            }
        });
    }

});

router.delete("/:id", verifyToken, async (req, res) => {
    const { id } = req.decoded;
    const code_id = req.params.id;

    //console.log(code_id);

    const deleted = await Code.deleteOne({ _id: code_id });
    if (deleted.deletedCount === 0&&updated.matchedCount===0) {
        await User.updateOne({ _id: id }, { $pull: { codes: code_id } });
        res.status(404).json({ message: "Object Not Found!" });
    } else {
        res.status(200).json({ message: "Record deleted. " });
    }
});

module.exports = router;