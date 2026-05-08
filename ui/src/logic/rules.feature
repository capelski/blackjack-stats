Feature: Rules

  The game rules determine which actions are available for each hand

  Scenario: Actionable
    Then the following actionable scenarios are considered
      | Label | Score  | Rules                                    | Is post double | Is post split | Result |
      | 22+   | 22     | {}                                       | -              | -             | false  |
      | BJ    | 21.5   | {}                                       | -              | -             | false  |
      | 21    | 21     | {}                                       | -              | -             | false  |
      | 11/21 | 21     | {}                                       | -              | -             | false  |
      | 20    | 20     | {}                                       | false          | false         | true   |
      | 20    | 20     | {"doubling": true}                       | true           | false         | false  |
      | 20    | 20     | {"splitting": true}                      | false          | true          | true   |
      | A,3   | 14     | {"splitting": true}                      | false          | true          | false  |
      | A,3   | 14     | {"splitting": true, "hitSplitAces":true} | false          | true          | true   |

  Scenario: Doubling
    Then the following doubling scenarios are considered
      | Card numbers   | Rules                                          | Is post split | Result |
      | 2              | {"doubling": false}                            | -             | false  |
      | 2              | {"doubling": true}                             | false         | true   |
      | 3              | {"doubling": true}                             | -             | false  |
      | 2              | {"doubling": true}                             | true          | false  |
      | 2              | {"doubling": true, "doublingAfterSplit": true} | true          | true   |

  Scenario: Splitting
    Then the following splitting scenarios are considered
      | Cards   | Rules                                           | Is post split | Result |
      | 8,8     | {"splitting": false}                            | -             | false  |
      | 8,8     | {"splitting": true}                             | false         | true   |
      | 8,7     | {"splitting": true}                             | -             | false  |
      | 8,8,2   | {"splitting": true}                             | -             | false  |
      | 8,8     | {"splitting": true}                             | true          | false  |

      

      