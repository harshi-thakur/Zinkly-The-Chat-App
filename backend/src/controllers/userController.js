import { getUserById, getUsersByName, updateUserById } from "../queries/user.js";

export const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (e) {
        console.log("Error in getUser controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}


export const searchUser = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        if (!searchQuery) {
            return res.status(400).json({ error: "Search query is required" });
        }
        const users = await getUsersByName(searchQuery,page);
        if (users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }
        return res.status(200).json(users);
    } catch (e) {
        console.log("Error in searchUser controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, profilePicture ,fullname} = req.body;

        if (!username && !email && !profilePicture&&!fullname) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const updatedUser = await updateUserById(userId, { username, email, profilePicture ,fullname});
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (e) {
        console.log("Error in updateUser controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}