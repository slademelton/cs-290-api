const advancedResults = (model, populate) => async (req, res, next) => {
     //initialize query
     let query;

     //copy req.query
     const reqQuery = {...req.query};
 
     //fields to exclude
     const fieldsToRemove = ["select", "sort", "page", "limit"];
 
     //loop over fieldsToRemove and delete them from reqQuery
     fieldsToRemove.forEach((param) => {
         delete reqQuery[param];
     })
     //create custom query string
     let queryStr = JSON.stringify(reqQuery);
     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => {
         return "$" + match;
     });
     //console.log(queryStr);
     query = model.find(JSON.parse(queryStr));
     
     //select fields
     if (req.query.select) {
         const fields = req.query.select.split(",").join(' ');
         query = query.select(fields);
     }
     
     //sort
     if (req.query.sort) {
         const sortBy = req.query.sort.split(',').join(' ');
         query = query.sort(sortBy);
     } else {
         query = query.sort('createdAt');
     }
 
     //pagination
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 20;
     const startIndex = (page - 1) * limit;
     const endIndex = page * limit - 1;
     const total = await model.countDocuments(JSON.parse(queryStr));
 
     query = query.skip(startIndex).limit(limit);
 
     //populate
     if (populate) {
         query = query.populate(populate);
     }

     //executing query
     const results = await query;
     
     //pagination results
     const pagination = {}
     //make sure we're not on the last page
     if (endIndex < total) {
         pagination.next = {
             page: page + 1,
             limit
         }
     }
 
     //make sure we're not on first page
     if (startIndex > 0) {
         pagination.prev = {
             page: page - 1,
             limit
         }
     }

     res.advancedResults = {
         success: true,
         count: results.length,
         pagination,
         data: results
     }

     next()

}

module.exports = advancedResults;