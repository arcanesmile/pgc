import mongoose , {Schema} from 'mongoose';

const UserSchema = new Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, },
    name: { type: String },
    role: { type: String, default: 'user', }
});

export default mongoose.models.User ||
mongoose.models('User',UserSchema);