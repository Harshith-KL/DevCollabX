const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tokenHash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },

        isRevoked: {
            type: Boolean,
            default: false,
        },
        
        userAgent: {
            type: String,
            default: "",
        },

        ipAddress: {
            type: String,
            default: "",
        },        
    },

    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);