// backend/scripts/table.js
const { getConnection } = require('../hana'); 

const createTablesSQL = `
DROP TABLE "Photos" IF EXISTS;
DROP TABLE "Chats" IF EXISTS;
DROP TABLE "Reviews" IF EXISTS;
DROP TABLE "Bookings" IF EXISTS;
DROP TABLE "Items" IF EXISTS;
DROP TABLE "Users" IF EXISTS;

CREATE TABLE "Users" (
    "id" NVARCHAR(36) PRIMARY KEY,
    "name" NVARCHAR(100) NOT NULL,
    "email" NVARCHAR(100) UNIQUE NOT NULL,
    "password_hash" NVARCHAR(255) NOT NULL,
    "aadhaar_encrypted" NVARCHAR(255),
    "phone" NVARCHAR(20),
    "avatar_url" NVARCHAR(255),
    "karma_points" INTEGER DEFAULT 0,
    "joined_date" DATE DEFAULT CURRENT_DATE
);

CREATE TABLE "Items" (
    "id" NVARCHAR(36) PRIMARY KEY,
    "owner_id" NVARCHAR(36) NOT NULL,
    "title" NVARCHAR(100) NOT NULL,
    "description" NVARCHAR(1000),
    "category" NVARCHAR(50),
    "price" DECIMAL(10,2) NOT NULL,
    "price_unit" NVARCHAR(10) DEFAULT 'day',
    "location" NVARCHAR(255),
    "geo_location" ST_GEOMETRY,
    "is_vault_item" BOOLEAN DEFAULT FALSE,
    "vault_story" NVARCHAR(1000),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY ("owner_id") REFERENCES "Users"("id")
);

CREATE TABLE "Bookings" (
    "id" NVARCHAR(36) PRIMARY KEY,
    "user_id" NVARCHAR(36) NOT NULL,
    "item_id" NVARCHAR(36) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" NVARCHAR(20) DEFAULT 'pending',
    "payment_status" NVARCHAR(20) DEFAULT 'unpaid',
    "qr_code" NVARCHAR(255),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY ("user_id") REFERENCES "Users"("id"),
    -- FOREIGN KEY ("item_id") REFERENCES "Items"("id")
);

CREATE TABLE "Reviews" (
    "id" NVARCHAR(36) PRIMARY KEY,
    "user_id" NVARCHAR(36) NOT NULL,
    "item_id" NVARCHAR(36) NOT NULL,
    "rating" INTEGER CHECK ("rating" BETWEEN 1 AND 5),
    "comment" NVARCHAR(1000),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY ("user_id") REFERENCES "Users"("id"),
    -- FOREIGN KEY ("item_id") REFERENCES "Items"("id")
);

CREATE TABLE "Chats" (
    "id" NVARCHAR(36) PRIMARY KEY,
    "booking_id" NVARCHAR(36) NOT NULL,
    "sender_id" NVARCHAR(36) NOT NULL,
    "message_encrypted" NVARCHAR(2000),
    "sent_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY ("booking_id") REFERENCES "Bookings"("id"),
    -- FOREIGN KEY ("sender_id") REFERENCES "Users"("id")
);

CREATE TABLE "Photos" (
    "id" NVARCHAR(36) PRIMARY KEY,
    "item_id" NVARCHAR(36) NOT NULL,
    "booking_id" NVARCHAR(36),
    "url" NVARCHAR(255),
    "photo_type" NVARCHAR(20),
    "uploaded_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY ("item_id") REFERENCES "Items"("id"),
    -- FOREIGN KEY ("booking_id") REFERENCES "Bookings"("id")
);
`;

async function setupTables() {
  const conn = getConnection();
  try {
    const statements = createTablesSQL.split(';').filter(stmt => stmt.trim() !== '');
    for (const stmt of statements) {
      await new Promise((resolve, reject) => {
        conn.exec(stmt, (err) => {
          if (err) {
            console.error('Error executing statement:', err.message);
            reject(err);
          } else {
            console.log('Statement executed successfully');
            resolve();
          }
        });
      });
    }
    console.log('All tables created successfully!');
  } catch (err) {
    console.error('Table creation failed:', err);
  } finally {
    if (conn) conn.disconnect();
  }
}

setupTables();