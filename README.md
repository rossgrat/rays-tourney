# Whist Tournament Maker

## Deployment
### Initial Setup
Add the angular-cli-ghpages package
`ng add angular-cli-ghpages

Useful resources:
[Github Pages](https://pages.github.com/)
[Angular Deployment](https://angular.dev/tools/cli/deployment#automatic-deployment-with-the-cli)
[angular-cli-gh-pages Package](https://www.npmjs.com/package/angular-cli-ghpages)

### Deploying to production
`ng deploy --base-href=/wtm/`

Visit ross.grattafiori.dev/wtm to verify deployment

## Resouces
[Durango Bill's Whist Starting Blocks](https://www.durangobill.com/BridgeCyclicSolutions.html)
[Richard Devenzia's Whist Tables](https://www.devenezia.com/downloads/round-robin/index.html)

## Future Ideas
* Multipeer connectivity and scoring
    * Users connect to a game, similar to kahoot then enter their scores after each game, app automatically keeps track of a leaderboard
    * Scoring algorithm needs to support uneven amount of games played
* Monolithic scoring, user selects winning team for each table each round, program keeps track of indvididual scores
    * Separate leaderboard tab
