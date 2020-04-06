
const { Group, validateGroup } = require("../models/Groupss")


const group = {
    //create new group
    createGroup: async (req, res) => {
        //check for validation errors
        const { error } = validateGroup(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //define req.body variables
        const name = req.body.name;
        const creator = req.user._id;
        let members = req.body.members;

        //add the creator as part of the group members
        members.unshift({
            member: creator,
            details: creator,
            role: "admin"
        })

        //check if the group has atleast one other member
        if (members.length <= 1) return res.status(404).send({ success: false, message: "Select atleast one Group member" });

        //init group model
        const group_ = new Group({
            name,
            creator,
            members
        })

        //save
        await group_.save()
        res.send({ success: true, message: "Group created successfully" })
    },

    //Add users to an existing group by group admin
    joinGroup: async (req, res) => {
        //define request parameters
        const id = req.params.id

        //Check if group with the given id exists
        const group_ = await Group.findById(id)
        if (!group_) return res.status(404).send({ success: false, message: "Group not found" });

        //check if the "adder" is an admin
        let member = group_.members.find(item => item.member == req.user._id);
        if (!member || member.role !== "admin") return res.status(400).send({ success: false, message: "Only admins can add members" });

        //Check if user is already a member of the group
        let members = req.body.members;
        let invalid = [];
        members.forEach(value => {
            member = group_.members.find(item => item.member == value.member);
            if (member) invalid.push(member)
        })

        //throw err if any of the users is already a group member
        if (invalid[0]) return res.status(400).send({ success: false, message: "One or more contacts are already group members", member });

        //add member(s) to the group
        members.forEach(item => {
            group_.members.push({
                member: item.member,
                details:item.member
            })
        })

        //check if members are more than 100
        if (group_.members.length > 100) return res.status(400).send({ success: false, message: "Maximum group members reached" });

        //save
        await group_.save()
        res.send({ success: true, message: "Added successfully" })
    },

    //get all groups connected to the signed in user
    getAllGroup: async (req, res) => {
        let id = req.user._id
        let group = await Group.find().populate('members.details creator lastMessage.sender', "username email name about -_id").select("-members._id -lastMessage._id")


        let groups_ = group.filter(item => {
            let members = item.members;
            let newMember = members.find(value => {
                return value.member == id
            })
            return newMember
        })

        res.send(groups_)
    },

    //get one group 
    getSingleGroup: async (req, res) => {
        const name = req.params.name
        const group = await Group.find({ name }).populate('user', 'username');
        if (!group[0]) return res.status(404).send({ success: false, message: "Group not found" })
        res.send(group)
    },

    //edit a group name
    editGroup: async (req, res) => {
        const name = req.params.name;
        const newName = req.body.newName
        let group = await Group.find({ name })
        //check if group exists
        if (!group[0]) return res.status(404).send({ success: false, message: "Group not found" });
        //update group name
        await Group.updateMany({ name }, { $set: { name: newName } })
        // await group.save()
        res.send({ success: true, message: "Edited successfuly" })
    }


}

module.exports = group