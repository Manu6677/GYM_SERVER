const express = require("express");
const mysql = require("mysql2"); // Use mysql2 for async/await support
const client = require("../connection");


// Function to add a subscription
exports.addSubscription = async (req, res) => {

  try {
    const { user_id, plan_id, subscription_from, subscription_to } = req.body;

    if (!user_id || !plan_id || !subscription_from || !subscription_to) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert query
    const query = `
      INSERT INTO subscriptions (user_id, plan_id, subscription_from, subscription_to)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      user_id, 
      plan_id, 
      subscription_from, 
      subscription_to                 
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
                      message: "Subscription created successfully", 
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
exports.getSubscription = async (req, res) => {

  try {
    const { id } = req.body;
    var condition = "";

    if (id ) {
      condition = 'where id = ?'
    }


    // Insert query
    const query = `
      SELECT * FROM subscriptions ${condition} ORDER BY id
    `;

    const values = [
      id||null                     
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
                      message: "subscriptions fetched successfully", 
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



// Function to remove a user
exports.deleteSubscription = async (req, res) => {

  try {
    const { id } = req.body;

    if (!id ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      DELETE FROM subscriptions WHERE id = ?
    `;

    const values = [
      id                   
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
                      message: "subscriptions removed successfully", 
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
exports.updateSubscription = async (req, res) => {
  try {
    const { id, user_id, plan_id, subscription_from, subscription_to  } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prepare the fields to update
    const updates = [];
    const values = [];

    if (user_id) {
      updates.push("user_id = ?");
      values.push(user_id);
    }
    if (plan_id) {
      updates.push("plan_id = ?");
      values.push(plan_id);
    }
    if (subscription_from) {
      updates.push("subscription_from = ?");
      values.push(subscription_from);
    }
    if (subscription_to) {
      updates.push("subscription_to = ?");
      values.push(subscription_to);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Construct the query
    const query = `
      UPDATE subscriptions 
      SET ${updates.join(", ")} 
      WHERE id = ?
    `;
    
    values.push(id); // Add user_id to the values array

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
                      message: "subscriptions updated successfully", 
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
