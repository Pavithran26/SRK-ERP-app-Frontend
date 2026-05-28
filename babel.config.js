module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // reanimated v4 plugin is handled automatically by babel-preset-expo
  };
};
