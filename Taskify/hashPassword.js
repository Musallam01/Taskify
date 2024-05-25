const bcrypt = require('bcrypt');
const password = "mohammed2024";

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(`Hashed password: ${hashedPassword}`);
};

hashPassword(password);
