Feature: Rules

  The game rules determine which actions are available for each hand

  Scenario: Actionable
    Then the following actionable scenarios are considered
      | Category             | Score | Rules                 | Result |
      | -                    | 22    | {}                    | false  |
      | -                    | 21.5  | {}                    | false  |
      | -                    | 21    | {}                    | false  |
      | Initial pair         | 20    | {}                    | true   |
      | Splittable pair      | 20    | {}                    | true   |
      | One split pair       | 20    | {}                    | true   |
      | Two splits pair      | 20    | {}                    | true   |
      | Three splits pair    | 20    | {}                    | true   |
      | 3+ cards             | 20    | {}                    | true   |
      | One split pair (S1A) | 20    | {}                    | false  |
      | One split pair (S1A) | 14    | {"hitSplitAces":true} | true   |
      | Post double hand     | 20    | {}                    | false  |

  Scenario: Doubling
    Then the following doubling scenarios are considered
      | Category             | Score  | Rules                                                                 | Result |
      | -                    | -      | {"doubling": "disabled"}                                              | false  |
      | -                    | 12     | {"doubling": "9-to-11"}                                               | false  |
      | Initial pair         | 10     | {"doubling": "9-to-11"}                                               | true   |
      | Initial pair         | -      | {"doubling": "all"}                                                   | true   |
      | Splittable pair      | 10     | {"doubling": "9-to-11"}                                               | true   |
      | Splittable pair      | -      | {"doubling": "all"}                                                   | true   |
      | One split pair       | -      | {"doubling": "all"}                                                   | false  |
      | One split pair       | -      | {"doubling": "all", "doublingAfterSplit": true}                       | true   |
      | Two splits pair      | -      | {"doubling": "all", "doublingAfterSplit": true}                       | true   |
      | Three splits pair    | -      | {"doubling": "all", "doublingAfterSplit": true}                       | true   |
      | One split pair (S1A) | -      | {"doubling": "all"}                                                   | false  |
      | One split pair (S1A) | -      | {"doubling": "all", "doublingAfterSplit": true}                       | false  |
      | One split pair (S1A) | -      | {"doubling": "all", "doublingAfterSplit": true, "hitSplitAces": true} | true   |

  Scenario: Splitting
    Then the following splitting scenarios are considered
      | Cards | Split count | Rules              | Result |
      | 8,8   | 0           | {}                 | false  |
      | 8,8   | 0           | {"splitting": "1"} | true   |
      | 8,7   | 0           | {"splitting": "1"} | false  |
      | 8,8,2 | 0           | {"splitting": "1"} | false  |
      | 8,8   | 1           | {"splitting": "1"} | false  |
      | 8,8   | 1           | {"splitting": "2"} | true   |
      | 8,8   | 2           | {"splitting": "2"} | false  |
      | 8,8   | 2           | {"splitting": "3"} | true   |
      | 8,8   | 3           | {"splitting": "3"} | false  |
