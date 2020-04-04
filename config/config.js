const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'guest',
    host: 'hexbird.mx',
    database: 'hb_nights',
    password: '8B5ru9m^',
    port: 5432
});

const secret = 'b1rd5-51ng1n6'

module.exports={
    pool,
    secret
}