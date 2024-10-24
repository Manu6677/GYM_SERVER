const express = require("express");
const mysql = require("mysql2"); // Use mysql2 for async/await support
const bcrypt = require("bcrypt"); // For password hashing
const client = require("../connection");
const {pagination} = require("../utils");


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
      status || "active",                   //active|inactive|suspended
      hashedPassword, 
      profile_image_base64 || null,
      role || "member"                      //member|admin|trainer
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



// Function to get a user
exports.getUser = async (req, res) => {

  console.log('req in controller', req);

  try {
    const { user_id, include_deleted, page, limit } = req.body;
    var condition = "";
    // var pagination_query = ""

    if (user_id && include_deleted) {
      condition = 'where user_id = ? '
    }
    else if(user_id){
      condition = 'where user_id = ? and is_deleted = 0'
    }
    else if(include_deleted){
      condition = "";
    }
    else{
      condition = "where is_deleted = 0";
    }




    // Insert query
    var query = `
      SELECT * FROM users ${condition} ORDER BY user_id
    `;

    const values = [
      user_id||null                     
    ];

    if(limit){
      query = pagination(query,limit,page);      
    }

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
                      message: "User fetched successfully", 
                      data: result,
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





// Function to update a user
exports.updateUser = async (req, res) => {
  try {
    const { user_id, first_name, last_name, email, phone_number, address, status, profile_image_base64, role } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prepare the fields to update
    const updates = [];
    const values = [];

    if (first_name) {
      updates.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone_number) {
      updates.push("phone_number = ?");
      values.push(phone_number);
    }
    if (address) {
      updates.push("address = ?");
      values.push(address);
    }
    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
    if (profile_image_base64) {
      updates.push("profile_image_base64 = ?");
      values.push(profile_image_base64);
    }
    if (role) {
      updates.push("role = ?");
      values.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Construct the query
    const query = `
      UPDATE users 
      SET ${updates.join(", ")} 
      WHERE user_id = ?
    `;
    
    values.push(user_id); // Add user_id to the values array

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
                      message: "User updated successfully", 
                      data: result,
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


// Function to remove a user forcefully or perminatly
exports.deleteUser = async (req, res) => {

  try {
    const { user_id } = req.body;

    if (!user_id ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      update users set is_deleted = 1 WHERE user_id = ?
    `;

    const values = [
      user_id                   
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
                      message: "User removed successfully", 
                      data: result,
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



// Function to remove a user forcefully or perminatly
exports.deleteUserForcefully = async (req, res) => {

  try {
    const { user_id } = req.body;

    if (!user_id ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      DELETE FROM users WHERE user_id = ?
    `;

    const values = [
      user_id                   
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
                      message: "User removed successfully", 
                      data: result,
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
