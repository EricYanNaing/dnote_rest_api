const fs = require("fs");
exports.removeImg = (filepath) => {
  fs.unlink(filepath, (err) => {
    if (err) throw err;
    console.log("Unlink Worked!!");
  });
};
