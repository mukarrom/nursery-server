// Run this in MongoDB shell or via mongosh
// mongosh "your-connection-string" fix-indexes.js

use nursery;

// Drop old indexes
db.users.dropIndex("phone_1");
db.users.dropIndex("email_1");

// Create new sparse indexes
db.users.createIndex({ phone: 1 }, { unique: true, sparse: true });
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });

print("Indexes recreated successfully!");
