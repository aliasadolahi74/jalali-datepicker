# [1.2.0](https://github.com/aliasadolahi74/jalali-datepicker/compare/v1.1.0...v1.2.0) (2026-08-07)


### Features

* make grid metrics themeable and compose outside+weekend days ([#14](https://github.com/aliasadolahi74/jalali-datepicker/issues/14)) ([3efedbe](https://github.com/aliasadolahi74/jalali-datepicker/commit/3efedbe99d05fc1ea84c6564b27015ac3c4bd99b)), closes [#f9a4a4](https://github.com/aliasadolahi74/jalali-datepicker/issues/f9a4a4)

# [1.1.0](https://github.com/aliasadolahi74/jalali-datepicker/compare/v1.0.1...v1.1.0) (2026-08-07)


### Features

* export a presentational <JalaliMonthGrid> ([#12](https://github.com/aliasadolahi74/jalali-datepicker/issues/12)) ([0db8549](https://github.com/aliasadolahi74/jalali-datepicker/commit/0db8549d662fd8b4c0f17e8d04dea148bdbcf330))

## [1.0.1](https://github.com/aliasadolahi74/jalali-datepicker/compare/v1.0.0...v1.0.1) (2026-08-07)


### Bug Fixes

* dist does not load in plain Node (ESM and CJS both broken in 1.0.0) ([#11](https://github.com/aliasadolahi74/jalali-datepicker/issues/11)) ([f070aba](https://github.com/aliasadolahi74/jalali-datepicker/commit/f070abaf74505c808680fbf5cf28e0bda03ddbff))

# [1.0.0](https://github.com/aliasadolahi74/jalali-datepicker/compare/v0.1.2...v1.0.0) (2026-08-07)


### Features

* event badges, range holiday rules, Jalali parsing — 1.0.0 ([#9](https://github.com/aliasadolahi74/jalali-datepicker/issues/9)) ([c5a5ec4](https://github.com/aliasadolahi74/jalali-datepicker/commit/c5a5ec49e33be30f9102e9428e6b72e2955162e5))


### BREAKING CHANGES

* `HolidayRule` is now a three-member union — code that switches
exhaustively on `rule.type` must handle `'range'`. `DayMeta` gains required
`matched` and `categories` fields, and `EnrichedDayCell` gains
`holidayCategories` and `events`, so anything constructing these objects by hand
must supply them. Reading them is unaffected. This release also promotes the
package out of 0.x: the shapes documented under "API stability" in the README
are now covered by semver.

## [0.1.2](https://github.com/aliasadolahi74/jalali-datepicker/compare/v0.1.1...v0.1.2) (2026-06-25)


### Bug Fixes

* republish to refresh package metadata and README ([#8](https://github.com/aliasadolahi74/jalali-datepicker/issues/8)) ([5632a3e](https://github.com/aliasadolahi74/jalali-datepicker/commit/5632a3e81e7c666d0b76a5d4f5d81275cf68ac9e))

## [0.1.1](https://github.com/aliasadolahi74/jalali-datepicker/compare/v0.1.0...v0.1.1) (2026-06-24)


### Bug Fixes

* set lang="fa" on calendar root for correct screen-reader pronunciation ([#3](https://github.com/aliasadolahi74/jalali-datepicker/issues/3)) ([47e2686](https://github.com/aliasadolahi74/jalali-datepicker/commit/47e268628cf34007bef04f5e41ce87df141a682b))
