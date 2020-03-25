const Message = require('../models/message');

const message = {
    //post new message
    postMessage: async (req, res) => {
        //define req.body variables
        const group = req.body.group;
        const messages = req.body.message;
        const user = req.user._id
        
       //init message model
        const message = new Message({
            group,
            message:messages,
            user
        })

        await message.save()
        res.send({success:true, message:"successfully posted"})
    },

    // get all messages
    getMessage : async (req, res) => {
        const message = await Message.find().populate("user", "username")
        res.send(message)
    },

    //get messages from a group 
    getSingleMessage: async (req, res) => {
        const name = req.params.name;
        const message = await Message.find({group:name}).populate('user', 'username')
        if(!message[0]) return res.status(404).send({success:false, message:"No message found for this group"})
        res.send(message)
    },

    //get private message  between two people
    getPrivateMessage : async (req, res) => {
        const sender = req.params.sender;
        const receiver = req.params.receiver
        const message = await Message.find({$and:[{$or:[{user:sender}, {user:receiver}]}, {$or:[{group:sender}, {group:receiver}]}]}).populate("user", "username _id").sort("createdAt")
        if(!message[0]) return res.send({success:true, message:"No messages yet"})
        res.send (message)
    }
}

module.exports = message