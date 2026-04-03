const fs = require("fs/promises")
const fs2 = require("fs")
const path = require("path")

const deleteCatImage=async(fileNAme)=>{
const fullPAth = path.join(process.cwd(),fileNAme);

if(fs2.existsSync(fullPAth)){await fs.unlink(fullPAth)}

}
module.exports = deleteCatImage  