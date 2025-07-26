// backend/scripts/table.js - Fixed for SAP HANA Cloud
require("dotenv").config();
const hana = require("@sap/hana-client");

// Connection configuration
const connParams = {
  serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
  uid: process.env.HANA_USER,
  pwd: process.env.HANA_PASSWORD,
  encrypt: "true",
  connectTimeout: 30000,
};

const tables = [
  {
    name: 'Users',
    sql: `CREATE COLUMN TABLE Users (
      id NVARCHAR(36) PRIMARY KEY,
      name NVARCHAR(100) NOT NULL,
      email NVARCHAR(100) NOT NULL,
      password_hash NVARCHAR(255) NOT NULL,
      aadhaar_encrypted NVARCHAR(255),
      phone NVARCHAR(20),
      avatar_url NVARCHAR(255),
      karma_points INTEGER DEFAULT 0,
      joined_date DATE
    )`
  },
  {
    name: 'Items',
    sql: `CREATE COLUMN TABLE Items (
      id NVARCHAR(36) PRIMARY KEY,
      owner_id NVARCHAR(36) NOT NULL,
      title NVARCHAR(100) NOT NULL,
      description NVARCHAR(1000),
      category NVARCHAR(50),
      price DECIMAL(10,2) NOT NULL,
      price_unit NVARCHAR(10) DEFAULT 'day',
      location NVARCHAR(255),
      geo_location NVARCHAR(255),
      is_vault_item INTEGER DEFAULT 0,
      vault_story NVARCHAR(1000),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'Bookings',
    sql: `CREATE COLUMN TABLE Bookings (
      id NVARCHAR(36) PRIMARY KEY,
      user_id NVARCHAR(36) NOT NULL,
      item_id NVARCHAR(36) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status NVARCHAR(20) DEFAULT 'pending',
      payment_status NVARCHAR(20) DEFAULT 'unpaid',
      qr_code NVARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'Reviews',
    sql: `CREATE COLUMN TABLE Reviews (
      id NVARCHAR(36) PRIMARY KEY,
      user_id NVARCHAR(36) NOT NULL,
      item_id NVARCHAR(36) NOT NULL,
      rating INTEGER,
      comment NVARCHAR(1000),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'Chats',
    sql: `CREATE COLUMN TABLE Chats (
      id NVARCHAR(36) PRIMARY KEY,
      booking_id NVARCHAR(36) NOT NULL,
      sender_id NVARCHAR(36) NOT NULL,
      message_encrypted NVARCHAR(2000),
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'Photos',
    sql: `CREATE COLUMN TABLE Photos (
      id NVARCHAR(36) PRIMARY KEY,
      item_id NVARCHAR(36) NOT NULL,
      booking_id NVARCHAR(36),
      url NVARCHAR(255),
      photo_type NVARCHAR(20),
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  }
];

// Add constraints separately after table creation
const constraints = [
  {
    name: 'Users_email_unique',
    sql: `ALTER TABLE Users ADD CONSTRAINT Users_email_unique UNIQUE (email)`
  },
  {
    name: 'Items_owner_fk',
    sql: `ALTER TABLE Items ADD CONSTRAINT Items_owner_fk FOREIGN KEY (owner_id) REFERENCES Users(id)`
  },
  {
    name: 'Bookings_user_fk',
    sql: `ALTER TABLE Bookings ADD CONSTRAINT Bookings_user_fk FOREIGN KEY (user_id) REFERENCES Users(id)`
  },
  {
    name: 'Bookings_item_fk',
    sql: `ALTER TABLE Bookings ADD CONSTRAINT Bookings_item_fk FOREIGN KEY (item_id) REFERENCES Items(id)`
  },
  {
    name: 'Reviews_user_fk',
    sql: `ALTER TABLE Reviews ADD CONSTRAINT Reviews_user_fk FOREIGN KEY (user_id) REFERENCES Users(id)`
  },
  {
    name: 'Reviews_item_fk',
    sql: `ALTER TABLE Reviews ADD CONSTRAINT Reviews_item_fk FOREIGN KEY (item_id) REFERENCES Items(id)`
  },
  {
    name: 'Chats_booking_fk',
    sql: `ALTER TABLE Chats ADD CONSTRAINT Chats_booking_fk FOREIGN KEY (booking_id) REFERENCES Bookings(id)`
  },
  {
    name: 'Chats_sender_fk',
    sql: `ALTER TABLE Chats ADD CONSTRAINT Chats_sender_fk FOREIGN KEY (sender_id) REFERENCES Users(id)`
  },
  {
    name: 'Photos_item_fk',
    sql: `ALTER TABLE Photos ADD CONSTRAINT Photos_item_fk FOREIGN KEY (item_id) REFERENCES Items(id)`
  },
  {
    name: 'Photos_booking_fk',
    sql: `ALTER TABLE Photos ADD CONSTRAINT Photos_booking_fk FOREIGN KEY (booking_id) REFERENCES Bookings(id)`
  }
];

function createConnection() {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    
    console.log("🔍 Attempting connection with params:", connParams);
    
    conn.connect(connParams, (err) => {
      if (err) {
        console.error("❌ Connection failed:", err.message);
        reject(err);
      } else {
        console.log("✅ Connected to SAP HANA Cloud");
        resolve(conn);
      }
    });
  });
}

function executeSQL(conn, sql, description) {
  return new Promise((resolve, reject) => {
    conn.exec(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function setupTables() {
  let conn;
  
  try {
    console.log('🔍 Starting table creation process...');
    
    // Create connection
    conn = await createConnection();
    
    // Create tables first
    for (const table of tables) {
      try {
        console.log(`\n📋 Creating table: ${table.name}`);
        
        await executeSQL(conn, table.sql, `Creating table ${table.name}`);
        console.log(`✅ Table ${table.name} created successfully`);
        
        // Small delay between table creations
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (err) {
        if (err.message.includes('already exists') || 
            err.message.includes('duplicate') ||
            err.sqlState === '42S01' ||
            err.code === -1) {
          console.log(`✅ Table ${table.name} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating ${table.name}:`);
          console.error(`   SQL State: ${err.sqlState}`);
          console.error(`   Error Code: ${err.code}`);
          console.error(`   Message: ${err.message}`);
          
          // Log the SQL for debugging
          console.error(`   SQL: ${table.sql.substring(0, 100)}...`);
          
          // Continue with other tables instead of stopping
          continue;
        }
      }
    }
    
    console.log('\n🔗 Adding constraints...');
    
    // Add constraints
    for (const constraint of constraints) {
      try {
        console.log(`Adding constraint: ${constraint.name}`);
        
        await executeSQL(conn, constraint.sql, `Adding constraint ${constraint.name}`);
        console.log(`✅ Constraint ${constraint.name} added successfully`);
        
        // Small delay between constraints
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (err) {
        if (err.message.includes('already exists') || 
            err.message.includes('duplicate') ||
            err.sqlState === '42S11') {
          console.log(`✅ Constraint ${constraint.name} already exists, skipping...`);
        } else {
          console.error(`⚠️  Warning: Could not add constraint ${constraint.name}: ${err.message}`);
          // Continue with other constraints
          continue;
        }
      }
    }
    
    console.log('\n🎉 Table creation process completed successfully!');
    
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    if (err.stack) {
      console.error('Stack trace:', err.stack);
    }
  } finally {
    if (conn) {
      try {
        conn.disconnect();
        console.log('🔌 Connection closed');
      } catch (disconnectErr) {
        console.error('Warning: Error closing connection:', disconnectErr.message);
      }
    }
  }
}

setupTables();