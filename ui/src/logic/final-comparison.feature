Feature: Final comparison

  The comparison between a player final score and a dealer final score returns
  the expected computed values

  Scenario: Final comparison for wins
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probability equals "0.01861781164971388"

  Scenario: Final comparison for pushes
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "19"
    Then the final comparison result equals "push"
    And the final comparison probability equals "0.017812627440711677"

  Scenario: Final comparison for losses
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "20"
    Then the final comparison result equals "lose"
    And the final comparison probability equals "0.024057201498982644"

  Scenario: Final comparison for blackjack
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "BJ" and a dealer score of "20"
    Then the final comparison result equals "win"
    And the final comparison probability equals "0.008532659119984349"

  Scenario: Final comparison with doubling
    Given doubling is allowed
    And a player hand resolver for optimal actions
    When getting the final comparison of a player score of "19" and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probability equals "0.0159125751321177"

  Scenario: Final comparison with splitting
    Given splitting is allowed
    And a player hand resolver for optimal actions
    When getting the final comparison of a player score of "19" and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probability equals "0.016180928039809205"
