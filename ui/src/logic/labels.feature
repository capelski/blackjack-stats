Feature: Labels

  Different aspects of a hand are considered when generating its label

  Scenario: Labels generation
    Then the following label scenarios are considered
      | Case name                    | Cards   | Rules                                            | Is post split | Label       |
      | Hard score                   | 9,8     | {}                                               | false         | 17          |
      | Soft score                   | 9,A     | {}                                               | false         | 10/20       |
      | Bust                         | 9,8,7   | {}                                               | false         | 22+         |
      | Blackjack                    | J,A     | {}                                               | false         | BJ          |
      | Pair                         | 9,9     | {}                                               | false         | 18          |
      | Pair split                   | 9,9     | {"splitting": true}                              | false         | 9,9         |
      | Hard score (post split)      | 9,8     | {"splitting": true}                              | true          | 17 (S)      |
      | Soft score (post split)      | 9,A     | {"splitting": true}                              | true          | 10/20 (S)   |
      | Bust (post split)            | 9,8,7   | {"splitting": true}                              | true          | 22+ (S)     |
      | Blackjack (post split)       | J,A     | {"splitting": true}                              | true          | 11/21 (S)   |
      | Blackjack (BJ after split)   | J,A     | {"splitting": true, "blackjackAfterSplit": true} | true          | BJ (S)      |
      | Pair (post split)            | 9,9     | {"splitting": true}                              | true          | 18 (S)      |
      | Soft score (post aces split) | A,9     | {"splitting": true}                              | true          | 10/20 (S,A) |
      | Blackjack (post aces split)  | A,J     | {"splitting": true}                              | true          | 11/21 (S,A) |
      | Blackjack (BJ after split)   | A,J     | {"splitting": true, "blackjackAfterSplit": true} | true          | BJ (S,A)    |
      | Pair (post aces split)       | A,A     | {"splitting": true}                              | true          | 2/12 (S,A)  |
      | Hard score (hit split aces)  | A,9,5   | {"splitting": true, "hitSplitAces": true}        | true          | 15 (S)      |
      | Soft score (hit split aces)  | A,9     | {"splitting": true, "hitSplitAces": true}        | true          | 10/20 (S)   |
      | Bust (hit split aces)        | A,9,7,5 | {"splitting": true, "hitSplitAces": true}        | true          | 22+ (S)     |
      | Blackjack (hit split aces)   | A,J     | {"splitting": true, "hitSplitAces": true}        | true          | 11/21 (S)   |
      | Pair (hit split aces)        | A,A     | {"splitting": true, "hitSplitAces": true}        | true          | 2/12 (S)    |
