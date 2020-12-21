// eslint-disable-next-line import/no-extraneous-dependencies
const propertiesOrder = require('stylelint-config-recess-order').rules['order/properties-order'];

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-sass-guidelines'],
  plugins: [
    'stylelint-scss',
    'stylelint-order',
  ],
  rules: {
    // linebreaks: 'unix', // see https://github.com/stylelint/stylelint/issues/5087

    'order/properties-alphabetical-order': null,
    'max-nesting-depth': 3,

    'at-rule-semicolon-space-before': 'never',
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['import'],
      },
    ],

    'declaration-property-value-disallowed-list': null,

    // Included here instead of inside 'extends' for greater flexibility should it be needed
    'order/properties-order': [
      propertiesOrder.map((group) => ({ properties: group.properties })),
    ],
  },
};
