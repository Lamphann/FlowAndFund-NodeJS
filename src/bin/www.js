#!/usr/bin/env node

const app = require("../app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started successfully");
    console.log(`Running at: http://localhost:${PORT}`);
});