"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileService_1 = require("../services/fileService");
const router = (0, express_1.Router)();
const fileService = new fileService_1.FileService();
// Get graph data
router.get('/', async (req, res) => {
    try {
        const graphData = await fileService.getGraphData();
        res.json(graphData);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch graph data' });
    }
});
exports.default = router;
//# sourceMappingURL=graph.js.map