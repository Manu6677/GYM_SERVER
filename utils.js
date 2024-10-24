const { query } = require("express")

var utils = {}

utils.pagination = (query, limit, page = 1) =>{
    if(limit&&limit!=0){
        return query += ` limit ${limit} offset ${(page - 1) * limit}`
    }
}


module.exports = utils;