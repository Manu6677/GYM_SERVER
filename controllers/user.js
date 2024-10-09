const express = require("express");
const mysql = require("mysql2"); // Use mysql2 for async/await support
const bcrypt = require("bcrypt"); // For password hashing
const client = require("../connection");


// Function to add a user
exports.addUser = async (req, res) => {

  console.log('req in controller', req);

  try {
    const { first_name, last_name, email, phone_number, address, status, password, profile_image_base64, role } = req.body;

    if (!first_name || !email || !phone_number || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert query
    const query = `
      INSERT INTO users (first_name, last_name, email, phone_number, address, status, password, profile_image_base64, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      first_name,
      last_name || null, 
      email,
      phone_number,
      address || null, 
      status || "active", 
      hashedPassword, 
      profile_image_base64 || null,
      role || "member" 
    ];

    // Execute the query
    client.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res
                .status(500)
                .json({ 
                        success : false,
                        message: err?.message 
                      });
      }
      return res
              .status(201)
              .json({ 
                      message: "User created successfully", 
                      userId: result.insertId,
                      success : true
                    });
    });
  } catch (error) {
    console.error(error);
    return res
            .status(500)
            .json({ 
                    message: error?.message,
                    success:false
                  });
  }
};
