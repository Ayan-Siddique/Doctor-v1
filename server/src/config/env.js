import dotenv from "dotenv"


dotenv.config()


const ENV={

    PORT: process.env.PORT,

    MONGOBD_URI: process.env.MONGOBD_URI

}
 
 

export default ENV;