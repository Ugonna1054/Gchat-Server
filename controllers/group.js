// const Message = require('../models/message');
// const User =   require('../models/User');
// const Group = require("../models/group")


// const group = {
//     //add new group
//     addGroup : async (req, res) => {
//         ///define req.body variables
//         const name = req.body.name;
//         const user = req.user._id;

//         //check if group has been created already by the ame user
//         let group = await Group.findOne({user, name})
        
//         if(group)  return res.send({success:true, message:"You are already a member"})

//         //init group model
//          group = new Group ({
//             name,
//             user
//         })
//         //save
//         await group.save()
//         res.send({success:true, message:"Group created successfully"})
//     },

//     //get all groups
//     getAllGroup : async (req, res) => {
//         let group = await Group.find().populate('user', 'username' )
    
//         res.send(group)
//     },

//     //get one group 
//     getSingleGroup : async (req, res) => {
//         const name = req.params.name
//         const group = await Group.find({name}).populate('user', 'username' );
//         if(!group[0]) return res.status(404).send({success:false, message:"Group not found"})
//         res.send(group)
//     },

//     //edit a group name
//     editGroup : async (req, res) => {
//         const name = req.params.name;
//         const newName = req.body.newName
//         let group = await Group.find({name})
//         //check if group exists
//         if(!group[0]) return res.status(404).send({success:false, message:"Group not found"});
//         //update group name
//         await Group.updateMany({name},{$set:{name: newName}})
//        // await group.save()
//         res.send({success:true, message:"Edited successfuly"})
//     }


// }

// module.exports = group