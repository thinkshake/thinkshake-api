import users from './users';
import topics from './topics';
import projects from './projects';
import opinions from './opinions';
import rates from './rates';
import root from './root';

export default { users, topics, projects, opinions: opinions.router, rates, root };
