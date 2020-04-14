const { Message, validateMessage, PrivateMessage, validatePrivateMessage } = require('../models/message');
const { Group } = require("../models/Group");

const message = {
    //post new group message
    postMessage: async (req, res) => {
        //check for validation errors
        const { error } = validateMessage(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //define req.body variables
        const group = req.body.group;
        const messages = req.body.message;
        const sender = req.user._id;

        //ensure that the poster is a member of the group
        let group_ = await Group.findById(group);
        if (!group_) return res.status(404).send({ success: false, message: "Group not found" });
        let group__ = group_.members.find(item => item.member == sender);
        if (!group__) return res.status(404).send({ success: false, message: "You must be a member to post messages" });

        //init message model
        const message = new Message({
            group,
            message: messages,
            sender
        })

        await message.save()

        //update group's last message to the new message
        group_.lastMessage.sender = req.user._id,
        group_.lastMessage.message = messages,
            
        await group_.save()
        //res.send({message:group_.lastMessage.message})
        res.send({ success: true, message: "successfully posted" })
    },

    //post new Private message
    postMessagePrivate: async (req, res) => {
        //check for validation errors
        const { error } = validatePrivateMessage(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //define req.body variables
        const receiver = req.body.receiver;
        const messages = req.body.message;
        const sender = req.user._id;

        if(receiver == req.user._id) return res.status(400).send({ success: false, message: "You cant send message to yourself" });

        //init message model
        const message = new PrivateMessage({
            receiver,
            message: messages,
            sender
        })

        await message.save()
            
        res.send({ success: true, message: "successfully posted" })
    },
    // get all messages
    getMessage: async (req, res) => {
        const message = await Message.find().populate("sender group", "_id username name")
        res.send(message)
    },

    //get messages from a group 
    getSingleMessage: async (req, res) => {
        const id = req.params.id;
        const sender = req.user._id;

        //ensure that the poster is a member of the group
        let group_ = await Group.findById(id);
        if (!group_) return res.status(404).send({ success: false, message: "Group not found" });
        group_ = group_.members.find(item => item.member == sender);
        if (!group_) return res.status(404).send({ success: false, message: "You must be a member to see messages" });

        const message = await Message.find({ group: id }).populate('sender group', '_id username name');
        if (!message[0]) return res.status(404).send({ success: false, message: "No message found for this group" });

        res.send(message)
    },

    //get private message  between two people
    getPrivateMessage: async (req, res) => {
        const sender = req.user._id;
        const receiver = req.params.receiver
        const message = await PrivateMessage.find({ $and: [{ $or: [{ sender }, { sender: receiver }] }, { $or: [{ receiver: sender }, { receiver }] }] }).populate("sender", "username _id").sort("createdAt")
        res.send(message)
    },

    //get all private messages  between two people
    getPrivateMessageAll: async (req, res) => {
        let id = req.user._id
        const message = await PrivateMessage.find({$or: [{ receiver: id }, { sender: id }]}).populate("sender  receiver", "username _id").sort("createdAt")
        
        
        res.send(message)
    }
}

module.exports = message