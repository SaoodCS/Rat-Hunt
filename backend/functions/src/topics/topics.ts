import type AppTypes from '../../../../shared/app/types/AppTypes';
import { animals } from './animals/animals';
import { countries } from './countries/countries';
import { food } from './food/food';
import { clothing } from './itemOfClothing/itemOfClothing';
import { movies } from './movies/movies';
import { music } from './musicGenres/musicGenres';
import { singers } from './singers/singers';
import { sports } from './sports/sports';

export const topics: AppTypes.Topic[] = [
   animals,
   countries,
   movies,
   sports,
   food,
   music,
   clothing,
   singers,
];
