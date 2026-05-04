Feature: Final comparison

  The comparison between a player final score and a dealer final score returns
  the expected computed values

  Scenario: Final comparison for wins
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "18"
    Then the final comparison result equals "Win"
    And the final comparison probability equals "0.01861781164971388"
    And the final comparison probability by bet multiplier equals "1=0.01861781164971388"
    And the final comparison outcomes equals "win=0.01861781164971388,push=0,lose=0"
    And the final comparison edge equals "0.01861781164971388"

  Scenario: Final comparison for pushes
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "19"
    Then the final comparison result equals "Push"
    And the final comparison probability equals "0.017812627440711677"
    And the final comparison probability by bet multiplier equals "1=0.017812627440711677"
    And the final comparison outcomes equals "win=0,push=0.017812627440711677,lose=0"
    And the final comparison edge equals "0"

  Scenario: Final comparison for losses
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" and a dealer score of "20"
    Then the final comparison result equals "Lose"
    And the final comparison probability equals "0.024057201498982644"
    And the final comparison probability by bet multiplier equals "1=0.024057201498982644"
    And the final comparison outcomes equals "win=0,push=0,lose=0.024057201498982644"
    And the final comparison edge equals "-0.024057201498982644"