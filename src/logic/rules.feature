Feature: Rules

  The game rules determine which actions are available for each hand

  Scenario: Actionable
    Then the following actionable scenarios are considered
      | Category          | Score | Rules                 | Result |
      | -                 | 22    | {}                    | false  |
      | -                 | 21.5  | {}                    | false  |
      | -                 | 21    | {}                    | false  |
      | Initial pair      | 20    | {}                    | true   |
      | Splittable pair   | 20    | {}                    | true   |
      | Post split pair   | 20    | {}                    | true   |
      | 3+ cards          | 20    | {}                    | true   |
      | Post A-split pair | 20    | {}                    | false  |
      | Post A-split pair | 14    | {"hitSplitAces":true} | true   |
      | Post double hand  | 20    | {}                    | false  |

  Scenario: Doubling
    Then the following doubling scenarios are considered
      | Category          | Score  | Rules                                                                 | Result |
      | -                 | -      | {"doubling": "disabled"}                                              | false  |
      | -                 | 12     | {"doubling": "9-to-11"}                                               | false  |
      | Initial pair      | 10     | {"doubling": "9-to-11"}                                               | true   |
      | Initial pair      | -      | {"doubling": "all"}                                                   | true   |
      | Splittable pair   | 10     | {"doubling": "9-to-11"}                                               | true   |
      | Splittable pair   | -      | {"doubling": "all"}                                                   | true   |
      | Post split pair   | -      | {"doubling": "all"}                                                   | false  |
      | Post split pair   | -      | {"doubling": "all", "doublingAfterSplit": true}                       | true   |
      | Post A-split pair | -      | {"doubling": "all"}                                                   | false  |
      | Post A-split pair | -      | {"doubling": "all", "doublingAfterSplit": true}                       | false  |
      | Post A-split pair | -      | {"doubling": "all", "doublingAfterSplit": true, "hitSplitAces": true} | true   |

  Scenario: Splitting
    Then the following splitting scenarios are considered
      | Cards | Is post split | Rules               | Result |
      | 8,8   | -             | {}                  | false  |
      | 8,8   | false         | {"splitting": true} | true   |
      | 8,7   | false         | {"splitting": true} | false  |
      | 8,8,2 | false         | {"splitting": true} | false  |
      | -     | true          | {"splitting": true} | false  |
