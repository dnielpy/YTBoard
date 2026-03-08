module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['frontend', 'web', 'docs', 'backend', 'repo', 'ui']],
  },
};
