const fs = require("fs/promises")
const path = require("path")

export const deleteImage=async(fileNAme)=>{
const fullPAth = path.join(process.cwd(),"uploads",fileNAme);
 await fs.unlink(fullPAth)
}