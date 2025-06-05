/**
 * Helper to retrieve and validate userId from headers
 */
exports.getUserId = (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        res.status(400).json({ error: 'User ID header missing' });
        return null;
    }
    return userId;
}
