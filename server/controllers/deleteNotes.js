const Notes = require('../models/notes');

const deleteNotes = async(req,res)=>{
    try {  
        const {id} = req.params;
        const del = await Notes.findOneAndDelete(
            {email:req.body.email},
            {$pull:{[`data.${id}`]:id}}
        );
        // if(!del) return res.status(401).send({message:"Document Not Found"});
        console.log(del);
        res.status(200).send({message:"Deleted Successfully"});
    } catch (err) {
        res.status(500).send({message:"Error Deleting"});
    }
}

module.exports={deleteNotes}