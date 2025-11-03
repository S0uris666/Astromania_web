import mongoose from "mongoose";
import slugify from "slugify";

const PerfilImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    public_id: { type: String, required: true, trim: true },
    alt: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const SocialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      unique: true,
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    profesion: { type: String, trim: true, default: "" },
    especializacion: { type: String, trim: true, default: "" },

    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingresa un email válido",
      ],
    },
    publicEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      validate: {
        validator: (value) =>
          !value ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
        message: "Por favor ingresa un email público válido",
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [8, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "superuser"],
      default: "user",
    },
    address: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" }, //
    country: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: [PerfilImageSchema],
    links: [SocialLinkSchema],
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
      validate: {
        validator: (value) => !value || value.length >= 10,
        message: "La descripcion debe tener al menos 10 caracteres",
      },
    },
     status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("username") || !this.slug) {
    const base = this.username || this.email || "";
    this.slug = slugify(base, { lower: true, strict: true });
  }
  next();
});

userSchema.index({ slug: 1 }, { unique: true, sparse: true });
userSchema.index({ status: 1, role: 1 });

export default mongoose.model("User", userSchema);

