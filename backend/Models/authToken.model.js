const mongoose = require("mongoose");

const authTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["passwordReset", "emailVerification"],
            required: true,
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

module.exports = AuthToken;
