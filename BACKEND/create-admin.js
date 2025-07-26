require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask user for input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const validatePassword = (password) => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

const createAdmin = async () => {
  try {
    console.log('🔧 Admin User Creation Tool');
    console.log('============================\n');

    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI environment variable is not set');
      console.log('Please make sure your .env file contains MONGODB_URI');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Created: ${existingAdmin.createdAt}`);
      
      const updateChoice = await askQuestion('\nDo you want to update the admin password? (y/n): ');
      if (updateChoice.toLowerCase() === 'y' || updateChoice.toLowerCase() === 'yes') {
        await updateAdminPassword();
      } else {
        console.log('👋 Exiting without changes');
      }
      return;
    }

    // Get admin details from user
    console.log('📝 Please provide admin user details:');
    
    let username = await askQuestion('Username (default: admin): ');
    username = username.trim() || 'admin';
    
    let email = await askQuestion('Email (default: admin@hairstyles.com): ');
    email = email.trim() || 'admin@hairstyles.com';
    
    // Validate email
    if (!isValidEmail(email)) {
      console.error('❌ Invalid email format');
      process.exit(1);
    }
    
    let password = await askQuestion('Password (default: admin123): ');
    password = password.trim() || 'admin123';
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      console.log(`⚠️  Password warning: ${passwordError}`);
      const continueChoice = await askQuestion('Continue anyway? (y/n): ');
      if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
        console.log('👋 Exiting without creating admin');
        return;
      }
    }

    // Confirm creation
    console.log('\n📋 Admin User Details:');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${'*'.repeat(password.length)}`);
    
    const confirm = await askQuestion('\nCreate admin user with these details? (y/n): ');
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('👋 Exiting without creating admin');
      return;
    }

    // Create admin user
    console.log('\n🔐 Creating admin user...');
    const saltRounds = 12; // Increased security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const adminUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await adminUser.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('📊 User Details:');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Created: ${adminUser.createdAt}`);
    console.log('\n⚠️  Security Reminders:');
    console.log('   - Change the password after first login');
    console.log('   - Use a strong password in production');
    console.log('   - Keep credentials secure');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    
    if (error.code === 11000) {
      console.log('💡 This usually means the username or email already exists');
    } else if (error.name === 'ValidationError') {
      console.log('💡 Please check the input data format');
    } else if (error.name === 'MongoNetworkError') {
      console.log('💡 Please check your MongoDB connection');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    rl.close();
    process.exit(0);
  }
};

const updateAdminPassword = async () => {
  try {
    console.log('\n🔐 Updating admin password...');
    
    let newPassword = await askQuestion('New password (default: admin123): ');
    newPassword = newPassword.trim() || 'admin123';
    
    // Validate password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      console.log(`⚠️  Password warning: ${passwordError}`);
      const continueChoice = await askQuestion('Continue anyway? (y/n): ');
      if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
        console.log('👋 Exiting without updating password');
        return;
      }
    }
    
    const confirm = await askQuestion(`\nUpdate password to: ${'*'.repeat(newPassword.length)}? (y/n): `);
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('👋 Exiting without updating password');
      return;
    }
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await User.findOneAndUpdate(
      { username: 'admin' },
      { password: hashedPassword },
      { new: true }
    );
    
    console.log('\n✅ Admin password updated successfully!');
    console.log(`New password: ${newPassword}`);
    console.log('⚠️  Remember to keep the new password secure');
    
  } catch (error) {
    console.error('\n❌ Error updating password:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Exiting...');
  rl.close();
  process.exit(0);
});

createAdmin(); 