import mongoose from "mongoose";

const paymentEmailLogSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "sending", "sent", "failed"],
      default: "pending",
    },
    attempts: { type: Number, default: 0 },
    sentAt: { type: Date },
    errorMessage: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.PaymentEmailLog ||
  mongoose.model("PaymentEmailLog", paymentEmailLogSchema);
