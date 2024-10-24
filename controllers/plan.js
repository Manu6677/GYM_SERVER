const express = require("express");
const mysql = require("mysql2"); // Use mysql2 for async/await support
const client = require("../connection");
const { pagination } = require("../utils");

// Function to add a plan
exports.addPlan = async (req, res) => {
  try {
    const { plan_name, duration_in_months, price, description, status } = req.body;

    if (!plan_name || !duration_in_months || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO plans (plan_name, duration_in_months, price, description, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      plan_name,
      duration_in_months,
      price,
      description || null,
      status || "active" // active|inactive
    ];

    // Execute the query
    client.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err?.message });
      }
      return res.status(201).json({ message: "Plan created successfully", planId: result.insertId, success: true });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error?.message, success: false });
  }
};

// Function to get a plan
exports.getPlan = async (req, res) => {
  try {
    const { plan_id, include_deleted, page, limit } = req.body;
    let condition = "";

    if (plan_id && include_deleted) {
      condition = 'WHERE plan_id = ?';
    } else if (plan_id) {
      condition = 'WHERE plan_id = ? AND is_deleted = 0';
    } else if (!include_deleted) {
      condition = "WHERE is_deleted = 0";
    }

    let query = `SELECT * FROM plans ${condition} ORDER BY plan_id`;
    const values = [plan_id || null];

    if (limit) {
      query = pagination(query, limit, page);
    }

    // Execute the query
    client.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err?.message });
      }
      return res.status(201).json({ message: "Plans fetched successfully", data: result, success: true });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error?.message, success: false });
  }
};

// Function to update a plan
exports.updatePlan = async (req, res) => {
  try {
    const { plan_id, plan_name, duration_in_months, price, description, status } = req.body;

    if (!plan_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updates = [];
    const values = [];

    if (plan_name) {
      updates.push("plan_name = ?");
      values.push(plan_name);
    }
    if (duration_in_months) {
      updates.push("duration_in_months = ?");
      values.push(duration_in_months);
    }
    if (price) {
      updates.push("price = ?");
      values.push(price);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }
    if (status) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `UPDATE plans SET ${updates.join(", ")} WHERE plan_id = ?`;
    values.push(plan_id);

    // Execute the query
    client.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err?.message });
      }
      return res.status(201).json({ message: "Plan updated successfully", data: result, success: true });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error?.message, success: false });
  }
};

// Function to soft delete a plan
exports.deletePlan = async (req, res) => {
  try {
    const { plan_id } = req.body;

    if (!plan_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `UPDATE plans SET is_deleted = 1 WHERE plan_id = ?`;
    const values = [plan_id];

    // Execute the query
    client.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err?.message });
      }
      return res.status(201).json({ message: "Plan removed successfully", data: result, success: true });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error?.message, success: false });
  }
};

// Function to permanently delete a plan
exports.deletePlanForcefully = async (req, res) => {
  try {
    const { plan_id } = req.body;

    if (!plan_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `DELETE FROM plans WHERE plan_id = ?`;
    const values = [plan_id];

    // Execute the query
    client.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err?.message });
      }
      return res.status(201).json({ message: "Plan removed successfully", data: result, success: true });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error?.message, success: false });
  }
};
