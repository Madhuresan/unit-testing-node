---
title: Designing the core logic module
---
Given that our core logic involves managing interactions between Hubot, Slack,
and GitHub, we will need a more complex object than a plain callback function.

### Functions

The specific functions required by the application flow are:

- **Configure** the application with rules and API parameters
- **Listen** for `reaction_added` events from the **Slack API** via **Hubot**
- **Match** events against the rules
- **Fetch** the reactions to a message using the **Slack API**
- **Create** an issue for a message using the **GitHub API**
- **Add** a reaction to a message using the **Slack API**
- **Log** the action taken for matching events

### Entities

There are six entities interacting, four **internal** and two **external**:

- The **internal** configuration object
- The **internal** rule objects comprising part of the configuration
- The **external** Slack service
- The **external** GitHub service
- The **internal** logging mechanism
- The **internal** application logic sitting between Hubot, Slack, and Github

### Object composition

Rather than writing a single object to do all six things, we will use
multiple objects responsible for each entity:

- A `Config` object to define the configuration schema and validate the
  configuration upon startup
- A `Rule` object to encapsulate the matching behavior
- A `SlackClient` object to encapsulate the
  [slack-client](https://www.npmjs.com/package/slack-client) object
  passed into the application as `robot.adapter.client` and the
  Slack Web API requests
- A `GitHubClient` object that will handle the GitHub API requests
- A `Log` object that will provide a thin abstraction over `console.log`
- A `Middleware` object composed of all of the above objects to manage the
  flow of event matching and API requests

In this way, we're able to build the complete application via the
_composition_ of multiple distinct objects. This makes it easier to test each
individual application function thoroughly, while making the overall structure
and flow of the application easier to understand.
