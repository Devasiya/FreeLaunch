const mongoose = require("mongoose");
const Client = require("../models/user"); // Import Client model
const clientData = require("./user"); // Import client data

async function insertClientData() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/sureConnect");
        console.log("MongoDB Connected");

        await Client.insertMany(clientData);
        console.log(" All clients added successfully!");
    } catch (err) {
        console.error(" Error inserting data:", err);
    } finally {
        mongoose.connection.close();
    }
}
insertClientData();