# Awards Service


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

This project is open-sourced under [MIT license](./LICENSE).

This REST API service provides for awards, points, redemptions, badges....

This service is designed to support generic workflows for awards, badges and multiple gamification scenarios.
Following is a brief overview of the internals of the service.

Service contains 3 main areas.
1. Schema Engine - A generic workflow engine
2. Domain specific facts data handler
3. Exernal event handling module - currently listening on webhook to defined types of events.

### Schema Engine

The schema engine is the most generic module in the service and can be re-used as a module in multiple scenarios.

1. Client admins/moderators can define the workflow to mimic the logic of gamification.
2. Each workflow is represented by workflow schema.
3. Each schema can be constructed as series of nodes connected by paths. Each node represents a state/step in the workflow.
4. A node can be of type 'Execution node' or 'Rule Node'.
5. A 'Execution node' contains an action which represents some action to be performed as a step in the workflow. After execution of the action, the control moves to the next node in the schema.
6. A 'Rule node' contains a rule to be executed and results in the passing or failing status. Based on the rule execution status, the workflow can change the paths in the workflow.
7. Each rule contains a tree structure of conditions to be evaluated against the set of facts. 
8. These facts could be 
  - input parameters fed to the schema at the start or 
  - can be result/output of the execution of the action of the 'execution node'. 
9. The conditions which are part of the rule can have following types of the operators - 
  - composite (e.g. AND, OR, XOR)
  - logical (e.g. EQUALS, NOT_EQUALS, GREATER_THAN,....and many more)
10. The schema is instanced for a given context. For example, in case of the awards or gamifications, the context can be a participant or a participant group.
11. Based on the use-cases, the schema instances can be of 2 types.
  - *Long running schema instance* : This schema instance can wait on a current node for certain types of events or rule to be satisfied before proceeding ahead. An example of this could be an emergency healthcare protocol or certain award point schema which is dependent on multiple events.
  - *Event based schema instance* : For every type of the supported event, a new instance of the schema is generated and executed by the engine. An example of this could be consistency badge awards schema.

### Domain Specific Facts Data Handler

This module basically pulls in the facts from the event as well as facts database and feeds them into schema instance. The interfaces are quite generic but the implementation of this is governed by the entities defined in the facts database. The facts database is generally populated and maintained by the client app/service.

### Exernal event handling module

This is a typical webhook which listens to the predefined events (which can be of custom types and created by the schema content moderators). The supported event will trigger execution of the schema instance for the given context. So each event payload must contain context identifier (which is generally called as 'reference id') apart from other event specific parameters. This reference id could be an 'id' of the participant in the exernal client system.

Please have a look at the following schematic depicting the internals of the awards service.

  <img src="./logical-architecture-layout.png" width="1300">

__We encourage forking and welcome contributions to this code base.__
