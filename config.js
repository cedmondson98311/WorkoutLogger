exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/workout-logger-db';
exports.PORT = process.env.PORT || 8080;
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
							global.TEST_DATABASE_URL ||
							'mongodb://cory:1101762@ds157987.mlab.com:57987/workout_logger_test';