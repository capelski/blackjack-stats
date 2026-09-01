Feature: Final comparison

  The comparison between a player final score and a dealer final score returns
  the expected computed values

  Scenario: Final comparison for wins
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" with bet multiplier 1 and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probabilities by bet multiplier are "1=0.01861781164971388"

  Scenario: Final comparison for pushes
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" with bet multiplier 1 and a dealer score of "19"
    Then the final comparison result equals "push"
    And the final comparison probabilities by bet multiplier are "1=0.017812627440711677"

  Scenario: Final comparison for losses
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "19" with bet multiplier 1 and a dealer score of "20"
    Then the final comparison result equals "lose"
    And the final comparison probabilities by bet multiplier are "1=0.024057201498982644"

  Scenario: Final comparison for blackjack
    Given a player hand resolver with a stand threshold of 17
    When getting the final comparison of a player score of "BJ" with bet multiplier 1.5 and a dealer score of "20"
    Then the final comparison result equals "win"
    And the final comparison probabilities by bet multiplier are "1.5=0.008532659119984349"

  Scenario: Final comparison with doubling
    Given doubling is allowed
    And a player hand resolver for optimal actions
    When getting the final comparison of a player score of "19" with bet multiplier 1 and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probabilities by bet multiplier are "1=0.014960160975189154"
    When getting the final comparison of a player score of "19" with bet multiplier 2 and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probabilities by bet multiplier are "2=0.0009524141569285474"

  Scenario: Final comparison with splitting
    Given splitting is allowed
    And a player hand resolver for optimal actions
    When getting the final comparison of a player score of "19" with bet multiplier 1 and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probabilities by bet multiplier are "1=0.016025930508361392"
    When getting the final comparison of a player score of "19" with bet multiplier 2 and a dealer score of "18"
    Then the final comparison result equals "win"
    And the final comparison probabilities by bet multiplier are "2=0.00015499753144781404"

  Scenario: Final comparison for surrender
    Given surrendering is allowed
    And a player hand resolver for optimal actions that surrenders "16" hands
    When getting the final comparison of surrendered hands and a dealer score of "18"
    Then the final comparison result equals "surrender"
    And the final comparison probabilities by bet multiplier are "0.5=0.009079681629385487"
