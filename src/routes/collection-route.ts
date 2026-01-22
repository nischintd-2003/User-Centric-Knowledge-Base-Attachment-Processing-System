import { Router } from 'express';
import {
  createCollection,
  deleteCollection,
  getUserCollection,
  updateCollection,
} from '../controllers/collection-controller';

const collectionRoute = Router();

collectionRoute.post('/', createCollection);
collectionRoute.get('/', getUserCollection);
collectionRoute.put('/:collectionId', updateCollection);
collectionRoute.delete('/:collectionId', deleteCollection);

export default collectionRoute;
