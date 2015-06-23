var util = require('util');
var PG = require('pg');
/**
 * datasource or postgres function error object
 * @typedef {Object} PostgresError
 * @property {String} code
 * @property {String} message
 */

var Postgres = function (host, dbname, user, pass) {
    var pg = this;
    /**
     * function runs given psql query
     * @function
     * @param {Object} q
     * @param {String} q.name
     * @param {String} q.text
     * @param {Array<any>} q.values
     * @param {function(err<{PostgresError}>,rs<{Object}>)} callback
     */
    this.postgresQuery = function (q, callback) {
        PG.connect('postgres://' + user + ':' + pass + '@' + host + ':5432/' + dbname, function (err, db, done) {
            if (err) {
                done();
                if (callback) {
                    callback(err);
                }
                console.log(host, dbname, user, pass, 'storage error:\n', err);
                return;
            }
            db.query(
                q,
                function (err, rs) {
                    done();
                    if (callback) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        callback(null, rs.rows);
                    }
                }
            );
        });
    }
    return this;
}


module.exports = Postgres;