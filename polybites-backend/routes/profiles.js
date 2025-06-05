import express from 'express';
import { getProfiles, getProfileById, getProfileByAuthId, createProfile } from '../controllers/profileController.js';

const router = express.Router();

router.get('/', getProfiles);
router.get('/auth/:auth_id', getProfileByAuthId);
router.get('/:id', getProfileById);
router.post('/', createProfile);

export default router;