exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://sim:cobra@ds161713.mlab.com:61713/barapp';
                       
exports.PORT = process.env.PORT || 8080;