// Dynamic Expo config layered on top of app.json.
//
// When EXPO_BASE_URL is set (e.g. in the GitHub Pages deploy workflow), the web
// export is served from a sub-path like "/Mobileapp/". Locally the variable is
// unset, so `expo start` / `expo start --web` behave exactly as before.
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL;
  if (baseUrl) {
    config.experiments = { ...(config.experiments || {}), baseUrl };
  }
  return config;
};
