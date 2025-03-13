const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aashishshrivastava2015:c4j2L1qyLL6mvT52@namatenode.ok7jm.mongodb.net/devTinder?retryWrites=true&w=majority&appName=NamateNode"
  );
};

module.exports = connectDB


