import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    airtableUserId: { type: String, index: true },
    email: { type: String },
    name: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenType: { type: String },
    tokenExpiresIn: { type: Number },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);


