'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/blog-api";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://localhost/test-blog-api";
exports.PORT = process.env.PORT || 8080;