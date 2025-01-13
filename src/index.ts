import app from './app'
import { logger } from './config/logger';

app.set('NODE_ENV', process.env.NODE_ENV || 'development');

app.listen(app.get('PORT'), () => {
    logger.info(`Server is running on http://localhost:${app.get('PORT')}`);
});
