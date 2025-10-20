import express from 'express';

import ia from '../services/ia.js';

const router = express.Router();


router.post('/', ia);


export default router;