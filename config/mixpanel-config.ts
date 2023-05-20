import "dotenv/config";
import mixpanel from 'mixpanel';

const mixpanelInstance = mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN as string);

export default mixpanelInstance;
