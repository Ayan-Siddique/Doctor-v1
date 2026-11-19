import app from "./src/app.js";
import ENV from "./src/config/env.js"
import connectDB from "./src/bootstrap/db.js";

const PORT = ENV.PORT || 3000;

app.listen(PORT,async()=>{

    await connectDB()
    console.log(`server is running on - http://localhost:${PORT}`)
})

