const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
// The above code defines a Mongoose schema for a User model with fields for name, email, and password.
// The email field is set to be unique, ensuring no two users can have the same email address.