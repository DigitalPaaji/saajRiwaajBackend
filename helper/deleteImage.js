const fs = require("fs/promises")
const fs2 = require("fs")
const path = require("path")

const deleteImage=async(fileNAme)=>{
const fullPAth = path.join(process.cwd(),"uploads",fileNAme);

if(fs2.existsSync(fullPAth)){await fs.unlink(fullPAth)}

}
module.exports =deleteImage  