import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userModel from './src/models/user.models.js';
import foodModel from './src/models/food.model.js';
import bookmarkModel from './src/models/bookmark.model.js';
import bcrypt from 'bcryptjs';

dotenv.config({ path: './.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = 'copilot-save-test@example.com';
  await userModel.deleteMany({ email });

  const hashed = await bcrypt.hash('Test1234!', 10);
  const user = await userModel.create({ name: 'Save Test', email, password: hashed, contact: '1234567890' });
  const food = await foodModel.create({
    name: 'Saved Test Recipe',
    description: 'Test description',
    ingredients: ['a', 'b'],
    recipeSteps: ['step1', 'step2'],
    cuisine: 'Test',
    difficulty: 'Easy',
    privacy: 'public',
    video: { url: 'https://ik.imagekit.io/demo/img/image1.jpg', fileId: 'testfile' },
    cover: { url: 'https://ik.imagekit.io/demo/img/image1.jpg', fileId: 'coverfile' },
    foodPartner: user._id,
  });
  await bookmarkModel.deleteMany({ user: user._id });
  const bookmark = await bookmarkModel.create({ food: food._id, user: user._id });
  const loaded = await bookmarkModel.findById(bookmark._id).populate({ path: 'food', populate: { path: 'foodPartner', select: 'name username profilePicture' } });
  console.log(JSON.stringify(loaded, null, 2));
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });