import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const { ObjectId } = Types;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Transgender"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 10,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: {
        original: String,
        thumbnail: String,
      },
      default: null,
    },
    phone: {
      type: Number,
      sparse: true,
      trim: true,
    },
    phoneExtension: {
      type: String,
      default: null,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      trim: true,
      minlength: [4, "Password must be at least 4 characters long"],
      maxlength: [20, "Password characters not allowed more than 20"],
      required: [true, "Please provide a password"],
      select: false,
    },
    resetPassword: {
      type: {
        token: String,
        expiresAt: Date,
      },
    },
    organizationSpecificData: {
      type: Array,
      default: [],
    },
    country: {
      type: String,
      trim: true,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    stateCode: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    cityCode: {
      type: String,
      trim: true,
    },
    lastActive: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { getters: true, virtuals: false },
    toObject: { getters: true, virtuals: false },
  }
);

userSchema.plugin(aggregatePaginate);

userSchema.pre("save", function save(next: VoidFunction) {
  const user = this;

  if (!user.password || !user.isModified("password")) return next();

  // encrypt password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  user.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.statics.getUser = async function (
  id: Types.ObjectId,
  organization: Types.ObjectId,
  pipelineOnly = false
) {
  const permissions = [
    {
      $unwind: "$organizationSpecificData",
    },
    {
      $match: {
        "organizationSpecificData.organization": new ObjectId(organization),
        "organizationSpecificData.isActive": true,
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "organizationSpecificData.role",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $unwind: "$role",
    },
    {
      $lookup: {
        from: "permissions",
        localField: "role.permissions",
        foreignField: "_id",
        as: "role.permissions",
      },
    },
    {
      $addFields: {
        roleName: "$role.name",
        roleType: "$role.type",
        permissions: "$role.permissions",
      },
    },
  ];

  const aggregate = [
    {
      $match: id
        ? {
            _id: new ObjectId(id),
          }
        : {},
    },
    ...permissions,
    {
      $addFields: {
        id: "$_id",
        fullName: { $concat: ["$firstName", " ", "$lastName"] },
      },
    },
  ];

  if (pipelineOnly) return aggregate;

  const [users] = await this.aggregate(aggregate);
  return users;
};

const Users = mongoose.model("users", userSchema);

module.exports = { Users };
