const http = require("http");
const fs = require("fs");
const path = require("path");

const dataUsers = async (url) => {
    const data = await fetch(url).then((res) => res.json());
    fs.writeFileSync("./fakeDB/users.json", JSON.stringify(data));
    return data;
};

const server = http.createServer(async (req, res) => {
    const url = new URL(
        `http://127.0.0.1:3003${req.url}`,
        "http://127.0.0.1:3003"
    );
    const { searchParams } = url;
    if (Boolean(searchParams.get("hello"))) {
        const header = {
            "Content-type": "text/plain",
        };
        response(res, 200, "OK", header, searchParams.get("hello"), "NAME");
        return;
    } else if (
        searchParams.has("hello") &&
        !Boolean(searchParams.get("hello"))
    ) {
        const header = {
            "Content-type": "text/plain",
        };
        response(res, 200, "OK", header, "enter a name!", "NAME");
    }
    switch (req.url) {
        case "/users": {
            const header = {
                "Content-type": "application/json",
            };
            const data = await dataUsers(
                "https://gist.githubusercontent.com/rubenCodeforges/ef1f0ce6a055bbb985c0848d8b0c04d5/raw/f91e3d0d2a6d14233fb8fd70c893821effbac5a6/users.json"
            );
            response(res, 200, "OK", header, JSON.stringify(data), "JSON");
            break;
        }
        case "/": {
            const header = {
                "Content-type": "text/plain",
            };
            response(res, 200, "OK", header, "world!");
            break;
        }
        default: {
            const header = {
                "Content-type": "text/plain",
            };
            response(res, 500, "FALSE", header, "", "NONE");
            break;
        }
    }
});

const response = (res, status, statusMessage, header, text, type) => {
    res.status = status;
    res.statusMessage = statusMessage;
    res.header = JSON.stringify(header);
    switch (type) {
        case "JSON":
            res.write(text);
            res.end();
            break;
        case "NONE":
            res.end();
            break;
        case "NAME":
            res.end(`Hello, ${text}!`);
            break;
    }
};

server.listen(3003);
