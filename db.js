import mongoose from "mongoose";


const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI)
  .then(()=> console.log("Database connection successfully"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// async function run() {
//   try {
//     await mongoose.connect(DB_URI);
//     console.info("Database connection successful ");
//   } finally {
//     await mongoose.disconnect();
//   }
// }
// run().catch((error) => console.error(error));