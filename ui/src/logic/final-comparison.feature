Feature: Final comparison

  The comparison between a player final score and a dealer final score returns
  the expected computed values

  Scenario: Final comparison for wins
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probability equals "0.01861781164971388"
    And the final comparison outcomes equal "win: 1=1 / push: 1=0 / lose: 1=0"

  Scenario: Final comparison for pushes
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "19"
    Then the final comparison result equals "push"
    And the final comparison probability equals "0.017812627440711677"
    And the final comparison outcomes equal "win: 1=0 / push: 1=1 / lose: 1=0"

  Scenario: Final comparison for losses
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "20"
    Then the final comparison result equals "lose"
    And the final comparison probability equals "0.024057201498982644"
    And the final comparison outcomes equal "win: 1=0 / push: 1=0 / lose: 1=1"

  Scenario: Final comparison for blackjack
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "BJ" and a dealer score of "20"
    Then the final comparison result equals "win"
    And the final comparison probability equals "0.008532659119984349"
    And the final comparison outcomes equal "win: 1.5=1 / push: 1.5=0 / lose: 1.5=0"

  Scenario: Final comparison with doubling
    Given doubling is allowed
    And a player hand resolver for optimal actions
    When getting the final comparison of a player score of "19" and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probability equals "0.015912575132117697"
    And the final comparison outcomes equal "win: 1=0.9401470755662793,2=0.059852924433720936 / push: 1=0,2=0 / lose: 1=0,2=0"

  Scenario: Final comparison with splitting
    Given splitting is allowed
    And a player hand resolver for optimal actions
    When getting the final comparison of a player score of "19" and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probability equals "0.016180928039809205"
    And the final comparison outcomes equal "win: 1=0.9904209739350871,2=0.009579026064913003 / push: 1=0,2=0 / lose: 1=0,2=0"
