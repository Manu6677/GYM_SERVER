const { query } = require("express")

var utils = {}

utils.pagination = (query, limit, page = 1) =>{
    if(limit&&limit!=0){
        return query += ` limit ${limit} offset ${(page - 1) * limit}`
    }
}

// Handle database errors
utils.handleDatabaseError = (err, res) => {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Database error"
    });
  };
  
  // Build update query dynamically
  utils.buildUpdateQuery = (table, fields, idField, idValue) => {
    const updates = [];
    const values = [];
  
    Object.keys(fields).forEach(field => {
      if (fields[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(fields[field]);
      }
    });
  
    if (updates.length === 0) {
      throw new Error("No fields to update");
    }
  
    const query = `UPDATE ${table} SET ${updates.join(", ")} WHERE ${idField} = ?`;
    values.push(idValue);
  
    return { query, values };
  };
  


module.exports = utils;