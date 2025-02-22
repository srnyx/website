const fs = require("fs");
const path = require("path");

/**
 * Display a file's contents
 *
 * @param   res         response
 * @param   file        file path
 * @param   callable    function to call on file data
 * @param   error       error handler
 */
function handle(res, file, callable, error) {
    fs.readFile(path.join(__dirname, "../public/" + file), (err, data) => {
        if (err) {
            if (error) return error(err);
            return console.error(err);
        }
        if (callable) data = callable(data);
        res.set('Content-Type', 'text/html')
        res.send(data);
    })
}
module.exports.handle = handle;
